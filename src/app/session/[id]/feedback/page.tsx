import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { FeedbackContent } from './FeedbackContent';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FeedbackPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const trainingSession = await prisma.trainingSession.findUnique({
    where: { id },
    include: {
      feedback: true,
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!trainingSession || !trainingSession.feedback) {
    redirect('/dashboard');
  }

  if (trainingSession.userId !== session.user.id) {
    redirect('/dashboard');
  }

  const feedback = trainingSession.feedback;

  const standards: Record<string, string> = {
    iso9001: 'ISO 9001:2015',
    iso14001: 'ISO 14001:2015',
    iso45001: 'ISO 45001:2018',
    iatf16949: 'IATF 16949:2016',
  };

  const auditTypes: Record<string, string> = {
    intern: 'Intern revision',
    extern: 'Extern revision',
    certifiering: 'Certifieringsrevision',
    overvakning: 'Övervakningsrevision',
  };

  const selectedStandards = trainingSession.standard.split(',').map(s => standards[s] || s);

  // Förbered data för klientsidan
  const feedbackData = {
    revisionPrinciples: feedback.revisionPrinciples,
    questionTechnique: feedback.questionTechnique,
    standardKnowledge: feedback.standardKnowledge,
    evidenceCollection: feedback.evidenceCollection,
    nonconformityClass: feedback.nonconformityClass,
    communication: feedback.communication,
    openingMeeting: feedback.openingMeeting,
    closingMeeting: feedback.closingMeeting,
    overallScore: feedback.overallScore,
    strengths: feedback.strengths || [],
    developmentAreas: feedback.developmentAreas || [],
    missedFindings: feedback.missedFindings || [],
    alternativeStrategies: feedback.alternativeStrategies || [],
    isoReferences: feedback.isoReferences || [],
    bestPracticeExamples: feedback.bestPracticeExamples as Array<{
      area: string;
      topic: string;
      userApproach?: string;
      optimalApproach: string;
      technique: string;
      isoReference?: string;
      explanation: string;
    }> | null,
    summary: feedback.summary,
  };

  const sessionData = {
    standard: selectedStandards.join(' + '),
    type: auditTypes[trainingSession.type] || trainingSession.type,
    difficulty: trainingSession.difficulty,
    annexSLChapters: trainingSession.annexSLChapters,
    userMessageCount: trainingSession.messages.filter(m => m.role === 'user').length,
    assistantMessageCount: trainingSession.messages.filter(m => m.role === 'assistant').length,
    completedAt: trainingSession.completedAt?.toISOString() || null,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <svg className="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Tillbaka till dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <FeedbackContent feedback={feedbackData} session={sessionData} />
    </div>
  );
}
