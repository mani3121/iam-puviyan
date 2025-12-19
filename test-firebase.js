// Simple test to check Firebase connection
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, limit, addDoc } from 'firebase/firestore';

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdfO4C21ks3Zuf5qPY_QNOflCVrsRzECs",
  authDomain: "gogreen-d6100.firebaseapp.com",
  projectId: "gogreen-d6100",
  storageBucket: "gogreen-d6100.appspot.com",
  messagingSenderId: "298832040055",
  appId: "1:298832040055:android:e52d6a429b3c3078a3b672"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addSampleData() {
  try {
    console.log('Adding sample rewards data...');
    
    const sampleRewards = [
      {
        availableCoupons: "50",
        brandName: "EcoMart",
        deductPoints: 100,
        dislikeCount: 2,
        fullImage: "https://example.com/ec1.jpg",
        fullImageGreyed: "https://example.com/ec1-grey.jpg",
        howToClaim: ["Show app at checkout", "Scan QR code"],
        likeCount: 15,
        maxPerUser: 1,
        previewImage: "https://example.com/ec1-thumb.jpg",
        previewImageGreyed: "https://example.com/ec1-thumb-grey.jpg",
        rewardDetails: ["10% discount on eco-friendly products", "Valid on minimum purchase of $50"],
        rewardSubtitle: "Save on green shopping",
        rewardTitle: "EcoMart Discount",
        rewardType: "discount",
        status: "available",
        usefulnessScore: 4.5,
        validFrom: "2024-01-01",
        validTo: "2024-12-31",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        availableCoupons: "25",
        brandName: "Green Cafe",
        deductPoints: 75,
        dislikeCount: 1,
        fullImage: "https://example.com/cafe1.jpg",
        fullImageGreyed: "https://example.com/cafe1-grey.jpg",
        howToClaim: ["Show app at counter", "Use coupon code GREEN25"],
        likeCount: 8,
        maxPerUser: 2,
        previewImage: "https://example.com/cafe1-thumb.jpg",
        previewImageGreyed: "https://example.com/cafe1-thumb-grey.jpg",
        rewardDetails: ["Free coffee with any meal", "Valid for dine-in only"],
        rewardSubtitle: "Complimentary beverage",
        rewardTitle: "Free Coffee",
        rewardType: "freebie",
        status: "available",
        usefulnessScore: 4.2,
        validFrom: "2024-01-15",
        validTo: "2024-06-30",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        availableCoupons: "100",
        brandName: "EcoTransport",
        deductPoints: 200,
        dislikeCount: 0,
        fullImage: "https://example.com/trans1.jpg",
        fullImageGreyed: "https://example.com/trans1-grey.jpg",
        howToClaim: ["Book through app", "Apply promo code"],
        likeCount: 22,
        maxPerUser: 1,
        previewImage: "https://example.com/trans1-thumb.jpg",
        previewImageGreyed: "https://example.com/trans1-thumb-grey.jpg",
        rewardDetails: ["20% off on electric bike rental", "Valid for weekend bookings"],
        rewardSubtitle: "Sustainable travel discount",
        rewardTitle: "E-Bike Rental Deal",
        rewardType: "discount",
        status: "available",
        usefulnessScore: 4.8,
        validFrom: "2024-02-01",
        validTo: "2024-11-30",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    for (const reward of sampleRewards) {
      await addDoc(collection(db, 'Rewards'), reward);
      console.log(`Added reward: ${reward.rewardTitle}`);
    }
    
    console.log('Sample data added successfully!');
    
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
}

async function testConnection() {
  try {
    console.log('Testing Firebase connection...');
    
    // Test basic connection by trying to fetch from Rewards collection
    const rewardsQuery = query(
      collection(db, 'Rewards'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    
    const querySnapshot = await getDocs(rewardsQuery);
    console.log('Query successful! Documents found:', querySnapshot.docs.length);
    
    if (querySnapshot.docs.length > 0) {
      console.log('Sample document:', querySnapshot.docs[0].data());
    } else {
      console.log('No documents found in Rewards collection');
      console.log('Adding sample data...');
      await addSampleData();
      
      // Test again after adding data
      const newSnapshot = await getDocs(rewardsQuery);
      console.log('After adding data - Documents found:', newSnapshot.docs.length);
    }
    
  } catch (error) {
    console.error('Firebase connection error:', error);
  }
}

testConnection();
