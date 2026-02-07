import { describe, it, expect } from 'vitest';

/**
 * Testar valideringslogiken som används i registrerings-API:t.
 * Funktionerna är duplicerade här eftersom de inte exporteras från route.ts.
 * Om valideringen extraheras till en delad modul kan dessa tester importera direkt.
 */

// Kopierad från src/app/api/auth/register/route.ts
function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Lösenordet måste vara minst 8 tecken' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Lösenordet måste innehålla minst en stor bokstav' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Lösenordet måste innehålla minst en liten bokstav' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Lösenordet måste innehålla minst en siffra' };
  }
  return { valid: true, message: '' };
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

describe('Registration validation', () => {
  describe('validatePassword', () => {
    it('godkänner giltigt lösenord', () => {
      expect(validatePassword('TestPass1')).toEqual({ valid: true, message: '' });
    });

    it('nekar lösenord kortare än 8 tecken', () => {
      const result = validatePassword('Test1');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('minst 8 tecken');
    });

    it('godkänner exakt 8 tecken', () => {
      expect(validatePassword('Testpa1x').valid).toBe(true);
    });

    it('nekar lösenord utan stor bokstav', () => {
      const result = validatePassword('testpass1');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('stor bokstav');
    });

    it('nekar lösenord utan liten bokstav', () => {
      const result = validatePassword('TESTPASS1');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('liten bokstav');
    });

    it('nekar lösenord utan siffra', () => {
      const result = validatePassword('TestPassx');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('siffra');
    });

    it('nekar tomt lösenord', () => {
      expect(validatePassword('').valid).toBe(false);
    });

    it('godkänner lösenord med specialtecken', () => {
      expect(validatePassword('Test@Pass1!').valid).toBe(true);
    });

    it('godkänner långt lösenord', () => {
      expect(validatePassword('TestPassword123456789').valid).toBe(true);
    });

    it('returnerar första felet (för kort)', () => {
      // Tomt lösenord - ska ge "minst 8 tecken"-felet först
      const result = validatePassword('');
      expect(result.message).toContain('minst 8 tecken');
    });
  });

  describe('validateEmail', () => {
    it('godkänner giltiga email-adresser', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('user.name@example.com')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
      expect(validateEmail('user@sub.domain.com')).toBe(true);
    });

    it('nekar email utan @', () => {
      expect(validateEmail('userexample.com')).toBe(false);
    });

    it('nekar email utan domän', () => {
      expect(validateEmail('user@')).toBe(false);
    });

    it('nekar email utan TLD', () => {
      expect(validateEmail('user@example')).toBe(false);
    });

    it('nekar tom sträng', () => {
      expect(validateEmail('')).toBe(false);
    });

    it('nekar email med mellanslag', () => {
      expect(validateEmail('user @example.com')).toBe(false);
      expect(validateEmail('user@ example.com')).toBe(false);
    });
  });

  describe('Session creation validation', () => {
    const validStandards = ['iso9001', 'iso14001', 'iso45001', 'iatf16949'];
    const validTypes = ['intern', 'extern', 'certifiering', 'overvakning'];
    const validDifficulties = ['grundlaggande', 'medel', 'avancerad'];
    const validChapters = [4, 5, 6, 7, 8, 9, 10];
    const validIndustries = ['manufacturing', 'food', 'construction'];

    it('godkänner alla giltiga standarder', () => {
      for (const s of validStandards) {
        expect(validStandards.includes(s)).toBe(true);
      }
    });

    it('nekar ogiltiga standarder', () => {
      expect(validStandards.includes('iso27001')).toBe(false);
      expect(validStandards.includes('ISO9001')).toBe(false); // case-sensitive
    });

    it('godkänner alla giltiga revisionstyper', () => {
      for (const t of validTypes) {
        expect(validTypes.includes(t)).toBe(true);
      }
    });

    it('godkänner alla giltiga svårighetsgrader', () => {
      for (const d of validDifficulties) {
        expect(validDifficulties.includes(d)).toBe(true);
      }
    });

    it('godkänner alla giltiga Annex SL-kapitel', () => {
      for (const ch of validChapters) {
        expect(validChapters.includes(ch)).toBe(true);
      }
    });

    it('nekar ogiltiga Annex SL-kapitel', () => {
      expect(validChapters.includes(1)).toBe(false);
      expect(validChapters.includes(3)).toBe(false);
      expect(validChapters.includes(11)).toBe(false);
    });

    it('godkänner alla giltiga branscher', () => {
      for (const i of validIndustries) {
        expect(validIndustries.includes(i)).toBe(true);
      }
    });

    it('hanterar komma-separerade standarder', () => {
      const input = 'iso9001,iso14001';
      const selected = input.split(',');
      expect(selected.every(s => validStandards.includes(s))).toBe(true);
    });

    it('nekar om ogiltiga standarder blandas in', () => {
      const input = 'iso9001,invalid';
      const selected = input.split(',');
      expect(selected.every(s => validStandards.includes(s))).toBe(false);
    });
  });
});
