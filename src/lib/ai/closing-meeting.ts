/**
 * Slutmöte-kontext och hjälpfunktioner
 * Används när revisorn indikerar att revisionen är klar
 */

export interface ClosingMeetingConfig {
  standard: string;
  type: string;
  difficulty: string;
}

const closingMeetingTriggers = [
  'slutmöte',
  'avsluta revisionen',
  'sammanfatta',
  'presentera fynd',
  'mina iakttagelser',
  'avvikelser jag hittat',
  'closing meeting',
  'revision klar',
  'vi är klara',
];

export function isClosingMeetingRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return closingMeetingTriggers.some(trigger => lowerMessage.includes(trigger));
}

export function generateClosingMeetingContext(): string {
  return `
## SLUTMÖTE

När revisorn indikerar att revisionen är klar och vill hålla slutmöte:

### Samla ledningen
*Erik Johansson samlar de som var med på startmötet*

"Vi har bokat konferensrummet för slutmötet. Anna Lindqvist (VD) är på väg, liksom de processägare som berörs av era iakttagelser."

### Lyssna på revisorn
- Låt revisorn presentera sina fynd
- Ta anteckningar
- Nicka förstående
- Ställ förtydligande frågor om något är oklart

### Reaktioner på fynd

**Om revisorn hittat korrekta avvikelser:**
- Acceptera professionellt: "Ja, det är en brist vi behöver åtgärda."
- Be om förtydligande vid behov: "Kan ni specificera vilket krav ni syftar på?"
- Diskutera möjliga orsaker: "Vi har haft resursbrist i det området..."
- Föreslå preliminära åtgärder: "Vi kommer att se över rutinen omedelbart."

**Om revisorn missat avvikelser:**
- Säg INGENTING - det ingår i träningen att revisorn ska upptäcka dem
- Reagera neutralt på det revisorn presenterar

**Om revisorn angett felaktiga avvikelser:**
- Ifrågasätt artigt: "Kan ni förklara mer om vad ni menar?"
- Be om bevis: "Vilken dokumentation baserar ni det på?"
- Förklara er syn: "Vår tolkning av kravet är att..."
- Acceptera om revisorn har rätt, men påpeka om det finns en missuppfattning

### Avslutning

*Anna Lindqvist (VD) tackar:*

"Tack för en professionellt genomförd revision. Vi uppskattar er feedback och kommer att arbeta med de förbättringsområden ni identifierat. Erik kommer att koordinera arbetet med korrigerande åtgärder."

*Erik Johansson följer upp:*

"Vi återkommer med åtgärdsplan inom överenskommen tid. Har ni några avslutande frågor eller kommentarer?"

### FORMAT FÖR SLUTMÖTE

Markera tydligt att slutmötet börjar:

---
**SLUTMÖTE**
*Närvarande: [lista deltagare baserat på revisionstyp]*
---

*Erik Johansson:*
"Välkomna till slutmötet. Vi är tacksamma att få ta del av era iakttagelser."

[Låt revisorn presentera]
`;
}

export function generateClosingMeetingResponse(auditType: string): string {
  const attendees: Record<string, string[]> = {
    intern: [
      'Erik Johansson (Kvalitetschef)',
      'Berörda processägare',
    ],
    extern: [
      'Anna Lindqvist (VD)',
      'Erik Johansson (Kvalitetschef)',
      'Maria Svensson (Produktionschef)',
    ],
    certifiering: [
      'Anna Lindqvist (VD)',
      'Erik Johansson (Kvalitetschef)',
      'Maria Svensson (Produktionschef)',
      'Lisa Bergström (Inköpschef)',
      'Karl Pettersson (Miljö/Arbetsmiljö)',
    ],
    overvakning: [
      'Erik Johansson (Kvalitetschef)',
      'Anna Lindqvist (VD)',
      'Berörda processägare',
    ],
  };

  const attendeeList = attendees[auditType] || attendees.certifiering;

  return `
---
**SLUTMÖTE**
*Tid: ${new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}*
*Plats: Konferensrum Eken*
*Närvarande från Nordisk Precision AB:*
${attendeeList.map(a => `• ${a}`).join('\n')}
---

*Erik Johansson, Kvalitetschef:*

Tack för att ni tog er tid att genomföra denna revision. Vi har samlat ledningen här för att ta del av era iakttagelser och slutsatser.

Vi är redo att lyssna på er sammanfattning. Vänligen presentera de fynd ni gjort under dagen - både styrkor ni observerat och eventuella avvikelser eller förbättringsområden.
`;
}
