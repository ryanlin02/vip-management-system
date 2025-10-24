# 貴賓資料庫管理系統

一個專為活動承辦人設計的貴賓名單管理系統，提供便捷的貴賓資料管理、搜尋與批量操作功能。

## 功能特色

- **貴賓資料管理**：新增、編輯、刪除貴賓資料
- **姓氏筆畫排序**：自動按姓氏筆畫由少至多排列
- **搜尋功能**：支援關鍵字、性別、單位、標籤等多條件搜尋
- **批量操作**：批量上傳 CSV、批量編輯標籤
- **介紹紀錄**：記錄貴賓介紹過的時間與場合
- **自訂標籤**：靈活的標籤系統方便分類管理
- **響應式設計**：支援手機、平板、電腦多種裝置

## 技術架構

- **前端**：HTML5 + CSS3 + Vanilla JavaScript
- **資料庫**：Firebase Firestore
- **部署**：GitHub Pages
- **設計風格**：黑白灰階、極簡設計

## 快速開始

### 1. Firebase 設定

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 Firestore Database
4. 前往專案設定 > 一般，複製 Firebase 配置資訊
5. 編輯 `js/firebase-config.js`，將配置資訊貼上：

```javascript
const firebaseConfig = {
    apiKey: "您的API金鑰",
    authDomain: "您的專案ID.firebaseapp.com",
    projectId: "您的專案ID",
    storageBucket: "您的專案ID.appspot.com",
    messagingSenderId: "您的發送者ID",
    appId: "您的應用程式ID"
};
```

6. 設定 Firestore 安全規則（Firebase Console > Firestore Database > 規則）：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /vips/{document=**} {
      allow read, write: if true;
    }
  }
}
```

**注意**：上述規則允許公開讀寫，建議在正式環境中加入認證機制。

### 2. 部署到 GitHub Pages

1. 建立 GitHub repository（例如：`vip-database-system`）
2. 初始化 Git 並推送程式碼：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ryanlin02/vip-database-system.git
git push -u origin main
```

3. 啟用 GitHub Pages：
   - 前往 repository 設定
   - 找到 "Pages" 選項
   - Source 選擇 `main` 分支
   - 儲存後即可透過 `https://ryanlin02.github.io/vip-database-system/` 訪問

### 3. 匯入範例資料

系統提供兩種方式匯入範例資料：

#### 方式一：使用網站的大量上傳功能

1. 開啟網站
2. 點擊「大量上傳」按鈕
3. 選擇 `data/sample-upload.csv` 檔案
4. 點擊「上傳」

#### 方式二：手動新增

參考 `data/sample-data.json` 中的資料格式，透過網站的「新增」功能逐筆輸入。

## 使用說明

### 貴賓資料管理

1. **新增貴賓**
   - 點擊「新增」按鈕
   - 填寫必填欄位（姓氏、姓名、主要稱謂、主要單位、性別）
   - 選填其他資訊（頭銜、照片、標籤、介紹、介紹紀錄）
   - 點擊「儲存」

2. **編輯貴賓**
   - 點擊貴賓卡片或「編輯」按鈕
   - 修改資料後點擊「儲存」

3. **刪除貴賓**
   - 點擊「刪除」按鈕
   - 確認刪除（此操作無法復原）

### 批量操作

1. **選取模式**
   - 點擊「選取」按鈕進入選取模式
   - 勾選需要操作的貴賓
   - 點擊「編輯標籤」進行批量標籤編輯

2. **大量上傳**
   - 準備 CSV 檔案（格式參考 `data/sample-upload.csv`）
   - 點擊「大量上傳」按鈕
   - 選擇檔案並上傳

### 搜尋貴賓

1. 切換到「搜尋」頁面
2. 輸入搜尋條件：
   - 關鍵字：搜尋姓名、稱謂、單位、介紹
   - 性別：篩選男性或女性
   - 單位：搜尋特定單位
   - 標籤：搜尋特定標籤（多個標籤以逗號分隔）
3. 點擊「搜尋」查看結果

## 資料結構

### 貴賓資料欄位

| 欄位名稱 | 類型 | 必填 | 說明 |
|---------|------|------|------|
| lastName | 字串 | 是 | 姓氏 |
| firstName | 字串 | 是 | 姓名 |
| mainTitle | 字串 | 是 | 主要稱謂 |
| mainOrganization | 字串 | 是 | 主要單位 |
| gender | 字串 | 是 | 性別（男/女）|
| otherTitles | 陣列 | 否 | 其他頭銜 |
| photoUrl | 字串 | 否 | 照片網址 |
| tags | 陣列 | 否 | 標籤 |
| introduction | 字串 | 否 | 貴賓介紹 |
| introducedRecords | 陣列 | 否 | 介紹紀錄 |

### CSV 上傳格式

```csv
姓氏,姓名,主要稱謂,主要單位,性別,其他頭銜,貴賓介紹,照片URL,標籤
黃,敏惠,市長,嘉義市政府,女,博士,嘉義市第10屆市長,,市府首長;VIP
```

**注意**：
- 多個標籤或頭銜使用分號（;）分隔
- 照片 URL 欄位可空白
- 必填欄位不可空白

## 專案結構

```
vip-database-system/
├── index.html              # 主頁面
├── css/
│   └── style.css          # 樣式表
├── js/
│   ├── firebase-config.js # Firebase 配置
│   ├── database.js        # 資料庫操作
│   ├── ui.js              # UI 邏輯
│   └── utils.js           # 工具函數
├── data/
│   ├── sample-upload.csv  # 範例 CSV 檔案
│   └── sample-data.json   # 範例資料說明
└── README.md              # 說明文件
```

## 設計規範

- **配色**：黑白灰階設計，刪除功能使用紅色警告
- **字體大小**：貴賓姓名與稱謂字體加大
- **響應式**：手機優先設計，適配多種螢幕尺寸
- **簡潔**：避免過多裝飾元素，專注於功能性

## 安全性建議

目前系統設定為公開訪問，建議在正式環境中：

1. 啟用 Firebase Authentication
2. 修改 Firestore 安全規則，限制讀寫權限
3. 使用環境變數管理 Firebase 配置

## 瀏覽器支援

- Chrome（推薦）
- Firefox
- Safari
- Edge

## 授權

MIT License

## 聯絡資訊

如有問題或建議，請透過 GitHub Issues 回報。
