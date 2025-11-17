
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const habitId = Number(id);

    if (Number.isNaN(habitId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit) {
      return NextResponse.json(
        { error: 'Habit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(habit, { status: 200 });
  } catch (error) {
    console.error('GET /api/habits/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch habit', details: error },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const habitId = Number(id);

    if (Number.isNaN(habitId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, completedDays } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      name,
      description: description || '',
    };

  
    if (typeof completedDays === 'number') {
      updateData.completedDays = completedDays;
    }

    const habit = await prisma.habit.update({
      where: { id: habitId },
      data: updateData,
    });

    return NextResponse.json(habit, { status: 200 });
  } catch (error: any) {
    console.error('PUT /api/habits/[id] error:', error);
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Habit not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update habit', details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const habitId = Number(id);

    if (Number.isNaN(habitId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    await prisma.habit.delete({
      where: { id: habitId },
    });

    return NextResponse.json(
      { success: true, message: 'Habit deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE /api/habits/[id] error:', error);
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Habit not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete habit', details: error },
      { status: 500 }
    );
  }
}