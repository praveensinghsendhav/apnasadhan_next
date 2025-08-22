import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface WorkWithUs {
  id: string;
  carName: string;
  carCapacity: string;
  model: string;
  rate: string;
  city: string;
  contactNumber: string;
  ownerName: string;
  experience: string;
  carCondition: string;
  availability: string;
}

export async function GET(req: NextRequest) {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const filePath = path.join(dataDir, 'workwithus.json');

  try {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const workWithUsData = JSON.parse(fileContents);
      
      // Get query parameters
      const { searchParams } = new URL(req.url);
      const download = searchParams.get('download');
      
      // If download parameter is present, return CSV data
      if (download === 'csv') {
        const csvHeaders = [
          'ID',
          'Car Name',
          'Car Capacity',
          'Model',
          'Rate',
          'City',
          'Owner Name',
          'Contact Number',
          'Experience',
          'Car Condition',
          'Availability',
          'Status',
          'Created At'
        ];
        
        const csvRows = workWithUsData.map((entry: any) => [
          entry.id || '',
          entry.carName || '',
          entry.carCapacity || '',
          entry.model || '',
          entry.rate || '',
          entry.city || '',
          entry.ownerName || '',
          entry.contactNumber || '',
          entry.experience || '',
          entry.carCondition || '',
          entry.availability || '',
          entry.status || 'pending',
          entry.createdAt || ''
        ]);
        
        const csvContent = [
          csvHeaders.join(','),
          ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        return new NextResponse(csvContent, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="work-with-us.csv"'
          }
        });
      }
      
      // Regular pagination logic
      const limit = parseInt(searchParams.get('limit') || '10');
      const offset = parseInt(searchParams.get('offset') || '0');
      
      // Apply pagination
      const totalCount = workWithUsData.length;
      const paginatedData = workWithUsData.slice(offset, offset + limit);
      
      return NextResponse.json({
        workWithUsData: paginatedData,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount
        }
      });
    }
    return NextResponse.json({
      workWithUsData: [],
      pagination: {
        total: 0,
        limit: 10,
        offset: 0,
        hasMore: false
      }
    });
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
