'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Branscher
const industries = [
  {
    id: 'manufacturing',
    name: 'Verkstad/Tillverkning',
    description: 'Precisionskomponenter, fordonsindustri, IATF 16949',
    company: 'Nordisk Precision AB',
    icon: '🏭',
  },
  {
    id: 'food',
    name: 'Livsmedel',
    description: 'Livsmedelssäkerhet, FSSC 22000, HACCP',
    company: 'Nordisk Livs AB',
    icon: '🍽️',
  },
  {
    id: 'construction',
    name: 'Bygg/Anläggning',
    description: 'Byggprojekt, arbetsmiljö, BF9K',
    company: 'Nordbygg Entreprenad AB',
    icon: '🏗️',
  },
];

// Annex SL kapitelstruktur
const annexSLChapters = [
  {
    id: 4,
    title: 'Organisationens förutsättningar',
    focus: ['intressentanalys', 'QMS-omfattning', 'processsamverkan'],
  },
  {
    id: 5,
    title: 'Ledarskap',
    focus: ['ledningens engagemang', 'kvalitetspolicy', 'roller och ansvar'],
  },
  {
    id: 6,
    title: 'Planering',
    focus: ['risker och möjligheter', 'kvalitetsmål', 'ändringshantering'],
  },
  {
    id: 7,
    title: 'Stöd',
    focus: ['resurser', 'kompetens', 'medvetenhet', 'kommunikation', 'dokumenterad information'],
  },
  {
    id: 8,
    title: 'Verksamhet',
    focus: ['driftplanering', 'kundkommunikation', 'design', 'leverantörsstyrning', 'produktion'],
  },
  {
    id: 9,
    title: 'Utvärdering av prestanda',
    focus: ['övervakning och mätning', 'internrevision', 'ledningens genomgång'],
  },
  {
    id: 10,
    title: 'Förbättring',
    focus: ['avvikelse och korrigerande åtgärd', 'ständig förbättring'],
  },
];

const standards = [
  { id: 'iso9001', name: 'ISO 9001:2015', description: 'Kvalitetsledningssystem' },
  { id: 'iso14001', name: 'ISO 14001:2015', description: 'Miljöledningssystem' },
  { id: 'iso45001', name: 'ISO 45001:2018', description: 'Arbetsmiljöledningssystem' },
  { id: 'iatf16949', name: 'IATF 16949:2016', description: 'Kvalitet för fordonsindustrin' },
];

const auditTypes = [
  { id: 'intern', name: 'Intern revision', description: 'Första parts revision - egen organisation' },
  { id: 'extern', name: 'Extern revision (part 2)', description: 'Andra parts revision - leverantör/kund' },
  { id: 'certifiering', name: 'Certifieringsrevision', description: 'Tredje parts revision - initial certifiering' },
  { id: 'overvakning', name: 'Övervakningsrevision', description: 'Tredje parts revision - årlig uppföljning' },
];

const difficultyLevels = [
  {
    id: 'grundlaggande',
    name: 'Grundläggande',
    description: 'Mindre avvikelser, ofullständiga register, bristande spårbarhet. Lämplig för nybörjare.',
  },
  {
    id: 'medel',
    name: 'Medel',
    description: 'Systembrister, otillräcklig riskbedömning, bristande koppling policy-praktik. För erfarna revisorer.',
  },
  {
    id: 'avancerad',
    name: 'Avancerad',
    description: 'Dolda systemfel, konflikterande bevis, motsägelsefulla uppgifter. För expertrevisorer.',
  },
];

type Step = 'industry' | 'standard' | 'type' | 'chapters' | 'difficulty' | 'options' | 'summary';

export default function NewSessionPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('industry');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [selectedStandards, setSelectedStandards] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedChapters, setSelectedChapters] = useState<number[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [hintsEnabled, setHintsEnabled] = useState<boolean>(true);

  const steps: { id: Step; title: string }[] = [
    { id: 'industry', title: 'Bransch' },
    { id: 'standard', title: 'Standard' },
    { id: 'type', title: 'Revisionstyp' },
    { id: 'chapters', title: 'Fokusområden' },
    { id: 'difficulty', title: 'Svårighetsgrad' },
    { id: 'options', title: 'Alternativ' },
    { id: 'summary', title: 'Sammanfattning' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const canProceed = () => {
    switch (currentStep) {
      case 'industry':
        return selectedIndustry !== '';
      case 'standard':
        return selectedStandards.length > 0;
      case 'type':
        return selectedType !== '';
      case 'chapters':
        return selectedChapters.length > 0;
      case 'difficulty':
        return selectedDifficulty !== '';
      case 'options':
        return true; // Alltid giltigt, hints har defaultvärde
      case 'summary':
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const toggleStandard = (standardId: string) => {
    setSelectedStandards((prev) =>
      prev.includes(standardId) ? prev.filter((s) => s !== standardId) : [...prev, standardId]
    );
  };

  const toggleChapter = (chapterId: number) => {
    setSelectedChapters((prev) =>
      prev.includes(chapterId) ? prev.filter((c) => c !== chapterId) : [...prev, chapterId]
    );
  };

  const selectAllChapters = () => {
    setSelectedChapters(annexSLChapters.map((c) => c.id));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: selectedIndustry,
          standard: selectedStandards.join(','),
          type: selectedType,
          difficulty: selectedDifficulty,
          annexSLChapters: selectedChapters,
          hintsEnabled,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Kunde inte skapa session');
      }

      const { sessionId } = await response.json();
      router.push(`/session/${sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett oväntat fel uppstod');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <svg className="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Tillbaka till dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ny träningssession</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Konfigurera din revisionsträning
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    index < currentStepIndex
                      ? 'bg-blue-600 text-white'
                      : index === currentStepIndex
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {index < currentStepIndex ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`ml-2 text-sm hidden sm:inline ${
                    index <= currentStepIndex
                      ? 'text-gray-900 dark:text-white font-medium'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 sm:w-24 h-0.5 mx-2 ${
                      index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Step: Industry */}
          {currentStep === 'industry' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Välj bransch
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Välj vilken typ av företag du vill träna på att revidera. Varje bransch har unika dokument, scenarion och avvikelser.
              </p>
              <div className="grid gap-4">
                {industries.map((industry) => (
                  <button
                    key={industry.id}
                    onClick={() => setSelectedIndustry(industry.id)}
                    className={`p-4 text-left rounded-lg border-2 transition-colors ${
                      selectedIndustry === industry.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{industry.icon}</span>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{industry.name}</span>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{industry.company}</p>
                        </div>
                      </div>
                      {selectedIndustry === industry.id && (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-9">{industry.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Standard */}
          {currentStep === 'standard' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Välj standard(er) att revidera
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Välj en eller flera standarder för en kombinerad revision.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {standards.map((standard) => (
                  <button
                    key={standard.id}
                    onClick={() => toggleStandard(standard.id)}
                    className={`p-4 text-left rounded-lg border-2 transition-colors ${
                      selectedStandards.includes(standard.id)
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">{standard.name}</span>
                      {selectedStandards.includes(standard.id) && (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{standard.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Type */}
          {currentStep === 'type' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Välj revisionstyp
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Vilken typ av revision vill du träna på?
              </p>
              <div className="grid gap-4">
                {auditTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 text-left rounded-lg border-2 transition-colors ${
                      selectedType === type.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">{type.name}</span>
                      {selectedType === type.id && (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Chapters */}
          {currentStep === 'chapters' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Välj Annex SL-kapitel att fokusera på
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Annex SL är den gemensamma strukturen för alla ISO-ledningssystemstandarder.
                  </p>
                </div>
                <button
                  onClick={selectAllChapters}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Välj alla
                </button>
              </div>
              <div className="grid gap-3">
                {annexSLChapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => toggleChapter(chapter.id)}
                    className={`p-4 text-left rounded-lg border-2 transition-colors ${
                      selectedChapters.includes(chapter.id)
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">
                          {chapter.id}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">{chapter.title}</span>
                      </div>
                      {selectedChapters.includes(chapter.id) && (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="mt-2 ml-11 flex flex-wrap gap-2">
                      {chapter.focus.map((f) => (
                        <span
                          key={f}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Difficulty */}
          {currentStep === 'difficulty' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Välj svårighetsgrad
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Svårighetsgraden påverkar komplexiteten på de avvikelser och scenarion du möter.
              </p>
              <div className="grid gap-4">
                {difficultyLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedDifficulty(level.id)}
                    className={`p-4 text-left rounded-lg border-2 transition-colors ${
                      selectedDifficulty === level.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">{level.name}</span>
                      {selectedDifficulty === level.id && (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{level.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Options */}
          {currentStep === 'options' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Träningsalternativ
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Anpassa din träningsupplevelse med dessa alternativ.
              </p>

              <div className="space-y-6">
                {/* Hints toggle */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">
                        Hints/tips-system
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Få hjälp om du kör fast under revisionen. Hints påverkar ditt slutbetyg något.
                      </p>
                    </div>
                    <button
                      onClick={() => setHintsEnabled(!hintsEnabled)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        hintsEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          hintsEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  {hintsEnabled && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>Tips:</strong> Du kan be om hints på tre nivåer:
                      </p>
                      <ul className="text-sm text-blue-600 dark:text-blue-400 mt-2 space-y-1">
                        <li>• <strong>Nivå 1:</strong> Subtil ledtråd utan att avslöja svaret</li>
                        <li>• <strong>Nivå 2:</strong> Konkret förslag på vad du kan utforska</li>
                        <li>• <strong>Nivå 3:</strong> Fullständigt svar med detaljer</li>
                      </ul>
                    </div>
                  )}
                  {!hintsEnabled && (
                    <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        <strong>Expertläge:</strong> Du tränar utan hints för en mer realistisk upplevelse.
                        Detta ger en mer autentisk bild av din revisorskompetens.
                      </p>
                    </div>
                  )}
                </div>

                {/* Info about voice input */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    <div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">
                        Röstinput
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Under sessionen kan du använda mikrofonknappen för att tala in dina frågor
                        istället för att skriva. Detta ger en mer realistisk träningsupplevelse
                        som liknar verkliga revisionssamtal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step: Summary */}
          {currentStep === 'summary' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Sammanfattning av sessionskonfiguration
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Granska dina val innan du startar sessionen.
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bransch</h3>
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{industries.find((i) => i.id === selectedIndustry)?.icon}</span>
                    <p className="text-gray-900 dark:text-white">
                      {industries.find((i) => i.id === selectedIndustry)?.name}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Standard(er)</h3>
                  <p className="text-gray-900 dark:text-white">
                    {selectedStandards.map((s) => standards.find((st) => st.id === s)?.name).join(', ')}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Revisionstyp</h3>
                  <p className="text-gray-900 dark:text-white">
                    {auditTypes.find((t) => t.id === selectedType)?.name}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Annex SL-kapitel</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedChapters.sort((a, b) => a - b).map((c) => {
                      const chapter = annexSLChapters.find((ch) => ch.id === c);
                      return (
                        <span
                          key={c}
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                        >
                          Kap {c}: {chapter?.title}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Svårighetsgrad</h3>
                  <p className="text-gray-900 dark:text-white">
                    {difficultyLevels.find((d) => d.id === selectedDifficulty)?.name}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Träningsalternativ</h3>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm ${
                      hintsEnabled
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                    }`}>
                      {hintsEnabled ? '💡 Hints aktiverat' : '🎯 Expertläge (inga hints)'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      🎤 Röstinput tillgängligt
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Om {industries.find((i) => i.id === selectedIndustry)?.company}
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    {selectedIndustry === 'manufacturing' && (
                      <>
                        Du kommer att revidera Nordisk Precision AB, ett tillverkande verkstadsföretag med 180 anställda.
                        Företaget tillverkar precisionskomponenter för fordonsindustrin och är certifierat enligt
                        ISO 9001, ISO 14001, ISO 45001 och IATF 16949.
                      </>
                    )}
                    {selectedIndustry === 'food' && (
                      <>
                        Du kommer att revidera Nordisk Livs AB, ett livsmedelsföretag med 145 anställda.
                        Företaget producerar kyld och fryst färdigmat för dagligvaruhandeln och är certifierat enligt
                        FSSC 22000, ISO 9001, ISO 14001 och BRC Food Safety.
                      </>
                    )}
                    {selectedIndustry === 'construction' && (
                      <>
                        Du kommer att revidera Nordbygg Entreprenad AB, ett byggföretag med 210 anställda.
                        Företaget är specialiserat på kommersiella byggprojekt och renoveringar och är certifierat enligt
                        ISO 9001, ISO 14001, ISO 45001 och BF9K.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentStepIndex === 0
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Tillbaka
            </button>

            {currentStep === 'summary' ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Startar session...
                  </>
                ) : (
                  <>
                    Starta session
                    <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Nästa
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
