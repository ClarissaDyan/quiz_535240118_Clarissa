// app/api/habits/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/habits -> ambil semua habits
export async function GET() {
  try {
    const habits = await prisma.habit.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(habits, { status: 200 });
  } catch (error) {
    console.error('GET /api/habits error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch habits', details: error },
      { status: 500 },
    );
  }
}

// POST /api/habits -> buat habit baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 },
      );
    }

    const habit = await prisma.habit.create({
      data: {
        name,
        description: description || '',
        completedDays: 0,
      },
    });

    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    console.error('POST /api/habits error:', error);
    return NextResponse.json(
      { error: 'Failed to create habit', details: error },
      { status: 500 },
    );
  }
}