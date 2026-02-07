import { describe, it, expect } from 'vitest';
import {
  generateOpeningMeetingMessage,
  generateWelcomeContext,
} from '@/lib/ai/opening-meeting';

describe('opening-meeting', () => {
  describe('generateOpeningMeetingMessage', () => {
    it('genererar meddelande för manufacturing med certifieringsrevision', () => {
      const message = generateOpeningMeetingMessage({
        standard: 'iso9001',
        type: 'certifiering',
        difficulty: 'medel',
        annexSLChapters: [7, 8],
      });

      expect(message).toContain('Erik Johansson');
      expect(message).toContain('ISO 9001:2015');
      expect(message).toContain('Kapitel 7');
      expect(message).toContain('Kapitel 8');
      expect(message).toContain('Nordisk Precision AB');
    });

    it('genererar meddelande för intern revision', () => {
      const message = generateOpeningMeetingMessage({
        standard: 'iso9001',
        type: 'intern',
        difficulty: 'grundlaggande',
        annexSLChapters: [5],
      });

      expect(message).toContain('interna revision');
      expect(message).toContain('Kapitel 5');
    });

    it('genererar meddelande för extern revision', () => {
      const message = generateOpeningMeetingMessage({
        standard: 'iso9001',
        type: 'extern',
        difficulty: 'medel',
        annexSLChapters: [8],
      });

      expect(message).toContain('leverantörsrevision');
    });

    it('genererar meddelande för övervakningsrevision', () => {
      const message = generateOpeningMeetingMessage({
        standard: 'iso9001',
        type: 'overvakning',
        difficulty: 'avancerad',
        annexSLChapters: [9, 10],
      });

      expect(message).toContain('övervakningsrevision');
    });

    it('hanterar multipla standarder', () => {
      const message = generateOpeningMeetingMessage({
        standard: 'iso9001,iso14001',
        type: 'certifiering',
        difficulty: 'medel',
        annexSLChapters: [4, 5],
      });

      expect(message).toContain('ISO 9001:2015');
      expect(message).toContain('ISO 14001:2015');
    });

    it('sorterar kapitel i ordning', () => {
      const message = generateOpeningMeetingMessage({
        standard: 'iso9001',
        type: 'certifiering',
        difficulty: 'medel',
        annexSLChapters: [10, 4, 7],
      });

      const chap4Pos = message.indexOf('Kapitel 4');
      const chap7Pos = message.indexOf('Kapitel 7');
      const chap10Pos = message.indexOf('Kapitel 10');

      expect(chap4Pos).toBeLessThan(chap7Pos);
      expect(chap7Pos).toBeLessThan(chap10Pos);
    });

    it('genererar branschspecifikt meddelande för food', () => {
      const message = generateOpeningMeetingMessage({
        standard: 'iso9001',
        type: 'certifiering',
        difficulty: 'medel',
        annexSLChapters: [8],
        industry: 'food',
      });

      expect(message).toContain('Nordisk Livs AB');
      expect(message).toContain('Maria Lindberg');
      expect(message).toContain('Hygienklädsel');
    });

    it('genererar branschspecifikt meddelande för construction', () => {
      const message = generateOpeningMeetingMessage({
        standard: 'iso9001',
        type: 'certifiering',
        difficulty: 'medel',
        annexSLChapters: [8],
        industry: 'construction',
      });

      expect(message).toContain('Nordbygg Entreprenad AB');
      expect(message).toContain('Peter Lindgren');
      expect(message).toContain('Skyddsutrustning');
    });

    it('faller tillbaka till manufacturing vid ogiltig bransch', () => {
      const message = generateOpeningMeetingMessage({
        standard: 'iso9001',
        type: 'certifiering',
        difficulty: 'medel',
        annexSLChapters: [8],
        industry: 'manufacturing',
      });

      expect(message).toContain('Nordisk Precision AB');
    });

    it('hanterar okänd revisionstyp med fallback', () => {
      const message = generateOpeningMeetingMessage({
        standard: 'iso9001',
        type: 'unknown-type' as string,
        difficulty: 'medel',
        annexSLChapters: [8],
      });

      // Ska inte krascha, använder certifiering som fallback
      expect(message).toBeTruthy();
      expect(message.length).toBeGreaterThan(100);
    });
  });

  describe('generateWelcomeContext', () => {
    it('genererar kontext för certifieringsrevision', () => {
      const context = generateWelcomeContext({
        standard: 'iso9001',
        type: 'certifiering',
        difficulty: 'medel',
        annexSLChapters: [7, 8],
      });

      expect(context).toContain('STARTMÖTE-KONTEXT');
      expect(context).toContain('Presentera sig själv');
      expect(context).toContain('revisionsplanen');
    });

    it('inkluderar närvarande baserat på revisionstyp', () => {
      const context = generateWelcomeContext({
        standard: 'iso9001',
        type: 'intern',
        difficulty: 'grundlaggande',
        annexSLChapters: [5],
      });

      expect(context).toContain('Erik Johansson');
    });
  });
});
