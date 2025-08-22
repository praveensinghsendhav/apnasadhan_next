import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const jsonFilePath = path.resolve('./src/data/usersays.json');

export async function GET(req: NextRequest) {
  try {
    const data = fs.readFileSync(jsonFilePath, 'utf-8');
    const userSays = JSON.parse(data);
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const download = searchParams.get('download');
    
    // If download parameter is present, return CSV data
    if (download === 'csv') {
      const csvHeaders = [
        'ID',
        'Name',
        'Designation',
        'Content',
        'Image URL',
        'Stars'
      ];
      
      const csvRows = userSays.map((userSay: any) => [
        userSay.id || '',
        userSay.name || '',
        userSay.designation || '',
        userSay.content || '',
        userSay.image || '',
        userSay.star || ''
      ]);
      
      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="user-testimonials.csv"'
        }
      });
    }
    
    // Regular pagination logic
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Apply pagination
    const totalCount = userSays.length;
    const paginatedUserSays = userSays.slice(offset, offset + limit);
    
    return NextResponse.json({
      userSays: paginatedUserSays,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });
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
