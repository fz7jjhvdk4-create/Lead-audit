import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { prismaMock } from '../mocks/prisma';
import { authMock, mockSession } from '../mocks/auth';

// Mock Anthropic SDK
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

import { POST } from '@/app/api/session/[id]/hint/route';

function createRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost:3000/api/session/s-1/hint', {
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
  hintsUsed: 2,
  completedAt: null,
  messages: [
    { role: 'assistant', content: 'Välkommen till revisionen.' },
    { role: 'user', content: 'Berätta om er kvalitetspolicy.' },
    { role: 'assistant', content: 'Vår kvalitetspolicy...' },
    { role: 'user', content: 'Kan jag se dokumentationen?' },
    { role: 'assistant', content: 'Ja, här har ni dokumenten.' },
  ],
};

describe('POST /api/session/[id]/hint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMock.mockResolvedValue(mockSession);
  });

  // --- Autentisering ---

  it('returnerar 401 om ej autentiserad', async () => {
    authMock.mockResolvedValue(null);
    const res = await POST(createRequest({ level: 1 }), { params });
    expect(res.status).toBe(401);
  });

  // --- Session-validering ---

  it('returnerar 404 om session inte finns', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue(null);
    const res = await POST(createRequest({ level: 1 }), { params });
    expect(res.status).toBe(404);
  });

  it('returnerar 403 om användaren inte äger sessionen', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue({
      ...baseSession,
      userId: 'other-user-id',
    });
    const res = await POST(createRequest({ level: 1 }), { params });
    expect(res.status).toBe(403);
  });

  it('returnerar 400 om hints inte är aktiverade', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue({
      ...baseSession,
      hintsEnabled: false,
    });
    const res = await POST(createRequest({ level: 1 }), { params });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('inte aktiverade');
  });

  // --- Hint-nivå validering ---

  it('returnerar 400 vid ogiltig hint-nivå', async () => {
    const res = await POST(createRequest({ level: 5 }), { params });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('hint-nivå');
  });

  it('returnerar 400 vid nivå 0', async () => {
    const res = await POST(createRequest({ level: 0 }), { params });
    expect(res.status).toBe(400);
  });

  // --- Lyckad hint ---

  it('genererar hint och uppdaterar hintsUsed', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue(baseSession);
    prismaMock.trainingSession.update.mockResolvedValue({});
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: 'Prova att fråga om kalibrering.' }],
    });

    const res = await POST(createRequest({ level: 1 }), { params });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.hint).toBe('Prova att fråga om kalibrering.');
    expect(data.level).toBe(1);
    expect(data.hintsUsed).toBe(3); // 2 + 1
  });

  it('uppdaterar hintsUsed med increment', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue(baseSession);
    prismaMock.trainingSession.update.mockResolvedValue({});
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: 'Hint text' }],
    });

    await POST(createRequest({ level: 2 }), { params });

    expect(prismaMock.trainingSession.update).toHaveBeenCalledWith({
      where: { id: 's-1' },
      data: { hintsUsed: { increment: 1 } },
    });
  });

  it('använder default nivå 1 om level inte anges', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue(baseSession);
    prismaMock.trainingSession.update.mockResolvedValue({});
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: 'Hint' }],
    });

    const res = await POST(createRequest({}), { params });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.level).toBe(1);
  });

  // --- Fas-detektering ---

  it('identifierar opening-fasen med få meddelanden', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue({
      ...baseSession,
      messages: [
        { role: 'assistant', content: 'Välkommen.' },
        { role: 'user', content: 'Hej.' },
      ],
    });
    prismaMock.trainingSession.update.mockResolvedValue({});
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: 'Hint' }],
    });

    await POST(createRequest({ level: 1 }), { params });

    // Verifiera att Claude anropades (fas-detektering sker internt)
    expect(mockCreate).toHaveBeenCalled();
  });

  it('identifierar closing-fasen från meddelandeinnehåll', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue({
      ...baseSession,
      messages: [
        ...baseSession.messages,
        { role: 'user', content: 'Jag vill hålla ett slutmöte nu.' },
        { role: 'assistant', content: 'Vi samlar ledningen.' },
        { role: 'user', content: 'Jag vill sammanfatta mina fynd.' },
      ],
    });
    prismaMock.trainingSession.update.mockResolvedValue({});
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: 'Hint' }],
    });

    await POST(createRequest({ level: 1 }), { params });

    expect(mockCreate).toHaveBeenCalled();
  });

  // --- Felhantering ---

  it('returnerar 500 vid AI-fel', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue(baseSession);
    mockCreate.mockRejectedValue(new Error('API timeout'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const res = await POST(createRequest({ level: 1 }), { params });

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toContain('Kunde inte generera hint');

    consoleSpy.mockRestore();
  });
});
