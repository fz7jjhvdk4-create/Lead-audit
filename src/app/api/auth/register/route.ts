import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

// Lösenordsvalidering: minst 8 tecken, stor/liten bokstav, siffra
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

// Email-validering
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validera input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Namn, email och lösenord krävs' },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Namnet måste vara minst 2 tecken' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Ogiltig email-adress' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Kolla om email redan finns
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'En användare med denna email finns redan' },
        { status: 400 }
      );
    }

    // Hasha lösenord
    const hashedPassword = await bcrypt.hash(password, 12);

    // Skapa användare
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: 'Användare skapad',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Ett fel uppstod vid registrering' },
      { status: 500 }
    );
  }
}
