import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { prismaMock } from '../mocks/prisma';

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed-password-123'),
    compare: vi.fn(),
  },
}));

import { POST } from '@/app/api/auth/register/route';

function createRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost:3000/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Lyckad registrering ---

  it('skapar användare med giltig input', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({
      id: 'new-user-id',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed-password-123',
    });

    const res = await POST(
      createRequest({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password1',
      })
    );

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.message).toBe('Användare skapad');
    expect(data.user.id).toBe('new-user-id');
    expect(data.user.email).toBe('test@example.com');
    expect(data.user).not.toHaveProperty('password');
  });

  it('trimmar namn och lowercasar email', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({
      id: 'id',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed',
    });

    await POST(
      createRequest({
        name: '  Test User  ',
        email: 'Test@Example.COM',
        password: 'Password1',
      })
    );

    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password-123',
      },
    });
  });

  // --- Saknade fält ---

  it('returnerar 400 om namn saknas', async () => {
    const res = await POST(
      createRequest({
        email: 'test@example.com',
        password: 'Password1',
      })
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('krävs');
  });

  it('returnerar 400 om email saknas', async () => {
    const res = await POST(
      createRequest({
        name: 'Test User',
        password: 'Password1',
      })
    );

    expect(res.status).toBe(400);
  });

  it('returnerar 400 om lösenord saknas', async () => {
    const res = await POST(
      createRequest({
        name: 'Test User',
        email: 'test@example.com',
      })
    );

    expect(res.status).toBe(400);
  });

  // --- Namnvalidering ---

  it('returnerar 400 om namn är för kort', async () => {
    const res = await POST(
      createRequest({
        name: 'A',
        email: 'test@example.com',
        password: 'Password1',
      })
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('minst 2 tecken');
  });

  it('returnerar 400 om namn bara är whitespace', async () => {
    const res = await POST(
      createRequest({
        name: '   ',
        email: 'test@example.com',
        password: 'Password1',
      })
    );

    expect(res.status).toBe(400);
  });

  // --- Email-validering ---

  it('returnerar 400 vid ogiltig email', async () => {
    const res = await POST(
      createRequest({
        name: 'Test User',
        email: 'not-an-email',
        password: 'Password1',
      })
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Ogiltig email');
  });

  // --- Lösenordsvalidering ---

  it('returnerar 400 om lösenord saknar stor bokstav', async () => {
    const res = await POST(
      createRequest({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password1',
      })
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('stor bokstav');
  });

  it('returnerar 400 om lösenord saknar liten bokstav', async () => {
    const res = await POST(
      createRequest({
        name: 'Test User',
        email: 'test@example.com',
        password: 'PASSWORD1',
      })
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('liten bokstav');
  });

  it('returnerar 400 om lösenord saknar siffra', async () => {
    const res = await POST(
      createRequest({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password',
      })
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('siffra');
  });

  it('returnerar 400 om lösenord är för kort', async () => {
    const res = await POST(
      createRequest({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Pass1',
      })
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('minst 8 tecken');
  });

  // --- Duplicerat email ---

  it('returnerar 400 om email redan finns', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'existing-id',
      name: 'Existing',
      email: 'test@example.com',
      password: 'hashed',
    });

    const res = await POST(
      createRequest({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password1',
      })
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('finns redan');
  });

  // --- Databasfel ---

  it('returnerar 500 vid databasfel', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockRejectedValue(new Error('DB connection lost'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const res = await POST(
      createRequest({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password1',
      })
    );

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toContain('fel uppstod');

    consoleSpy.mockRestore();
  });

  // --- Säkerhet ---

  it('hashar lösenordet innan lagring', async () => {
    const bcrypt = await import('bcryptjs');
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({
      id: 'id',
      name: 'Test',
      email: 'test@example.com',
      password: 'hashed-password-123',
    });

    await POST(
      createRequest({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password1',
      })
    );

    expect(bcrypt.default.hash).toHaveBeenCalledWith('Password1', 12);
    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          password: 'hashed-password-123',
        }),
      })
    );
  });

  it('returnerar inte lösenordet i svaret', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({
      id: 'id',
      name: 'Test',
      email: 'test@example.com',
      password: 'hashed-password-123',
    });

    const res = await POST(
      createRequest({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password1',
      })
    );

    const data = await res.json();
    expect(JSON.stringify(data)).not.toContain('hashed-password');
    expect(JSON.stringify(data)).not.toContain('Password1');
  });
});
