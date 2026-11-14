import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    // Ping the database to verify live connection
    await db.command({ ping: 1 });
    
    return NextResponse.json({
      status: 'success',
      message: 'MongoDB Atlas-এর সাথে সফলভাবে কানেকশন স্থাপিত হয়েছে!',
      database: db.databaseName,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'MongoDB-তে কানেক্ট করতে ব্যর্থ হয়েছে।',
        error: error.message
      },
      { status: 500 }
    );
  }
}

