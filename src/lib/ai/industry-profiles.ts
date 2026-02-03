// US-025: Branschspecifika profiler för revisionsträning

export interface IndustryProfile {
  id: string;
  name: string;
  description: string;
  company: CompanyProfile;
  characters: CharacterProfile[];
  documents: DocumentProfile[];
  deficiencies: DeficiencyProfile[];
  standards: StandardReference[];
  terminology: Record<string, string>;
}

export interface CompanyProfile {
  name: string;
  industry: string;
  employees: number;
  description: string;
  products: string[];
  certifications: string[];
  facilities: string[];
  customers: string[];
}

export interface CharacterProfile {
  name: string;
  role: string;
  title: string;
  department: string;
  yearsAtCompany: number;
  personality: string;
  knowledge: string[];
  responsibilities: string[];
}

export interface DocumentProfile {
  id: string;
  name: string;
  type: string;
  description: string;
  content: string;
  deficiencies?: string[];
}

export interface DeficiencyProfile {
  id: string;
  annexSLChapter: number;
  type: 'major' | 'minor' | 'observation';
  description: string;
  evidence: string;
  standardReference: string;
  difficulty: 'grundlaggande' | 'medel' | 'avancerad';
}

export interface StandardReference {
  code: string;
  name: string;
  relevantClauses: string[];
}

// ============================================================
// LIVSMEDEL - FSSC 22000 / HACCP
// ============================================================

export const foodIndustryProfile: IndustryProfile = {
  id: 'food',
  name: 'Livsmedel',
  description: 'Livsmedelsproduktion med fokus på livsmedelssäkerhet, HACCP och FSSC 22000',

  company: {
    name: 'Nordisk Livs AB',
    industry: 'Livsmedelsproduktion',
    employees: 145,
    description: 'Producent av kyld och fryst färdigmat för dagligvaruhandeln. Tillverkar färdigrätter, sallader och smörgåsar med fokus på svenska råvaror.',
    products: [
      'Färdigrätter (kyld)',
      'Sallader och smörgåsar',
      'Fryst färdigmat',
      'Dressingar och såser'
    ],
    certifications: ['FSSC 22000', 'ISO 9001:2015', 'ISO 14001:2015', 'BRC Food Safety'],
    facilities: [
      'Produktionshall 1 (kylda produkter)',
      'Produktionshall 2 (frysta produkter)',
      'Råvarulager',
      'Färdigvarulager (kyl/frys)',
      'Kvalitetslaboratorium'
    ],
    customers: ['ICA', 'Coop', 'Axfood', 'Bergendahls', 'Foodservice']
  },

  characters: [
    {
      name: 'Maria Lindberg',
      role: 'quality_manager',
      title: 'Kvalitets- och livsmedelssäkerhetschef',
      department: 'Kvalitet',
      yearsAtCompany: 12,
      personality: 'Strukturerad och detaljorienterad. Tar livsmedelssäkerhet på största allvar.',
      knowledge: [
        'FSSC 22000 och ISO 22000',
        'HACCP-principer',
        'Allergenhantering',
        'Mikrobiologiska faror',
        'Myndighetskrav (Livsmedelsverket)'
      ],
      responsibilities: [
        'HACCP-team ledare',
        'Certifieringsansvarig',
        'Leverantörsgodkännande',
        'Reklamationshantering',
        'Internrevisionsprogram'
      ]
    },
    {
      name: 'Anders Bergström',
      role: 'production_manager',
      title: 'Produktionschef',
      department: 'Produktion',
      yearsAtCompany: 8,
      personality: 'Pragmatisk och lösningsorienterad. Prioriterar effektivitet men respekterar kvalitetskrav.',
      knowledge: [
        'Produktionsplanering',
        'Hygienrutiner',
        'CCP-övervakning',
        'Personalhantering',
        'Underhåll av utrustning'
      ],
      responsibilities: [
        'Produktionsledning',
        'Schemaläggning',
        'Personalutbildning hygien',
        'Daglig drift',
        'Avvikelsehantering produktion'
      ]
    },
    {
      name: 'Lisa Ek',
      role: 'haccp_coordinator',
      title: 'HACCP-koordinator',
      department: 'Kvalitet',
      yearsAtCompany: 5,
      personality: 'Noggrann och metodisk. Expert på faroanalys.',
      knowledge: [
        'HACCP 7 principer',
        'CCP-validering',
        'Faroanalys (biologisk, kemisk, fysisk)',
        'Processflödesdiagram',
        'Verifiering och validering'
      ],
      responsibilities: [
        'HACCP-planer',
        'CCP-dokumentation',
        'Faroanalys uppdatering',
        'Verifieringsaktiviteter',
        'PRP-program'
      ]
    },
    {
      name: 'Karin Nordin',
      role: 'lab_manager',
      title: 'Laboratoriechef',
      department: 'Kvalitet',
      yearsAtCompany: 10,
      personality: 'Vetenskaplig och faktabaserad. Kräver evidens för alla beslut.',
      knowledge: [
        'Mikrobiologisk analys',
        'Kemisk analys',
        'Allergenanalys',
        'Hållbarhetsstudier',
        'Ackreditering och metodvalidering'
      ],
      responsibilities: [
        'Laboratoriedrift',
        'Produktanalyser',
        'Leverantörsanalyser',
        'Miljöprover',
        'Trendanalys'
      ]
    },
    {
      name: 'Erik Johansson',
      role: 'warehouse_manager',
      title: 'Lagerchef',
      department: 'Logistik',
      yearsAtCompany: 6,
      personality: 'Organiserad och systematisk. Fokus på spårbarhet.',
      knowledge: [
        'Kyl/frys-kedjor',
        'Temperaturövervakning',
        'FIFO/FEFO',
        'Spårbarhetssystem',
        'Lagerhygien'
      ],
      responsibilities: [
        'Råvarumottagning',
        'Temperaturkontroll',
        'Lagerstyrning',
        'Utleverans',
        'Spårbarhetstest'
      ]
    },
    {
      name: 'Johan Persson',
      role: 'maintenance_manager',
      title: 'Underhållschef',
      department: 'Teknik',
      yearsAtCompany: 7,
      personality: 'Tekniskt kunnig men ibland dokumentationstrött.',
      knowledge: [
        'Processutrustning',
        'Kyl/frys-system',
        'Förebyggande underhåll',
        'Kalibrering',
        'Hygienic design'
      ],
      responsibilities: [
        'Underhållsplanering',
        'Akut underhåll',
        'Kalibrering av mätutrustning',
        'Reservdelslager',
        'Utrustningskvalificering'
      ]
    },
    {
      name: 'Anna Svensson',
      role: 'line_operator',
      title: 'Linjeoperatör',
      department: 'Produktion',
      yearsAtCompany: 3,
      personality: 'Praktisk och erfaren på sitt område. Mindre insatt i dokumentation.',
      knowledge: [
        'Maskinhantering',
        'Hygienrutiner på linjen',
        'CCP-mätningar',
        'Produktbyte och allergenrengöring'
      ],
      responsibilities: [
        'Linjekörning',
        'CCP-dokumentation',
        'Produktbyte',
        'Rengöring'
      ]
    }
  ],

  documents: [
    {
      id: 'DOC-HACCP-001',
      name: 'HACCP-plan för färdigrätter',
      type: 'haccp_plan',
      description: 'HACCP-plan för produktkategori färdigrätter (kyld)',
      content: `
╔══════════════════════════════════════════════════════════════════════════════╗
║                    HACCP-PLAN: FÄRDIGRÄTTER (KYLD)                           ║
║                    Nordisk Livs AB                                           ║
║                    Rev 3.1 | 2025-08-15                                      ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ PRODUKTBESKRIVNING                                                           ║
║ Typ: Kylda färdigrätter (lasagne, köttbullar, gratänger)                    ║
║ Förpackning: MAP-förpackning (modifierad atmosfär)                          ║
║ Hållbarhet: 10-14 dagar vid max 4°C                                         ║
║ Målgrupp: Allmän konsumtion (inklusive riskgrupper)                         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ KRITISKA STYRPUNKTER (CCP)                                                  ║
╠═══════╦════════════════╦═══════════════╦═══════════════╦════════════════════╣
║ CCP # ║ Process        ║ Fara          ║ Kritisk gräns ║ Övervakning        ║
╠═══════╬════════════════╬═══════════════╬═══════════════╬════════════════════╣
║ CCP-1 ║ Tillagning     ║ Patogener     ║ ≥75°C kärn-   ║ Kontinuerlig temp- ║
║       ║                ║ (Salmonella,  ║ temperatur    ║ loggning + manuell ║
║       ║                ║ Listeria)     ║ i 2 min       ║ kontroll 1x/batch  ║
╠═══════╬════════════════╬═══════════════╬═══════════════╬════════════════════╣
║ CCP-2 ║ Snabbkylning   ║ Patogentill-  ║ Från 60°C     ║ Temperaturloggning ║
║       ║                ║ växt (B.      ║ till <10°C    ║ + visuell kontroll ║
║       ║                ║ cereus)       ║ inom 4 timmar ║ av kylkurva        ║
╠═══════╬════════════════╬═══════════════╬═══════════════╬════════════════════╣
║ CCP-3 ║ Metalldetekt.  ║ Fysisk fara   ║ Fe ≥1.5mm     ║ Kontinuerlig +     ║
║       ║                ║ (metall)      ║ NFe ≥2.0mm    ║ testbitar 1x/tim   ║
║       ║                ║               ║ SS ≥2.5mm     ║                    ║
╠═══════╩════════════════╩═══════════════╩═══════════════╩════════════════════╣
║ KORRIGERANDE ÅTGÄRDER                                                       ║
║ CCP-1: Förläng tillagning tills kritisk gräns uppnås. Spärra om ej möjligt ║
║ CCP-2: Om >4 tim: Kassera produkten. Identifiera orsak.                     ║
║ CCP-3: Stoppa linje. Spärra produkt sedan senaste OK-test. Verifiera detekt║
╠═══════════════════════════════════════════════════════════════════════════════╣
║ VERIFIERING: Månadsvis trendanalys av CCP-data                              ║
║ VALIDERING: Årlig review av kritiska gränser                                ║
╚══════════════════════════════════════════════════════════════════════════════╝
`,
      deficiencies: [
        'CCP-2 saknar specifikation för max tid i farlig zon (10-60°C)',
        'Verifieringsfrekvens "månadsvis" kan vara för sällan för CCP-2'
      ]
    },
    {
      id: 'DOC-ALLERGEN-001',
      name: 'Allergenhanteringsprocedur',
      type: 'procedure',
      description: 'Procedur för hantering av allergener i produktion',
      content: `
╔══════════════════════════════════════════════════════════════════════════════╗
║                    ALLERGENHANTERINGSPROCEDUR                               ║
║                    PR-QA-012 | Rev 2.0 | 2024-11-20                         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ 1. SYFTE                                                                    ║
║    Säkerställa att allergena ingredienser hanteras korrekt för att          ║
║    förebygga korskontamination och felaktig märkning.                       ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ 2. ALLERGENER SOM HANTERAS                                                  ║
║    ☑ Gluten (vete, råg, korn, havre)  ☑ Ägg                                ║
║    ☑ Mjölk                             ☑ Fisk                               ║
║    ☑ Skaldjur                          ☑ Jordnötter                         ║
║    ☑ Nötter                            ☑ Soja                               ║
║    ☑ Selleri                           ☑ Senap                              ║
║    ☑ Sesam                             ☑ Svaveldioxid/sulfit                ║
║    ☑ Lupin                             ☑ Blötdjur                           ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ 3. PRODUKTIONSSEKVENS                                                       ║
║    3.1 Produkter SKA produceras i ordning: Allergenfria → Allergenhaltiga   ║
║    3.2 Om ordning ej kan hållas: Fullständig allergenrengöring krävs        ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ 4. ALLERGENRENGÖRING                                                        ║
║    4.1 Visuellt ren (kontrolleras av linjechef)                            ║
║    4.2 ATP-test på 3 kritiska punkter (gräns: <150 RLU)                    ║
║    4.3 Vid glutenbyte: Allergenprov med Romer-kit (gräns: <10 ppm)         ║
║    4.4 Dokumenteras i rengöringsloggen                                      ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ 5. MÄRKNING                                                                 ║
║    5.1 Ingrediensspecifikation verifieras mot recept                       ║
║    5.2 "Kan innehålla spår av" baseras på riskbedömning                    ║
║    5.3 Etikettgodkännande av QA före produktionsstart                       ║
╚══════════════════════════════════════════════════════════════════════════════╝
`,
      deficiencies: [
        'Ingen frekvens angiven för allergenriskbedömning',
        'ATP-gränsvärde 150 RLU är högre än branschstandard (100 RLU)'
      ]
    },
    {
      id: 'DOC-CCP-LOG-001',
      name: 'CCP-logg tillagning januari 2026',
      type: 'record',
      description: 'Övervakning av CCP-1 (tillagning) för januari månad',
      content: `
╔══════════════════════════════════════════════════════════════════════════════╗
║                    CCP-1 ÖVERVAKNINGSLOGG - TILLAGNING                      ║
║                    Januari 2026 | Linje 1                                   ║
╠═══════════╦═══════════╦═══════════╦═══════════╦═══════════╦═════════════════╣
║ Datum     ║ Batch     ║ Tid       ║ Kärntemp  ║ Sign      ║ Anmärkning      ║
╠═══════════╬═══════════╬═══════════╬═══════════╬═══════════╬═════════════════╣
║ 2026-01-06║ LAS-0601  ║ 06:45     ║ 78°C      ║ AS        ║ OK              ║
║ 2026-01-06║ LAS-0602  ║ 10:30     ║ 76°C      ║ AS        ║ OK              ║
║ 2026-01-07║ KÖT-0701  ║ 07:15     ║ 77°C      ║ ML        ║ OK              ║
║ 2026-01-07║ KÖT-0702  ║ 11:00     ║ 75°C      ║ ML        ║ OK              ║
║ 2026-01-08║ GRA-0801  ║ 06:30     ║ 79°C      ║ AS        ║ OK              ║
║ 2026-01-08║ GRA-0802  ║ 10:15     ║ 74°C      ║ AS        ║ AVVIK ÅTG-026   ║
║ 2026-01-09║ LAS-0901  ║ 07:00     ║ 77°C      ║ JP        ║ OK              ║
║ 2026-01-09║ LAS-0902  ║ 11:30     ║ 76°C      ║ JP        ║ OK              ║
║ 2026-01-10║ KÖT-1001  ║ 06:45     ║ 78°C      ║ ML        ║ OK              ║
║ 2026-01-10║ KÖT-1002  ║   -       ║   -       ║   -       ║ EJ UTFÖRD       ║
║ 2026-01-13║ GRA-1301  ║ 07:00     ║ 77°C      ║ AS        ║ OK              ║
╠═══════════╩═══════════╩═══════════╩═══════════╩═══════════╩═════════════════╣
║ Kritisk gräns: ≥75°C kärntemperatur i minst 2 minuter                       ║
║ Mätmetod: Stickprov med kalibrerad kärntemperaturmätare                     ║
║ Granskad av: Maria Lindberg, 2026-01-31                                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
`,
      deficiencies: [
        'Mätning 2026-01-10 KÖT-1002 saknas helt utan förklaring',
        'Avvikelse ÅTG-026 registrerad men korrigerande åtgärd ej synlig'
      ]
    },
    {
      id: 'DOC-TRACE-001',
      name: 'Spårbarhetstest 2025-Q4',
      type: 'record',
      description: 'Kvartalsvis spårbarhetsövning',
      content: `
╔══════════════════════════════════════════════════════════════════════════════╗
║                    SPÅRBARHETSTEST - Q4 2025                                ║
║                    Utfört: 2025-12-10                                       ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ TESTSCENARIO                                                                ║
║ Simulerad återkallelse: Potentiell Listeria-kontamination i färdigrätt     ║
║ Produkt: Lasagne 400g, Batch LAS-1208                                       ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ FRAMÅTSPÅRNING (Batch → Kund)                                              ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║ Batch         │ LAS-1208                                                    ║
║ Produktion    │ 2025-12-08, 06:00-10:30                                     ║
║ Förpackat     │ 850 enheter                                                 ║
║ Levererat     │ ICA (450 st), Coop (300 st), Axfood (100 st)               ║
║ Tid att spåra │ 3 timmar 45 minuter                                         ║
║ Status        │ ⚠ ÖVERSKRED 2-TIMMARSMÅL                                    ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ BAKÅTSPÅRNING (Batch → Råvaror)                                            ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║ Nötkött       │ Leverantör: Scan, Batch: SC-4521, Mottaget: 2025-12-06     ║
║ Pasta         │ Leverantör: Barilla, Batch: BA-9987, Mottaget: 2025-12-01  ║
║ Tomatsås      │ Leverantör: Mutti, Batch: MU-2234, Mottaget: 2025-12-03    ║
║ Ost           │ Leverantör: Arla, Batch: ???? - EJ SPÅRBART                ║
║ Tid att spåra │ 2 timmar 15 minuter                                         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ SLUTSATS                                                                    ║
║ ❌ Framåtspårning överskred tidsmål (mål: 2h, faktisk: 3h 45min)           ║
║ ❌ Ost-batch ej fullständigt spårbart                                       ║
║ Korrigerande åtgärd behövs för förbättrad spårbarhet                        ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Utfört av: Erik Johansson | Godkänt av: Maria Lindberg                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
`,
      deficiencies: [
        'Ost-batch ej spårbar - allvarlig brist i spårbarhet',
        'Spårningstid överskred mål med nästan 2 timmar'
      ]
    },
    {
      id: 'DOC-SUPPLIER-001',
      name: 'Leverantörsgodkännande',
      type: 'register',
      description: 'Register över godkända leverantörer',
      content: `
╔══════════════════════════════════════════════════════════════════════════════╗
║                    GODKÄNDA LEVERANTÖRER - RÅVAROR                          ║
║                    Uppdaterad: 2025-09-15                                   ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ LEVERANTÖR      │ PRODUKT       │ CERTIFIERING   │ AUDIT   │ STATUS        ║
╠═════════════════╪═══════════════╪════════════════╪═════════╪═══════════════╣
║ Scan AB         │ Nötkött       │ BRC AA         │ 2025-03 │ ✓ GODKÄND    ║
║ Barilla SpA     │ Pasta         │ FSSC 22000     │ 2024-11 │ ✓ GODKÄND    ║
║ Mutti SpA       │ Tomatsås      │ IFS Higher     │ 2025-06 │ ✓ GODKÄND    ║
║ Arla Foods      │ Ost, grädde   │ FSSC 22000     │ 2024-08 │ ✓ GODKÄND    ║
║ Lantmännen      │ Grönsaker     │ GlobalGAP      │ 2025-02 │ ✓ GODKÄND    ║
║ Spice Import AB │ Kryddor       │ FSSC 22000     │ 2023-05 │ ⚠ UTGÅNGEN   ║
║ Nordic Eggs     │ Ägg           │ KravGodkänd    │ 2025-01 │ ✓ GODKÄND    ║
║ Frysleveransen  │ Frysta bär    │ Saknas         │ Ej utförd│ ? VILLKORAD  ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ GODKÄNNANDEKRITERIER                                                        ║
║ A-leverantör: GFSI-certifiering + audit senaste 18 mån                     ║
║ B-leverantör: Frågeformulär + spec + årlig utvärdering                     ║
║ C-leverantör (sporadisk): Specifikation + CoA per leverans                 ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Nästa review: 2026-03-15                                                    ║
║ Ansvarig: Maria Lindberg                                                    ║
╚══════════════════════════════════════════════════════════════════════════════╝
`,
      deficiencies: [
        'Spice Import AB certifiering utgången sedan 2023 - fortfarande godkänd',
        'Frysleveransen saknar certifiering och audit men är villkorad leverantör'
      ]
    },
    {
      id: 'DOC-TEMP-LOG',
      name: 'Temperaturlogg kyllager',
      type: 'record',
      description: 'Kontinuerlig temperaturövervakning av kyllager',
      content: `
╔══════════════════════════════════════════════════════════════════════════════╗
║                    TEMPERATURLOGG - KYLLAGER FÄRDIGVAROR                    ║
║                    Vecka 4, 2026 (20-26 januari)                            ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ INSTÄLLNING: Min -1°C, Max +4°C, Larm vid >5°C eller <-3°C                 ║
╠════════════╦═══════╦═══════╦═══════╦═══════╦═══════╦═══════╦════════════════╣
║ Datum      ║ 06:00 ║ 10:00 ║ 14:00 ║ 18:00 ║ 22:00 ║ 02:00 ║ Anmärkning     ║
╠════════════╬═══════╬═══════╬═══════╬═══════╬═══════╬═══════╬════════════════╣
║ 2026-01-20 ║ +2.1  ║ +2.3  ║ +2.5  ║ +2.2  ║ +2.0  ║ +1.8  ║ OK             ║
║ 2026-01-21 ║ +2.0  ║ +2.4  ║ +2.8  ║ +2.5  ║ +2.1  ║ +1.9  ║ OK             ║
║ 2026-01-22 ║ +1.9  ║ +2.2  ║ +5.8  ║ +6.2  ║ +3.5  ║ +2.4  ║ LARM 13:45     ║
║ 2026-01-23 ║ +2.2  ║ +2.5  ║ +2.6  ║ +2.3  ║ +2.1  ║ +2.0  ║ OK             ║
║ 2026-01-24 ║ +2.1  ║ +2.3  ║ +2.4  ║ +2.2  ║ +2.0  ║ +1.8  ║ OK             ║
║ 2026-01-25 ║ +1.8  ║ +2.1  ║ +2.3  ║ +2.1  ║ +1.9  ║ +1.7  ║ OK             ║
║ 2026-01-26 ║ +1.9  ║ +2.2  ║ +2.5  ║ +2.3  ║ +2.0  ║ +1.8  ║ OK             ║
╠════════════╩═══════╩═══════╩═══════╩═══════╩═══════╩═══════╩════════════════╣
║ LARMHÄNDELSE 2026-01-22                                                     ║
║ 13:45: Larm +5.8°C - Kylaggregat stannade pga elfel                        ║
║ 14:30: Tekniker kallad                                                      ║
║ 15:15: Åtgärdat - Kylaggregat startat                                      ║
║ 18:00: Temperatur återställd till normalläge                               ║
║ Åtgärd: Produkter med >2 tim i >5°C utvärderades - ej kasserade            ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Granskad av: Erik Johansson | 2026-01-27                                   ║
╚══════════════════════════════════════════════════════════════════════════════╝
`,
      deficiencies: [
        'Produkter i >5°C i ca 2.5 timmar kasserades inte - brist i korrigerande åtgärd',
        'Ingen dokumenterad riskbedömning av påverkade produkter'
      ]
    }
  ],

  deficiencies: [
    {
      id: 'DEF-FOOD-001',
      annexSLChapter: 7,
      type: 'major',
      description: 'Bristande spårbarhet av råvaror',
      evidence: 'Spårbarhetstest Q4 2025 visar att ost-batch ej kunde spåras. Framåtspårning tog 3h 45min istället för max 2h.',
      standardReference: 'FSSC 22000 / ISO 22000:2018 kap 8.3 (Spårbarhetssystem)',
      difficulty: 'medel'
    },
    {
      id: 'DEF-FOOD-002',
      annexSLChapter: 8,
      type: 'major',
      description: 'Leverantör med utgången certifiering fortfarande godkänd',
      evidence: 'Spice Import AB:s certifiering utgick maj 2023 men finns fortfarande som godkänd leverantör.',
      standardReference: 'FSSC 22000 / ISO 22000:2018 kap 7.1.6 (Kontroll av externt tillhandahållna processer)',
      difficulty: 'grundlaggande'
    },
    {
      id: 'DEF-FOOD-003',
      annexSLChapter: 8,
      type: 'minor',
      description: 'Saknad CCP-mätning utan dokumenterad förklaring',
      evidence: 'CCP-logg 2026-01-10 batch KÖT-1002 markerad som "EJ UTFÖRD" utan förklaring eller korrigerande åtgärd.',
      standardReference: 'ISO 22000:2018 kap 8.5.4.3 (Åtgärder vid överskridande av kritiska gränser)',
      difficulty: 'grundlaggande'
    },
    {
      id: 'DEF-FOOD-004',
      annexSLChapter: 8,
      type: 'minor',
      description: 'Temperaturavvikelse hanterades ej enligt procedur',
      evidence: 'Temperaturlogg 2026-01-22 visar +6.2°C i över 2 timmar. Produkter kasserades inte trots att kylkedjan bröts.',
      standardReference: 'ISO 22000:2018 kap 8.9.4 (Hantering av potentiellt osäkra produkter)',
      difficulty: 'medel'
    },
    {
      id: 'DEF-FOOD-005',
      annexSLChapter: 8,
      type: 'observation',
      description: 'ATP-gränsvärde högre än branschpraxis',
      evidence: 'Allergenhanteringsprocedur anger ATP-gräns 150 RLU. Branschstandard är typiskt 100 RLU.',
      standardReference: 'FSSC 22000 kap 2.5.9 (Allergenhantering)',
      difficulty: 'avancerad'
    },
    {
      id: 'DEF-FOOD-006',
      annexSLChapter: 9,
      type: 'minor',
      description: 'HACCP-verifiering för sällan',
      evidence: 'HACCP-planen anger "månadsvis trendanalys" för CCP-data. Snabbkylning CCP-2 bör verifieras oftare.',
      standardReference: 'ISO 22000:2018 kap 8.8 (Verifiering relaterad till PRP och farostyrningsplanen)',
      difficulty: 'avancerad'
    }
  ],

  standards: [
    {
      code: 'FSSC 22000',
      name: 'Food Safety System Certification 22000',
      relevantClauses: [
        '2.5.1 Hantering av allergener',
        '2.5.6 Spårbarhet',
        '2.5.9 Allergenrengöring',
        '2.5.10 Produktåterkallelse'
      ]
    },
    {
      code: 'ISO 22000:2018',
      name: 'Livsmedelssäkerhet - Ledningssystem',
      relevantClauses: [
        'Kap 7.1.6 Kontroll av externa resurser',
        'Kap 8.3 Spårbarhetssystem',
        'Kap 8.5 Farostyrning (HACCP)',
        'Kap 8.8 Verifiering',
        'Kap 8.9 Hantering av potentiellt osäkra produkter'
      ]
    },
    {
      code: 'Codex HACCP',
      name: 'Codex Alimentarius HACCP-principer',
      relevantClauses: [
        'Princip 1: Faroanalys',
        'Princip 2: Identifiera CCP',
        'Princip 3: Kritiska gränser',
        'Princip 4: Övervakning',
        'Princip 5: Korrigerande åtgärder',
        'Princip 6: Verifiering',
        'Princip 7: Dokumentation'
      ]
    }
  ],

  terminology: {
    'CCP': 'Critical Control Point - Kritisk styrpunkt där kontroll kan tillämpas',
    'PRP': 'Prerequisite Program - Grundförutsättningsprogram (hygien, underhåll)',
    'OPRP': 'Operational Prerequisite Program - Operativt grundförutsättningsprogram',
    'HACCP': 'Hazard Analysis Critical Control Points - Faroanalys och kritiska styrpunkter',
    'MAP': 'Modified Atmosphere Packaging - Förpackning med modifierad atmosfär',
    'FIFO': 'First In First Out - Först in först ut',
    'FEFO': 'First Expired First Out - Först utgånget först ut',
    'ATP': 'Adenosintrifosfat - Mäter biologisk kontamination vid hygienkontroll',
    'RLU': 'Relative Light Units - Enhet för ATP-mätning',
    'CoA': 'Certificate of Analysis - Analysbevis från leverantör',
    'GFSI': 'Global Food Safety Initiative - Global livsmedelsäkerhetsstandard'
  }
};


// ============================================================
// BYGG/ANLÄGGNING
// ============================================================

export const constructionIndustryProfile: IndustryProfile = {
  id: 'construction',
  name: 'Bygg/Anläggning',
  description: 'Byggentreprenad med fokus på projektstyrning, arbetsmiljö och kvalitetssäkring',

  company: {
    name: 'Nordbygg Entreprenad AB',
    industry: 'Bygg och anläggning',
    employees: 210,
    description: 'Medelstort byggföretag specialiserat på kommersiella byggprojekt och renoveringar. Arbetar med nyproduktion av kontor, skolor och flerbostadshus.',
    products: [
      'Nyproduktion kommersiella fastigheter',
      'Ombyggnad och renovering',
      'Markentreprenader',
      'Projektledning och byggledning'
    ],
    certifications: ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'BF9K'],
    facilities: [
      'Huvudkontor Stockholm',
      'Maskinpark Arlanda',
      'Projektkontor (temporära)',
      'Byggetableringar'
    ],
    customers: ['Fastighetsbolag', 'Kommuner', 'Bostadsrättsföreningar', 'Industri']
  },

  characters: [
    {
      name: 'Peter Lindgren',
      role: 'quality_manager',
      title: 'Kvalitets- och miljöchef',
      department: 'Kvalitet',
      yearsAtCompany: 15,
      personality: 'Erfaren och pragmatisk. Förstår byggbranschens utmaningar med dokumentation.',
      knowledge: [
        'ISO 9001, 14001, 45001',
        'BF9K byggbranschens kvalitetssystem',
        'AMA (Allmän Material- och Arbetsbeskrivning)',
        'Entreprenadrätt (AB04, ABT06)',
        'Miljöcertifieringar (BREEAM, Miljöbyggnad)'
      ],
      responsibilities: [
        'Ledningssystemansvarig',
        'Internrevisioner',
        'Miljöplaner',
        'Egenkontrollsystem',
        'Avvikelsehantering'
      ]
    },
    {
      name: 'Karin Holm',
      role: 'construction_manager',
      title: 'Byggchef',
      department: 'Produktion',
      yearsAtCompany: 12,
      personality: 'Resultatinriktad och van vid att lösa problem i fält. Dokumentation kommer ofta i andra hand.',
      knowledge: [
        'Byggproduktion',
        'Tidplanering',
        'Entreprenadformer',
        'Underentreprenörsstyrning',
        'Kostnadsstyrning'
      ],
      responsibilities: [
        'Projektansvar större projekt',
        'Ekonomiskt resultat',
        'Personalplanering',
        'Kundkontakt',
        'Slutbesiktningar'
      ]
    },
    {
      name: 'Erik Svensson',
      role: 'site_manager',
      title: 'Platschef',
      department: 'Produktion',
      yearsAtCompany: 8,
      personality: 'Praktiskt lagd och fokuserad på att bygget ska fungera. Stress under tidspress.',
      knowledge: [
        'Byggarbetsledning',
        'Säkerhet på byggarbetsplats',
        'Daglig drift',
        'Resursplanering',
        'Kvalitetsdokumentation i produktion'
      ],
      responsibilities: [
        'Daglig byggledning',
        'Säkerhetsronder',
        'Underentreprenörssamordning',
        'Kvalitetskontroller',
        'Tidsrapportering'
      ]
    },
    {
      name: 'Maria Andersson',
      role: 'hse_manager',
      title: 'Arbetsmiljösamordnare (BAS-U)',
      department: 'Arbetsmiljö',
      yearsAtCompany: 6,
      personality: 'Engagerad i arbetsmiljöfrågor. Tar säkerhet på stort allvar.',
      knowledge: [
        'Arbetsmiljölagen',
        'BAS-U/BAS-P ansvar',
        'Riskbedömningar',
        'Skyddsronder',
        'Olycksutredning'
      ],
      responsibilities: [
        'Arbetsmiljöplan (AMP)',
        'Skyddsronder',
        'Riskbedömningar',
        'Olycks- och tillbudshantering',
        'Utbildning säkerhet'
      ]
    },
    {
      name: 'Lars Bergman',
      role: 'project_manager',
      title: 'Projektchef',
      department: 'Projekt',
      yearsAtCompany: 10,
      personality: 'Strategisk och kundfokuserad. Balanserar kvalitet med ekonomi.',
      knowledge: [
        'Projektledning',
        'Kontrakthantering',
        'Ekonomistyrning',
        'Kundrelationer',
        'Tvistlösning'
      ],
      responsibilities: [
        'Övergripande projektansvar',
        'Kundkontakt',
        'Ekonomisk uppföljning',
        'Slutredovisning',
        'ÄTA-hantering'
      ]
    },
    {
      name: 'Anna Forsberg',
      role: 'purchasing_manager',
      title: 'Inköpschef',
      department: 'Inköp',
      yearsAtCompany: 5,
      personality: 'Analytisk och kostnadsmedveten. Fokuserar på leverantörsrelationer.',
      knowledge: [
        'Materialinköp',
        'Underentreprenörsupphandling',
        'Leverantörsutvärdering',
        'Avtalsjuridik',
        'Hållbarhetskrav'
      ],
      responsibilities: [
        'Strategiska inköp',
        'Ramavtal',
        'Leverantörskvalificering',
        'Materialförsörjning',
        'Reklamationer'
      ]
    },
    {
      name: 'Niklas Ekström',
      role: 'supervisor',
      title: 'Arbetsledare',
      department: 'Produktion',
      yearsAtCompany: 4,
      personality: 'Praktisk och handlingskraftig. Nära arbetet på plats.',
      knowledge: [
        'Byggmetoder',
        'Arbetsinstruktioner',
        'Egenkontroller',
        'Materialhantering'
      ],
      responsibilities: [
        'Daglig arbetsledning',
        'Egenkontroller',
        'Materialavrop',
        'Personaldisponering'
      ]
    }
  ],

  documents: [
    {
      id: 'DOC-QP-001',
      name: 'Kvalitetsplan Projekt Solbacken',
      type: 'quality_plan',
      description: 'Projektspecifik kvalitetsplan för nybyggnad av flerbostadshus',
      content: `
╔══════════════════════════════════════════════════════════════════════════════╗
║                    KVALITETSPLAN                                            ║
║                    Projekt: Solbacken Etapp 1                               ║
║                    Beställare: Solbacken Bostads AB                         ║
║                    Rev 2.0 | 2025-09-01                                     ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ PROJEKTBESKRIVNING                                                          ║
║ Nybyggnad av 3 st flerbostadshus, totalt 84 lägenheter                     ║
║ Kontraktssumma: 185 MSEK                                                    ║
║ Entreprenadform: Totalentreprenad (ABT06)                                   ║
║ Byggstart: 2025-06-15 | Färdigställande: 2027-03-31                        ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ ORGANISATION                                                                ║
╠═════════════════════════════════════════════════════════════════════════════╣
║ Projektchef        │ Lars Bergman                                           ║
║ Platschef          │ Erik Svensson                                          ║
║ Kvalitetsansvarig  │ Peter Lindgren (20% allokering)                        ║
║ BAS-U              │ Maria Andersson                                        ║
║ BAS-P              │ Extern (Byggkonsulten AB)                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ KONTROLLPLAN ENLIGT PBL                                                     ║
╠════════════════════════════════════════════════════════════════════════════╣
║ Kontrollpunkt           │ Ansvarig  │ Metod      │ Dokumentation           ║
╠═════════════════════════╪═══════════╪════════════╪═════════════════════════╣
║ Grundläggning           │ UE        │ Egenkontroll│ FK-01 Grund            ║
║ Betonggjutning          │ UE        │ Egenkontroll│ FK-02 Betong           ║
║ Stomresning             │ Platschef │ Syn        │ FK-03 Stomme           ║
║ Tätskikt våtrum         │ Behörig   │ Mätning    │ FK-04 Tätskikt         ║
║ Brandskydd genomföringar│ SA        │ Kontroll   │ FK-05 Brand            ║
║ Lufttäthet              │ Certif.   │ Tryckmätning│ FK-06 Lufttät         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ UNDERENTREPRENÖRER                                                          ║
╠═════════════════════════╪═══════════════════════════════════════════════════╣
║ Grundläggning           │ Markbygg AB (kvalificerad 2024-08)               ║
║ Betong/stomme           │ Betongteknik AB (kvalificerad 2023-12)           ║
║ El                      │ ElPartner AB (ej kvalificerad - pågående)        ║
║ VVS                     │ Rörbolaget AB (kvalificerad 2025-01)             ║
║ Ventilation             │ Luftflödet AB (kvalificerad 2024-06)             ║
║ Målning                 │ Mästarns Måleri AB (ej kvalificerad)             ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ AVVIKELSE- OCH ÄTA-HANTERING                                               ║
║ Avvikelser rapporteras i företagets avvikelsesystem inom 24 timmar         ║
║ ÄTA-arbeten påbörjas EJ utan skriftlig beställning                         ║
╚══════════════════════════════════════════════════════════════════════════════╝
`,
      deficiencies: [
        'Två underentreprenörer (El, Målning) ej kvalificerade trots pågående arbete',
        'Kvalitetsansvarig endast 20% allokerad på 185 MSEK-projekt'
      ]
    },
    {
      id: 'DOC-AMP-001',
      name: 'Arbetsmiljöplan Projekt Solbacken',
      type: 'safety_plan',
      description: 'Arbetsmiljöplan enligt Arbetsmiljölagen',
      content: `
╔══════════════════════════════════════════════════════════════════════════════╗
║                    ARBETSMILJÖPLAN (AMP)                                    ║
║                    Projekt: Solbacken Etapp 1                               ║
║                    Rev 1.2 | 2025-06-10                                     ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ 1. ORGANISATION                                                             ║
║    BAS-P: Byggkonsulten AB (planering och projektering)                    ║
║    BAS-U: Maria Andersson, Nordbygg Entreprenad AB (utförandeskedet)        ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ 2. IDENTIFIERADE RISKER OCH ÅTGÄRDER                                       ║
╠═════════════════════════════════════════════════════════════════════════════╣
║ Risk                    │ Sannolik │ Konsekvens │ Åtgärd                    ║
╠═════════════════════════╪══════════╪════════════╪═════════════════════════╣
║ Fall från höjd          │ Hög      │ Allvarlig  │ Skyddsräcke, fallskydd   ║
║ Tung lyft               │ Medel    │ Medel      │ Hjälpmedel, utbildning   ║
║ El-arbete               │ Medel    │ Allvarlig  │ Behörig elektriker       ║
║ Schaktarbete            │ Medel    │ Allvarlig  │ Spontning, geotekniker   ║
║ Buller                  │ Hög      │ Medel      │ Hörselskydd obligatoriskt║
║ Damm/partiklar          │ Hög      │ Medel      │ Andningsskydd, dammsug   ║
║ Trafik på arbetsplats   │ Medel    │ Allvarlig  │ APD-plan, signalmän      ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ 3. SKYDDSRONDER                                                             ║
║    Frekvens: Veckovis (varje torsdag kl 07:00)                             ║
║    Deltagare: Platschef, skyddsombud, BAS-U                                ║
║    Dokumentation: Skyddsrondsprotokoll i projektpärm                       ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ 4. INTRODUKTION OCH UTBILDNING                                             ║
║    Alla på arbetsplatsen ska ha genomgått:                                 ║
║    - Arbetsplatsintroduktion (registreras i närvarolista)                  ║
║    - Safe Construction Training (giltigt ID06-kort)                        ║
║    - Projektspecifik säkerhetsgenomgång                                    ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ 5. OLYCKS- OCH TILLBUDSRAPPORTERING                                        ║
║    Alla olyckor och tillbud rapporteras omedelbart till platschef          ║
║    Dokumenteras i företagets händelserapportsystem                         ║
║    Allvarliga olyckor anmäls till Arbetsmiljöverket inom 24 timmar         ║
╚══════════════════════════════════════════════════════════════════════════════╝
`,
      deficiencies: [
        'AMP daterad 2025-06-10 men ej reviderad trots att byggstart var 2025-06-15',
        'Riskbedömning saknar kvantitativ riskvärdering (endast Hög/Medel/Låg)'
      ]
    },
    {
      id: 'DOC-SAFETY-LOG',
      name: 'Skyddsrondsprotokoll december 2025',
      type: 'record',
      description: 'Protokoll från skyddsronder',
      content: `
╔══════════════════════════════════════════════════════════════════════════════╗
║                    SKYDDSRONDSPROTOKOLL                                     ║
║                    Projekt: Solbacken Etapp 1                               ║
║                    December 2025                                            ║
╠════════════╦═══════════════════════════════════════════════════════════════╣
║ 2025-12-05 ║ Deltagare: Erik S, Maria A, Skyddsombud                       ║
║            ║ Noteringar:                                                    ║
║            ║ - Skyddsräcke saknas trappa hus B, plan 3 → ÅTGÄRDAS          ║
║            ║ - Städning bristfällig källarplan → PÅPEKAD                   ║
║            ║ - Brandsläckare kontrollerad OK                               ║
║            ║ Åtgärdsansvarig: Niklas E | Klart: 2025-12-06                 ║
╠════════════╬═══════════════════════════════════════════════════════════════╣
║ 2025-12-12 ║ Deltagare: Erik S, Maria A                                    ║
║            ║ Noteringar:                                                    ║
║            ║ - Skyddsräcke åtgärdat OK                                     ║
║            ║ - Fallskydd ej använt vid takarbete (UE Plåtslagarn)          ║
║            ║   → ALLVARLIG OBSERVATION - Arbetet stoppat                   ║
║            ║ - Ordning/reda förbättrad                                     ║
║            ║ Åtgärdsansvarig: Lars B (UE-kontakt) | Klart: AKUT           ║
╠════════════╬═══════════════════════════════════════════════════════════════╣
║ 2025-12-19 ║ EJ GENOMFÖRD - Julstängning                                   ║
╠════════════╬═══════════════════════════════════════════════════════════════╣
║ 2025-12-26 ║ EJ GENOMFÖRD - Julstängning                                   ║
╠════════════╬═══════════════════════════════════════════════════════════════╣
║ 2026-01-02 ║ Deltagare: Erik S, Skyddsombud (Maria A sjuk)                 ║
║            ║ Noteringar:                                                    ║
║            ║ - Fallskyddsavvikelse ej stängd (UE ej återkommit med plan)   ║
║            ║ - Ny observation: Kemikalier saknar säkerhetsdatablad         ║
║            ║ - Personalbodar OK                                            ║
║            ║ Åtgärdsansvarig: Anna F | Klart: 2026-01-09                   ║
╠════════════╩═══════════════════════════════════════════════════════════════╣
║ Sammanfattning december/januari:                                            ║
║ - 2 skyddsronder genomförda av 4 planerade (50%)                          ║
║ - 1 allvarlig avvikelse (fallskydd) ÖPPEN sedan 12 december                ║
║ - BAS-U ej närvarande vid senaste ronden                                   ║
╚══════════════════════════════════════════════════════════════════════════════╝
`,
      deficiencies: [
        'Allvarlig fallskyddsavvikelse öppen i över 3 veckor',
        'Endast 50% av planerade skyddsronder genomförda',
        'BAS-U ej närvarande - bryter mot rutinen'
      ]
    },
    {
      id: 'DOC-EGENK-001',
      name: 'Egenkontroll tätskikt våtrum',
      type: 'inspection_record',
      description: 'Egenkontrollprotokoll för tätskiktsarbeten',
      content: `
╔══════════════════════════════════════════════════════════════════════════════╗
║                    EGENKONTROLL TÄTSKIKT VÅTRUM                             ║
║                    Projekt: Solbacken Etapp 1, Hus A                        ║
║                    Enligt BBR 8:9 och Byggkeramikrådets branschregler       ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ LGH   │ RUM      │ DATUM    │ UTFÖRARE       │ KONTROLLANT │ GODKÄND       ║
╠═══════╪══════════╪══════════╪════════════════╪═════════════╪═══════════════╣
║ 1101  │ Badrum   │ 2025-11-15│ Kakel-Kansen  │ Niklas E    │ ✓ JA          ║
║ 1101  │ WC       │ 2025-11-15│ Kakel-Kansen  │ Niklas E    │ ✓ JA          ║
║ 1102  │ Badrum   │ 2025-11-18│ Kakel-Kansen  │ Niklas E    │ ✓ JA          ║
║ 1102  │ WC       │ 2025-11-18│ Kakel-Kansen  │ -           │ Ej kontrollerat║
║ 1103  │ Badrum   │ 2025-11-20│ Kakel-Kansen  │ Niklas E    │ ⚠ ANMÄRKNING  ║
║ 1103  │ WC       │ 2025-11-20│ Kakel-Kansen  │ Niklas E    │ ✓ JA          ║
║ 1104  │ Badrum   │ 2025-11-22│ Kakel-Kansen  │ Niklas E    │ ✓ JA          ║
║ 1104  │ WC       │ 2025-11-22│ Kakel-Kansen  │ -           │ Ej kontrollerat║
║ 1201  │ Badrum   │ 2025-11-25│ Kakel-Kansen  │ Niklas E    │ ✓ JA          ║
║ 1201  │ WC       │ 2025-11-25│ Kakel-Kansen  │ Niklas E    │ ✓ JA          ║
╠═══════╩══════════╩══════════╩════════════════╩═════════════╩═══════════════╣
║ ANMÄRKNING LGH 1103 Badrum:                                                ║
║ Bristande överlapp vid golvbrunn (15mm istället för 30mm enligt regler)    ║
║ Åtgärd: Komplettering utförd 2025-11-21, godkänd av Niklas E               ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ CERTIFIERING UTFÖRARE                                                       ║
║ Kakel-Kansen AB: BKR-certifierad våtrumsmontör                             ║
║ Certifikat nr: BKR-4521 | Giltig t.o.m: 2024-12-31                         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Kontroll utförd av: Niklas Ekström                                         ║
║ Granskad av: Peter Lindgren, 2025-12-01                                    ║
╚══════════════════════════════════════════════════════════════════════════════╝
`,
      deficiencies: [
        'BKR-certifikat utgånget 2024-12-31 - arbete utfört med ogiltigt certifikat',
        '2 av 10 utrymmen ej kontrollerade men kakelsättning fortskrider'
      ]
    },
    {
      id: 'DOC-SUPPLIER-REG',
      name: 'Underentreprenörsregister',
      type: 'register',
      description: 'Register över underentreprenörer och leverantörer',
      content: `
╔══════════════════════════════════════════════════════════════════════════════╗
║                    UNDERENTREPRENÖRSREGISTER                                ║
║                    Nordbygg Entreprenad AB                                  ║
║                    Uppdaterad: 2025-10-15                                   ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ FÖRETAG              │ VERKSAMHET    │ KVALIFICERAD │ F-SKATT │ FÖRSÄKRING  ║
╠══════════════════════╪═══════════════╪══════════════╪═════════╪═════════════╣
║ Markbygg AB          │ Markentrepr.  │ 2024-08-15   │ ✓ OK    │ ✓ 50 MSEK   ║
║ Betongteknik AB      │ Betong/stomme │ 2023-12-10   │ ✓ OK    │ ✓ 30 MSEK   ║
║ ElPartner AB         │ El            │ PÅGÅENDE     │ ✓ OK    │ ⚠ 5 MSEK    ║
║ Rörbolaget AB        │ VVS           │ 2025-01-20   │ ✓ OK    │ ✓ 20 MSEK   ║
║ Luftflödet AB        │ Ventilation   │ 2024-06-05   │ ✓ OK    │ ✓ 15 MSEK   ║
║ Kakel-Kansen AB      │ Våtrum        │ 2023-04-01   │ ✓ OK    │ ✓ 10 MSEK   ║
║ Mästarns Måleri AB   │ Målning       │ EJ UTFÖRD    │ ? Ej ktr│ ? Ej ktr    ║
║ Plåtslagarn HB       │ Plåt/tak      │ 2024-02-28   │ ✓ OK    │ ✓ 8 MSEK    ║
║ Stål & Svets AB      │ Stålstomme    │ 2024-09-12   │ ✓ OK    │ ✓ 25 MSEK   ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ KVALIFICERINGSKRITERIER                                                     ║
║ ☑ F-skattsedel verifierad                                                  ║
║ ☑ Ansvarsförsäkring min 10 MSEK (20 MSEK för kritiska arbeten)            ║
║ ☑ Referensprojekt genomgångna (min 2 st)                                   ║
║ ☑ ID06-anslutning bekräftad                                                ║
║ ☑ Arbetsmiljöpolicy granskad                                               ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Nästa översyn: 2026-01-15                                                   ║
║ Ansvarig: Anna Forsberg                                                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
`,
      deficiencies: [
        'Mästarns Måleri ej kvalificerad men finns i register som aktuell UE',
        'ElPartner AB har ansvarsförsäkring på endast 5 MSEK (under krav på 10 MSEK)',
        'Kakel-Kansen kvalificerad 2023-04-01 - över 2 år gammalt'
      ]
    },
    {
      id: 'DOC-INCIDENT-001',
      name: 'Händelserapport tillbud',
      type: 'incident_report',
      description: 'Rapport över tillbud och olyckor',
      content: `
╔══════════════════════════════════════════════════════════════════════════════╗
║                    HÄNDELSERAPPORT                                          ║
║                    Projekt: Solbacken Etapp 1                               ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Händelse-ID: TB-2025-047                                                    ║
║ Typ: TILLBUD (nära ögat-händelse)                                          ║
║ Datum: 2025-12-18 | Tid: 10:35                                             ║
║ Plats: Hus B, Plan 4, Trapphusschakt                                       ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ BESKRIVNING                                                                 ║
║ Vid förflyttning av betongskiva med travers lossnade en lyftögla.          ║
║ Skivan (ca 200 kg) föll 3 meter och landade i trapphusschaktet.            ║
║ Ingen person befann sig i farozonen vid tillfället.                        ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ BAKOMLIGGANDE ORSAKER                                                       ║
║ 1. Lyftögla var inte korrekt infäst (fabriksdefekt eller felmontering)    ║
║ 2. Ingen kontroll av lyftanordningen före lyft                             ║
║ 3. Området under lyft var inte avspärrat                                   ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ ÅTGÄRDER                                                                    ║
║ Omedelbara:                                                                 ║
║ - Stopp på traversarbete tills vidare                                      ║
║ - Kontroll av samtliga lyftöglor i leveransen                              ║
║                                                                             ║
║ Korrigerande:                                                               ║
║ - ? EJ DEFINIERADE                                                         ║
║                                                                             ║
║ Förebyggande:                                                               ║
║ - ? EJ DEFINIERADE                                                         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Rapporterad av: Erik Svensson | 2025-12-18                                 ║
║ Utredningsansvarig: Maria Andersson                                        ║
║ Status: ÖPPEN                                                               ║
║ Anmäld till Arbetsmiljöverket: NEJ (bedömt som tillbud, ej olycka)         ║
╚══════════════════════════════════════════════════════════════════════════════╝
`,
      deficiencies: [
        'Korrigerande och förebyggande åtgärder ej definierade trots allvarligt tillbud',
        'Händelse från december fortfarande öppen utan åtgärdsplan',
        'Gränsdragning tillbud/olycka kan ifrågasättas - potentiellt dödlig händelse'
      ]
    }
  ],

  deficiencies: [
    {
      id: 'DEF-CONST-001',
      annexSLChapter: 8,
      type: 'major',
      description: 'Underentreprenörer arbetar utan godkänd kvalificering',
      evidence: 'Kvalitetsplan och UE-register visar att ElPartner AB och Mästarns Måleri arbetar på projektet utan fullständig kvalificering.',
      standardReference: 'ISO 9001:2015 kap 8.4 (Kontroll av externt tillhandahållna processer)',
      difficulty: 'grundlaggande'
    },
    {
      id: 'DEF-CONST-002',
      annexSLChapter: 8,
      type: 'major',
      description: 'Allvarlig arbetsmiljöavvikelse ej stängd inom rimlig tid',
      evidence: 'Skyddsrondsprotokoll visar att fallskyddsavvikelse från 12 december fortfarande är öppen efter 3 veckor.',
      standardReference: 'ISO 45001:2018 kap 10.2 (Incident, avvikelse och korrigerande åtgärd)',
      difficulty: 'grundlaggande'
    },
    {
      id: 'DEF-CONST-003',
      annexSLChapter: 7,
      type: 'major',
      description: 'Arbete utfört med utgånget certifikat',
      evidence: 'BKR-certifikat för Kakel-Kansen utgick 2024-12-31. Tätskiktsarbeten utfördes i november 2025 med ogiltigt certifikat.',
      standardReference: 'ISO 9001:2015 kap 7.2 (Kompetens)',
      difficulty: 'medel'
    },
    {
      id: 'DEF-CONST-004',
      annexSLChapter: 9,
      type: 'minor',
      description: 'Skyddsronder genomförs ej enligt plan',
      evidence: 'December 2025: Endast 2 av 4 planerade skyddsronder genomförda (50%).',
      standardReference: 'ISO 45001:2018 kap 9.1 (Övervakning, mätning, analys och utvärdering)',
      difficulty: 'grundlaggande'
    },
    {
      id: 'DEF-CONST-005',
      annexSLChapter: 10,
      type: 'minor',
      description: 'Tillbudsutredning saknar korrigerande åtgärder',
      evidence: 'Händelserapport TB-2025-047 visar allvarligt tillbud utan definierade korrigerande eller förebyggande åtgärder.',
      standardReference: 'ISO 45001:2018 kap 10.2 (Incident, avvikelse och korrigerande åtgärd)',
      difficulty: 'medel'
    },
    {
      id: 'DEF-CONST-006',
      annexSLChapter: 8,
      type: 'observation',
      description: 'Egenkontroller ej fullständigt genomförda',
      evidence: 'Egenkontroll tätskikt visar 2 av 10 utrymmen ej kontrollerade trots att kakelsättning påbörjats.',
      standardReference: 'ISO 9001:2015 kap 8.6 (Frisläppning av produkter och tjänster)',
      difficulty: 'avancerad'
    },
    {
      id: 'DEF-CONST-007',
      annexSLChapter: 7,
      type: 'observation',
      description: 'BAS-U ej närvarande vid skyddsrond',
      evidence: 'Skyddsrondsprotokoll 2026-01-02 visar att BAS-U var frånvarande trots krav på närvaro.',
      standardReference: 'AFS 1999:3 (Byggnads- och anläggningsarbete)',
      difficulty: 'avancerad'
    }
  ],

  standards: [
    {
      code: 'ISO 9001:2015',
      name: 'Kvalitetsledning',
      relevantClauses: [
        'Kap 7.2 Kompetens',
        'Kap 8.4 Kontroll av externt tillhandahållna processer',
        'Kap 8.6 Frisläppning av produkter'
      ]
    },
    {
      code: 'ISO 45001:2018',
      name: 'Arbetsmiljöledning',
      relevantClauses: [
        'Kap 6.1 Åtgärder för att hantera risker och möjligheter',
        'Kap 8.1 Planering och styrning av verksamheten',
        'Kap 9.1 Övervakning och mätning',
        'Kap 10.2 Incident, avvikelse och korrigerande åtgärd'
      ]
    },
    {
      code: 'AFS 1999:3',
      name: 'Byggnads- och anläggningsarbete',
      relevantClauses: [
        'BAS-P och BAS-U ansvar',
        'Arbetsmiljöplan',
        'Skyddsronder',
        'Fallskydd'
      ]
    },
    {
      code: 'BF9K',
      name: 'Byggbranschens kvalitetssystem',
      relevantClauses: [
        'Kvalitetsplan',
        'Egenkontrollsystem',
        'Underentreprenörskontroll'
      ]
    }
  ],

  terminology: {
    'BAS-P': 'Byggarbetsmiljösamordnare för planering och projektering',
    'BAS-U': 'Byggarbetsmiljösamordnare för utförandet',
    'AMP': 'Arbetsmiljöplan - krävs för alla byggarbetsplatser',
    'UE': 'Underentreprenör',
    'ÄTA': 'Ändrings- och tilläggsarbete',
    'ABT06': 'Allmänna bestämmelser för totalentreprenader',
    'AB04': 'Allmänna bestämmelser för utförandeentreprenader',
    'AMA': 'Allmän Material- och Arbetsbeskrivning',
    'BKR': 'Byggkeramikrådets branschregler för våtrum',
    'ID06': 'Legitimationssystem för byggbranschen',
    'PBL': 'Plan- och bygglagen',
    'BBR': 'Boverkets byggregler',
    'APD-plan': 'Arbetsplatsdisposition - hur arbetsplatsen är organiserad'
  }
};


// ============================================================
// MANUFACTURING (BEFINTLIG)
// ============================================================

export const manufacturingIndustryProfile: IndustryProfile = {
  id: 'manufacturing',
  name: 'Verkstad/Tillverkning',
  description: 'Tillverkande industri med fokus på precisionskomponenter och processer',

  company: {
    name: 'Nordisk Precision AB',
    industry: 'Tillverkande verkstadsindustri',
    employees: 180,
    description: 'Tillverkare av precisionskomponenter för fordonsindustrin med fokus på hydrauliksystem och transmissioner.',
    products: [
      'Precisionskomponenter för fordonsindustrin',
      'Hydrauliksystem',
      'Industriella transmissioner'
    ],
    certifications: ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'IATF 16949:2016'],
    facilities: [
      'Produktionshall 1 (svarvning)',
      'Produktionshall 2 (fräsning)',
      'Monteringshall',
      'Mätrum',
      'Lager'
    ],
    customers: ['Volvo', 'Scania', 'Autoliv', 'SKF']
  },

  characters: [], // Använder befintliga karaktärer från character-profiles.ts
  documents: [], // Använder befintliga dokument från company-documents.ts
  deficiencies: [], // Använder befintliga från observations.ts

  standards: [
    {
      code: 'ISO 9001:2015',
      name: 'Kvalitetsledning',
      relevantClauses: ['Kap 4-10 (Annex SL)']
    },
    {
      code: 'IATF 16949:2016',
      name: 'Fordonsindustrins kvalitetsledning',
      relevantClauses: ['Core Tools (APQP, PPAP, FMEA, MSA, SPC)']
    }
  ],

  terminology: {
    'APQP': 'Advanced Product Quality Planning',
    'PPAP': 'Production Part Approval Process',
    'FMEA': 'Failure Mode and Effects Analysis',
    'MSA': 'Measurement System Analysis',
    'SPC': 'Statistical Process Control',
    'Cpk': 'Process Capability Index'
  }
};


// ============================================================
// HELPER FUNCTIONS
// ============================================================

export const industryProfiles: Record<string, IndustryProfile> = {
  manufacturing: manufacturingIndustryProfile,
  food: foodIndustryProfile,
  construction: constructionIndustryProfile,
};

export function getIndustryProfile(industryId: string): IndustryProfile | null {
  return industryProfiles[industryId] || null;
}

export function getIndustryList(): Array<{ id: string; name: string; description: string }> {
  return Object.values(industryProfiles).map(profile => ({
    id: profile.id,
    name: profile.name,
    description: profile.description,
  }));
}

export function getIndustrySystemPromptContext(industryId: string): string {
  const profile = getIndustryProfile(industryId);
  if (!profile) return '';

  const terminologyList = Object.entries(profile.terminology)
    .map(([term, def]) => `- **${term}**: ${def}`)
    .join('\n');

  const standardsList = profile.standards
    .map(s => `- ${s.code}: ${s.name}`)
    .join('\n');

  return `
## BRANSCHKONTEXT: ${profile.name.toUpperCase()}

### Företag
**${profile.company.name}**
${profile.company.description}

- **Anställda**: ${profile.company.employees}
- **Certifieringar**: ${profile.company.certifications.join(', ')}
- **Produkter/tjänster**: ${profile.company.products.join(', ')}
- **Anläggningar**: ${profile.company.facilities.join(', ')}

### Relevanta standarder
${standardsList}

### Branschterminologi
${terminologyList}

### Karaktärer på företaget
${profile.characters.map(c => `- **${c.name}** (${c.title}): ${c.personality}`).join('\n')}
`;
}
