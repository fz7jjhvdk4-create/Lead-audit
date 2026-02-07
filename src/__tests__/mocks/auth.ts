import { vi } from 'vitest';

export const mockSession = {
  user: {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
  },
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};

export const authMock = vi.fn().mockResolvedValue(mockSession);

vi.mock('@/lib/auth', () => ({
  auth: authMock,
}));
