'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RadarChart, CompetencyBarChart } from '@/components/RadarChart';

interface FeedbackData {
  revisionPrinciples: number | null;
  questionTechnique: number | null;
  standardKnowledge: number | null;
  evidenceCollection: number | null;
  nonconformityClass: number | null;
  communication: number | null;
  openingMeeting: number | null;
  closingMeeting: number | null;
  overallScore: number | null;
  strengths: string[];
  developmentAreas: string[];
  missedFindings: string[];
  alternativeStrategies: string[];
  isoReferences: string[];
  summary: string | null;
}

interface SessionData {
  standard: string;
  type: string;
  difficulty: string;
  annexSLChapters: number[];
  userMessageCount: number;
  assistantMessageCount: number;
  completedAt: string | null;
}

interface Props {
  feedback: FeedbackData;
  session: SessionData;
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
  revisionPrinciples: 'Integritet, opartiskhet, professionalism, faktabaserat förhållningssätt',
  questionTechnique: 'Öppna frågor, fördjupning, logisk sekvens, aktivt lyssnande',
  standardKnowledge: 'Korrekt referens till krav, processansats, riskbaserat tänkande',
  evidenceCollection: 'Objektiva bevis, triangulering, dokumentgranskning, observation',
  nonconformityClass: 'Korrekt klassificering: större/mindre avvikelser, förbättringsmöjligheter',
  communication: 'Tydlighet, respekt, bekräftar förståelse, förklarar syfte',
  openingMeeting: 'Presentation, syfte, revisionsplan, frågor',
  closingMeeting: 'Sammanfattning, fynd, kommentarer, nästa steg',
};

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 4 ? 'text-green-500' : score >= 3 ? 'text-yellow-500' : 'text-red-500';
  const bgColor = score >= 4 ? 'bg-green-100 dark:bg-green-900/30' : score >= 3 ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-red-100 dark:bg-red-900/30';

  return (
    <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full ${bgColor}`}>
      <span className={`text-5xl font-bold ${color}`}>{score}</span>
      <span className="text-xl text-gray-500 dark:text-gray-400 ml-1">/5</span>
    </div>
  );
}

export function FeedbackContent({ feedback, session }: Props) {
  const [viewMode, setViewMode] = useState<'chart' | 'bars'>('chart');
  const [isPrinting, setIsPrinting] = useState(false);

  // Förbered data för radar chart
  const chartData = [
    { label: 'Principer', value: feedback.revisionPrinciples || 0 },
    { label: 'Frågeteknik', value: feedback.questionTechnique || 0 },
    { label: 'Standardkunskap', value: feedback.standardKnowledge || 0 },
    { label: 'Bevisinhämtning', value: feedback.evidenceCollection || 0 },
    { label: 'Kommunikation', value: feedback.communication || 0 },
  ].filter(d => d.value > 0);

  // Förbered data för bar chart
  const barData = Object.entries(competencyLabels)
    .map(([key, label]) => ({
      label,
      value: feedback[key as keyof FeedbackData] as number,
      description: competencyDescriptions[key],
    }))
    .filter(d => d.value !== null && d.value !== undefined);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const handleExportPDF = () => {
    // Enkel PDF-export via print dialog
    handlePrint();
  };

  return (
    <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Revisionsresultat
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {session.standard} • {session.type}
        </p>
        {session.completedAt && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Avslutad: {new Date(session.completedAt).toLocaleDateString('sv-SE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>

      {/* Overall Score */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 text-center">
        <h2 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-4">
          Totalbetyg enligt ISO 19011
        </h2>
        <ScoreCircle score={feedback.overallScore || 3} />
        {feedback.summary && (
          <p className="mt-6 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            {feedback.summary}
          </p>
        )}
      </div>

      {/* Visualization Toggle */}
      <div className="flex justify-center mb-6 print:hidden">
        <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
          <button
            onClick={() => setViewMode('chart')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'chart'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Diagram
          </button>
          <button
            onClick={() => setViewMode('bars')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'bars'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Staplar
          </button>
        </div>
      </div>

      {/* Competency Visualization */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">
          Kompetensområden (ISO 19011:2018)
        </h2>

        {viewMode === 'chart' ? (
          <div className="flex justify-center">
            <RadarChart data={chartData} size={350} color="#3b82f6" />
          </div>
        ) : (
          <CompetencyBarChart data={barData} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Strengths */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Styrkor
          </h2>
          {feedback.strengths.length > 0 ? (
            <ul className="space-y-2">
              {feedback.strengths.map((strength, i) => (
                <li key={i} className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-3 bg-green-500 rounded-full flex-shrink-0" />
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
          {feedback.developmentAreas.length > 0 ? (
            <ul className="space-y-2">
              {feedback.developmentAreas.map((area, i) => (
                <li key={i} className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-3 bg-yellow-500 rounded-full flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{area}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">Inga utvecklingsområden identifierade</p>
          )}
        </div>
      </div>

      {/* Missed Findings & Alternative Strategies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Missed Findings */}
        {feedback.missedFindings.length > 0 && (
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
                  <span className="inline-block w-2 h-2 mt-2 mr-3 bg-red-500 rounded-full flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Alternative Strategies */}
        {feedback.alternativeStrategies.length > 0 && (
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
                  <span className="inline-block w-2 h-2 mt-2 mr-3 bg-blue-500 rounded-full flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{strategy}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ISO References */}
      {feedback.isoReferences && feedback.isoReferences.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            ISO 19011 Referenser
          </h2>
          <ul className="space-y-2">
            {feedback.isoReferences.map((ref, i) => (
              <li key={i} className="flex items-start">
                <span className="inline-block w-2 h-2 mt-2 mr-3 bg-purple-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{ref}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Session Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Sessionsstatistik
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {session.userMessageCount}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Dina meddelanden</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {session.assistantMessageCount}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Svar från företaget</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {session.annexSLChapters.length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Annex SL-kapitel</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
              {session.difficulty === 'grundlaggande' ? 'Grund' : session.difficulty === 'avancerad' ? 'Avancerad' : 'Medel'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Svårighetsgrad</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
        <button
          onClick={handleExportPDF}
          disabled={isPrinting}
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {isPrinting ? 'Förbereder...' : 'Exportera som PDF'}
        </button>
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

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}
