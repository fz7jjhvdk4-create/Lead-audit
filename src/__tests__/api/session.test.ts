import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { prismaMock } from '../mocks/prisma';
import { authMock, mockSession } from '../mocks/auth';

import { POST, GET } from '@/app/api/session/route';

function createPostRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost:3000/api/session', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

function createGetRequest(params?: Record<string, string>): NextRequest {
  const url = new URL('http://localhost:3000/api/session');
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }
  return new NextRequest(url, { method: 'GET' });
}

const validSessionBody = {
  standard: 'iso9001',
  type: 'certifiering',
  difficulty: 'medel',
  annexSLChapters: [7, 8],
  industry: 'manufacturing',
  hintsEnabled: true,
};

describe('POST /api/session', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMock.mockResolvedValue(mockSession);
  });

  // --- Autentisering ---

  it('returnerar 401 om ej autentiserad', async () => {
    authMock.mockResolvedValue(null);

    const res = await POST(createPostRequest(validSessionBody));

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toContain('autentiserad');
  });

  it('returnerar 401 om session saknar user id', async () => {
    authMock.mockResolvedValue({ user: {} });

    const res = await POST(createPostRequest(validSessionBody));

    expect(res.status).toBe(401);
  });

  // --- Lyckad skapning ---

  it('skapar session med giltig input', async () => {
    prismaMock.trainingSession.create.mockResolvedValue({
      id: 'session-123',
      userId: 'test-user-id',
      ...validSessionBody,
      hintsUsed: 0,
    });

    const res = await POST(createPostRequest(validSessionBody));

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.sessionId).toBe('session-123');
  });

  it('skapar session med opening message', async () => {
    prismaMock.trainingSession.create.mockResolvedValue({
      id: 'session-123',
    });

    await POST(createPostRequest(validSessionBody));

    expect(prismaMock.trainingSession.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'test-user-id',
          standard: 'iso9001',
          type: 'certifiering',
          difficulty: 'medel',
          annexSLChapters: [7, 8],
          hintsUsed: 0,
          messages: expect.objectContaining({
            create: expect.objectContaining({
              role: 'assistant',
            }),
          }),
        }),
      })
    );
  });

  it('använder manufacturing som default industry', async () => {
    prismaMock.trainingSession.create.mockResolvedValue({ id: 's-1' });

    const body = { ...validSessionBody };
    delete (body as Record<string, unknown>).industry;

    await POST(createPostRequest(body));

    expect(prismaMock.trainingSession.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          industry: 'manufacturing',
        }),
      })
    );
  });

  it('använder hintsEnabled true som default', async () => {
    prismaMock.trainingSession.create.mockResolvedValue({ id: 's-1' });

    const body = { ...validSessionBody };
    delete (body as Record<string, unknown>).hintsEnabled;

    await POST(createPostRequest(body));

    expect(prismaMock.trainingSession.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          hintsEnabled: true,
        }),
      })
    );
  });

  // --- Valideringsfel ---

  it('returnerar 400 om standard saknas', async () => {
    const res = await POST(
      createPostRequest({ ...validSessionBody, standard: '' })
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('fyllas i');
  });

  it('returnerar 400 om type saknas', async () => {
    const res = await POST(
      createPostRequest({ ...validSessionBody, type: '' })
    );
    expect(res.status).toBe(400);
  });

  it('returnerar 400 om difficulty saknas', async () => {
    const res = await POST(
      createPostRequest({ ...validSessionBody, difficulty: '' })
    );
    expect(res.status).toBe(400);
  });

  it('returnerar 400 om annexSLChapters är tom', async () => {
    const res = await POST(
      createPostRequest({ ...validSessionBody, annexSLChapters: [] })
    );
    expect(res.status).toBe(400);
  });

  it('returnerar 400 om annexSLChapters saknas', async () => {
    const body = { ...validSessionBody };
    delete (body as Record<string, unknown>).annexSLChapters;
    const res = await POST(createPostRequest(body));
    expect(res.status).toBe(400);
  });

  // --- Ogiltiga värden ---

  it('returnerar 400 vid ogiltig bransch', async () => {
    const res = await POST(
      createPostRequest({ ...validSessionBody, industry: 'healthcare' })
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('bransch');
  });

  it('returnerar 400 vid ogiltig standard', async () => {
    const res = await POST(
      createPostRequest({ ...validSessionBody, standard: 'iso27001' })
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('standard');
  });

  it('returnerar 400 vid ogiltigt mixat standard-val', async () => {
    const res = await POST(
      createPostRequest({ ...validSessionBody, standard: 'iso9001,invalid' })
    );
    expect(res.status).toBe(400);
  });

  it('returnerar 400 vid ogiltig revisionstyp', async () => {
    const res = await POST(
      createPostRequest({ ...validSessionBody, type: 'unknown' })
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('revisionstyp');
  });

  it('returnerar 400 vid ogiltig svårighetsgrad', async () => {
    const res = await POST(
      createPostRequest({ ...validSessionBody, difficulty: 'expert' })
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('svårighetsgrad');
  });

  it('returnerar 400 vid ogiltigt Annex SL-kapitel', async () => {
    const res = await POST(
      createPostRequest({ ...validSessionBody, annexSLChapters: [1, 2, 3] })
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('kapitel');
  });

  it('returnerar 400 om ett av kapitlen är ogiltigt', async () => {
    const res = await POST(
      createPostRequest({ ...validSessionBody, annexSLChapters: [7, 8, 11] })
    );
    expect(res.status).toBe(400);
  });

  // --- Giltiga kombinationer ---

  it('godkänner alla giltiga branscher', async () => {
    for (const industry of ['manufacturing', 'food', 'construction']) {
      prismaMock.trainingSession.create.mockResolvedValue({ id: 's-1' });
      const res = await POST(
        createPostRequest({ ...validSessionBody, industry })
      );
      expect(res.status).toBe(201);
    }
  });

  it('godkänner alla giltiga revisionstyper', async () => {
    for (const type of ['intern', 'extern', 'certifiering', 'overvakning']) {
      prismaMock.trainingSession.create.mockResolvedValue({ id: 's-1' });
      const res = await POST(
        createPostRequest({ ...validSessionBody, type })
      );
      expect(res.status).toBe(201);
    }
  });

  it('godkänner multipla standarder', async () => {
    prismaMock.trainingSession.create.mockResolvedValue({ id: 's-1' });
    const res = await POST(
      createPostRequest({
        ...validSessionBody,
        standard: 'iso9001,iso14001,iso45001',
      })
    );
    expect(res.status).toBe(201);
  });

  // --- Databasfel ---

  it('returnerar 500 vid databasfel', async () => {
    prismaMock.trainingSession.create.mockRejectedValue(
      new Error('DB error')
    );
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const res = await POST(createPostRequest(validSessionBody));

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toContain('Kunde inte skapa session');

    consoleSpy.mockRestore();
  });
});

describe('GET /api/session', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMock.mockResolvedValue(mockSession);
  });

  // --- Autentisering ---

  it('returnerar 401 om ej autentiserad', async () => {
    authMock.mockResolvedValue(null);

    const res = await GET(createGetRequest());

    expect(res.status).toBe(401);
  });

  // --- Hämta alla sessioner ---

  it('returnerar alla sessioner för användaren', async () => {
    const sessions = [
      { id: 's-1', standard: 'iso9001', feedback: { overallScore: 4.2 } },
      { id: 's-2', standard: 'iso14001', feedback: null },
    ];
    prismaMock.trainingSession.findMany.mockResolvedValue(sessions);

    const res = await GET(createGetRequest());

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveLength(2);
    expect(prismaMock.trainingSession.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'test-user-id' },
        orderBy: { startedAt: 'desc' },
      })
    );
  });

  it('returnerar tom lista om inga sessioner finns', async () => {
    prismaMock.trainingSession.findMany.mockResolvedValue([]);

    const res = await GET(createGetRequest());

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual([]);
  });

  // --- Hämta specifik session ---

  it('returnerar specifik session med id', async () => {
    const session = {
      id: 's-1',
      userId: 'test-user-id',
      standard: 'iso9001',
      messages: [{ role: 'assistant', content: 'Välkommen' }],
      feedback: null,
    };
    prismaMock.trainingSession.findUnique.mockResolvedValue(session);

    const res = await GET(createGetRequest({ id: 's-1' }));

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe('s-1');
  });

  it('returnerar 404 om session inte finns', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue(null);

    const res = await GET(createGetRequest({ id: 'nonexistent' }));

    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toContain('hittades inte');
  });

  // --- Behörighet ---

  it('returnerar 403 om användaren inte äger sessionen', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue({
      id: 's-1',
      userId: 'other-user-id',
      messages: [],
      feedback: null,
    });

    const res = await GET(createGetRequest({ id: 's-1' }));

    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toContain('behörighet');
  });

  // --- Databasfel ---

  it('returnerar 500 vid databasfel', async () => {
    prismaMock.trainingSession.findMany.mockRejectedValue(
      new Error('DB error')
    );
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const res = await GET(createGetRequest());

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toContain('Kunde inte hämta sessioner');

    consoleSpy.mockRestore();
  });
});
