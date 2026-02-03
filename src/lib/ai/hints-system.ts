/**
 * US-022: Hints/tips-system
 * Ger kontextbaserade ledtrådar till revisorer som kör fast
 */

export interface HintLevel {
  level: 1 | 2 | 3;
  name: string;
  description: string;
}

export const hintLevels: HintLevel[] = [
  { level: 1, name: 'Subtil ledtråd', description: 'En försiktig riktning utan att avslöja svaret' },
  { level: 2, name: 'Konkret förslag', description: 'Specifik vägledning om vad du kan utforska' },
  { level: 3, name: 'Fullständigt svar', description: 'Detaljerad förklaring av vad du bör göra' },
];

export interface HintContext {
  annexSLChapters: number[];
  difficulty: string;
  messageCount: number;
  recentTopics: string[];
  currentPhase: 'opening' | 'execution' | 'closing';
}

// Genererar hint-prompten som skickas till AI:n
export function generateHintPrompt(level: number, context: HintContext): string {
  const levelDescriptions: Record<number, string> = {
    1: `GE EN SUBTIL LEDTRÅD:
- Ställ en öppen motfråga som leder revisorn åt rätt håll
- Nämn ett område som kan vara värt att utforska
- Undvik att avslöja specifika avvikelser eller svar
- Håll det kort (1-2 meningar)`,
    2: `GE ETT KONKRET FÖRSLAG:
- Föreslå en specifik fråga eller teknik att använda
- Peka på ett dokument eller process som bör undersökas
- Ge ett exempel på hur frågan kan formuleras
- Förklara varför detta område är relevant`,
    3: `GE ETT FULLSTÄNDIGT SVAR:
- Förklara exakt vad revisorn bör fråga om
- Beskriv vilka avvikelser som finns att upptäcka
- Ge exempel på effektiva frågeformuleringar
- Förklara kopplingen till standardkraven`,
  };

  const chapterHints = getChapterSpecificHints(context.annexSLChapters);
  const phaseHints = getPhaseSpecificHints(context.currentPhase);

  return `
## HINT-FÖRFRÅGAN (Nivå ${level})

Revisorn har bett om hjälp. Analysera konversationen och ge en hint baserad på följande:

${levelDescriptions[level]}

### KONTEXT
- Valda Annex SL-kapitel: ${context.annexSLChapters.join(', ')}
- Svårighetsgrad: ${context.difficulty}
- Antal meddelanden: ${context.messageCount}
- Nuvarande fas: ${context.currentPhase === 'opening' ? 'Startmöte' : context.currentPhase === 'closing' ? 'Slutmöte' : 'Revisionsutförande'}

### FOKUSOMRÅDEN FÖR HINTS
${chapterHints}

${phaseHints}

### FORMAT
Svara som en mentor/coach. Använd formatet:

💡 **Hint:** [Din ledtråd här]

${level >= 2 ? '**Varför:** [Förklaring av varför detta är relevant]' : ''}
${level >= 3 ? '**Standardkoppling:** [Relevant ISO-krav]' : ''}

Svara på svenska och anpassa nivån till svårighetsgraden ${context.difficulty}.
`;
}

function getChapterSpecificHints(chapters: number[]): string {
  const chapterHints: Record<number, string[]> = {
    4: [
      'Intressentanalys - Fråga hur externa och interna faktorer identifieras och uppdateras',
      'Ledningssystemets omfattning - Verifiera att scope täcker alla relevanta processer',
      'Processinteraktioner - Be om att se processkarta och förklaring av kopplingar',
    ],
    5: [
      'Ledningens engagemang - Fråga hur ledningen visar sitt engagemang i praktiken',
      'Kvalitetspolicy - Verifiera att policyn är kommunicerad och förstådd',
      'Roller och ansvar - Be om organisationsschema och ansvarsbeskrivningar',
    ],
    6: [
      'Risker och möjligheter - Fråga hur risker identifieras, bedöms och hanteras',
      'Kvalitetsmål - Verifiera att målen är SMARTa och följs upp',
      'Ändringshantering - Hur planeras och kontrolleras förändringar?',
    ],
    7: [
      'Resurser och infrastruktur - Fråga om underhåll och kalibrering',
      'Kompetens - Be om utbildningsplaner och kompetensutvärderingar',
      'Dokumentstyrning - Kontrollera revisionsstatus och godkännanden',
    ],
    8: [
      'Operativ planering - Fråga om produktionsplanering och kapacitet',
      'Kundkommunikation - Hur hanteras kundkrav och reklamationer?',
      'Leverantörsstyrning - Be om leverantörsutvärderingar och godkännandekriterier',
    ],
    9: [
      'Övervakning och mätning - Fråga om KPI:er och hur de följs upp',
      'Internrevision - Be om revisionsplan och uppföljning av fynd',
      'Ledningens genomgång - Fråga om senaste genomgång och beslut',
    ],
    10: [
      'Avvikelsehantering - Fråga om processen för korrigerande åtgärder',
      'Ständig förbättring - Hur identifieras och implementeras förbättringar?',
      'Grundorsaksanalys - Be om exempel på 5 varför eller fiskbensdiagram',
    ],
  };

  const relevantHints = chapters
    .filter(ch => chapterHints[ch])
    .map(ch => `**Kapitel ${ch}:**\n${chapterHints[ch].map(h => `  - ${h}`).join('\n')}`)
    .join('\n\n');

  return relevantHints || 'Generella revisionstekniker kan tillämpas.';
}

function getPhaseSpecificHints(phase: string): string {
  const phaseHints: Record<string, string> = {
    opening: `### STARTMÖTE-HINTS
- Har revisorn presenterat sig och sitt team?
- Har revisionsplanen bekräftats?
- Har praktiska frågor diskuterats (tidplan, resurser, lunch)?
- Har konfidentialitet och rapportering berörts?`,
    execution: `### REVISIONSUTFÖRANDE-HINTS
- Triangulering: Verifiera genom intervju + dokument + observation
- Följ processer från input till output
- Fråga "Visa mig" för konkreta bevis
- Sök efter kopplingar mellan olika krav`,
    closing: `### SLUTMÖTE-HINTS
- Har alla iakttagelser presenterats?
- Har företaget fått kommentera?
- Har korrigerande åtgärder diskuterats?
- Har nästa steg klargjorts?`,
  };

  return phaseHints[phase] || phaseHints.execution;
}

// Bedöm hint-användningens påverkan på betyget
export function calculateHintPenalty(hintsUsed: number, difficulty: string): number {
  const baseMultiplier = difficulty === 'grundlaggande' ? 0.05 : difficulty === 'medel' ? 0.1 : 0.15;
  const penalty = hintsUsed * baseMultiplier;
  return Math.min(penalty, 1.0); // Max 1 poängs avdrag
}

// Generera sammanfattning av hint-användning för feedback
export function getHintUsageSummary(hintsUsed: number, hintsEnabled: boolean): string {
  if (!hintsEnabled) {
    return 'Du genomförde revisionen utan aktiverat hints-stöd - imponerande självständighet!';
  }

  if (hintsUsed === 0) {
    return 'Du genomförde revisionen utan att använda några hints - utmärkt!';
  }

  if (hintsUsed <= 2) {
    return `Du använde ${hintsUsed} hint(s) under sessionen. Försök nästa gång att klara dig med färre.`;
  }

  if (hintsUsed <= 5) {
    return `Du använde ${hintsUsed} hints under sessionen. Detta påverkade ditt betyg något. Öva på att ställa mer utforskande frågor.`;
  }

  return `Du använde ${hintsUsed} hints under sessionen. För att utvecklas som revisor, försök nästa gång med färre hints eller stäng av dem helt.`;
}
