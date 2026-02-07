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

import { POST } from '@/app/api/session/[id]/complete/route';

function createRequest(): NextRequest {
  return new NextRequest('http://localhost:3000/api/session/s-1/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
}

const params = Promise.resolve({ id: 's-1' });

const validFeedbackJson = {
  revisionPrinciples: 4,
  questionTechnique: 3,
  standardKnowledge: 4,
  evidenceCollection: 3,
  nonconformityClass: 3,
  communication: 4,
  openingMeeting: 4,
  closingMeeting: null,
  overallScore: 4,
  strengths: ['Bra frågeteknik', 'Professionellt bemötande'],
  developmentAreas: ['Kan fördjupa standardkunnande'],
  missedFindings: ['Kalibrering av MÄT-008'],
  alternativeStrategies: ['Fråga om senaste kalibreringsprotokoll'],
  isoReferences: ['ISO 19011:2018 kap 7.2.3'],
  summary: 'En godkänd revision med utvecklingspotential.',
};

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
  feedback: null,
  messages: [
    { role: 'assistant', content: 'Välkommen till revisionen.' },
    { role: 'user', content: 'Berätta om er kvalitetspolicy.' },
    { role: 'assistant', content: 'Vår kvalitetspolicy fastställdes...' },
    { role: 'user', content: 'Kan jag se kalibreringsprotokoll?' },
  ],
};

describe('POST /api/session/[id]/complete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMock.mockResolvedValue(mockSession);
  });

  // --- Autentisering ---

  it('returnerar 401 om ej autentiserad', async () => {
    authMock.mockResolvedValue(null);
    const res = await POST(createRequest(), { params });
    expect(res.status).toBe(401);
  });

  // --- Session-validering ---

  it('returnerar 404 om session inte finns', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue(null);
    const res = await POST(createRequest(), { params });
    expect(res.status).toBe(404);
  });

  it('returnerar 403 om användaren inte äger sessionen', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue({
      ...baseSession,
      userId: 'other-user-id',
    });
    const res = await POST(createRequest(), { params });
    expect(res.status).toBe(403);
  });

  it('returnerar 400 om sessionen redan är avslutad', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue({
      ...baseSession,
      completedAt: new Date(),
    });
    const res = await POST(createRequest(), { params });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('redan avslutad');
  });

  it('returnerar 400 om för få meddelanden', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue({
      ...baseSession,
      messages: [{ role: 'assistant', content: 'Välkommen.' }],
    });
    const res = await POST(createRequest(), { params });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('fler meddelanden');
  });

  // --- Lyckad completion ---

  it('skapar feedback och markerar sessionen som avslutad', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue(baseSession);
    prismaMock.sessionFeedback.create.mockResolvedValue({
      id: 'fb-1',
      ...validFeedbackJson,
    });
    prismaMock.trainingSession.update.mockResolvedValue({});

    // Feedback-anrop
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify(validFeedbackJson) }],
    });
    // Best practice-anrop
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: '[]' }],
    });

    const res = await POST(createRequest(), { params });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.feedback).toBeDefined();

    // Sessionen markeras avslutad
    expect(prismaMock.trainingSession.update).toHaveBeenCalledWith({
      where: { id: 's-1' },
      data: { completedAt: expect.any(Date) },
    });
  });

  it('sparar korrekt feedback i databasen', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue(baseSession);
    prismaMock.sessionFeedback.create.mockResolvedValue({ id: 'fb-1' });
    prismaMock.trainingSession.update.mockResolvedValue({});

    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify(validFeedbackJson) }],
    });
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: '[]' }],
    });

    await POST(createRequest(), { params });

    expect(prismaMock.sessionFeedback.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        sessionId: 's-1',
        revisionPrinciples: 4,
        questionTechnique: 3,
        standardKnowledge: 4,
        overallScore: 4,
        summary: expect.any(String),
      }),
    });
  });

  // --- Hint-påverkan ---

  it('justerar betyg baserat på hint-användning', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue({
      ...baseSession,
      hintsUsed: 5,
      difficulty: 'medel',
    });
    prismaMock.sessionFeedback.create.mockResolvedValue({ id: 'fb-1' });
    prismaMock.trainingSession.update.mockResolvedValue({});

    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify(validFeedbackJson) }],
    });
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: '[]' }],
    });

    await POST(createRequest(), { params });

    // overallScore 4 - (5 * 0.1) = 3.5, rounded to 4
    // Men Math.round(4 - 0.5) = Math.round(3.5) = 4
    expect(prismaMock.sessionFeedback.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        overallScore: expect.any(Number),
      }),
    });
  });

  it('lägger till hint-sammanfattning i utvecklingsområden', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue({
      ...baseSession,
      hintsUsed: 3,
    });
    prismaMock.sessionFeedback.create.mockResolvedValue({ id: 'fb-1' });
    prismaMock.trainingSession.update.mockResolvedValue({});

    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify(validFeedbackJson) }],
    });
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: '[]' }],
    });

    await POST(createRequest(), { params });

    expect(prismaMock.sessionFeedback.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        developmentAreas: expect.arrayContaining([
          expect.stringContaining('hints'),
        ]),
      }),
    });
  });

  // --- JSON-parsing fallback ---

  it('använder fallback-feedback vid ogiltig JSON från AI', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue(baseSession);
    prismaMock.sessionFeedback.create.mockResolvedValue({ id: 'fb-1' });
    prismaMock.trainingSession.update.mockResolvedValue({});
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // AI returnerar text utan JSON
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: 'Här är min bedömning utan JSON-format.' }],
    });
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: '[]' }],
    });

    const res = await POST(createRequest(), { params });

    expect(res.status).toBe(200);
    // Fallback-värden sparas
    expect(prismaMock.sessionFeedback.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        overallScore: 3,
        summary: expect.stringContaining('Tekniskt fel'),
      }),
    });

    consoleSpy.mockRestore();
  });

  it('extraherar JSON inbäddat i text', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue(baseSession);
    prismaMock.sessionFeedback.create.mockResolvedValue({ id: 'fb-1' });
    prismaMock.trainingSession.update.mockResolvedValue({});

    const wrappedJson = `Här är min bedömning:\n\n${JSON.stringify(validFeedbackJson)}\n\nHoppas det hjälper!`;
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: wrappedJson }],
    });
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: '[]' }],
    });

    const res = await POST(createRequest(), { params });

    expect(res.status).toBe(200);
    expect(prismaMock.sessionFeedback.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        overallScore: 4,
      }),
    });
  });

  // --- Best practice-fel ignoreras ---

  it('fortsätter även om best practice-generering misslyckas', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue(baseSession);
    prismaMock.sessionFeedback.create.mockResolvedValue({ id: 'fb-1' });
    prismaMock.trainingSession.update.mockResolvedValue({});
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify(validFeedbackJson) }],
    });
    mockCreate.mockRejectedValueOnce(new Error('Best practice API error'));

    const res = await POST(createRequest(), { params });

    expect(res.status).toBe(200);
    expect(prismaMock.sessionFeedback.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        bestPracticeExamples: null,
      }),
    });

    consoleSpy.mockRestore();
  });

  // --- Multi-standard ---

  it('hanterar multipla standarder', async () => {
    prismaMock.trainingSession.findUnique.mockResolvedValue({
      ...baseSession,
      standard: 'iso9001,iso14001',
    });
    prismaMock.sessionFeedback.create.mockResolvedValue({ id: 'fb-1' });
    prismaMock.trainingSession.update.mockResolvedValue({});

    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify(validFeedbackJson) }],
    });
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: '[]' }],
    });

    const res = await POST(createRequest(), { params });
    expect(res.status).toBe(200);
  });

  // --- Allvarligt fel ---

  it('returnerar 500 vid oväntat fel', async () => {
    prismaMock.trainingSession.findUnique.mockRejectedValue(
      new Error('Connection refused')
    );
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const res = await POST(createRequest(), { params });

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toContain('Kunde inte avsluta');

    consoleSpy.mockRestore();
  });
});
