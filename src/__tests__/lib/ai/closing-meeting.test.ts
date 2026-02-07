import { describe, it, expect } from 'vitest';
import {
  isClosingMeetingRequest,
  generateClosingMeetingContext,
  generateClosingMeetingResponse,
} from '@/lib/ai/closing-meeting';

describe('closing-meeting', () => {
  describe('isClosingMeetingRequest', () => {
    it('identifierar "slutmöte"', () => {
      expect(isClosingMeetingRequest('Jag vill hålla slutmöte')).toBe(true);
    });

    it('identifierar "avsluta revisionen"', () => {
      expect(isClosingMeetingRequest('Nu vill jag avsluta revisionen')).toBe(true);
    });

    it('identifierar "sammanfatta"', () => {
      expect(isClosingMeetingRequest('Kan vi sammanfatta?')).toBe(true);
    });

    it('identifierar "presentera fynd"', () => {
      expect(isClosingMeetingRequest('Jag vill presentera fynd')).toBe(true);
    });

    it('identifierar "mina iakttagelser"', () => {
      expect(isClosingMeetingRequest('Här är mina iakttagelser')).toBe(true);
    });

    it('identifierar "closing meeting" (engelska)', () => {
      expect(isClosingMeetingRequest('I want a closing meeting')).toBe(true);
    });

    it('identifierar "vi är klara"', () => {
      expect(isClosingMeetingRequest('Nu tycker jag vi är klara')).toBe(true);
    });

    it('är case-insensitive', () => {
      expect(isClosingMeetingRequest('SLUTMÖTE')).toBe(true);
      expect(isClosingMeetingRequest('Slutmöte')).toBe(true);
    });

    it('returnerar false för vanliga frågor', () => {
      expect(isClosingMeetingRequest('Berätta om er kvalitetspolicy')).toBe(false);
      expect(isClosingMeetingRequest('Kan jag se dokumentet?')).toBe(false);
      expect(isClosingMeetingRequest('Hur hanterar ni avvikelser?')).toBe(false);
    });
  });

  describe('generateClosingMeetingContext', () => {
    it('innehåller slutmöte-information', () => {
      const context = generateClosingMeetingContext();
      expect(context).toContain('SLUTMÖTE');
      expect(context).toContain('Erik Johansson');
    });

    it('beskriver reaktioner på fynd', () => {
      const context = generateClosingMeetingContext();
      expect(context).toContain('korrekta avvikelser');
      expect(context).toContain('felaktiga avvikelser');
      expect(context).toContain('missat avvikelser');
    });
  });

  describe('generateClosingMeetingResponse', () => {
    it('inkluderar VD för certifieringsrevision', () => {
      const response = generateClosingMeetingResponse('certifiering');
      expect(response).toContain('Anna Lindqvist (VD)');
      expect(response).toContain('Erik Johansson');
    });

    it('inkluderar VD för extern revision', () => {
      const response = generateClosingMeetingResponse('extern');
      expect(response).toContain('Anna Lindqvist (VD)');
    });

    it('har färre deltagare vid intern revision', () => {
      const response = generateClosingMeetingResponse('intern');
      expect(response).toContain('Erik Johansson');
      expect(response).not.toContain('Lisa Bergström');
    });

    it('hanterar övervakningsrevision', () => {
      const response = generateClosingMeetingResponse('overvakning');
      expect(response).toContain('Erik Johansson');
    });

    it('faller tillbaka till certifiering vid okänd typ', () => {
      const response = generateClosingMeetingResponse('unknown');
      expect(response).toContain('Anna Lindqvist (VD)');
    });

    it('innehåller konferensrum och tidsangivelse', () => {
      const response = generateClosingMeetingResponse('certifiering');
      expect(response).toContain('Konferensrum Eken');
    });
  });
});
