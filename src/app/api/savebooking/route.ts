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

    const newBookings: Booking[] = await req.json();

    // Directly write the new bookings array to the file
    fs.writeFileSync(filePath, JSON.stringify(newBookings, null, 2));

    return NextResponse.json({ message: 'Data replaced successfully' });
  } catch (error) {
    console.error('Error writing file:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
} 