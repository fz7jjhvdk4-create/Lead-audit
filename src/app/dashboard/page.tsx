import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getDashboardStats } from '@/lib/actions/dashboard';

function formatDate(date: Date | null): string {
  if (!date) return '-';
  return new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

function formatStandard(standard: string): string {
  const standards: Record<string, string> = {
    'iso9001': 'ISO 9001',
    'iso14001': 'ISO 14001',
    'iso45001': 'ISO 45001',
    'iatf16949': 'IATF 16949',
  };
  return standards[standard] || standard;
}

function formatType(type: string): string {
  const types: Record<string, string> = {
    'intern': 'Intern',
    'extern': 'Extern',
    'certifiering': 'Certifiering',
    'overvakning': 'Övervakning',
  };
  return types[type] || type;
}

function formatDifficulty(difficulty: string): string {
  const difficulties: Record<string, string> = {
    'grundlaggande': 'Grundläggande',
    'medel': 'Medel',
    'avancerad': 'Avancerad',
  };
  return difficulties[difficulty] || difficulty;
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' | null }) {
  if (trend === 'up') {
    return (
      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    );
  }
  if (trend === 'down') {
    return (
      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    );
  }
  if (trend === 'stable') {
    return (
      <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    );
  }
  return <span className="text-gray-400">-</span>;
}

function ScoreBar({ score, label }: { score: number | null; label: string }) {
  const percentage = score ? (score / 5) * 100 : 0;

  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium text-gray-900 dark:text-white">
          {score ? `${score}/5` : '-'}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const stats = await getDashboardStats(session.user.id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Lead Audit Simulering</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <span className="text-gray-700 dark:text-gray-300">Hej, {session.user?.name}</span>
              <Link
                href="/api/auth/signout"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Logga ut
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Välkommen, {session.user?.name}!
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Här är din träningsdashboard för ledningssystemsrevisioner.
            </p>
          </div>

          {/* Statistik-kort */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Genomförda sessioner
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stats.completedSessions}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Genomsnittligt betyg
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stats.averageScore ? `${stats.averageScore}/5` : '-'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Senaste session
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatDate(stats.lastSessionDate)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <TrendIcon trend={stats.trend} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Trend
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                        {stats.trend === 'up' ? 'Uppåtgående' : stats.trend === 'down' ? 'Nedåtgående' : stats.trend === 'stable' ? 'Stabil' : '-'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Starta ny session */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Starta ny träningssession
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Träna på att genomföra revisioner av ledningssystem enligt ISO 19011.
                  Simulatorn agerar som företaget Nordisk Precision AB.
                </p>
                <Link
                  href="/session/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Starta ny session
                </Link>
              </div>

              {/* Senaste sessioner */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Senaste sessioner</h3>
                </div>
                {stats.recentSessions.length > 0 ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {stats.recentSessions.map((s) => (
                      <li key={s.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <Link href={`/session/${s.id}`} className="block">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatStandard(s.standard)} - {formatType(s.type)}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDifficulty(s.difficulty)} • {formatDate(s.startedAt)}
                              </p>
                            </div>
                            <div className="flex items-center">
                              {s.completedAt ? (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  s.overallScore && s.overallScore >= 4
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : s.overallScore && s.overallScore >= 3
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                  {s.overallScore ? `${s.overallScore}/5` : 'Klar'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                  Pågående
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p>Du har inga genomförda sessioner ännu.</p>
                    <p className="text-sm mt-2">Starta din första träningssession ovan!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Kompetensöversikt */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Kompetensöversikt
                </h3>
                {stats.completedSessions > 0 ? (
                  <div>
                    <ScoreBar score={stats.competencyScores.revisionPrinciples} label="Revisionsprinciper" />
                    <ScoreBar score={stats.competencyScores.questionTechnique} label="Frågeteknik" />
                    <ScoreBar score={stats.competencyScores.standardKnowledge} label="Standardkunskap" />
                    <ScoreBar score={stats.competencyScores.evidenceCollection} label="Bevisinhämtning" />
                    <ScoreBar score={stats.competencyScores.nonconformityClass} label="Avvikelseklassificering" />
                    <ScoreBar score={stats.competencyScores.communication} label="Kommunikation" />
                    <ScoreBar score={stats.competencyScores.openingMeeting} label="Startmöte" />
                    <ScoreBar score={stats.competencyScores.closingMeeting} label="Slutmöte" />
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    <p className="text-sm">Genomför din första session för att se din kompetensöversikt.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
