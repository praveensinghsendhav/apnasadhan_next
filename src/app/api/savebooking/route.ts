import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Booking {
  name: string;
  number: string;
  email?: string;
  pickupAddress: string;
  dropAddress: string;
  pickupDate: string;
}

export async function GET() {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const filePath = path.join(dataDir, 'bookings.json');

  try {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const bookings = JSON.parse(fileContents);
      // Sort by createdAt descending (newest first)
      bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return NextResponse.json(bookings);
    }
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const filePath = path.join(dataDir, 'bookings.json');

  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const newBookings: any = await req.json();

    if (!Array.isArray(newBookings)) {
      let currentData: Booking[] = [];

      // Check if the file exists and has content
      if (fs.existsSync(filePath)) {
        const fileContents = fs.readFileSync(filePath, 'utf-8');
        if (fileContents.trim() !== '') {
          currentData = JSON.parse(fileContents);
        }
      }

      currentData.push(newBookings);

      // Directly write the new bookings array to the file
      fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2));
    } else {
      fs.writeFileSync(filePath, JSON.stringify(newBookings, null, 2));
    }

    return NextResponse.json({ message: 'Data replaced successfully' });
  } catch (error) {
    console.error('Error writing file:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
} 