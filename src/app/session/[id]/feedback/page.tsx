import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

const competencyLabels: Record<string, string> = {
  revisionPrinciples: 'Revisionsprinciper',
  questionTechnique: 'Frågeteknik',
  standardKnowledge: 'Standardkunskap',
  evidenceCollection: 'Bevisinhämtning',
  nonconformityClass: 'Avvikelseklassificering',
  communication: 'Kommunikation',
  openingMeeting: 'Startmöte',
  closingMeeting: 'Slutmöte',
};

const competencyDescriptions: Record<string, string> = {
  revisionPrinciples: 'Integritet, opartiskhet, professionalism',
  questionTechnique: 'Öppna frågor, fördjupning, logisk sekvens',
  standardKnowledge: 'Korrekt referens, processansats, koppling mellan krav',
  evidenceCollection: 'Objektiva bevis, triangulering, dokumentgranskning',
  nonconformityClass: 'Korrekt klassificering av avvikelser',
  communication: 'Tydlighet, respekt, bekräftar förståelse',
  openingMeeting: 'Presentation, syfte, revisionsplan',
  closingMeeting: 'Sammanfattning, fynd, nästa steg',
};

function ScoreBar({ score, label, description }: { score: number | null; label: string; description: string }) {
  if (score === null) return null;

  const percentage = (score / 5) * 100;
  const color = score >= 4 ? 'bg-green-500' : score >= 3 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="mb-4">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{score}/5</span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{description}</p>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className={`${color} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 4 ? 'text-green-500' : score >= 3 ? 'text-yellow-500' : 'text-red-500';
  const bgColor = score >= 4 ? 'bg-green-100 dark:bg-green-900/30' : score >= 3 ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-red-100 dark:bg-red-900/30';

  return (
    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${bgColor}`}>
      <span className={`text-4xl font-bold ${color}`}>{score}</span>
      <span className="text-lg text-gray-500 dark:text-gray-400">/5</span>
    </div>
  );
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
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

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Revisionsresultat
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {selectedStandards.join(' + ')} • {auditTypes[trainingSession.type]}
          </p>
        </div>

        {/* Overall Score */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 text-center">
          <h2 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-4">
            Totalbetyg
          </h2>
          <ScoreCircle score={feedback.overallScore || 3} />
          {feedback.summary && (
            <p className="mt-6 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              {feedback.summary}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Competency Scores */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Kompetensområden (ISO 19011)
            </h2>
            {Object.entries(competencyLabels).map(([key, label]) => {
              const score = feedback[key as keyof typeof feedback];
              if (typeof score !== 'number') return null;
              return (
                <ScoreBar
                  key={key}
                  score={score}
                  label={label}
                  description={competencyDescriptions[key]}
                />
              );
            })}
          </div>

          {/* Strengths & Development Areas */}
          <div className="space-y-8">
            {/* Strengths */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Styrkor
              </h2>
              {feedback.strengths && feedback.strengths.length > 0 ? (
                <ul className="space-y-2">
                  {feedback.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start">
                      <span className="inline-block w-2 h-2 mt-2 mr-3 bg-green-500 rounded-full" />
                      <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">Inga styrkor identifierade</p>
              )}
            </div>

            {/* Development Areas */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Utvecklingsområden
              </h2>
              {feedback.developmentAreas && feedback.developmentAreas.length > 0 ? (
                <ul className="space-y-2">
                  {feedback.developmentAreas.map((area, i) => (
                    <li key={i} className="flex items-start">
                      <span className="inline-block w-2 h-2 mt-2 mr-3 bg-yellow-500 rounded-full" />
                      <span className="text-gray-700 dark:text-gray-300">{area}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">Inga utvecklingsområden identifierade</p>
              )}
            </div>
          </div>
        </div>

        {/* Missed Findings & Alternative Strategies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Missed Findings */}
          {feedback.missedFindings && feedback.missedFindings.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Vad du kunde ha upptäckt
              </h2>
              <ul className="space-y-2">
                {feedback.missedFindings.map((finding, i) => (
                  <li key={i} className="flex items-start">
                    <span className="inline-block w-2 h-2 mt-2 mr-3 bg-red-500 rounded-full" />
                    <span className="text-gray-700 dark:text-gray-300">{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Alternative Strategies */}
          {feedback.alternativeStrategies && feedback.alternativeStrategies.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Alternativa frågestrategier
              </h2>
              <ul className="space-y-2">
                {feedback.alternativeStrategies.map((strategy, i) => (
                  <li key={i} className="flex items-start">
                    <span className="inline-block w-2 h-2 mt-2 mr-3 bg-blue-500 rounded-full" />
                    <span className="text-gray-700 dark:text-gray-300">{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Session Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sessionsstatistik
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {trainingSession.messages.filter(m => m.role === 'user').length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Dina meddelanden</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {trainingSession.messages.filter(m => m.role === 'assistant').length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Svar från företaget</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {trainingSession.annexSLChapters.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Annex SL-kapitel</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                {trainingSession.difficulty === 'grundlaggande' ? 'Grund' : trainingSession.difficulty === 'avancerad' ? 'Avancerad' : 'Medel'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Svårighetsgrad</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/session/new"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ny träningssession
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Till dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
