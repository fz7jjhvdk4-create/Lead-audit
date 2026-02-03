import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { SessionChat } from './SessionChat';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SessionPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const trainingSession = await prisma.trainingSession.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
      feedback: true,
    },
  });

  if (!trainingSession) {
    redirect('/dashboard');
  }

  if (trainingSession.userId !== session.user.id) {
    redirect('/dashboard');
  }

  // Om sessionen är avslutad, redirecta till feedback-sidan
  if (trainingSession.completedAt && trainingSession.feedback) {
    redirect(`/session/${id}/feedback`);
  }

  return (
    <SessionChat
      sessionId={trainingSession.id}
      initialMessages={trainingSession.messages.map(m => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))}
      config={{
        standard: trainingSession.standard,
        type: trainingSession.type,
        difficulty: trainingSession.difficulty,
        annexSLChapters: trainingSession.annexSLChapters,
        industry: trainingSession.industry,
        hintsEnabled: trainingSession.hintsEnabled,
        hintsUsed: trainingSession.hintsUsed,
      }}
    />
  );
}
