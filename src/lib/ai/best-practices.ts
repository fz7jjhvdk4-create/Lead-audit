/**
 * US-023: Best practice-exempel efter session
 * Visar exempelfrågor och tekniker för inlärning
 */

export interface BestPracticeExample {
  area: string;
  topic: string;
  userApproach?: string;
  optimalApproach: string;
  technique: string;
  isoReference?: string;
  explanation: string;
}

export interface InterviewTechnique {
  name: string;
  description: string;
  example: string;
  whenToUse: string;
}

// Intervjutekniker enligt ISO 19011
export const interviewTechniques: InterviewTechnique[] = [
  {
    name: '5 Varför',
    description: 'Fråga "varför" upprepade gånger för att nå grundorsaken',
    example: 'Varför missades leveransen? → Varför var maskinen ur funktion? → Varför utfördes inte underhållet? → Varför prioriterades det bort? → Varför finns ingen planering?',
    whenToUse: 'Vid avvikelser, för att hitta systembrister bakom enskilda händelser',
  },
  {
    name: 'Tratt-tekniken',
    description: 'Börja med breda öppna frågor, smalna av mot specifika detaljer',
    example: 'Hur fungerar er reklamationshantering? → Vad händer när ni får en reklamation? → Hur dokumenterar ni åtgärden? → Vem godkänner stängningen?',
    whenToUse: 'Vid processgenomgångar, för att få överblick innan fördjupning',
  },
  {
    name: 'Omvänd tratt',
    description: 'Börja med specifik detalj, utvidga till större sammanhang',
    example: 'Jag ser att denna avvikelse stängdes igår. Hur beslutades det? → Vem var inblandad? → Hur ofta sker uppföljning? → Hur rapporteras trender till ledningen?',
    whenToUse: 'När du hittat något intressant och vill förstå systemet bakom',
  },
  {
    name: 'Visa mig',
    description: 'Be om konkreta bevis istället för muntliga svar',
    example: 'Kan du visa mig det senaste kalibreringsprotokollet? Kan vi gå till produktionen och se hur märkningen görs?',
    whenToUse: 'För att verifiera påståenden med objektiva bevis',
  },
  {
    name: 'Triangulering',
    description: 'Verifiera samma information från tre källor: dokument, intervju, observation',
    example: 'Proceduren säger X (dokument), operatören säger Y (intervju), och i praktiken ser jag Z (observation)',
    whenToUse: 'Alltid - för att säkerställa bevisens tillförlitlighet',
  },
  {
    name: 'Tystnad',
    description: 'Pausa efter svar för att uppmuntra vidare förklaring',
    example: 'Efter svaret, vänta 3-5 sekunder innan nästa fråga. Personen fyller ofta tystnaden med viktig information.',
    whenToUse: 'När du misstänker att det finns mer att berätta',
  },
  {
    name: 'Spegling',
    description: 'Upprepa nyckelfras från svaret för att få fördjupning',
    example: 'Intervjuad: "Vi har ibland problem med leveranser" → Revisor: "Ibland problem?" → Intervjuad berättar mer',
    whenToUse: 'För att få personen att utveckla ett intressant uttalande',
  },
];

// Best practice-frågor per Annex SL-kapitel
export const chapterBestPractices: Record<number, BestPracticeExample[]> = {
  4: [
    {
      area: 'Intressentanalys',
      topic: 'Identifiering av intressenter',
      optimalApproach: 'Hur identifierar ni era intressenter och deras krav? Kan du visa mig er intressentanalys och berätta hur ofta den uppdateras?',
      technique: 'Tratt-tekniken',
      isoReference: 'ISO 9001:2015 4.2',
      explanation: 'Börja brett med hur de identifierar, sedan specifikt om dokumentation och uppdatering',
    },
    {
      area: 'Ledningssystemets omfattning',
      topic: 'Scope och avgränsningar',
      optimalApproach: 'Jag ser att er scope täcker produktion. Hur har ni bedömt att konstruktion inte behöver ingå? Vilka aktiviteter utförs på andra platser?',
      technique: 'Omvänd tratt',
      isoReference: 'ISO 9001:2015 4.3',
      explanation: 'Utgå från dokumenterat scope, fråga om avgränsningar och motivering',
    },
  ],
  5: [
    {
      area: 'Ledningens engagemang',
      topic: 'Praktiskt ledarskap',
      optimalApproach: 'Hur visar ledningen sitt engagemang för kvalitetsledningssystemet i praktiken? Kan du ge mig några konkreta exempel från senaste månaden?',
      technique: 'Visa mig',
      isoReference: 'ISO 9001:2015 5.1',
      explanation: 'Undvik teoretiska svar - be om konkreta exempel som kan verifieras',
    },
    {
      area: 'Kvalitetspolicy',
      topic: 'Kommunikation och förståelse',
      optimalApproach: 'Kan du berätta med egna ord vad er kvalitetspolicy innebär för ditt dagliga arbete?',
      technique: 'Direkt fråga',
      isoReference: 'ISO 9001:2015 5.2',
      explanation: 'Fråga operatörer, inte bara chefer, för att verifiera kommunikation',
    },
  ],
  6: [
    {
      area: 'Risker och möjligheter',
      topic: 'Riskhantering i praktiken',
      optimalApproach: 'Visa mig hur ni identifierade och bedömde riskerna för denna process. Hur ofta omprövas riskbedömningen? Vad händer om en ny risk upptäcks?',
      technique: '5 Varför + Visa mig',
      isoReference: 'ISO 9001:2015 6.1',
      explanation: 'Kombinera dokumentgranskning med frågor om processen',
    },
    {
      area: 'Kvalitetsmål',
      topic: 'Mätning och uppföljning',
      optimalApproach: 'Jag ser att ni har målet "98% leveransprecision". Hur mäter ni det exakt? Vem samlar in data? Vad gör ni när målet inte nås?',
      technique: 'Tratt-tekniken',
      isoReference: 'ISO 9001:2015 6.2',
      explanation: 'Verifiera att målen är mätbara och följs upp systematiskt',
    },
  ],
  7: [
    {
      area: 'Kompetens',
      topic: 'Utbildning och utvärdering',
      optimalApproach: 'Hur säkerställer ni att personal har rätt kompetens för sina arbetsuppgifter? Kan du visa mig kompetensmatrisen för denna avdelning?',
      technique: 'Visa mig + Triangulering',
      isoReference: 'ISO 9001:2015 7.2',
      explanation: 'Verifiera med dokumentation OCH intervju med operatör',
    },
    {
      area: 'Dokumenterad information',
      topic: 'Styrning och åtkomst',
      optimalApproach: 'Hur vet du att du arbetar med rätt version av instruktionen? Vad händer om du hittar ett fel i dokumentet?',
      technique: 'Direkt fråga till operatör',
      isoReference: 'ISO 9001:2015 7.5',
      explanation: 'Fråga användare, inte dokumentstyrningsansvarig, för verklig bild',
    },
  ],
  8: [
    {
      area: 'Leverantörsstyrning',
      topic: 'Utvärdering och uppföljning',
      optimalApproach: 'Vilka kriterier använder ni för att godkänna en ny leverantör? Visa mig en utvärdering. Vad händer om en leverantör inte levererar enligt avtal?',
      technique: 'Tratt-tekniken + Visa mig',
      isoReference: 'ISO 9001:2015 8.4',
      explanation: 'Verifiera hela kedjan från godkännande till uppföljning',
    },
    {
      area: 'Produktion',
      topic: 'Processstyrning',
      optimalApproach: 'Hur vet operatören vilka inställningar som ska användas? Vad händer om något avviker från specifikationen?',
      technique: 'Observation + Intervju',
      isoReference: 'ISO 9001:2015 8.5',
      explanation: 'Observera i produktionen och fråga operatören direkt',
    },
  ],
  9: [
    {
      area: 'Internrevision',
      topic: 'Planering och uppföljning',
      optimalApproach: 'Visa mig revisionsprogrammet. Hur bestämmer ni vilka områden som ska revideras oftare? Hur följs avvikelser upp?',
      technique: 'Visa mig + 5 Varför',
      isoReference: 'ISO 9001:2015 9.2',
      explanation: 'Verifiera riskbaserad planering och effektiv uppföljning',
    },
    {
      area: 'Ledningens genomgång',
      topic: 'Input och beslut',
      optimalApproach: 'Kan du visa mig protokollet från senaste ledningens genomgång? Vilka beslut fattades och hur följdes de upp?',
      technique: 'Visa mig + Tratt-tekniken',
      isoReference: 'ISO 9001:2015 9.3',
      explanation: 'Verifiera att genomgången leder till åtgärder',
    },
  ],
  10: [
    {
      area: 'Avvikelsehantering',
      topic: 'Korrigerande åtgärder',
      optimalApproach: 'Visa mig en nyligen stängd avvikelse. Hur analyserades grundorsaken? Hur verifierade ni att åtgärden var effektiv?',
      technique: '5 Varför + Visa mig',
      isoReference: 'ISO 9001:2015 10.2',
      explanation: 'Följ en specifik avvikelse genom hela processen',
    },
    {
      area: 'Ständig förbättring',
      topic: 'Förbättringsprocess',
      optimalApproach: 'Ge mig ett exempel på en förbättring som genomförts det senaste halvåret. Hur identifierades behovet? Hur mättes resultatet?',
      technique: 'Omvänd tratt',
      isoReference: 'ISO 9001:2015 10.3',
      explanation: 'Konkreta exempel visar om förbättringsprocessen fungerar',
    },
  ],
};

// Genererar prompt för AI att skapa best practice-jämförelse
export function generateBestPracticeAnalysisPrompt(
  userMessages: string[],
  annexSLChapters: number[]
): string {
  const relevantPractices = annexSLChapters
    .filter(ch => chapterBestPractices[ch])
    .flatMap(ch => chapterBestPractices[ch]);

  return `
## BEST PRACTICE-ANALYS

Analysera revisorns frågor under sessionen och jämför med best practice.

### REVISORNS FRÅGOR
${userMessages.map((m, i) => `${i + 1}. ${m}`).join('\n')}

### BEST PRACTICE-REFERENS
${relevantPractices.map(p => `- **${p.area}**: ${p.optimalApproach} (Teknik: ${p.technique})`).join('\n')}

### INSTRUKTIONER
Skapa en JSON-array med 3-5 best practice-exempel. För varje exempel:
1. Identifiera ett område där revisorn kunde förbättras
2. Citera (eller parafrasera) revisorns faktiska fråga om den finns
3. Visa den optimala frågeställningen
4. Nämn vilken intervjuteknik som rekommenderas
5. Ge en kort förklaring

Svara ENDAST med JSON i detta format:
[
  {
    "area": "Kompetens",
    "topic": "Utbildningsverifiering",
    "userApproach": "Har ni utbildning?",
    "optimalApproach": "Hur säkerställer ni att operatören har rätt kompetens? Visa mig kompetensmatrisen.",
    "technique": "Visa mig + Triangulering",
    "isoReference": "ISO 9001:2015 7.2",
    "explanation": "Frågan var för bred och ledde inte till verifierbara bevis."
  }
]
`;
}

// Hämta relevanta intervjutekniker baserat på kontext
export function getRelevantTechniques(areas: string[]): InterviewTechnique[] {
  // Returnera alla tekniker för nu, kan filtreras baserat på areas i framtiden
  return interviewTechniques;
}
