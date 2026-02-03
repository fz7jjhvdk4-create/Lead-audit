import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStandardSpecificFindings } from '@/lib/ai/multistandard-context';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function generateFeedbackPrompt(standards: string[]): string {
  const selectedStandards = standards;
  const additionalFindings = getStandardSpecificFindings(selectedStandards);

  const standardSpecificSection = additionalFindings.length > 0 ? `

### Standardspecifika avvikelser
${additionalFindings.map(f => `- ${f}`).join('\n')}
` : '';

  return `Du är en erfaren bedömare av revisorsträning enligt ISO 19011:2018.
Analysera revisionskonversationen och ge en detaljerad bedömning av revisorns prestation.

## BEDÖMNINGSKRITERIER ENLIGT ISO 19011

### 1. Revisionsprinciper (ISO 19011:2018, kapitel 4)
Bedöm om revisorn visar:
- **Integritet**: Utför arbetet ärligt, ansvarsfullt och opartiskt
- **Opartiskhet**: Rapporterar sanningsenligt och korrekt
- **Professionalism**: Visar kompetens och yrkesskicklighet
- **Konfidentialitet**: Hanterar information korrekt
- **Oberoende**: Agerar fritt från partiskhet och intressekonflikt
- **Faktabaserat förhållningssätt**: Baserar slutsatser på verifierbara bevis
- **Riskbaserat tänkande**: Identifierar och prioriterar risker

### 2. Frågeteknik
Bedöm revisorns förmåga att:
- Ställa **öppna frågor** (vad, hur, varför, vem, när)
- Använda **fördjupningsfrågor** för att förstå orsaker
- Följa en **logisk sekvens** från övergripande till detaljerat
- Undvika **ledande frågor** som förutsätter svar
- Praktisera **aktivt lyssnande** och bygga vidare på svar

### 3. Standardkunskap
Bedöm revisorns:
- Korrekta referenser till **specifika standardkrav** (kapitel, krav)
- Förståelse för **processansatsen** och PDCA-cykeln
- Tillämpning av **riskbaserat tänkande**
- Förmåga att se **kopplingar mellan krav** och processer
- Kunskap om **Annex SL-strukturen** (kapitel 4-10)

### 4. Bevisinhämtning
Bedöm revisorns förmåga att:
- Samla **objektiva bevis** (inte antaganden)
- Använda **triangulering** (dokument + intervju + observation)
- Granska **dokument** kritiskt (giltighet, revision, godkännande)
- Göra **observationer** på plats (om tillämpligt)
- Koppla bevis till **specifika krav**

### 5. Avvikelseklassificering
Bedöm om revisorn kan:
- Skilja mellan **större avvikelse** (systemfel, total frånvaro av krav)
- Identifiera **mindre avvikelse** (enstaka brister, delvis efterlevnad)
- Notera **förbättringsmöjligheter** (god praxis som saknas)
- Formulera avvikelser med **krav + bevis + slutsats**

### 6. Kommunikation
Bedöm revisorns:
- **Tydlighet** i frågor och uttalanden
- **Respekt** och professionellt bemötande
- Förmåga att **förklara syfte** med frågor
- **Sammanfattning** av information för bekräftelse
- **Bekräftelse av förståelse** innan avslut

### 7. Startmöte (om genomfört)
Bedöm om revisorn:
- Presenterade sig och sin roll
- Bekräftade revisionsomfattning och mål
- Gick igenom revisionsplanen
- Förklarade hur avvikelser rapporteras
- Frågade om det fanns frågor

### 8. Slutmöte (om genomfört)
Bedöm om revisorn:
- Sammanfattade revisionen
- Presenterade fynd tydligt och strukturerat
- Gav företaget möjlighet att kommentera
- Förklarade nästa steg
- Tackade för samarbetet

## POÄNGSKALA 1-5

1 = **Otillräcklig** - Uppfyller inte grundläggande krav, betydande brister
2 = **Under förväntan** - Uppfyller delvis krav men med påtagliga brister
3 = **Godkänd** - Uppfyller grundläggande krav, viss förbättringspotential
4 = **Bra** - Uppfyller krav väl med mindre förbättringsmöjligheter
5 = **Utmärkt** - Uppfyller alla krav på hög nivå, god praxis

## AVVIKELSER I DENNA SESSION

Följande avvikelser fanns i scenariot som revisorn kunde ha upptäckt:
- Intressentanalys inte uppdaterad på över 1 år (kap 4.2)
- Kvalitetspolicy från 2022 saknar aktuella fokusområden (kap 5.2)
- Kundreklamationer över target (0.7% vs mål 0.5%) (kap 6.2)
- Högriskåtgärd utan deadline (kap 6.1)
- Nyanställd Henrik Lund saknar dokumenterad utbildning (kap 7.2)
- Förfallen kalibrering på toleranstolk MÄT-008 (kap 7.1.5)
- Cpk under krav på kontrollplan (kap 8.5)
- Leverantör inte godkänd/utvärderad (kap 8.4)
- Internrevision av inköp ej genomförd enligt plan (kap 9.2)
- Korrigerande åtgärder ej verifierade inom deadline (kap 10.2)
${standardSpecificSection}
Svara ENDAST med giltig JSON i följande format:
{
  "revisionPrinciples": <1-5>,
  "questionTechnique": <1-5>,
  "standardKnowledge": <1-5>,
  "evidenceCollection": <1-5>,
  "nonconformityClass": <1-5 eller null om ej tillämpligt>,
  "communication": <1-5>,
  "openingMeeting": <1-5 eller null om ej genomfört>,
  "closingMeeting": <1-5 eller null om ej genomfört>,
  "overallScore": <1-5 viktat genomsnitt>,
  "strengths": ["styrka 1", "styrka 2", ...],
  "developmentAreas": ["utvecklingsområde 1", "utvecklingsområde 2", ...],
  "missedFindings": ["kort beskrivning av avvikelse som missades", ...],
  "alternativeStrategies": ["förslag på alternativ fråga eller strategi", ...],
  "isoReferences": ["ISO 19011:2018 referens för förbättring", ...],
  "summary": "Sammanfattande bedömning på 2-3 meningar"
}`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Ej autentiserad' }, { status: 401 });
    }

    // Hämta träningssessionen
    const trainingSession = await prisma.trainingSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        feedback: true,
      },
    });

    if (!trainingSession) {
      return NextResponse.json({ error: 'Session hittades inte' }, { status: 404 });
    }

    if (trainingSession.userId !== session.user.id) {
      return NextResponse.json({ error: 'Ingen behörighet' }, { status: 403 });
    }

    if (trainingSession.completedAt) {
      return NextResponse.json({ error: 'Sessionen är redan avslutad' }, { status: 400 });
    }

    if (trainingSession.messages.length < 2) {
      return NextResponse.json(
        { error: 'Sessionen behöver fler meddelanden för att kunna bedömas' },
        { status: 400 }
      );
    }

    // Bygg konversationen för bedömning
    const conversationText = trainingSession.messages
      .map(m => `${m.role === 'user' ? 'REVISOR' : 'FÖRETAG'}: ${m.content}`)
      .join('\n\n');

    const contextInfo = `
Sessionskonfiguration:
- Standard: ${trainingSession.standard}
- Revisionstyp: ${trainingSession.type}
- Svårighetsgrad: ${trainingSession.difficulty}
- Annex SL-kapitel: ${trainingSession.annexSLChapters.join(', ')}

Konversation:
${conversationText}
`;

    // Generera feedbackprompt baserat på valda standarder
    const selectedStandards = trainingSession.standard.split(',');
    const feedbackPrompt = generateFeedbackPrompt(selectedStandards);

    // Anropa Claude för bedömning
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: feedbackPrompt,
      messages: [
        {
          role: 'user',
          content: contextInfo,
        },
      ],
    });

    // Extrahera textinnehållet
    const textContent = response.content.find(c => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('Inget textsvar från AI');
    }

    // Parsa JSON från svaret
    let feedbackData;
    try {
      // Försök hitta JSON i svaret
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Kunde inte hitta JSON i svaret');
      }
      feedbackData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, textContent.text);
      // Fallback med grundläggande feedback
      feedbackData = {
        revisionPrinciples: 3,
        questionTechnique: 3,
        standardKnowledge: 3,
        evidenceCollection: 3,
        nonconformityClass: null,
        communication: 3,
        openingMeeting: null,
        closingMeeting: null,
        overallScore: 3,
        strengths: ['Genomförde revisionen'],
        developmentAreas: ['Kunde inte generera detaljerad feedback'],
        missedFindings: [],
        alternativeStrategies: [],
        summary: 'Sessionen genomfördes. Tekniskt fel vid feedbackgenerering.',
      };
    }

    // Spara feedback i databasen
    const feedback = await prisma.sessionFeedback.create({
      data: {
        sessionId,
        revisionPrinciples: feedbackData.revisionPrinciples,
        questionTechnique: feedbackData.questionTechnique,
        standardKnowledge: feedbackData.standardKnowledge,
        evidenceCollection: feedbackData.evidenceCollection,
        nonconformityClass: feedbackData.nonconformityClass,
        communication: feedbackData.communication,
        openingMeeting: feedbackData.openingMeeting,
        closingMeeting: feedbackData.closingMeeting,
        overallScore: feedbackData.overallScore,
        strengths: feedbackData.strengths || [],
        developmentAreas: feedbackData.developmentAreas || [],
        missedFindings: feedbackData.missedFindings || [],
        alternativeStrategies: feedbackData.alternativeStrategies || [],
        isoReferences: feedbackData.isoReferences || [],
        summary: feedbackData.summary,
      },
    });

    // Markera sessionen som avslutad
    await prisma.trainingSession.update({
      where: { id: sessionId },
      data: { completedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error('Complete session error:', error);
    return NextResponse.json(
      { error: 'Kunde inte avsluta sessionen' },
      { status: 500 }
    );
  }
}
