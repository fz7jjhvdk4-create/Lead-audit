import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { prismaMock } from '../mocks/prisma';
import { authMock, mockSession } from '../mocks/auth';

// Mock Anthropic SDK with streaming support
const { mockCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
}));
vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: class MockAnthropic {
      messages = { create: mockCreate };
    },
  };
});

// Mock AI modules
vi.mock('@/lib/ai/system-prompt', () => ({
  generateSystemPrompt: vi.fn().mockReturnValue('System prompt here'),
}));

vi.mock('@/lib/ai/closing-meeting', () => ({
  isClosingMeetingRequest: vi.fn().mockReturnValue(false),
  generateClosingMeetingResponse: vi.fn().mockReturnValue('Closing context'),
}));

import { POST } from '@/app/api/session/[id]/chat/route';

function createRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost:3000/api/session/s-1/chat', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

const params = Promise.resolve({ id: 's-1' });

const baseSession = {
  id: 's-1',
  userId: 'test-user-id',
  standard: 'iso9001',
  type: 'certifiering',
  difficulty: 'medel',
  annexSLChapters: [7, 8],
  industry: 'manufacturing',
  hintsEnabled: true,
  hintsUsed: 0,
  completedAt: null,
  messages: [
    { role: 'assistant', content: 'Välkommen till revisionen.' },
    { role: 'user', content: 'Hej, jag vill granska er kvalitetspolicy.' },
  ],
};

describe('POST /api/session/[id]/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMock.mockResolvedValue(mockSession);
  });

  // --- Autentisering ---

  it('returnerar 401 om ej autentiserad', async () => {
    authMock.mockResolvedValue(null);
    const res = await POST(createRequest({ message: 'Hej' }), { params });
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toContain('autentiserad');
  });

  // --- Session-validering ---

  it('returnerar 404 om session inte finns', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue(null);
    const res = await POST(createRequest({ message: 'Hej' }), { params });
    expect(res.status).toBe(404);
  });

  it('returnerar 403 om användaren inte äger sessionen', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue({
      ...baseSession,
      userId: 'other-user-id',
    });
    const res = await POST(createRequest({ message: 'Hej' }), { params });
    expect(res.status).toBe(403);
  });

  it('returnerar 400 om sessionen är avslutad', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue({
      ...baseSession,
      completedAt: new Date(),
    });
    const res = await POST(createRequest({ message: 'Hej' }), { params });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('avslutad');
  });

  // --- Meddelande-validering ---

  it('returnerar 400 om meddelande saknas', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue(baseSession);
    const res = await POST(createRequest({}), { params });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Meddelande krävs');
  });

  it('returnerar 400 om meddelande är tom sträng', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue(baseSession);
    const res = await POST(createRequest({ message: '' }), { params });
    expect(res.status).toBe(400);
  });

  it('returnerar 400 om meddelande bara är whitespace', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue(baseSession);
    const res = await POST(createRequest({ message: '   ' }), { params });
    expect(res.status).toBe(400);
  });

  it('returnerar 400 om meddelande inte är en sträng', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue(baseSession);
    const res = await POST(createRequest({ message: 123 }), { params });
    expect(res.status).toBe(400);
  });

  // --- Rate limiting ---

  it('returnerar 429 vid max antal meddelanden', async () => {
    const messages = Array.from({ length: 100 }, (_, i) => ({
      role: i % 2 === 0 ? 'assistant' : 'user',
      content: `Message ${i}`,
    }));

    prismaMock.trainingSession.findUnique.mockResolvedValue({
      ...baseSession,
      messages,
    });

    const res = await POST(createRequest({ message: 'Ännu ett' }), { params });
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toContain('Max antal');
    expect(data.limit).toBe(50);
  });

  it('tillåter meddelande under gränsen', async () => {
    // 48 user messages, under 50 limit
    const messages = Array.from({ length: 96 }, (_, i) => ({
      role: i % 2 === 0 ? 'assistant' : 'user',
      content: `Message ${i}`,
    }));

    prismaMock.trainingSession.findUnique.mockResolvedValue({
      ...baseSession,
      messages,
    });
    prismaMock.sessionMessage.create.mockResolvedValue({});

    // Mock streaming response
    async function* streamEvents() {
      yield { type: 'content_block_delta', delta: { text: 'Svar' } };
    }
    mockCreate.mockResolvedValue(streamEvents());

    const res = await POST(createRequest({ message: 'Ok' }), { params });
    // Streaming response returns 200
    expect(res.status).toBe(200);
  });

  // --- Lyckad chat ---

  it('sparar användarens meddelande i databasen', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue(baseSession);
    prismaMock.sessionMessage.create.mockResolvedValue({});

    async function* streamEvents() {
      yield { type: 'content_block_delta', delta: { text: 'Svar' } };
    }
    mockCreate.mockResolvedValue(streamEvents());

    const res = await POST(
      createRequest({ message: '  Berätta om er kalibrering  ' }),
      { params }
    );

    expect(res.status).toBe(200);
    expect(prismaMock.sessionMessage.create).toHaveBeenCalledWith({
      data: {
        sessionId: 's-1',
        role: 'user',
        content: 'Berätta om er kalibrering', // trimmed
      },
    });
  });

  it('returnerar SSE-stream', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue(baseSession);
    prismaMock.sessionMessage.create.mockResolvedValue({});

    async function* streamEvents() {
      yield { type: 'content_block_delta', delta: { text: 'Del 1' } };
      yield { type: 'content_block_delta', delta: { text: ' Del 2' } };
    }
    mockCreate.mockResolvedValue(streamEvents());

    const res = await POST(createRequest({ message: 'Hej' }), { params });

    expect(res.headers.get('Content-Type')).toBe('text/event-stream');
    expect(res.headers.get('Cache-Control')).toBe('no-cache');
  });

  // --- Felhantering ---

  it('returnerar 500 vid oväntat fel', async () => {
    prismaMock.trainingSession.findUnique.mockRejectedValue(
      new Error('DB error')
    );
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const res = await POST(createRequest({ message: 'Hej' }), { params });
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toContain('Kunde inte skicka meddelande');

    consoleSpy.mockRestore();
  });
});
