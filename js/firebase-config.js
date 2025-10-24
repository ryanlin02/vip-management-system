// Firebase 配置
// 請將以下配置替換為您的 Firebase 專案配置
const firebaseConfig = {
  apiKey: "AIzaSyDgT1R2009bVzTJZcPSNsr-b9A9Rr0S3Pg",
  authDomain: "vip-mgmt-ryanlin02.firebaseapp.com",
  projectId: "vip-mgmt-ryanlin02",
  storageBucket: "vip-mgmt-ryanlin02.firebasestorage.app",
  messagingSenderId: "787340618947",
  appId: "1:787340618947:web:b4a5582cb331208bee0676",
  measurementId: "G-L68WP0EYL7"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);

// 初始化 Firestore
const db = firebase.firestore();

// Firestore 集合名稱
const COLLECTIONS = {
    VIP: 'vips'
};

// 檢查 Firebase 是否正確初始化
console.log('Firebase 已初始化');
