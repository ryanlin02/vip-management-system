// Firebase 配置
// 請將以下配置替換為您的 Firebase 專案配置
// 可從 Firebase Console > 專案設定 > 您的應用程式 中取得

const firebaseConfig = {
  apiKey: "AIzaSyDgT1R2009bVzTJZcPSNsr-b9A9Rr0S3Pg",
  authDomain: "vip-mgmt-ryanlin02.firebaseapp.com",
  projectId: "vip-mgmt-ryanlin02",
  storageBucket: "vip-mgmt-ryanlin02.firebasestorage.app",
  messagingSenderId: "787340618947",
  appId: "1:787340618947:web:b4a5582cb331208bee0676",
  measurementId: "G-L68WP0EYL7"
};

// 初始化 Firebase（同時處理 App 和 Firestore）
(async function initializeFirebase() {
    try {
        // 載入 Firebase App
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        window.firebaseApp = initializeApp(firebaseConfig);
        console.log('✓ Firebase 已初始化');

        // 載入 Firestore
        const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        window.db = getFirestore(window.firebaseApp);
        console.log('✓ Firestore 已連接');

        // 觸發自訂事件，通知系統 Firebase 已準備就緒
        window.dispatchEvent(new Event('firebaseReady'));

    } catch (error) {
        console.error('❌ Firebase 初始化失敗:', error);
        alert('Firebase 連線失敗，請檢查網路連線或 Firebase 配置。\n錯誤：' + error.message);
    }
})();

/**
 * Firebase 設定步驟：
 *
 * 1. 前往 Firebase Console: https://console.firebase.google.com/
 * 2. 建立新專案或選擇現有專案（建議命名：vip-mgmt-ryanlin02）
 * 3. 在專案概覽中，點擊「</> Web」圖示新增網頁應用程式
 * 4. 註冊應用程式後，複製 firebaseConfig 的內容
 * 5. 將上方的 firebaseConfig 替換為您的配置
 *
 * 6. 設定 Firestore Database：
 *    - 在左側選單選擇「Firestore Database」
 *    - 點擊「建立資料庫」
 *    - 選擇「以測試模式啟動」（或生產模式後自行設定規則）
 *    - 選擇資料庫位置（建議：asia-east1 (台灣)）
 *
 * 7. 設定安全性規則（Firestore Database > 規則）：
 *    由於本系統設定為公開讀寫，請使用以下規則：
 *
 *    rules_version = '2';
 *    service cloud.firestore {
 *      match /databases/{database}/documents {
 *        match /{document=**} {
 *          allow read, write: true;
 *        }
 *      }
 *    }
 *
 *    ⚠️ 警告：此規則允許任何人讀寫您的資料庫
 *    如需保護資料，建議之後加入 Firebase Authentication
 *
 * 8. 儲存並發布規則
 */
