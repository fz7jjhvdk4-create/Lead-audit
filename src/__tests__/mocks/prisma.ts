import { vi } from 'vitest';

export const prismaMock = {
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  trainingSession: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  sessionMessage: {
    findMany: vi.fn(),
    create: vi.fn(),
    count: vi.fn(),
  },
  sessionFeedback: {
    create: vi.fn(),
    findUnique: vi.fn(),
  },
};

vi.mock('@/lib/prisma', () => ({
  default: prismaMock,
  prisma: prismaMock,
}));
