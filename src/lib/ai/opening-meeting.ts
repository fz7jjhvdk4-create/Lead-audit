/**
 * Genererar välkomstmeddelande för startmötet
 * Baserat på revisionstyp och valda standarder
 */

import { getIndustryProfile } from './industry-profiles';

interface SessionConfig {
  standard: string;
  type: string;
  difficulty: string;
  annexSLChapters: number[];
  industry?: string;
}

const standardNames: Record<string, string> = {
  iso9001: 'ISO 9001:2015',
  iso14001: 'ISO 14001:2015',
  iso45001: 'ISO 45001:2018',
  iatf16949: 'IATF 16949:2016',
};

const auditTypeDescriptions: Record<string, { greeting: string; context: string; attendees: string[] }> = {
  intern: {
    greeting: 'Välkommen till startmötet för vår interna revision.',
    context: 'Som ni vet genomför vi regelbundna internrevisioner för att säkerställa att vårt ledningssystem fungerar effektivt och att vi fortsätter förbättra oss.',
    attendees: [
      'Erik Johansson (Kvalitetschef) - Revisionsledare internt',
      'Maria Svensson (Produktionschef)',
      'Berörda processägare kommer tillkallas vid behov',
    ],
  },
  extern: {
    greeting: 'Välkommen till Nordisk Precision AB för denna leverantörsrevision.',
    context: 'Vi förstår att denna revision är en del av ert arbete med att kvalificera och följa upp era leverantörer. Vi ser fram emot att visa hur vi arbetar.',
    attendees: [
      'Erik Johansson (Kvalitetschef) - Er huvudkontakt',
      'Anna Lindqvist (VD) - Tillgänglig för ledningsfrågor',
      'Maria Svensson (Produktionschef)',
      'Lisa Bergström (Inköpschef)',
    ],
  },
  certifiering: {
    greeting: 'Välkommen till Nordisk Precision AB för certifieringsrevisionen.',
    context: 'Vi har förberett oss noga för denna revision och ser fram emot att demonstrera vårt ledningssystem. All dokumentation finns tillgänglig och berörda medarbetare är informerade.',
    attendees: [
      'Anna Lindqvist (VD)',
      'Erik Johansson (Kvalitetschef) - Er huvudkontakt',
      'Maria Svensson (Produktionschef)',
      'Karl Pettersson (Miljö- och arbetsmiljöansvarig)',
      'Lisa Bergström (Inköpschef)',
      'Emma Gustafsson (Konstruktionschef)',
    ],
  },
  overvakning: {
    greeting: 'Välkommen tillbaka till Nordisk Precision AB för årets övervakningsrevision.',
    context: 'Sedan förra revisionen har vi arbetat med de korrigerande åtgärderna och fortsatt utveckla vårt ledningssystem. Vi har också gjort några organisatoriska förändringar som vi gärna berättar om.',
    attendees: [
      'Erik Johansson (Kvalitetschef) - Er huvudkontakt',
      'Anna Lindqvist (VD) - Tillgänglig vid behov',
      'Maria Svensson (Produktionschef)',
      'Berörda processägare enligt revisionsplanen',
    ],
  },
};

const chapterTitles: Record<number, string> = {
  4: 'Organisationens förutsättningar',
  5: 'Ledarskap',
  6: 'Planering',
  7: 'Stöd',
  8: 'Verksamhet',
  9: 'Utvärdering av prestanda',
  10: 'Förbättring',
};

export function generateOpeningMeetingMessage(config: SessionConfig): string {
  const industryId = config.industry || 'manufacturing';
  const industryProfile = getIndustryProfile(industryId);

  // Om branschspecifik profil finns, använd den
  if (industryProfile && industryId !== 'manufacturing') {
    return generateIndustrySpecificOpeningMessage(config, industryProfile);
  }

  // Standard (manufacturing) meddelande
  const standards = config.standard.split(',').map(s => standardNames[s] || s);
  const auditType = auditTypeDescriptions[config.type] || auditTypeDescriptions.certifiering;
  const chapters = config.annexSLChapters
    .sort((a, b) => a - b)
    .map(ch => `Kapitel ${ch}: ${chapterTitles[ch]}`)
    .join('\n   • ');

  const currentTime = new Date();
  const timeString = currentTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });

  return `*Erik Johansson, Kvalitetschef:*

${auditType.greeting}

Klockan är nu ${timeString} och vi har samlats i konferensrum Eken här på huvudkontoret i Västerås.

${auditType.context}

**Närvarande från Nordisk Precision AB:**
${auditType.attendees.map(a => `• ${a}`).join('\n')}

**Om företaget:**
Nordisk Precision AB grundades 1987 och vi är idag 180 anställda. Vi tillverkar precisionskomponenter för fordonsindustrin, hydrauliksystem och industriella transmissioner. Vår omsättning ligger på cirka 285 miljoner kronor.

Vi är certifierade enligt ISO 9001:2015, ISO 14001:2015, ISO 45001:2018 och IATF 16949:2016.

**Revision avser:**
• Standard: ${standards.join(', ')}
• Fokusområden:
   • ${chapters}

**Praktisk information:**
• Lunch serveras i personalrestaurangen kl 12:00
• Kaffe och fika finns tillgängligt i pausrummet intill
• Toaletter finns i korridoren till vänster
• Säkerhetsgenomgång: Vid eventuellt brandlarm, samling vid flaggstången på parkeringen
• Skyddsutrustning tillhandahålls vid verkstadsbesök

Vi har bokat intervjutider med berörda medarbetare enligt önskemål. Dokumentation finns förberedd digitalt och i pärmar här i konferensrummet.

*Anna Lindqvist, VD:*

Tack Erik. Jag vill också hälsa välkommen och betona att vi ser denna revision som en möjlighet att få värdefull feedback på vårt arbete. Tveka inte att ställa frågor - vi vill vara så transparenta som möjligt.

---

*Erik Johansson:*

Vi lämnar nu över till er för att presentera er och gå igenom revisionsplanen. Hur vill ni lägga upp dagen?`;
}

// Generera branschspecifikt startmöte
function generateIndustrySpecificOpeningMessage(config: SessionConfig, profile: ReturnType<typeof getIndustryProfile>): string {
  if (!profile) return '';

  const standards = config.standard.split(',').map(s => standardNames[s] || s);
  const chapters = config.annexSLChapters
    .sort((a, b) => a - b)
    .map(ch => `Kapitel ${ch}: ${chapterTitles[ch]}`)
    .join('\n   • ');

  const currentTime = new Date();
  const timeString = currentTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });

  // Hitta kvalitetschef-rollen
  const qualityManager = profile.characters.find(c => c.role === 'quality_manager');
  const qualityManagerName = qualityManager?.name || 'Kvalitetschefen';
  const qualityManagerTitle = qualityManager?.title || 'Kvalitetschef';

  // Bygg lista över närvarande
  const attendees = profile.characters.slice(0, 5).map(c => `${c.name} (${c.title})`);

  // Branschspecifik kontext
  let industrySpecificInfo = '';
  if (profile.id === 'food') {
    industrySpecificInfo = `
**Särskild information för livsmedelsrevisioner:**
• Hygienklädsel tillhandahålls vid besök i produktionsområden
• Handtvätt och desinfektion krävs före inträde
• Ingen personlig utrustning (telefon, klocka) tillåten i produktionen
• Allergener hanteras - vänligen informera om eventuella allergier`;
  } else if (profile.id === 'construction') {
    industrySpecificInfo = `
**Särskild information för byggplatsbesök:**
• Skyddsutrustning (hjälm, skyddsväst, skyddsskor) tillhandahålls
• Säkerhetsgenomgång krävs före besök på byggarbetsplatsen
• ID06-kort registreras vid inpassering
• Håll er inom markerade säkra områden`;
  }

  return `*${qualityManagerName}, ${qualityManagerTitle}:*

Välkommen till ${profile.company.name} för denna revision.

Klockan är nu ${timeString} och vi har samlats i vårt konferensrum.

Vi har förberett oss för denna revision och ser fram emot att visa hur vi arbetar. All dokumentation finns tillgänglig och berörda medarbetare är informerade.

**Närvarande från ${profile.company.name}:**
${attendees.map(a => `• ${a}`).join('\n')}

**Om företaget:**
${profile.company.description}

Vi har ${profile.company.employees} anställda och är certifierade enligt ${profile.company.certifications.join(', ')}.

**Våra huvudprodukter/tjänster:**
${profile.company.products.map(p => `• ${p}`).join('\n')}

**Revision avser:**
• Standard: ${standards.join(', ')}
• Fokusområden:
   • ${chapters}

**Praktisk information:**
• Lunch serveras kl 12:00
• Kaffe och fika finns tillgängligt
• Toaletter finns i korridoren
• Vid eventuellt brandlarm, samling utanför huvudentrén
${industrySpecificInfo}

Vi har bokat intervjutider med berörda medarbetare enligt önskemål. Dokumentation finns förberedd.

---

*${qualityManagerName}:*

Vi lämnar nu över till er för att presentera er och gå igenom revisionsplanen. Hur vill ni lägga upp dagen?`;
}

export function generateWelcomeContext(config: SessionConfig): string {
  const auditType = auditTypeDescriptions[config.type] || auditTypeDescriptions.certifiering;

  return `
STARTMÖTE-KONTEXT:
Sessionen börjar med ett startmöte. Erik Johansson har hälsat välkommen och presenterat företaget.
Närvarande: ${auditType.attendees.join(', ')}

Revisorn förväntas nu:
1. Presentera sig själv (namn, organisation, roll)
2. Bekräfta syftet med revisionen
3. Gå igenom revisionsplanen och tidschema
4. Bekräfta vilka som ska intervjuas
5. Förklara hur fynd kommer att rapporteras
6. Fråga om det finns några frågor innan revisionen börjar

Om revisorn missar att presentera sig eller går direkt på frågor, kan Erik Johansson artigt be om en kort presentation först.
`;
}
