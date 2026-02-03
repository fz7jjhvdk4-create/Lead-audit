'use client';

import { useState } from 'react';

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

interface DocumentViewerProps {
  document: Document;
  onClose: () => void;
}

export function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  const typeColors: Record<string, string> = {
    policy: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    procedure: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    register: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    chart: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    report: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    form: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    matrix: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  };

  const typeLabels: Record<string, string> = {
    policy: 'Policy',
    procedure: 'Procedur',
    register: 'Register',
    chart: 'Diagram',
    report: 'Rapport',
    form: 'Formulär',
    matrix: 'Matris',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeColors[document.type] || 'bg-gray-100 text-gray-800'}`}>
                  {typeLabels[document.type] || document.type}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Kapitel {document.annexSLChapter}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {document.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Rev {document.revision} • Uppdaterad {document.lastUpdated} • {document.approvedBy}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <pre className="font-mono text-xs sm:text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
              {document.content}
            </pre>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Stäng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DocumentListProps {
  documents: Array<{
    id: string;
    title: string;
    type: string;
    category: string;
    annexSLChapter: number;
    revision: string;
    lastUpdated: string;
  }>;
  onSelect: (id: string) => void;
}

export function DocumentList({ documents, onSelect }: DocumentListProps) {
  const typeColors: Record<string, string> = {
    policy: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    procedure: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    register: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    chart: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    report: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    form: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    matrix: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  };

  const typeLabels: Record<string, string> = {
    policy: 'Policy',
    procedure: 'Procedur',
    register: 'Register',
    chart: 'Diagram',
    report: 'Rapport',
    form: 'Formulär',
    matrix: 'Matris',
  };

  if (documents.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-sm italic">
        Inga dokument hittades
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <button
          key={doc.id}
          onClick={() => onSelect(doc.id)}
          className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeColors[doc.type] || 'bg-gray-100 text-gray-800'}`}>
                {typeLabels[doc.type] || doc.type}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Kap {doc.annexSLChapter}
              </span>
            </div>
            <span className="text-xs text-gray-400">Rev {doc.revision}</span>
          </div>
          <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
            {doc.title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {doc.category} • {doc.lastUpdated}
          </p>
        </button>
      ))}
    </div>
  );
}

interface DocumentSidebarProps {
  sessionChapters: number[];
  onDocumentSelect: (document: Document) => void;
}

export function DocumentSidebar({ sessionChapters, onDocumentSelect }: DocumentSidebarProps) {
  const [documents, setDocuments] = useState<Array<{
    id: string;
    title: string;
    type: string;
    category: string;
    annexSLChapter: number;
    revision: string;
    lastUpdated: string;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const fetchDocuments = async (chapter?: number) => {
    setLoading(true);
    try {
      const url = chapter ? `/api/documents?chapter=${chapter}` : '/api/documents';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocument = async (id: string) => {
    try {
      const response = await fetch(`/api/documents?id=${id}`);
      if (response.ok) {
        const doc = await response.json();
        setSelectedDocument(doc);
        onDocumentSelect(doc);
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  };

  const handleChapterSelect = (chapter: number) => {
    setSelectedChapter(chapter);
    fetchDocuments(chapter);
  };

  const chapterTitles: Record<number, string> = {
    4: 'Org. förutsättningar',
    5: 'Ledarskap',
    6: 'Planering',
    7: 'Stöd',
    8: 'Verksamhet',
    9: 'Utvärdering',
    10: 'Förbättring',
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
        Dokument att granska
      </h3>

      {/* Kapitelväljare */}
      <div className="flex flex-wrap gap-1 mb-3">
        {sessionChapters.sort((a, b) => a - b).map((ch) => (
          <button
            key={ch}
            onClick={() => handleChapterSelect(ch)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              selectedChapter === ch
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {ch}
          </button>
        ))}
      </div>

      {selectedChapter && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Kapitel {selectedChapter}: {chapterTitles[selectedChapter]}
        </p>
      )}

      {/* Dokumentlista */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : selectedChapter ? (
          <DocumentList documents={documents} onSelect={fetchDocument} />
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            Välj ett kapitel ovan för att se tillgängliga dokument
          </p>
        )}
      </div>

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
