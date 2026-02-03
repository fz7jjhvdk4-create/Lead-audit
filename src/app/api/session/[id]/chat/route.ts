import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateSystemPrompt } from '@/lib/ai/system-prompt';
import { isClosingMeetingRequest, generateClosingMeetingResponse } from '@/lib/ai/closing-meeting';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MAX_MESSAGES_PER_SESSION = 50;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Ej autentiserad' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Hämta träningssessionen
    const trainingSession = await prisma.trainingSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!trainingSession) {
      return new Response(JSON.stringify({ error: 'Session hittades inte' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (trainingSession.userId !== session.user.id) {
      return new Response(JSON.stringify({ error: 'Ingen behörighet' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (trainingSession.completedAt) {
      return new Response(JSON.stringify({ error: 'Sessionen är avslutad' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Rate limiting
    const userMessageCount = trainingSession.messages.filter(m => m.role === 'user').length;
    if (userMessageCount >= MAX_MESSAGES_PER_SESSION) {
      return new Response(
        JSON.stringify({
          error: 'Max antal meddelanden uppnått för denna session',
          limit: MAX_MESSAGES_PER_SESSION
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Meddelande krävs' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Spara användarens meddelande
    await prisma.sessionMessage.create({
      data: {
        sessionId,
        role: 'user',
        content: message.trim(),
      },
    });

    // Kontrollera om detta är en slutmötesförfrågan
    const isClosingMeeting = isClosingMeetingRequest(message.trim());

    // Generera systemprompt
    let systemPrompt = generateSystemPrompt({
      standard: trainingSession.standard,
      type: trainingSession.type,
      difficulty: trainingSession.difficulty,
      annexSLChapters: trainingSession.annexSLChapters,
    });

    // Lägg till extra kontext för slutmöte om det behövs
    if (isClosingMeeting) {
      const closingContext = generateClosingMeetingResponse(trainingSession.type);
      systemPrompt += `\n\n## AKTIVT SLUTMÖTE\n\nRevisorn har indikerat att de vill avsluta och hålla slutmöte. Använd följande format:\n\n${closingContext}`;
    }

    // Bygg meddelandehistorik för Claude
    const messageHistory: Anthropic.MessageParam[] = trainingSession.messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // Lägg till det nya meddelandet
    messageHistory.push({
      role: 'user',
      content: message.trim(),
    });

    // Skapa streaming response
    const encoder = new TextEncoder();
    let fullResponse = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: systemPrompt,
            messages: messageHistory,
            stream: true,
          });

          for await (const event of response) {
            if (event.type === 'content_block_delta') {
              const delta = event.delta;
              if ('text' in delta) {
                fullResponse += delta.text;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: delta.text })}\n\n`));
              }
            }
          }

          // Spara AI:ns svar i databasen
          await prisma.sessionMessage.create({
            data: {
              sessionId,
              role: 'assistant',
              content: fullResponse,
            },
          });

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: 'Ett fel uppstod' })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Kunde inte skicka meddelande' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
