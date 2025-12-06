import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // 🧪 Hardcoded admin for local testing (disabled in production)
    if (process.env.NODE_ENV !== 'production' && email === 'admin@test.com') {
      const token = jwt.sign(
        { userId: 'dev-admin', email, role: 'ADMIN', name: 'Local Admin' },
        (process.env.JWT_SECRET as string) || 'dev-secret'
      );
      return NextResponse.json(
        { message: 'Login successful (dev override)', token, role: 'ADMIN' },
        { status: 200 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, role: true, passwordHash: true },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, name: user.name },
      (process.env.JWT_SECRET as string) || 'dev-secret'
    );

    return NextResponse.json(
      { message: 'Login successful', token, role: user.role },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
