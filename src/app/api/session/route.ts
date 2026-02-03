import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Ej autentiserad' }, { status: 401 });
    }

    const body = await request.json();
    const { standard, type, difficulty, annexSLChapters } = body;

    // Validera input
    if (!standard || !type || !difficulty || !annexSLChapters || annexSLChapters.length === 0) {
      return NextResponse.json(
        { error: 'Alla fält måste fyllas i' },
        { status: 400 }
      );
    }

    // Validera standarder
    const validStandards = ['iso9001', 'iso14001', 'iso45001', 'iatf16949'];
    const selectedStandards = standard.split(',');
    if (!selectedStandards.every((s: string) => validStandards.includes(s))) {
      return NextResponse.json(
        { error: 'Ogiltig standard vald' },
        { status: 400 }
      );
    }

    // Validera revisionstyp
    const validTypes = ['intern', 'extern', 'certifiering', 'overvakning'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Ogiltig revisionstyp vald' },
        { status: 400 }
      );
    }

    // Validera svårighetsgrad
    const validDifficulties = ['grundlaggande', 'medel', 'avancerad'];
    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json(
        { error: 'Ogiltig svårighetsgrad vald' },
        { status: 400 }
      );
    }

    // Validera Annex SL-kapitel
    const validChapters = [4, 5, 6, 7, 8, 9, 10];
    if (!annexSLChapters.every((c: number) => validChapters.includes(c))) {
      return NextResponse.json(
        { error: 'Ogiltigt Annex SL-kapitel valt' },
        { status: 400 }
      );
    }

    // Skapa session i databasen
    const trainingSession = await prisma.trainingSession.create({
      data: {
        userId: session.user.id,
        standard,
        type,
        difficulty,
        annexSLChapters,
      },
    });

    return NextResponse.json({ sessionId: trainingSession.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Kunde inte skapa session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Ej autentiserad' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('id');

    if (sessionId) {
      // Hämta specifik session
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
        return NextResponse.json(
          { error: 'Session hittades inte' },
          { status: 404 }
        );
      }

      // Kontrollera att användaren äger sessionen
      if (trainingSession.userId !== session.user.id) {
        return NextResponse.json(
          { error: 'Ingen behörighet' },
          { status: 403 }
        );
      }

      return NextResponse.json(trainingSession);
    }

    // Hämta alla sessioner för användaren
    const sessions = await prisma.trainingSession.findMany({
      where: { userId: session.user.id },
      orderBy: { startedAt: 'desc' },
      include: {
        feedback: {
          select: { overallScore: true },
        },
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Kunde inte hämta sessioner' },
      { status: 500 }
    );
  }
}
