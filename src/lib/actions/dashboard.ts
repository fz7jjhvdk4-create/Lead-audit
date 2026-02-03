'use server';

import prisma from '@/lib/prisma';
import type { SessionFeedback } from '@prisma/client';

export interface DashboardStats {
  totalSessions: number;
  completedSessions: number;
  averageScore: number | null;
  lastSessionDate: Date | null;
  recentSessions: {
    id: string;
    standard: string;
    type: string;
    difficulty: string;
    startedAt: Date;
    completedAt: Date | null;
    overallScore: number | null;
  }[];
  competencyScores: {
    revisionPrinciples: number | null;
    questionTechnique: number | null;
    standardKnowledge: number | null;
    evidenceCollection: number | null;
    nonconformityClass: number | null;
    communication: number | null;
    openingMeeting: number | null;
    closingMeeting: number | null;
  };
  trend: 'up' | 'down' | 'stable' | null;
}

type SessionWithFeedback = {
  feedback: SessionFeedback | null;
};

type CompetencyField =
  | 'revisionPrinciples'
  | 'questionTechnique'
  | 'standardKnowledge'
  | 'evidenceCollection'
  | 'nonconformityClass'
  | 'communication'
  | 'openingMeeting'
  | 'closingMeeting';

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  // Hämta alla sessioner för användaren
  const sessions = await prisma.trainingSession.findMany({
    where: { userId },
    include: {
      feedback: true,
    },
    orderBy: { startedAt: 'desc' },
  });

  const completedSessions = sessions.filter(s => s.completedAt !== null);
  const sessionsWithFeedback = completedSessions.filter(s => s.feedback?.overallScore);

  // Beräkna genomsnittlig poäng
  const averageScore = sessionsWithFeedback.length > 0
    ? sessionsWithFeedback.reduce((sum, s) => sum + (s.feedback?.overallScore || 0), 0) / sessionsWithFeedback.length
    : null;

  // Beräkna genomsnittlig kompetenspoäng
  const competencyScores = {
    revisionPrinciples: calculateAverage(sessionsWithFeedback, 'revisionPrinciples'),
    questionTechnique: calculateAverage(sessionsWithFeedback, 'questionTechnique'),
    standardKnowledge: calculateAverage(sessionsWithFeedback, 'standardKnowledge'),
    evidenceCollection: calculateAverage(sessionsWithFeedback, 'evidenceCollection'),
    nonconformityClass: calculateAverage(sessionsWithFeedback, 'nonconformityClass'),
    communication: calculateAverage(sessionsWithFeedback, 'communication'),
    openingMeeting: calculateAverage(sessionsWithFeedback, 'openingMeeting'),
    closingMeeting: calculateAverage(sessionsWithFeedback, 'closingMeeting'),
  };

  // Beräkna trend (jämför senaste 3 sessioner med tidigare 3)
  let trend: 'up' | 'down' | 'stable' | null = null;
  if (sessionsWithFeedback.length >= 4) {
    const recent = sessionsWithFeedback.slice(0, 3);
    const previous = sessionsWithFeedback.slice(3, 6);

    const recentAvg = recent.reduce((sum, s) => sum + (s.feedback?.overallScore || 0), 0) / recent.length;
    const previousAvg = previous.reduce((sum, s) => sum + (s.feedback?.overallScore || 0), 0) / previous.length;

    if (recentAvg > previousAvg + 0.3) trend = 'up';
    else if (recentAvg < previousAvg - 0.3) trend = 'down';
    else trend = 'stable';
  }

  // Formatera senaste sessioner för visning
  const recentSessions = sessions.slice(0, 5).map(s => ({
    id: s.id,
    standard: s.standard,
    type: s.type,
    difficulty: s.difficulty,
    startedAt: s.startedAt,
    completedAt: s.completedAt,
    overallScore: s.feedback?.overallScore || null,
  }));

  return {
    totalSessions: sessions.length,
    completedSessions: completedSessions.length,
    averageScore: averageScore ? Math.round(averageScore * 10) / 10 : null,
    lastSessionDate: sessions[0]?.startedAt || null,
    recentSessions,
    competencyScores,
    trend,
  };
}

function calculateAverage(
  sessions: SessionWithFeedback[],
  field: CompetencyField
): number | null {
  const values = sessions
    .map(s => s.feedback?.[field])
    .filter((v): v is number => v !== null && v !== undefined);

  if (values.length === 0) return null;
  return Math.round((values.reduce((sum, v) => sum + v, 0) / values.length) * 10) / 10;
}
