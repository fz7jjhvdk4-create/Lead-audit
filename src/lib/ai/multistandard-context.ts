/**
 * Kontext för multistandard-revision (kombinerad revision)
 * Innehåller standardspecifika krav och kopplingar
 */

export interface StandardRequirement {
  id: string;
  chapter: number;
  requirement: string;
  description: string;
  deficiency?: string;
}

// ISO 14001:2015 - Miljöledningssystem
export const iso14001Requirements: StandardRequirement[] = [
  {
    id: 'ENV-001',
    chapter: 4,
    requirement: 'Miljöaspekter och miljöpåverkan',
    description: 'Identifiering av betydande miljöaspekter i verksamheten',
    deficiency: 'Miljöaspektregistret saknar bedömning av nya kemikalier införda 2024',
  },
  {
    id: 'ENV-002',
    chapter: 6,
    requirement: 'Miljömål och planering',
    description: 'Fastställda miljömål med mätbara indikatorer',
    deficiency: 'Mål för energiförbrukning saknar tidsatta delmål',
  },
  {
    id: 'ENV-003',
    chapter: 7,
    requirement: 'Beredskap och agerande vid nödsituationer',
    description: 'Planer för kemikalieutsläpp, brand, etc.',
    deficiency: 'Övning av nödlägesplan genomfördes inte under 2024',
  },
  {
    id: 'ENV-004',
    chapter: 8,
    requirement: 'Avfallshantering',
    description: 'Sortering, lagring och bortforsling av avfall',
    deficiency: 'Farligt avfall (skärvätskor) förvaras utan sekundärt skydd',
  },
  {
    id: 'ENV-005',
    chapter: 9,
    requirement: 'Övervakning av miljöprestanda',
    description: 'Mätning av utsläpp, energi, avfall',
    deficiency: 'Kalibrering av energimätare utfördes inte enligt plan',
  },
];

// ISO 45001:2018 - Arbetsmiljöledningssystem
export const iso45001Requirements: StandardRequirement[] = [
  {
    id: 'OHS-001',
    chapter: 4,
    requirement: 'Samråd med arbetstagare',
    description: 'Arbetstagarnas deltagande i arbetsmiljöarbete',
    deficiency: 'Protokoll från skyddskommittémöten saknas för Q3 2024',
  },
  {
    id: 'OHS-002',
    chapter: 6,
    requirement: 'Riskbedömning arbetsmiljö',
    description: 'Identifiering och bedömning av arbetsmiljörisker',
    deficiency: 'Riskbedömning för ny CNC-maskin inte genomförd före driftsättning',
  },
  {
    id: 'OHS-003',
    chapter: 7,
    requirement: 'Kompetens arbetsmiljö',
    description: 'Utbildning i säkerhet och skyddsutrustning',
    deficiency: 'Truckförarutbildning utgången för 2 medarbetare',
  },
  {
    id: 'OHS-004',
    chapter: 8,
    requirement: 'Åtgärder för att eliminera risker',
    description: 'Hierarki för riskhantering (eliminera, substituera, tekniska åtgärder, administrativa, PPE)',
    deficiency: 'Hörselskydd används inte konsekvent i svetsavdelningen trots bullernivåer >85 dB',
  },
  {
    id: 'OHS-005',
    chapter: 10,
    requirement: 'Incidenter och tillbud',
    description: 'Rapportering och utredning av olyckor och tillbud',
    deficiency: '3 tillbud rapporterade men ingen rotorsaksanalys dokumenterad',
  },
];

// IATF 16949:2016 - Fordonsindustri
export const iatf16949Requirements: StandardRequirement[] = [
  {
    id: 'IATF-001',
    chapter: 4,
    requirement: 'Kundspecifika krav (CSR)',
    description: 'Hantering av kundspecifika tilläggskrav från OEM',
    deficiency: 'Volvo CSR version 4.2 implementerad, men version 5.0 gäller sedan 2024-07',
  },
  {
    id: 'IATF-002',
    chapter: 7,
    requirement: 'MSA - Measurement System Analysis',
    description: 'Analys av mätsystemets variation (R&R-studier)',
    deficiency: 'GRR-studie för kritiskt mått visar >30% variation (krav <10%)',
  },
  {
    id: 'IATF-003',
    chapter: 8,
    requirement: 'APQP/PPAP',
    description: 'Advanced Product Quality Planning och Production Part Approval Process',
    deficiency: 'PPAP för ny komponent saknar kapacitetsstudie (Ppk)',
  },
  {
    id: 'IATF-004',
    chapter: 8,
    requirement: 'FMEA',
    description: 'Failure Mode and Effects Analysis för produkt och process',
    deficiency: 'Process-FMEA inte uppdaterad efter processändring på linje 3',
  },
  {
    id: 'IATF-005',
    chapter: 8,
    requirement: 'Kontrollplan',
    description: 'Kontrollplaner med SPC-krav och reaktionsplaner',
    deficiency: 'Reaktionsplan saknas för kritisk parameter i kontrollplan',
  },
  {
    id: 'IATF-006',
    chapter: 8,
    requirement: 'Spårbarhet',
    description: 'Fullständig spårbarhet från råmaterial till slutkund',
    deficiency: 'Batchspårbarhet bruten för inköpt material från underleverantör',
  },
  {
    id: 'IATF-007',
    chapter: 9,
    requirement: 'SPC - Statistical Process Control',
    description: 'Processtyrning med statistiska metoder',
    deficiency: 'Cpk-beräkning använder fel formel (kortsiktig istället för långsiktig kapabilitet)',
  },
  {
    id: 'IATF-008',
    chapter: 10,
    requirement: '8D-problemlösning',
    description: 'Strukturerad problemlösningsmetod för kundreklamationer',
    deficiency: '8D-rapport för kundreklamation saknar verifiering av permanent åtgärd (D7)',
  },
];

export function generateMultistandardContext(standards: string[]): string {
  const contexts: string[] = [];

  if (standards.includes('iso14001')) {
    contexts.push(`
## ISO 14001:2015 - MILJÖLEDNINGSSYSTEM

### Nordisk Precision AB - Miljöaspekter
- **Betydande miljöaspekter**: Energiförbrukning, kemikalieanvändning, metallavfall, skärvätskor
- **Miljötillstånd**: Anmälningspliktig verksamhet enligt miljöbalken
- **Miljömål 2025**:
  - Minska energiförbrukning med 10% (kWh/producerad enhet)
  - Öka andel återvunnet material till 85%
  - Noll allvarliga kemikalieincidenter

### Dokumentation miljö
- **ENV-DOC-001**: Miljöaspektregister (Rev D, 2024-03-15) - ⚠️ Nya kemikalier saknas
- **ENV-DOC-002**: Nödlägesplan miljö (Rev B, 2023-05-10) - ⚠️ Övning ej genomförd
- **ENV-DOC-003**: Avfallshanteringsplan (Rev C, 2024-08-20)
- **ENV-DOC-004**: Kemikalieförteckning (Rev E, 2024-11-05)

### Potentiella avvikelser ISO 14001
${iso14001Requirements.map(r => `- ${r.requirement}: ${r.deficiency}`).join('\n')}
`);
  }

  if (standards.includes('iso45001')) {
    contexts.push(`
## ISO 45001:2018 - ARBETSMILJÖLEDNINGSSYSTEM

### Nordisk Precision AB - Arbetsmiljö
- **Arbetsmiljörisker**: Buller, vibration, tunga lyft, kemikalieexponering, maskinrisker
- **Skyddsorganisation**: Huvudskyddsombud + 4 lokala skyddsombud
- **Skyddskommitté**: Möten kvartalsvis (ska vara månadsvis)
- **Arbetsolyckor 2024**: 2 st (mål: 0), 8 tillbud rapporterade

### Dokumentation arbetsmiljö
- **OHS-DOC-001**: Riskbedömningsregister (Rev F, 2024-09-10) - ⚠️ Ny maskin saknas
- **OHS-DOC-002**: Utbildningsplan säkerhet (Rev C, 2024-01-15) - ⚠️ Truckkort utgångna
- **OHS-DOC-003**: Skyddskommittéprotokoll (Rev -, 2024-06-15) - ⚠️ Q3 saknas
- **OHS-DOC-004**: Incident- och tillbudsrapporter (Rev -, löpande)

### Potentiella avvikelser ISO 45001
${iso45001Requirements.map(r => `- ${r.requirement}: ${r.deficiency}`).join('\n')}
`);
  }

  if (standards.includes('iatf16949')) {
    contexts.push(`
## IATF 16949:2016 - FORDONSINDUSTRI

### Nordisk Precision AB - Fordonskunder
- **OEM-kunder**: Volvo Cars, Scania, Autoliv
- **Tier 1 leverantör**: Ja, direktleverantör till OEM
- **Kundspecifika krav (CSR)**:
  - Volvo Cars - Supplier Quality Manual v5.0
  - Scania - STD4150
  - Autoliv - ASM (Autoliv Supplier Manual)

### APQP-processer
- **APQP-projekt pågående**: 3 st (HV-2450, TR-1890, AX-3200)
- **PPAP-status**: Level 3 för alla säkerhetskritiska komponenter
- **FMEA**: Design-FMEA och Process-FMEA för alla nya produkter

### Core Tools
- **APQP**: Projektplan med gate reviews
- **PPAP**: 18-elements krav, Level 3 default
- **FMEA**: AIAG-VDA format sedan 2024
- **MSA**: GRR-studier på kritisk mätutrustning
- **SPC**: Cpk ≥1.33 för kritiska mått, Cpk ≥1.67 för säkerhetskritiska

### Dokumentation IATF 16949
- **IATF-DOC-001**: CSR-register (Rev H, 2024-05-10) - ⚠️ Volvo CSR ej uppdaterad
- **IATF-DOC-002**: APQP-projektplan HV-2450 (Rev C, 2024-10-15)
- **IATF-DOC-003**: Process-FMEA Linje 3 (Rev B, 2024-02-20) - ⚠️ Ej uppdaterad
- **IATF-DOC-004**: MSA-rapport mätrum (Rev A, 2024-08-15) - ⚠️ GRR >30%
- **IATF-DOC-005**: PPAP-paket AX-3200 (Rev A, 2025-01-10) - ⚠️ Saknar Ppk

### Potentiella avvikelser IATF 16949
${iatf16949Requirements.map(r => `- ${r.requirement}: ${r.deficiency}`).join('\n')}

### IATF-SPECIFIKA TERMER
Om revisorn frågar om IATF-specifika processer, förklara:
- **APQP**: 5 faser - Planering, Produktdesign, Processdesign, Validering, Produktion
- **PPAP**: 18 element inklusive designdokumentation, FMEA, kontrollplan, MSA, kapacitetsstudie
- **FMEA**: Risk Priority Number (RPN) = Severity × Occurrence × Detection
- **MSA**: Gage R&R, Bias, Linearity, Stability
- **SPC**: Kontrolldiagram (X-bar/R, X-bar/S), Cp, Cpk, Pp, Ppk
`);
  }

  if (contexts.length === 0) {
    return '';
  }

  const integrationContext = contexts.length > 1 ? `
## INTEGRERAT LEDNINGSSYSTEM

Nordisk Precision AB har ett **integrerat ledningssystem** som kombinerar:
${standards.includes('iso9001') ? '- ISO 9001:2015 Kvalitetsledning\n' : ''}${standards.includes('iso14001') ? '- ISO 14001:2015 Miljöledning\n' : ''}${standards.includes('iso45001') ? '- ISO 45001:2018 Arbetsmiljöledning\n' : ''}${standards.includes('iatf16949') ? '- IATF 16949:2016 Fordonsindustri\n' : ''}

### Gemensamma element (Annex SL)
Systemet delar gemensam struktur för:
- **Kapitel 4**: Organisationens förutsättningar - gemensam intressentanalys
- **Kapitel 5**: Ledarskap - integrerad policy
- **Kapitel 6**: Planering - gemensam riskhantering med olika fokus
- **Kapitel 7**: Stöd - gemensam dokumentstyrning och kompetensmatris
- **Kapitel 9**: Utvärdering - samordnad internrevision
- **Kapitel 10**: Förbättring - gemensamt avvikelsesystem

### Kopplingar mellan standarder
Vid kombinerad revision, visa hur krav hänger samman:
- Riskbedömning enligt ISO 9001 kap 6.1 inkluderar miljö- och arbetsmiljörisker
- Kompetenskrav enligt kap 7.2 täcker alla tre områden
- Ledningens genomgång enligt kap 9.3 har input från alla standarder
- Korrigerande åtgärder (kap 10.2) hanteras i gemensamt system

### Potentiella systembrister vid kombinerad revision
- Integrerad policy finns men är inte tydligt kommunicerad till alla medarbetare
- Riskregister separata för kvalitet, miljö och arbetsmiljö - ingen helhetsbild
- Internrevisorer saknar kompetens att granska alla tre standarder
- Ledningens genomgång täcker inte alla inputkrav från alla standarder
` : '';

  return contexts.join('\n') + integrationContext;
}

export function getStandardSpecificFindings(standards: string[]): string[] {
  const findings: string[] = [];

  if (standards.includes('iso14001')) {
    findings.push(...iso14001Requirements.filter(r => r.deficiency).map(r => r.deficiency!));
  }

  if (standards.includes('iso45001')) {
    findings.push(...iso45001Requirements.filter(r => r.deficiency).map(r => r.deficiency!));
  }

  if (standards.includes('iatf16949')) {
    findings.push(...iatf16949Requirements.filter(r => r.deficiency).map(r => r.deficiency!));
  }

  return findings;
}
