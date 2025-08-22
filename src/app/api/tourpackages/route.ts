import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const jsonFilePath = path.resolve('./src/data/tourpackages.json');

export async function GET(req: NextRequest) {
  try {
    console.log('Reading data from JSON file:', jsonFilePath);
    const data = fs.readFileSync(jsonFilePath, 'utf-8');
    const packages = JSON.parse(data);
    console.log('Data read successfully');
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const download = searchParams.get('download');
    
    // If download parameter is present, return CSV data
    if (download === 'csv') {
      const csvHeaders = [
        'Name',
        'Image URL',
        'City',
        'Instagram URL'
      ];
      
      const csvRows = packages.map((pkg: any) => [
        pkg.name || '',
        pkg.imageUrl || '',
        pkg.city || '',
        pkg.social?.instagram || ''
      ]);
      
      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="tour-packages.csv"'
        }
      });
    }
    
    // Regular pagination logic
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Apply pagination
    const totalCount = packages.length;
    const paginatedPackages = packages.slice(offset, offset + limit);
    
    return NextResponse.json({
      packages: paginatedPackages,
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