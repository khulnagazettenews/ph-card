import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

const DEFAULT_PRESET_ADS = [
  {
    title: 'Road Home',
    imageUrl: '/assets/ad_road_home.png',
    isDefault: true,
    createdAt: new Date('2026-01-01')
  },
  {
    title: 'ACI Water Pump',
    imageUrl: '/assets/ad_aci_water_pump.png',
    isDefault: true,
    createdAt: new Date('2026-01-02')
  },
  {
    title: 'ACI Smart Tools',
    imageUrl: '/assets/ad_aci_smart_tools.png',
    isDefault: true,
    createdAt: new Date('2026-01-03')
  }
];

// GET: Fetch all ads from MongoDB
export async function GET() {
  try {
    const db = await getDatabase();
    const adsCollection = db.collection('ads');

    let ads = await adsCollection.find({}).sort({ createdAt: -1 }).toArray();

    // If database is brand new and has no ads, seed the default preset ads
    if (!ads || ads.length === 0) {
      await adsCollection.insertMany(DEFAULT_PRESET_ADS);
      ads = await adsCollection.find({}).sort({ createdAt: -1 }).toArray();
    }

    const formattedAds = ads.map(ad => ({
      id: ad._id.toString(),
      title: ad.title || 'বিজ্ঞাপন',
      imageUrl: ad.imageUrl,
      isDefault: !!ad.isDefault,
      createdAt: ad.createdAt
    }));

    return NextResponse.json({ success: true, ads: formattedAds });
  } catch (error) {
    console.error('Error fetching ads from MongoDB:', error);
    return NextResponse.json(
      { success: false, message: 'বিজ্ঞাপন তালিকা লোড করতে ব্যর্থ হয়েছে', error: error.message },
      { status: 500 }
    );
  }
}

// POST: Save a new custom ad to MongoDB
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: 'ছবির ডাটা (imageUrl) প্রয়োজন' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const adsCollection = db.collection('ads');

    const newAd = {
      title: title?.trim() || `কাস্টম ব্যানার ${new Date().toLocaleDateString('bn-BD')}`,
      imageUrl,
      isDefault: false,
      createdAt: new Date()
    };

    const result = await adsCollection.insertOne(newAd);

    return NextResponse.json({
      success: true,
      message: 'বিজ্ঞাপন সফলভাবে ডাটাবেজে সংরক্ষণ করা হয়েছে!',
      ad: {
        id: result.insertedId.toString(),
        title: newAd.title,
        imageUrl: newAd.imageUrl,
        isDefault: false,
        createdAt: newAd.createdAt
      }
    });
  } catch (error) {
    console.error('Error saving ad to MongoDB:', error);
    return NextResponse.json(
      { success: false, message: 'বিজ্ঞাপন সংরক্ষণ করতে ব্যর্থ হয়েছে', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Remove an ad from MongoDB
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'বিজ্ঞাপনের ID প্রয়োজন' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const adsCollection = db.collection('ads');

    let deleteFilter;
    try {
      deleteFilter = { _id: new ObjectId(id) };
    } catch {
      deleteFilter = { _id: id };
    }

    const result = await adsCollection.deleteOne(deleteFilter);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'বিজ্ঞাপনটি খুঁজে পাওয়া যায়নি' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'বিজ্ঞাপনটি সফলভাবে ডাটাবেজ থেকে মুছে ফেলা হয়েছে!'
    });
  } catch (error) {
    console.error('Error deleting ad from MongoDB:', error);
    return NextResponse.json(
      { success: false, message: 'বিজ্ঞাপন মুছতে ব্যর্থ হয়েছে', error: error.message },
      { status: 500 }
    );
  }
}

