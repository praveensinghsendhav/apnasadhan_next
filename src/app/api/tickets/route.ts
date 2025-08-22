import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the path to the ticket.json file
const jsonFilePath = path.resolve('./src/data/ticket.json');

// Function to read the current tickets from the JSON file
const readTickets = () => {
  try {
    const data = fs.readFileSync(jsonFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tickets:', error);
    return [];
  }
};

// Function to write tickets to the JSON file
const writeTickets = (tickets: any) => {
  try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(tickets, null, 2));
  } catch (error) {
    console.error('Error writing tickets:', error);
  }
};

// Handle GET requests to fetch tickets
export async function GET(req: NextRequest) {
  try {
    const tickets = readTickets();
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const download = searchParams.get('download');
    
    // If download parameter is present, return CSV data
    if (download === 'csv') {
      const csvHeaders = [
        'ID',
        'Name',
        'Email',
        'Phone',
        'Message',
        'Status',
        'Priority',
        'Created At'
      ];
      
      const csvRows = tickets.map((ticket: any) => [
        ticket.id || '',
        ticket.name || '',
        ticket.email || '',
        ticket.phone || '',
        ticket.message || '',
        ticket.status || 'pending',
        ticket.priority || 'medium',
        ticket.createdAt || ''
      ]);
      
      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="support-tickets.csv"'
        }
      });
    }
    
    // Regular pagination logic
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Apply pagination
    const totalCount = tickets.length;
    const paginatedTickets = tickets.slice(offset, offset + limit);
    
    return NextResponse.json({
      tickets: paginatedTickets,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

// Handle POST requests to add a new ticket
export async function POST(req: NextRequest) {
  try {
    const newTicket = await req.json();
    const tickets = readTickets();
    tickets.push(newTicket);
    writeTickets(tickets);
    return NextResponse.json({ message: 'Ticket submitted successfully' });
  } catch (error) {
    console.error('Error processing ticket submission:', error);
    return NextResponse.json({ error: 'Failed to submit ticket' }, { status: 500 });
  }
}

// Handle DELETE requests to remove a ticket
export async function DELETE(req: NextRequest) {
  try {
    const { index } = await req.json();
    const tickets = readTickets();
    if (index >= 0 && index < tickets.length) {
      tickets.splice(index, 1);
      writeTickets(tickets);
      return NextResponse.json({ message: 'Ticket deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return NextResponse.json({ error: 'Failed to delete ticket' }, { status: 500 });
  }
}
