import { describe, it, expect } from 'vitest';
import {
  calculateHintPenalty,
  getHintUsageSummary,
  generateHintPrompt,
  hintLevels,
} from '@/lib/ai/hints-system';

describe('hints-system', () => {
  describe('hintLevels', () => {
    it('har tre nivåer', () => {
      expect(hintLevels).toHaveLength(3);
    });

    it('har nivåer 1, 2 och 3', () => {
      expect(hintLevels.map(h => h.level)).toEqual([1, 2, 3]);
    });
  });

  describe('calculateHintPenalty', () => {
    it('returnerar 0 när inga hints använts', () => {
      expect(calculateHintPenalty(0, 'grundlaggande')).toBe(0);
      expect(calculateHintPenalty(0, 'medel')).toBe(0);
      expect(calculateHintPenalty(0, 'avancerad')).toBe(0);
    });

    it('ger lägre penalty för grundläggande', () => {
      const penalty = calculateHintPenalty(1, 'grundlaggande');
      expect(penalty).toBeCloseTo(0.05);
    });

    it('ger medelhög penalty för medel', () => {
      const penalty = calculateHintPenalty(1, 'medel');
      expect(penalty).toBeCloseTo(0.1);
    });

    it('ger högre penalty för avancerad', () => {
      const penalty = calculateHintPenalty(1, 'avancerad');
      expect(penalty).toBeCloseTo(0.15);
    });

    it('skalas linjärt med antal hints', () => {
      expect(calculateHintPenalty(3, 'medel')).toBeCloseTo(0.3);
      expect(calculateHintPenalty(5, 'medel')).toBeCloseTo(0.5);
    });

    it('har max 1.0 i penalty', () => {
      expect(calculateHintPenalty(100, 'avancerad')).toBe(1.0);
      expect(calculateHintPenalty(20, 'grundlaggande')).toBe(1.0);
    });

    it('når max vid korrekt antal hints', () => {
      // avancerad: 0.15 * 7 = 1.05, capped at 1.0
      expect(calculateHintPenalty(7, 'avancerad')).toBe(1.0);
      // medel: 0.1 * 10 = 1.0
      expect(calculateHintPenalty(10, 'medel')).toBe(1.0);
    });
  });

  describe('getHintUsageSummary', () => {
    it('returnerar meddelande om hints ej aktiverade', () => {
      const summary = getHintUsageSummary(0, false);
      expect(summary).toContain('utan aktiverat hints-stöd');
    });

    it('returnerar positivt meddelande om 0 hints använda', () => {
      const summary = getHintUsageSummary(0, true);
      expect(summary).toContain('utan att använda några hints');
    });

    it('returnerar milt meddelande vid 1-2 hints', () => {
      const summary = getHintUsageSummary(1, true);
      expect(summary).toContain('1 hint');
      expect(summary).toContain('färre');
    });

    it('returnerar varning vid 3-5 hints', () => {
      const summary = getHintUsageSummary(4, true);
      expect(summary).toContain('4 hints');
      expect(summary).toContain('påverkade ditt betyg');
    });

    it('returnerar stark varning vid fler än 5 hints', () => {
      const summary = getHintUsageSummary(8, true);
      expect(summary).toContain('8 hints');
      expect(summary).toContain('stäng av dem helt');
    });
  });

  describe('generateHintPrompt', () => {
    const baseContext = {
      annexSLChapters: [7, 8],
      difficulty: 'medel',
      messageCount: 10,
      recentTopics: [],
      currentPhase: 'execution' as const,
    };

    it('inkluderar nivånummer i prompten', () => {
      const prompt = generateHintPrompt(1, baseContext);
      expect(prompt).toContain('Nivå 1');
    });

    it('inkluderar valda kapitel', () => {
      const prompt = generateHintPrompt(1, baseContext);
      expect(prompt).toContain('7, 8');
    });

    it('inkluderar svårighetsgrad', () => {
      const prompt = generateHintPrompt(1, baseContext);
      expect(prompt).toContain('medel');
    });

    it('inkluderar kapitelspecifika hints', () => {
      const prompt = generateHintPrompt(1, baseContext);
      expect(prompt).toContain('Kapitel 7');
      expect(prompt).toContain('Kapitel 8');
    });

    it('nivå 2 inkluderar förklaring', () => {
      const prompt = generateHintPrompt(2, baseContext);
      expect(prompt).toContain('Varför:');
    });

    it('nivå 3 inkluderar standardkoppling', () => {
      const prompt = generateHintPrompt(3, baseContext);
      expect(prompt).toContain('Standardkoppling:');
    });

    it('nivå 1 inkluderar inte förklaring', () => {
      const prompt = generateHintPrompt(1, baseContext);
      expect(prompt).not.toContain('Varför:');
    });

    it('hanterar opening-fasen', () => {
      const prompt = generateHintPrompt(1, {
        ...baseContext,
        currentPhase: 'opening',
      });
      expect(prompt).toContain('Startmöte');
    });

    it('hanterar closing-fasen', () => {
      const prompt = generateHintPrompt(1, {
        ...baseContext,
        currentPhase: 'closing',
      });
      expect(prompt).toContain('Slutmöte');
    });
  });
});
