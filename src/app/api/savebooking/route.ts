import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Booking {
  id: string;
  name: string;
  number: string;
  email?: string;
  pickupAddress: string;
  dropAddress: string;
  pickupDate: string;
  pickupTime: string;
  passengers: string;
  carType: string;
}

export async function GET(req: NextRequest) {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const filePath = path.join(dataDir, 'bookings.json');

  try {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const bookings = JSON.parse(fileContents);
      
      // Sort by createdAt descending (newest first)
      bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Get query parameters
      const { searchParams } = new URL(req.url);
      const download = searchParams.get('download');
      
      // If download parameter is present, return CSV data
      if (download === 'csv') {
        const csvHeaders = [
          'ID',
          'Name',
          'Phone Number',
          'Email',
          'Pickup Address',
          'Drop Address',
          'Pickup Date',
          'Pickup Time',
          'Passengers',
          'Car Type',
          'Status',
          'Price',
          'Created At'
        ];
        
        const csvRows = bookings.map((booking: any) => [
          booking.id || '',
          booking.name || '',
          booking.number || '',
          booking.email || '',
          booking.pickupAddress || '',
          booking.dropAddress || '',
          booking.pickupDate || '',
          booking.pickupTime || '',
          booking.passengers || '',
          booking.carType || '',
          booking.status || '',
          booking.price || '',
          booking.createdAt || ''
        ]);
        
        const csvContent = [
          csvHeaders.join(','),
          ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        return new NextResponse(csvContent, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="bookings.csv"'
          }
        });
      }
      
      // Regular pagination logic
      const limit = parseInt(searchParams.get('limit') || '10');
      const offset = parseInt(searchParams.get('offset') || '0');
      
      // Apply pagination
      const totalCount = bookings.length;
      const paginatedBookings = bookings.slice(offset, offset + limit);
      
      return NextResponse.json({
        bookings: paginatedBookings,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount
        }
      });
    }
    return NextResponse.json({
      bookings: [],
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