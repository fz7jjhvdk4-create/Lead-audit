'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DocumentViewer } from '@/components/DocumentViewer';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface Document {
  id: string;
  title: string;
  type: string;
  category: string;
  annexSLChapter: number;
  revision: string;
  lastUpdated: string;
  approvedBy: string;
  content: string;
}

interface SessionConfig {
  standard: string;
  type: string;
  difficulty: string;
  annexSLChapters: number[];
}

interface SessionChatProps {
  sessionId: string;
  initialMessages: Message[];
  config: SessionConfig;
}

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

export function SessionChat({ sessionId, initialMessages, config }: SessionChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDocuments, setShowDocuments] = useState(false);
  const [documents, setDocuments] = useState<Array<{ id: string; title: string; type: string; category: string; annexSLChapter: number; revision: string; lastUpdated: string }>>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedStandards = config.standard.split(',');

  // Hämta dokument för valda kapitel
  const fetchDocuments = useCallback(async (chapter?: number) => {
    setLoadingDocs(true);
    try {
      const url = chapter ? `/api/documents?chapter=${chapter}` : '/api/documents';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoadingDocs(false);
    }
  }, []);

  // Hämta ett specifikt dokument
  const fetchDocument = async (id: string) => {
    try {
      const response = await fetch(`/api/documents?id=${id}`);
      if (response.ok) {
        const doc = await response.json();
        setSelectedDocument(doc);
      }
    } catch (err) {
      console.error('Error fetching document:', err);
    }
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);

    // Lägg till användarens meddelande
    const userMessageObj: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMessage,
    };
    setMessages(prev => [...prev, userMessageObj]);

    // Lägg till placeholder för AI-svar
    const assistantMessageId = `assistant-${Date.now()}`;
    setMessages(prev => [
      ...prev,
      { id: assistantMessageId, role: 'assistant', content: '' },
    ]);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/session/${sessionId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Kunde inte skicka meddelande');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Ingen stream tillgänglig');

      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                fullContent += data.text;
                setMessages(prev =>
                  prev.map(m =>
                    m.id === assistantMessageId ? { ...m, content: fullContent } : m
                  )
                );
              }
              if (data.error) {
                throw new Error(data.error);
              }
            } catch (parseError) {
              // Ignorera parse-fel för tomma rader
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod');
      // Ta bort det tomma AI-meddelandet vid fel
      setMessages(prev => prev.filter(m => m.id !== assistantMessageId));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const completeSession = async () => {
    if (isCompleting) return;

    if (messages.length < 4) {
      setError('Genomför mer av revisionen innan du avslutar (minst 2 frågor)');
      return;
    }

    setIsCompleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/session/${sessionId}/complete`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Kunde inte avsluta sessionen');
      }

      router.push(`/session/${sessionId}/feedback`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod');
      setIsCompleting(false);
    }
  };

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
              {auditTypes[config.type] || config.type}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Svårighetsgrad
            </h3>
            <p className="text-sm text-gray-900 dark:text-white">
              {difficultyLevels[config.difficulty] || config.difficulty}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Annex SL-kapitel
            </h3>
            <div className="space-y-2">
              {config.annexSLChapters.sort((a, b) => a - b).map((chapterId) => {
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

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Meddelanden
            </h3>
            <p className="text-sm text-gray-900 dark:text-white">
              {messages.filter(m => m.role === 'user').length} / 50
            </p>
          </div>

          {/* Dokumentbibliotek */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <button
              onClick={() => {
                setShowDocuments(!showDocuments);
                if (!showDocuments && documents.length === 0) {
                  fetchDocuments();
                }
              }}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Dokument
              </h3>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${showDocuments ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDocuments && (
              <div className="mt-3">
                {/* Kapitelfilter */}
                <div className="flex flex-wrap gap-1 mb-2">
                  <button
                    onClick={() => fetchDocuments()}
                    className="px-2 py-0.5 text-xs rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    Alla
                  </button>
                  {config.annexSLChapters.sort((a, b) => a - b).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => fetchDocuments(ch)}
                      className="px-2 py-0.5 text-xs rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/30"
                    >
                      Kap {ch}
                    </button>
                  ))}
                </div>

                {/* Dokumentlista */}
                {loadingDocs ? (
                  <div className="flex justify-center py-2">
                    <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                ) : (
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {documents.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => fetchDocument(doc.id)}
                        className="w-full text-left p-2 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className={`px-1 py-0.5 rounded text-[10px] font-medium ${
                            doc.type === 'chart' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                            doc.type === 'register' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                            doc.type === 'report' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                          }`}>
                            {doc.type === 'chart' ? '📊' : doc.type === 'register' ? '📋' : doc.type === 'report' ? '📄' : doc.type === 'matrix' ? '📈' : '📑'}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">Kap {doc.annexSLChapter}</span>
                        </div>
                        <p className="font-medium text-gray-900 dark:text-white truncate">{doc.title}</p>
                        <p className="text-gray-500 dark:text-gray-400">Rev {doc.revision}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={completeSession}
            disabled={isCompleting || messages.length < 4}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCompleting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Avslutar...
              </span>
            ) : (
              'Avsluta och få feedback'
            )}
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
            {selectedStandards.map((s) => standards[s] || s).join(' + ')} • {auditTypes[config.type]}
          </p>
        </header>

        {/* Error message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Redo att starta revisionen
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Kvalitetschef Erik Johansson och VD Anna Lindqvist väntar på dig i konferensrummet.
                  Börja med att presentera dig och syftet med revisionen.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xl px-4 py-3 rounded-lg whitespace-pre-wrap ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      {message.content || (
                        <span className="flex items-center">
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
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
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Skriv ditt meddelande till företaget..."
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  'Skicka'
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              Tryck Enter för att skicka, Shift+Enter för ny rad
            </p>
          </div>
        </div>
      </main>

      <style jsx>{`
        .typing-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          margin: 0 2px;
          background-color: currentColor;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out both;
        }
        .typing-dot:nth-child(1) {
          animation-delay: -0.32s;
        }
        .typing-dot:nth-child(2) {
          animation-delay: -0.16s;
        }
        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

      {/* Dokumentvisare modal */}
      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
}
