import { describe, it, expect } from 'vitest';
import {
  companyDocuments,
  getDocumentsByChapter,
  getDocumentsWithDeficiencies,
  searchDocuments,
  getDocumentById,
} from '@/lib/documents/company-documents';

describe('company-documents', () => {
  describe('companyDocuments', () => {
    it('innehåller dokument', () => {
      expect(companyDocuments.length).toBeGreaterThan(0);
    });

    it('varje dokument har obligatoriska fält', () => {
      for (const doc of companyDocuments) {
        expect(doc.id).toBeTruthy();
        expect(doc.title).toBeTruthy();
        expect(doc.type).toBeTruthy();
        expect(doc.category).toBeTruthy();
        expect(doc.annexSLChapter).toBeGreaterThanOrEqual(4);
        expect(doc.annexSLChapter).toBeLessThanOrEqual(10);
        expect(doc.revision).toBeTruthy();
        expect(doc.lastUpdated).toBeTruthy();
        expect(doc.approvedBy).toBeTruthy();
        expect(doc.content).toBeTruthy();
      }
    });

    it('har unika id:n', () => {
      const ids = companyDocuments.map(d => d.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('har giltiga dokumenttyper', () => {
      const validTypes = ['policy', 'procedure', 'register', 'chart', 'report', 'form', 'matrix'];
      for (const doc of companyDocuments) {
        expect(validTypes).toContain(doc.type);
      }
    });
  });

  describe('getDocumentsByChapter', () => {
    it('returnerar dokument för kapitel 4', () => {
      const docs = getDocumentsByChapter(4);
      expect(docs.length).toBeGreaterThan(0);
      for (const doc of docs) {
        expect(doc.annexSLChapter).toBe(4);
      }
    });

    it('returnerar dokument för kapitel 7', () => {
      const docs = getDocumentsByChapter(7);
      expect(docs.length).toBeGreaterThan(0);
      for (const doc of docs) {
        expect(doc.annexSLChapter).toBe(7);
      }
    });

    it('returnerar tom lista för ogiltigt kapitel', () => {
      expect(getDocumentsByChapter(1)).toEqual([]);
      expect(getDocumentsByChapter(11)).toEqual([]);
    });
  });

  describe('getDocumentsWithDeficiencies', () => {
    it('returnerar dokument med brister', () => {
      const docs = getDocumentsWithDeficiencies();
      expect(docs.length).toBeGreaterThan(0);
      for (const doc of docs) {
        expect(doc.hasDeficiency).toBe(true);
      }
    });

    it('alla dokument med brister har beskrivning', () => {
      const docs = getDocumentsWithDeficiencies();
      for (const doc of docs) {
        expect(doc.deficiencyDescription).toBeTruthy();
      }
    });
  });

  describe('searchDocuments', () => {
    it('hittar dokument via titel', () => {
      const firstDoc = companyDocuments[0];
      const titleWord = firstDoc.title.split(' ')[0];
      const results = searchDocuments(titleWord);
      expect(results.length).toBeGreaterThan(0);
    });

    it('söker case-insensitivt', () => {
      const results1 = searchDocuments('kvalitet');
      const results2 = searchDocuments('KVALITET');
      expect(results1.length).toBe(results2.length);
    });

    it('hittar dokument via kategori', () => {
      const firstDoc = companyDocuments[0];
      const results = searchDocuments(firstDoc.category);
      expect(results.length).toBeGreaterThan(0);
    });

    it('hittar dokument via innehåll', () => {
      const results = searchDocuments('Nordisk Precision');
      expect(results.length).toBeGreaterThan(0);
    });

    it('returnerar tom lista vid ingen träff', () => {
      const results = searchDocuments('xyznonexistent123');
      expect(results).toEqual([]);
    });
  });

  describe('getDocumentById', () => {
    it('returnerar dokument med giltigt id', () => {
      const doc = getDocumentById('DOC-001');
      expect(doc).toBeDefined();
      expect(doc?.id).toBe('DOC-001');
    });

    it('returnerar undefined för ogiltigt id', () => {
      expect(getDocumentById('INVALID')).toBeUndefined();
      expect(getDocumentById('')).toBeUndefined();
    });

    it('returnerar komplett dokument med innehåll', () => {
      const doc = getDocumentById('DOC-001');
      expect(doc?.content).toBeTruthy();
      expect(doc?.title).toBeTruthy();
    });
  });
});
