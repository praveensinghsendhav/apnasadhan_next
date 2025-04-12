import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface WorkWithUs {
  carName: string;
  carCapacity: string;
  model: string;
  rate: string;
  city: string;
  contactNumber: string;
}

export async function GET() {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const filePath = path.join(dataDir, 'workwithus.json');

  try {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const workWithUsData = JSON.parse(fileContents);
      return NextResponse.json(workWithUsData);
    }
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const filePath = path.join(dataDir, 'workwithus.json');

  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const newWorkWithUsData: any = await req.json();

    if (!Array.isArray(newWorkWithUsData)) {

      let currentData: WorkWithUs[] = [];

      // Check if the file exists and has content
      if (fs.existsSync(filePath)) {
        const fileContents = fs.readFileSync(filePath, 'utf-8');
        if (fileContents.trim() !== '') {
          currentData = JSON.parse(fileContents);
        }
      }

      currentData.push(newWorkWithUsData);

      fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2));
    } else {
      // Directly write the new bookings array to the file
      fs.writeFileSync(filePath, JSON.stringify(newWorkWithUsData, null, 2));
    }
    return NextResponse.json({ message: 'Data replaced successfully' });

  } catch (error) {
    console.error('Error writing file:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}
