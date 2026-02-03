import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

// Annex SL kapitelstruktur
const annexSLChapters: Record<number, { title: string; focus: string[] }> = {
  4: { title: 'Organisationens förutsättningar', focus: ['intressentanalys', 'QMS-omfattning', 'processsamverkan'] },
  5: { title: 'Ledarskap', focus: ['ledningens engagemang', 'kvalitetspolicy', 'roller och ansvar'] },
  6: { title: 'Planering', focus: ['risker och möjligheter', 'kvalitetsmål', 'ändringshantering'] },
  7: { title: 'Stöd', focus: ['resurser', 'kompetens', 'medvetenhet', 'kommunikation', 'dokumenterad information'] },
  8: { title: 'Verksamhet', focus: ['driftplanering', 'kundkommunikation', 'design', 'leverantörsstyrning', 'produktion'] },
  9: { title: 'Utvärdering av prestanda', focus: ['övervakning och mätning', 'internrevision', 'ledningens genomgång'] },
  10: { title: 'Förbättring', focus: ['avvikelse och korrigerande åtgärd', 'ständig förbättring'] },
};

const standards: Record<string, string> = {
  iso9001: 'ISO 9001:2015',
  iso14001: 'ISO 14001:2015',
  iso45001: 'ISO 45001:2018',
  iatf16949: 'IATF 16949:2016',
};

const auditTypes: Record<string, string> = {
  intern: 'Intern revision',
  extern: 'Extern revision (part 2)',
  certifiering: 'Certifieringsrevision',
  overvakning: 'Övervakningsrevision',
};

const difficultyLevels: Record<string, string> = {
  grundlaggande: 'Grundläggande',
  medel: 'Medel',
  avancerad: 'Avancerad',
};

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

  const selectedStandards = trainingSession.standard.split(',');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Tillbaka
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sessionsinformation</h2>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Standard
            </h3>
            <div className="flex flex-wrap gap-1">
              {selectedStandards.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                >
                  {standards[s] || s}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Revisionstyp
            </h3>
            <p className="text-sm text-gray-900 dark:text-white">
              {auditTypes[trainingSession.type] || trainingSession.type}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Svårighetsgrad
            </h3>
            <p className="text-sm text-gray-900 dark:text-white">
              {difficultyLevels[trainingSession.difficulty] || trainingSession.difficulty}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Annex SL-kapitel
            </h3>
            <div className="space-y-2">
              {trainingSession.annexSLChapters.sort((a, b) => a - b).map((chapterId) => {
                const chapter = annexSLChapters[chapterId];
                return (
                  <div key={chapterId} className="text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Kap {chapterId}:
                    </span>{' '}
                    <span className="text-gray-600 dark:text-gray-400">{chapter?.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <h3 className="text-xs font-medium text-blue-800 dark:text-blue-300 uppercase tracking-wide mb-1">
              Företag
            </h3>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200">Nordisk Precision AB</p>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              Tillverkande verkstadsföretag, 180 anställda
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Avsluta och få feedback
          </button>
        </div>
      </aside>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Revision av Nordisk Precision AB
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedStandards.map((s) => standards[s] || s).join(' + ')} • {auditTypes[trainingSession.type]}
          </p>
        </header>

        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {trainingSession.messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Redo att starta revisionen
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  Kvalitetschef Erik Johansson och VD Anna Lindqvist väntar på dig i konferensrummet.
                  Börja med att presentera dig och syftet med revisionen.
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                  Chattfunktionen implementeras i nästa steg (US-007 och US-008)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {trainingSession.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xl px-4 py-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Input area */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <textarea
                  rows={2}
                  placeholder="Skriv ditt meddelande till företaget..."
                  disabled
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <button
                disabled
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Skicka
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              Chattfunktionen aktiveras efter AI-integration (US-007)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
