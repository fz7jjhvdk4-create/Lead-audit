import { describe, it, expect } from 'vitest';
import {
  getIndustryProfile,
  getIndustryList,
  getIndustrySystemPromptContext,
  industryProfiles,
  foodIndustryProfile,
  constructionIndustryProfile,
  manufacturingIndustryProfile,
} from '@/lib/ai/industry-profiles';

describe('industry-profiles', () => {
  describe('getIndustryProfile', () => {
    it('returnerar profil för manufacturing', () => {
      const profile = getIndustryProfile('manufacturing');
      expect(profile).not.toBeNull();
      expect(profile?.id).toBe('manufacturing');
    });

    it('returnerar profil för food', () => {
      const profile = getIndustryProfile('food');
      expect(profile).not.toBeNull();
      expect(profile?.id).toBe('food');
      expect(profile?.company.name).toBe('Nordisk Livs AB');
    });

    it('returnerar profil för construction', () => {
      const profile = getIndustryProfile('construction');
      expect(profile).not.toBeNull();
      expect(profile?.id).toBe('construction');
      expect(profile?.company.name).toBe('Nordbygg Entreprenad AB');
    });

    it('returnerar null för ogiltig bransch', () => {
      expect(getIndustryProfile('healthcare')).toBeNull();
      expect(getIndustryProfile('')).toBeNull();
    });
  });

  describe('getIndustryList', () => {
    it('returnerar alla branscher', () => {
      const list = getIndustryList();
      expect(list).toHaveLength(3);
    });

    it('innehåller id, name och description för varje bransch', () => {
      const list = getIndustryList();
      for (const item of list) {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('description');
        expect(item.id).toBeTruthy();
        expect(item.name).toBeTruthy();
        expect(item.description).toBeTruthy();
      }
    });
  });

  describe('getIndustrySystemPromptContext', () => {
    it('returnerar tom sträng för ogiltig bransch', () => {
      expect(getIndustrySystemPromptContext('unknown')).toBe('');
    });

    it('inkluderar företagsnamn i kontexten', () => {
      const context = getIndustrySystemPromptContext('food');
      expect(context).toContain('Nordisk Livs AB');
    });

    it('inkluderar terminologi', () => {
      const context = getIndustrySystemPromptContext('food');
      expect(context).toContain('HACCP');
      expect(context).toContain('CCP');
    });

    it('inkluderar karaktärer', () => {
      const context = getIndustrySystemPromptContext('food');
      expect(context).toContain('Maria Lindberg');
    });

    it('inkluderar certifieringar', () => {
      const context = getIndustrySystemPromptContext('construction');
      expect(context).toContain('ISO 9001:2015');
      expect(context).toContain('ISO 45001:2018');
    });
  });

  describe('foodIndustryProfile', () => {
    it('har korrekt antal karaktärer', () => {
      expect(foodIndustryProfile.characters.length).toBeGreaterThanOrEqual(5);
    });

    it('har en quality_manager', () => {
      const qm = foodIndustryProfile.characters.find(c => c.role === 'quality_manager');
      expect(qm).toBeDefined();
      expect(qm?.name).toBe('Maria Lindberg');
    });

    it('har dokument med deficiencies', () => {
      for (const doc of foodIndustryProfile.documents) {
        expect(doc.id).toBeTruthy();
        expect(doc.name).toBeTruthy();
        expect(doc.content).toBeTruthy();
      }
    });

    it('har deficiencies med rätt svårighetsgrader', () => {
      const validDifficulties = ['grundlaggande', 'medel', 'avancerad'];
      for (const def of foodIndustryProfile.deficiencies) {
        expect(validDifficulties).toContain(def.difficulty);
      }
    });

    it('har deficiencies med giltiga Annex SL-kapitel', () => {
      for (const def of foodIndustryProfile.deficiencies) {
        expect(def.annexSLChapter).toBeGreaterThanOrEqual(4);
        expect(def.annexSLChapter).toBeLessThanOrEqual(10);
      }
    });

    it('har deficiencies med giltiga typer', () => {
      const validTypes = ['major', 'minor', 'observation'];
      for (const def of foodIndustryProfile.deficiencies) {
        expect(validTypes).toContain(def.type);
      }
    });
  });

  describe('constructionIndustryProfile', () => {
    it('har en quality_manager', () => {
      const qm = constructionIndustryProfile.characters.find(c => c.role === 'quality_manager');
      expect(qm).toBeDefined();
      expect(qm?.name).toBe('Peter Lindgren');
    });

    it('har en hse_manager', () => {
      const hse = constructionIndustryProfile.characters.find(c => c.role === 'hse_manager');
      expect(hse).toBeDefined();
    });

    it('har bygg-specifik terminologi', () => {
      expect(constructionIndustryProfile.terminology).toHaveProperty('BAS-U');
      expect(constructionIndustryProfile.terminology).toHaveProperty('AMP');
      expect(constructionIndustryProfile.terminology).toHaveProperty('UE');
    });
  });

  describe('industryProfiles registry', () => {
    it('innehåller alla tre branscher', () => {
      expect(Object.keys(industryProfiles)).toEqual(
        expect.arrayContaining(['manufacturing', 'food', 'construction'])
      );
    });

    it('varje profil har ett unikt id', () => {
      const ids = Object.values(industryProfiles).map(p => p.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });
});
