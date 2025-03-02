import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const jsonFilePath = path.resolve('./src/data/usersays.json');

export async function GET(req: NextRequest) {
  try {
    const data = fs.readFileSync(jsonFilePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const updatedData = await req.json();
    fs.writeFileSync(jsonFilePath, JSON.stringify(updatedData, null, 2));
    return NextResponse.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error writing file:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}
