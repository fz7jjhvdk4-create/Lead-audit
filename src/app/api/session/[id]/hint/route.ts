import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Anthropic from '@anthropic-ai/sdk';
import { generateHintPrompt, HintContext } from '@/lib/ai/hints-system';

const anthropic = new Anthropic();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Ej autentiserad' }, { status: 401 });
    }

    const { id: sessionId } = await params;
    const body = await request.json();
    const { level = 1 } = body;

    // Validera hint-nivå
    if (![1, 2, 3].includes(level)) {
      return NextResponse.json(
        { error: 'Ogiltig hint-nivå' },
        { status: 400 }
      );
    }

    // Hämta session med meddelanden
    const trainingSession = await prisma.trainingSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!trainingSession) {
      return NextResponse.json(
        { error: 'Session hittades inte' },
        { status: 404 }
      );
    }

    if (trainingSession.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Ingen behörighet' },
        { status: 403 }
      );
    }

    if (!trainingSession.hintsEnabled) {
      return NextResponse.json(
        { error: 'Hints är inte aktiverade för denna session' },
        { status: 400 }
      );
    }

    // Analysera senaste meddelanden för att avgöra fas
    const messageCount = trainingSession.messages.length;
    const recentMessages = trainingSession.messages.slice(-10);
    const recentContent = recentMessages.map(m => m.content.toLowerCase()).join(' ');

    let currentPhase: 'opening' | 'execution' | 'closing' = 'execution';
    if (messageCount < 5) {
      currentPhase = 'opening';
    } else if (
      recentContent.includes('slutmöte') ||
      recentContent.includes('avslut') ||
      recentContent.includes('sammanfatta')
    ) {
      currentPhase = 'closing';
    }

    const hintContext: HintContext = {
      annexSLChapters: trainingSession.annexSLChapters,
      difficulty: trainingSession.difficulty,
      messageCount,
      recentTopics: [], // Kan utökas med topic extraction
      currentPhase,
    };

    // Bygg meddelanden för AI
    const messagesForAI = trainingSession.messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    // Generera hint-prompt
    const hintPrompt = generateHintPrompt(level, hintContext);

    // Anropa Claude för att generera hint
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `Du är en erfaren revisionsmentor som hjälper revisorer under träning.
Du ska ge hints och vägledning utan att förstöra inlärningsupplevelsen.
Anpassa dina svar till den begärda hint-nivån.`,
      messages: [
        ...messagesForAI,
        {
          role: 'user',
          content: hintPrompt,
        },
      ],
    });

    // Extrahera hint-texten
    const hintText = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('');

    // Uppdatera antal använda hints
    await prisma.trainingSession.update({
      where: { id: sessionId },
      data: {
        hintsUsed: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      hint: hintText,
      level,
      hintsUsed: trainingSession.hintsUsed + 1,
    });
  } catch (error) {
    console.error('Error generating hint:', error);
    return NextResponse.json(
      { error: 'Kunde inte generera hint' },
      { status: 500 }
    );
  }
}
