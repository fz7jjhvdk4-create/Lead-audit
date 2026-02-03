/**
 * Observationsscenarier för verkstadsbesök
 * Används när revisorn besöker produktionen och gör observationer
 */

export interface Observation {
  id: string;
  location: string;
  description: string;
  hasDeficiency: boolean;
  deficiencyType?: 'minor' | 'major' | 'observation';
  deficiencyDescription?: string;
  relatedChapter: number;
  difficulty: 'grundlaggande' | 'medel' | 'avancerad';
}

export const productionObservations: Observation[] = [
  // ========== GRUNDLÄGGANDE NIVÅ ==========
  {
    id: 'OBS-001',
    location: 'CNC-avdelningen, maskin 7',
    description: `Vid maskin 7 finns en arbetsinstruktion uppsatt i plastficka.
Instruktionen är tydlig med bilder och steg-för-steg-beskrivningar.
Operatören Anders Ek arbetar med svarvning av axlar.
En pärm med kontrollplan och mätprotokoll finns vid maskinen.`,
    hasDeficiency: true,
    deficiencyType: 'minor',
    deficiencyDescription: 'Arbetsinstruktionen vid maskin 7 är revision A, men aktuell revision är C enligt dokumentförteckningen.',
    relatedChapter: 8,
    difficulty: 'grundlaggande',
  },
  {
    id: 'OBS-002',
    location: 'Mätrummet',
    description: `Mätrummet är klimatkontrollerat (20°C ±1°C).
En 3D-mätmaskin Zeiss finns centralt placerad.
Hyllor med mikrometer, skjutmått och toleranstolkar är tydligt märkta.
Kalibreringsprotokoll sitter på väggen vid varje utrustning.
En uppsättning toleranstolkar (set B) ligger på arbetsbänken.`,
    hasDeficiency: true,
    deficiencyType: 'minor',
    deficiencyDescription: 'Toleranstolk set B (MÄT-008) har en röd "SPÄRRAD"-etikett men ligger framme på arbetsbänken bland övrig utrustning.',
    relatedChapter: 7,
    difficulty: 'grundlaggande',
  },
  {
    id: 'OBS-003',
    location: 'Monteringsavdelningen',
    description: `Monteringsbänkar är organiserade enligt 5S-principer.
Varje arbetsplats har tydligt uppmärkta zoner för verktyg och material.
Skyddsglasögon används av all personal.
En nyanställd medarbetare (Henrik Lund) arbetar vid en av stationerna.`,
    hasDeficiency: true,
    deficiencyType: 'minor',
    deficiencyDescription: 'Henrik Lund (nyanställd 2024-09-15) har ingen synlig kompetensmarkering på sin arbetsplats. Vid fråga kan han inte visa dokumentation på genomförd utbildning.',
    relatedChapter: 7,
    difficulty: 'grundlaggande',
  },

  // ========== MEDELNIVÅ ==========
  {
    id: 'OBS-004',
    location: 'Svetsavdelningen',
    description: `Svetsavdelningen har 4 arbetsstationer med MIG/MAG-utrustning.
Utsug och ventilation fungerar. Svetsare har korrekt skyddsutrustning.
Svetsparametrar finns dokumenterade på tavla vid varje station.
Operatören Björn Falk svetsar en hydraulikkomponent enligt ritning.
Svetsfogen ser visuellt godkänd ut.`,
    hasDeficiency: true,
    deficiencyType: 'minor',
    deficiencyDescription: 'Svetsparametrar som används av operatören avviker något från dokumenterade värden (180A istället för specificerade 175A). Operatören förklarar att "det funkar bättre så" men ingen avvikelsehantering eller ändringsprocess har genomförts.',
    relatedChapter: 8,
    difficulty: 'medel',
  },
  {
    id: 'OBS-005',
    location: 'Godsmottagningen',
    description: `Inkommande gods placeras i mottagningszon märkt med gul tejp.
Följesedlar och fraktsedlar hanteras av godsmottagare.
Material flyttas till lager efter inleveranskontroll.
En pall med stångmaterial från ny leverantör (CleanChem AB) står för kontroll.`,
    hasDeficiency: true,
    deficiencyType: 'minor',
    deficiencyDescription: 'Material från CleanChem AB tas emot och kontrolleras, men leverantören finns inte på godkända leverantörslistan. Inköpsorder saknar hänvisning till specifikation.',
    relatedChapter: 8,
    difficulty: 'medel',
  },
  {
    id: 'OBS-006',
    location: 'Slutkontrollstationen',
    description: `Slutkontroll utförs innan produkter förpackas.
Kontrollant använder mätprotokoll och checklista.
Godkända produkter märks med grön etikett.
En låda med komponenter har gul etikett "Väntar på beslut".
Intill står en låda utan etikett med liknande komponenter.`,
    hasDeficiency: true,
    deficiencyType: 'minor',
    deficiencyDescription: 'En låda med avvikande produkt saknar spärrmärkning (varken röd eller gul etikett). Risk för sammanblandning med godkänt gods.',
    relatedChapter: 8,
    difficulty: 'medel',
  },

  // ========== AVANCERAD NIVÅ ==========
  {
    id: 'OBS-007',
    location: 'CNC-avdelningen, maskin 3 (SPC-station)',
    description: `Vid maskin 3 körs SPC på kritiskt mått Ø45mm.
Operatören mäter var 10:e detalj och plottar i SPC-diagram.
Diagrammet visar att processen ligger inom styrningsgränser.
Inga röda punkter eller trender syns.
Maskinen har körts med samma inställningar i 3 månader.`,
    hasDeficiency: true,
    deficiencyType: 'observation',
    deficiencyDescription: 'SPC-diagrammet visar Cpk på 1.32 vilket är under kravet på 1.33 enligt kontrollplan. Inga åtgärder har vidtagits trots att processen tekniskt sett inte är kapabel enligt specifikation. Operatören är inte medveten om Cpk-kravet.',
    relatedChapter: 8,
    difficulty: 'avancerad',
  },
  {
    id: 'OBS-008',
    location: 'Produktionskontoret',
    description: `Produktionsplaneringen sker i ERP-system.
Tavla visar daglig OEE-uppföljning: mål 85%, utfall senaste veckan 81-84%.
Avvikelserapporter hanteras digitalt.
På skrivbordet ligger en utskriven lista med "prioriterade order".
Produktionschefen förklarar att de "kör på för fullt" för att hinna med.`,
    hasDeficiency: true,
    deficiencyType: 'observation',
    deficiencyDescription: 'OEE ligger konsekvent under mål (85%) men ingen eskalering till ledningen har skett. Avvikelserapporter visar återkommande stopp på maskin CNC-5 men rotorsaksanalysen stannar vid "maskinproblem" utan djupare utredning.',
    relatedChapter: 9,
    difficulty: 'avancerad',
  },
  {
    id: 'OBS-009',
    location: 'Kvalitetsavdelningens kontor',
    description: `Kvalitetsavdelningen har kontor intill produktionen.
Avvikelsestatistik visas på skärm: Kundreklamationer YTD 0.7% (mål <0.5%).
Pärmar med revisionsrapporter, ledningens genomgångar och avvikelseregister.
Kvalitetschefen visar stolt upp det digitala avvikelsesystemet.
En lista på "öppna korrigerande åtgärder" visar 8 poster.`,
    hasDeficiency: true,
    deficiencyType: 'minor',
    deficiencyDescription: 'Granskning av öppna korrigerande åtgärder visar att 3 av 8 har passerat sin deadline utan verifiering. Grundorsaken "mänskligt fel" anges i 5 av 8 fall, vilket indikerar bristande rotorsaksanalys.',
    relatedChapter: 10,
    difficulty: 'avancerad',
  },
];

export function getObservationsForDifficulty(difficulty: string): Observation[] {
  const difficultyLevel = difficulty.toLowerCase();

  if (difficultyLevel === 'grundlaggande') {
    return productionObservations.filter(o => o.difficulty === 'grundlaggande');
  }
  if (difficultyLevel === 'medel') {
    return productionObservations.filter(o => o.difficulty === 'grundlaggande' || o.difficulty === 'medel');
  }
  // Avancerad - alla observationer
  return productionObservations;
}

export function generateObservationContext(difficulty: string): string {
  const observations = getObservationsForDifficulty(difficulty);

  let context = `
## OBSERVATIONSSCENARIER

När revisorn ber om att besöka produktionen eller göra observationer, använd dessa scenarier:

`;

  for (const obs of observations) {
    context += `
### ${obs.location}
${obs.description}
${obs.hasDeficiency ? `\n**[DOLD BRIST - Avslöja ENDAST om revisorn ställer rätt frågor]**\n${obs.deficiencyDescription}` : ''}

`;
  }

  context += `
## REGLER FÖR OBSERVATIONER

1. **Beskriv det revisorn ser** - ge en realistisk bild av platsen
2. **Svara på frågor** - om revisorn frågar specifikt, ge detaljer
3. **Avslöja inte brister automatiskt** - låt revisorn upptäcka genom observation och frågor
4. **Operatörer kan intervjuas** - de ger praktiska svar men hänvisar teoretiska frågor till chefer
5. **Om revisorn missar en brist** - fortsätt utan att påpeka det
`;

  return context;
}
