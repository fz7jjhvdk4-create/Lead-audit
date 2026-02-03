import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const feedbackPrompt = `Du är en erfaren bedömare av revisorsträning enligt ISO 19011.
Analysera revisionskonversationen och ge en detaljerad bedömning av revisorns prestation.

Bedöm följande områden på en skala 1-5:
1. **Revisionsprinciper** (integritet, opartiskhet, professionalism)
2. **Frågeteknik** (öppna frågor, fördjupning, logisk sekvens)
3. **Standardkunskap** (korrekt referens, processansats, koppling mellan krav)
4. **Bevisinhämtning** (objektiva bevis, triangulering, dokumentgranskning)
5. **Avvikelseklassificering** (korrekt klassificering om tillämpligt)
6. **Kommunikation** (tydlighet, respekt, bekräftar förståelse)
7. **Startmöte** (om genomfört - presentation, syfte, plan)
8. **Slutmöte** (om genomfört - sammanfattning, fynd, nästa steg)

Svara ENDAST med giltig JSON i följande format:
{
  "revisionPrinciples": <1-5>,
  "questionTechnique": <1-5>,
  "standardKnowledge": <1-5>,
  "evidenceCollection": <1-5>,
  "nonconformityClass": <1-5 eller null om ej tillämpligt>,
  "communication": <1-5>,
  "openingMeeting": <1-5 eller null om ej genomfört>,
  "closingMeeting": <1-5 eller null om ej genomfört>,
  "overallScore": <1-5 viktat genomsnitt>,
  "strengths": ["styrka 1", "styrka 2", ...],
  "developmentAreas": ["utvecklingsområde 1", "utvecklingsområde 2", ...],
  "missedFindings": ["vad som missades 1", ...],
  "alternativeStrategies": ["förslag 1", "förslag 2", ...],
  "summary": "Sammanfattande bedömning på 2-3 meningar"
}`;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Ej autentiserad' }, { status: 401 });
    }

    // Hämta träningssessionen
    const trainingSession = await prisma.trainingSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        feedback: true,
      },
    });

    if (!trainingSession) {
      return NextResponse.json({ error: 'Session hittades inte' }, { status: 404 });
    }

    if (trainingSession.userId !== session.user.id) {
      return NextResponse.json({ error: 'Ingen behörighet' }, { status: 403 });
    }

    if (trainingSession.completedAt) {
      return NextResponse.json({ error: 'Sessionen är redan avslutad' }, { status: 400 });
    }

    if (trainingSession.messages.length < 2) {
      return NextResponse.json(
        { error: 'Sessionen behöver fler meddelanden för att kunna bedömas' },
        { status: 400 }
      );
    }

    // Bygg konversationen för bedömning
    const conversationText = trainingSession.messages
      .map(m => `${m.role === 'user' ? 'REVISOR' : 'FÖRETAG'}: ${m.content}`)
      .join('\n\n');

    const contextInfo = `
Sessionskonfiguration:
- Standard: ${trainingSession.standard}
- Revisionstyp: ${trainingSession.type}
- Svårighetsgrad: ${trainingSession.difficulty}
- Annex SL-kapitel: ${trainingSession.annexSLChapters.join(', ')}

Konversation:
${conversationText}
`;

    // Anropa Claude för bedömning
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: feedbackPrompt,
      messages: [
        {
          role: 'user',
          content: contextInfo,
        },
      ],
    });

    // Extrahera textinnehållet
    const textContent = response.content.find(c => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('Inget textsvar från AI');
    }

    // Parsa JSON från svaret
    let feedbackData;
    try {
      // Försök hitta JSON i svaret
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Kunde inte hitta JSON i svaret');
      }
      feedbackData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, textContent.text);
      // Fallback med grundläggande feedback
      feedbackData = {
        revisionPrinciples: 3,
        questionTechnique: 3,
        standardKnowledge: 3,
        evidenceCollection: 3,
        nonconformityClass: null,
        communication: 3,
        openingMeeting: null,
        closingMeeting: null,
        overallScore: 3,
        strengths: ['Genomförde revisionen'],
        developmentAreas: ['Kunde inte generera detaljerad feedback'],
        missedFindings: [],
        alternativeStrategies: [],
        summary: 'Sessionen genomfördes. Tekniskt fel vid feedbackgenerering.',
      };
    }

    // Spara feedback i databasen
    const feedback = await prisma.sessionFeedback.create({
      data: {
        sessionId,
        revisionPrinciples: feedbackData.revisionPrinciples,
        questionTechnique: feedbackData.questionTechnique,
        standardKnowledge: feedbackData.standardKnowledge,
        evidenceCollection: feedbackData.evidenceCollection,
        nonconformityClass: feedbackData.nonconformityClass,
        communication: feedbackData.communication,
        openingMeeting: feedbackData.openingMeeting,
        closingMeeting: feedbackData.closingMeeting,
        overallScore: feedbackData.overallScore,
        strengths: feedbackData.strengths || [],
        developmentAreas: feedbackData.developmentAreas || [],
        missedFindings: feedbackData.missedFindings || [],
        alternativeStrategies: feedbackData.alternativeStrategies || [],
        summary: feedbackData.summary,
      },
    });

    // Markera sessionen som avslutad
    await prisma.trainingSession.update({
      where: { id: sessionId },
      data: { completedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error('Complete session error:', error);
    return NextResponse.json(
      { error: 'Kunde inte avsluta sessionen' },
      { status: 500 }
    );
  }
}
