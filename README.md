# 貴賓管理系統

專業活動貴賓名單管理系統，協助活動承辦人員管理貴賓資料、搜尋查詢，並支援批量上傳功能。

## 功能特色

- **貴賓資料管理**：新增、編輯、刪除、檢視貴賓詳細資訊
- **智慧排序**：自動依照姓氏筆畫由少至多排列
- **進階搜尋**：支援關鍵字、單位、性別、稱謂等多條件搜尋
- **批量操作**：支援批量選取、刪除貴賓資料
- **大量上傳**：支援 CSV 和 JSON 格式批量匯入貴賓名單
- **響應式設計**：完美支援手機、平板、電腦等不同裝置

## 技術架構

- **前端**：HTML5 + CSS3 + Vanilla JavaScript
- **資料庫**：Firebase Firestore
- **部署**：GitHub Pages
- **照片儲存**：外部圖床 URL

## 快速開始

### 1. Firebase 設定

#### 1.1 建立 Firebase 專案

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 點擊「新增專案」或選擇現有專案
3. 專案名稱建議：`vip-mgmt-ryanlin02`
4. 按照步驟完成專案建立

#### 1.2 新增網頁應用程式

1. 在專案概覽頁面，點擊「</> Web」圖示
2. 註冊應用程式（名稱可填：貴賓管理系統）
3. 複製 Firebase SDK 配置資訊

#### 1.3 設定 Firestore Database

1. 在左側選單選擇「Firestore Database」
2. 點擊「建立資料庫」
3. 選擇「以測試模式啟動」（或生產模式後自行設定規則）
4. 選擇資料庫位置：`asia-east1 (台灣)` 或其他就近位置

#### 1.4 設定安全性規則

1. 進入「Firestore Database」→「規則」
2. 貼上以下規則（公開讀寫）：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: true;
    }
  }
}
```

3. 點擊「發布」

> ⚠️ **警告**：此規則允許任何人讀寫您的資料庫。如需保護資料，建議之後加入 Firebase Authentication。

#### 1.5 更新 Firebase 配置

1. 開啟 `js/firebase-config.js`
2. 將您的 Firebase 配置資訊替換到檔案中：

```javascript
const firebaseConfig = {
    apiKey: "您的 API Key",
    authDomain: "您的專案ID.firebaseapp.com",
    projectId: "您的專案ID",
    storageBucket: "您的專案ID.appspot.com",
    messagingSenderId: "您的 Messaging Sender ID",
    appId: "您的 App ID"
};
```

### 2. GitHub Pages 部署

#### 2.1 建立 GitHub Repository

1. 登入 GitHub（帳號：ryanlin02）
2. 點擊右上角「+」→「New repository」
3. Repository name：`vip-management-system`
4. 設為 Public
5. 點擊「Create repository」

#### 2.2 上傳專案檔案

在專案目錄中執行以下命令：

```bash
git init
git add .
git commit -m "Initial commit: 貴賓管理系統 v1.0"
git branch -M main
git remote add origin https://github.com/ryanlin02/vip-management-system.git
git push -u origin main
```

#### 2.3 啟用 GitHub Pages

1. 進入 Repository → Settings
2. 左側選單選擇「Pages」
3. Source 選擇：`main` branch
4. 資料夾選擇：`/ (root)`
5. 點擊「Save」
6. 等待幾分鐘後，您的網站將部署在：
   `https://ryanlin02.github.io/vip-management-system/`

### 3. 匯入範例資料

系統提供 10 位嘉義市政府長官的範例資料：

1. 開啟網站
2. 點擊「大量上傳」按鈕
3. 選擇 `data/sample-guests.csv` 或 `data/sample-guests.json`
4. 點擊「開始上傳」

## 使用說明

### 基本操作

#### 新增貴賓

1. 點擊「新增」按鈕
2. 填寫必填欄位：
   - 姓氏
   - 名字
   - 主要稱謂（例：市長、局長、處長）
   - 主要單位（例：嘉義市政府）
   - 性別
3. 選填欄位：
   - 照片網址（外部圖床連結）
   - 其他頭銜（輸入後按 Enter 新增標籤）
   - 貴賓介紹
   - 介紹紀錄
4. 點擊「儲存」

#### 檢視貴賓

- 在貴賓列表中點擊任一貴賓卡片
- 檢視完整資訊
- 可進行編輯或刪除

#### 編輯貴賓

1. 點擊貴賓卡片進入詳情頁
2. 點擊「編輯」按鈕
3. 修改資料後點擊「儲存」

#### 刪除貴賓

1. 點擊貴賓卡片進入詳情頁
2. 點擊「刪除」按鈕（紅色）
3. 確認刪除

### 進階功能

#### 批量操作

1. 點擊「選取」按鈕進入選取模式
2. 勾選要操作的貴賓
3. 可使用「全選」或「取消全選」
4. 點擊「批量刪除」刪除選取的貴賓
5. 點擊「完成」離開選取模式

#### 搜尋貴賓

1. 點擊導航列「搜尋」按鈕
2. 使用以下條件搜尋：
   - **關鍵字**：搜尋姓名、單位或稱謂
   - **性別**：男/女
   - **單位**：輸入單位名稱
   - **稱謂**：輸入稱謂
3. 系統即時顯示搜尋結果

#### 大量上傳

系統支援 CSV 和 JSON 兩種格式：

##### CSV 格式範例

```csv
姓氏,名字,主要稱謂,主要單位,性別,其他頭銜,照片URL,貴賓介紹,介紹紀錄
黃,敏惠,市長,嘉義市政府,female,第10屆市長,https://example.com/photo.jpg,市長介紹,介紹紀錄
```

**欄位說明**：
- 必填：姓氏、名字、主要稱謂、主要單位、性別
- 性別格式：`male`（男）或 `female`（女）
- 其他頭銜：多個頭銜用 `|` 分隔，例：`第10屆市長|嘉義市長`

##### JSON 格式範例

```json
[
  {
    "lastName": "黃",
    "firstName": "敏惠",
    "mainTitle": "市長",
    "mainOrganization": "嘉義市政府",
    "gender": "female",
    "otherTitles": ["第10屆市長"],
    "photoURL": "https://example.com/photo.jpg",
    "guestIntroduction": "市長介紹",
    "introductionRecord": "介紹紀錄"
  }
]
```

**上傳步驟**：
1. 點擊「大量上傳」按鈕
2. 點擊「選擇檔案」
3. 選擇 CSV 或 JSON 檔案
4. 系統自動驗證資料格式
5. 點擊「開始上傳」
6. 等待上傳完成

## 資料結構

### Firestore Collection: `guests`

```javascript
{
  id: "auto-generated",          // 自動產生
  lastName: "黃",                 // 姓氏
  firstName: "敏惠",              // 名字
  fullName: "黃敏惠",             // 完整姓名（自動組合）
  mainTitle: "市長",              // 主要稱謂
  mainOrganization: "嘉義市政府", // 主要單位
  gender: "female",               // 性別（male/female）
  otherTitles: ["第10屆市長"],    // 其他頭銜陣列
  introductionRecord: "",         // 介紹紀錄
  guestIntroduction: "",          // 貴賓介紹
  photoURL: "",                   // 照片URL
  strokeCount: 12,                // 姓氏筆畫數（排序用）
  createdAt: Timestamp,           // 建立時間
  updatedAt: Timestamp            // 更新時間
}
```

## 專案結構

```
vip-management-system/
├── index.html              # 主頁面
├── css/
│   └── style.css          # 統一樣式
├── js/
│   ├── firebase-config.js # Firebase 配置
│   ├── app.js             # 主應用邏輯
│   ├── guest-crud.js      # 貴賓 CRUD 功能
│   ├── search.js          # 搜尋功能
│   └── bulk-upload.js     # 大量上傳功能
├── data/
│   ├── sample-guests.csv  # 範例資料（CSV）
│   └── sample-guests.json # 範例資料（JSON）
└── README.md              # 說明文件
```

## 設計原則

- **色彩**：黑白灰配色，重要操作（刪除）使用紅色警示
- **字體**：貴賓姓名與稱謂加大顯示（28px），一般內容 16px
- **響應式**：支援手機（<768px）、平板（768-1024px）、電腦（>1024px）
- **簡潔**：清晰的介面，避免過多裝飾元素

## 常見問題

### Q: 資料庫連接失敗？

A: 請檢查：
1. Firebase 配置是否正確填寫在 `js/firebase-config.js`
2. Firestore Database 是否已建立並啟用
3. 安全性規則是否正確設定
4. 瀏覽器控制台（F12）是否有錯誤訊息

### Q: 姓氏排序不正確？

A: 系統使用內建的姓氏筆畫對照表。如遇少見姓氏，可能會使用 Unicode 編碼排序。您可以在 `js/guest-crud.js` 的 `SURNAME_STROKES` 物件中新增對應的姓氏筆畫數。

### Q: 如何新增照片？

A:
1. 將照片上傳到圖床（例：Imgur、Google Drive、Cloudflare Images）
2. 取得照片的公開網址
3. 在新增/編輯貴賓時，將網址貼到「照片網址」欄位

### Q: 可以離線使用嗎？

A: 本系統需要網路連接才能存取 Firebase 資料庫。

### Q: 如何備份資料？

A:
1. 前往 Firebase Console → Firestore Database
2. 匯出資料（需要 Firebase CLI）
3. 或使用「大量上傳」功能的 JSON 格式，手動建立備份檔

## 版本資訊

**Version:** 1.0.3
**更新日期:** 2025-10-24
**作者:** Ryan Lin (ryanlin02)

## 授權聲明

本專案為個人專案，供活動承辦人員使用。

## 技術支援

如有問題或建議，請聯繫專案維護者。

---

© 2025 貴賓管理系統 - 專業活動貴賓名單管理解決方案
