/**
 * Session Context Manager
 * Håller reda på etablerade fakta och beslut under en session
 * för att säkerställa konsekvent upplevelse
 */

export interface EstablishedFact {
  topic: string;
  statement: string;
  source: string; // Vem sa det
  timestamp: Date;
}

export interface SessionContext {
  sessionId: string;
  establishedFacts: EstablishedFact[];
  currentInterviewee: string | null;
  visitedLocations: string[];
  reviewedDocuments: string[];
  identifiedFindings: string[];
  auditPhase: 'opening' | 'execution' | 'closing';
}

// Kontext-instruktioner för AI:n att bibehålla konsekvent beteende
export function generateConsistencyContext(): string {
  return `
## KONSEKVENT SESSIONSHANTERING

### Etablerade fakta
Under sessionen kommer du att etablera fakta genom dina svar. Kom ihåg och var konsekvent med:

1. **Siffror och datum** - Om du sagt att något hände 2024-06-15, håll fast vid det
2. **Namn och titlar** - Använd samma namn för samma person
3. **Processdetaljer** - Om du beskrivit hur något fungerar, beskriv det likadant nästa gång
4. **Dokumentstatus** - Om ett dokument sagts vara revision C, ändra inte det

### Konsekvensregler
- Om revisorn ber dig upprepa något, ge samma information (kanske omformulerad)
- Om revisorn hittar en motsägelse, erkänn det naturligt ("Jag kanske uttryckte mig otydligt...")
- Undvik att spontant ändra fakta som etablerats tidigare

### Rollkonsistens
Varje karaktär har sin unika:
- **Kunskap** - De vet bara det som är relevant för deras roll
- **Perspektiv** - De ser saker från sitt ansvarsområde
- **Språkbruk** - Behåll samma ton och ordval för varje person
- **Attityd** - Om någon var entusiastisk först, var det konsekvent

### Dokumentkonsistens
När du visar dokument:
- Använd samma dokumentnummer varje gång (DOC-001 är alltid Intressentanalysen)
- Samma revision (om DOC-001 var Rev C, behåll det)
- Samma innehåll och brister vid upprepade förfrågningar

### Tidskonsistens
- "Idag" är alltid samma dag under sessionen
- Om något sades vara "förra veckan", räkna konsekvent
- Kalibreringar, revisioner och möten har fasta datum

### Hantering av komplexitet
Om revisorn ställer frågor som kräver ny information:
1. Kontrollera först att det inte motsäger etablerade fakta
2. Om det gör det, anpassa svaret för att vara konsekvent
3. Om ny information behövs, gör den kompatibel med existerande fakta

### Avvikelsekonsistens
De avvikelser som finns i scenariot:
- Finns där hela tiden, oavsett om revisorn upptäckt dem
- Kan inte "lösas" under revisionen
- Ska beskrivas likadant vid upprepade frågor
`;
}

// Generar kontextsammanfattning för långa sessioner
export function generateContextSummary(
  messageHistory: { role: string; content: string }[]
): string {
  if (messageHistory.length < 10) {
    return ''; // Ingen sammanfattning behövs för korta sessioner
  }

  return `
## SESSIONSSAMMANFATTNING

Denna session har ${messageHistory.length} meddelanden. Här är viktiga punkter att komma ihåg:

### Revisionsflöde
- Sessionen startade med ett startmöte
- Revisorn har ställt ${messageHistory.filter(m => m.role === 'user').length} frågor
- Bibehåll kontinuitet i svaren

### Att komma ihåg
- Eventuella fakta som etablerats i tidigare svar
- Vilka dokument som visats
- Vilka områden som granskats
- Eventuella fynd som revisorn identifierat

**VIKTIGT:** Läs igenom tidigare meddelanden för att säkerställa att nya svar är konsekventa med etablerad information.
`;
}

// Adaptiv komplexitetsjustering baserat på revisorns prestation
export function generateAdaptiveComplexityContext(
  difficulty: string,
  messageCount: number,
  successfulFindings: number
): string {
  // Grundläggande logik för att anpassa svårighet
  const baseComplexity = difficulty;

  // Om revisorn hittar många fynd tidigt, gör det lite svårare
  const findingsPerMessage = successfulFindings / Math.max(messageCount, 1);

  let adaptiveContext = '';

  if (findingsPerMessage > 0.3 && baseComplexity === 'grundlaggande') {
    adaptiveContext = `
### Dynamisk anpassning
Revisorn visar god förmåga att identifiera avvikelser.
- Ge mer nyanserade svar som kräver fördjupning
- Inkludera fler detaljer som kan leda till ytterligare fynd
- Låt personal vara mer motvilliga att spontant avslöja problem
`;
  } else if (findingsPerMessage < 0.1 && baseComplexity === 'avancerad' && messageCount > 15) {
    adaptiveContext = `
### Dynamisk anpassning
Revisorn har svårt att hitta avvikelser.
- Ge subtila ledtrådar i svaren
- Låt personal vara mer öppna om utmaningar
- Underlätta något för att hålla sessionen pedagogisk
`;
  }

  return adaptiveContext;
}
