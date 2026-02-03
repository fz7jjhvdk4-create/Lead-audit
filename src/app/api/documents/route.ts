import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  companyDocuments,
  getDocumentsByChapter,
  getDocumentById,
  searchDocuments,
} from '@/lib/documents/company-documents';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Ej autentiserad' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const chapter = searchParams.get('chapter');
    const query = searchParams.get('query');

    // Hämta specifikt dokument
    if (id) {
      const document = getDocumentById(id);
      if (!document) {
        return NextResponse.json({ error: 'Dokument hittades inte' }, { status: 404 });
      }
      return NextResponse.json(document);
    }

    // Filtrera på kapitel
    if (chapter) {
      const chapterNum = parseInt(chapter, 10);
      if (isNaN(chapterNum) || chapterNum < 4 || chapterNum > 10) {
        return NextResponse.json({ error: 'Ogiltigt kapitel' }, { status: 400 });
      }
      const documents = getDocumentsByChapter(chapterNum);
      return NextResponse.json(documents);
    }

    // Sök dokument
    if (query) {
      const documents = searchDocuments(query);
      return NextResponse.json(documents);
    }

    // Returnera alla dokument (bara metadata, inte innehåll)
    const documentList = companyDocuments.map(({ id, title, type, category, annexSLChapter, revision, lastUpdated }) => ({
      id,
      title,
      type,
      category,
      annexSLChapter,
      revision,
      lastUpdated,
    }));

    return NextResponse.json(documentList);
  } catch (error) {
    console.error('Documents API error:', error);
    return NextResponse.json({ error: 'Kunde inte hämta dokument' }, { status: 500 });
  }
}
