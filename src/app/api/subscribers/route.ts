import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the path to the subscriber.json file
const jsonFilePath = path.resolve('./src/data/subscriber.json');

// Function to read the current subscribers from the JSON file
const readSubscribers = () => {
  try {
    const data = fs.readFileSync(jsonFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading subscribers:', error);
    return [];
  }
};

// Function to write subscribers to the JSON file
const writeSubscribers = (subscribers: any) => {
  try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(subscribers, null, 2));
  } catch (error) {
    console.error('Error writing subscribers:', error);
  }
};

// Handle GET requests to fetch subscribers
export async function GET() {
  try {
    const subscribers = readSubscribers();
    return NextResponse.json(subscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

// Handle DELETE requests to remove a subscriber
export async function DELETE(req: NextRequest) {
  try {
    const { index } = await req.json();
    const subscribers = readSubscribers();
    if (index >= 0 && index < subscribers.length) {
      subscribers.splice(index, 1);
      writeSubscribers(subscribers);
      return NextResponse.json({ message: 'Subscriber deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 });
  }
}

// Handle POST requests to add a new subscriber
export async function POST(req: NextRequest) {
  try {
    const newSubscriber = await req.json();
    const subscribers = readSubscribers();
    subscribers.push(newSubscriber);
    writeSubscribers(subscribers);
    return NextResponse.json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Error processing subscription:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
} 