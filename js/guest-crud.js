// 貴賓 CRUD 功能模組

// 常見姓氏筆畫對照表（用於排序）
const SURNAME_STROKES = {
    '丁': 2, '刁': 2, '卜': 2, '乃': 2,
    '于': 3, '干': 3, '弓': 3, '才': 3, '千': 3, '山': 3, '上': 3, '士': 3, '土': 3, '夕': 3, '大': 3, '女': 3, '子': 3, '寸': 3, '小': 3, '尤': 3, '尹': 3, '工': 3,
    '王': 4, '方': 4, '文': 4, '毛': 4, '水': 4, '火': 4, '牛': 4, '尤': 4, '云': 4, '井': 4, '尹': 4, '元': 4, '支': 4, '月': 4, '木': 4,
    '白': 5, '石': 5, '田': 5, '包': 5, '甘': 5, '古': 5, '左': 5, '右': 5, '平': 5, '丘': 5, '申': 5, '史': 5, '司': 5, '尼': 5, '冉': 5, '台': 5, '仙': 5, '伍': 5,
    '任': 6, '伊': 6, '朱': 6, '江': 6, '何': 6, '余': 6, '吳': 6, '吕': 6, '宋': 6, '成': 6, '池': 6, '米': 6, '羊': 6, '羽': 6, '老': 6, '艾': 6, '匡': 6, '安': 6, '充': 6, '印': 6, '向': 6, '曲': 6,
    '李': 7, '吳': 7, '宋': 7, '杜': 7, '江': 7, '余': 7, '沈': 7, '何': 7, '汪': 7, '狄': 7, '辛': 7, '谷': 7, '車': 7, '利': 7, '巫': 7, '岑': 7, '杞': 7, '束': 7, '言': 7, '貝': 7, '邢': 7, '步': 7,
    '林': 8, '周': 8, '金': 8, '卓': 8, '尚': 8, '孟': 8, '季': 8, '岳': 8, '房': 8, '易': 8, '昌': 8, '明': 8, '武': 8, '牧': 8, '祁': 8, '屈': 8, '宗': 8, '卑': 8, '阮': 8, '官': 8, '姚': 8, '尚': 8, '東': 8, '松': 8,
    '胡': 9, '柯': 9, '柳': 9, '段': 9, '姚': 9, '姜': 9, '紀': 9, '韋': 9, '查': 9, '柏': 9, '秋': 9, '姬': 9, '紅': 9, '郁': 9, '郎': 9, '封': 9, '宦': 9, '施': 9, '柴': 9, '胥': 9, '皇': 9, '風': 9,
    '徐': 10, '翁': 10, '馬': 10, '高': 10, '夏': 10, '柴': 10, '展': 10, '袁': 10, '倪': 10, '孫': 10, '凌': 10, '時': 10, '殷': 10, '席': 10, '師': 10, '索': 10, '秦': 10, '秘': 10, '祝': 10, '耿': 10, '翁': 10, '能': 10, '荀': 10, '荊': 10, '莫': 10, '莘': 10, '馬': 10,
    '張': 11, '許': 11, '梁': 11, '曹': 11, '崔': 11, '章': 11, '盛': 11, '陳': 11, '康': 11, '莊': 11, '郭': 11, '陸': 11, '畢': 11, '麥': 11, '麻': 11, '終': 11, '符': 11, '紹': 11, '許': 11, '連': 11, '梅': 11, '常': 11, '寇': 11, '習': 11, '國': 11, '崇': 11,
    '黃': 12, '彭': 12, '曾': 12, '程': 12, '賀': 12, '童': 12, '雲': 12, '黃': 12, '馮': 12, '喬': 12, '單': 12, '惠': 12, '景': 12, '湯': 12, '游': 12, '賈': 12, '舒': 12, '華': 12, '焦': 12, '費': 12, '鈕': 12, '項': 12, '閔': 12,
    '楊': 13, '溫': 13, '詹': 13, '葉': 13, '賈': 13, '路': 13, '萬': 13, '農': 13, '雷': 13, '楊': 13, '楚': 13, '雍': 13, '靳': 13, '葛': 13, '董': 13, '葉': 13, '藍': 13, '賈': 13, '酆': 13, '鄒': 13, '裘': 13, '解': 13, '詹': 13, '賈': 13,
    '劉': 15, '鄭': 15, '黎': 15, '潘': 15, '滕': 15, '鄧': 15, '劉': 15, '潘': 15, '樊': 15, '蔣': 15, '蔡': 15, '談': 15, '黎': 15, '衛': 15, '齊': 15, '鄭': 15, '魯': 15, '諸': 15, '廖': 15, '黎': 15, '蔣': 15, '談': 15,
    '盧': 16, '錢': 16, '穆': 16, '蕭': 16, '戴': 16, '霍': 16, '燕': 16, '賴': 16, '盧': 16, '錢': 16, '駱': 16, '鮑': 16, '諸': 16, '穆': 16, '鍾': 16, '龍': 16, '蕭': 16, '閻': 16, '薛': 16, '隨': 16, '衡': 16,
    '謝': 17, '戴': 17, '鍾': 17, '鍾': 17, '薛': 17, '應': 17, '謝': 17, '鄺': 17, '戴': 17, '繆': 17, '鄔': 17, '隗': 17, '隆': 17, '韓': 17, '魏': 17, '魏': 17, '謝': 17, '鍾': 17,
    '顏': 18, '魏': 18, '簡': 18, '藍': 18, '顏': 18, '魏': 18, '豐': 18, '雙': 18, '鄺': 18, '雙': 18, '關': 19, '鄭': 19, '羅': 20, '嚴': 20, '蘇': 22, '龔': 22, '權': 22
};

// 計算姓氏筆畫數
function getStrokeCount(surname) {
    // 如果在對照表中找到，直接返回
    if (SURNAME_STROKES[surname]) {
        return SURNAME_STROKES[surname];
    }

    // 否則使用 Unicode 編碼作為備用排序依據
    // 這不是真實筆畫數，但能保證一致性排序
    return surname.charCodeAt(0);
}

// GuestCRUD 類別
class GuestCRUD {
    constructor() {
        this.collectionName = 'guests';
    }

    // 等待 Firestore 初始化
    async waitForFirestore() {
        let attempts = 0;
        while (!window.db && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        if (!window.db) {
            throw new Error('Firestore 初始化失敗，請檢查 Firebase 配置');
        }
    }

    // 新增貴賓
    async createGuest(guestData) {
        try {
            await this.waitForFirestore();
            const { collection, addDoc } = window.firestoreModule;

            // 計算姓氏筆畫數
            const strokeCount = getStrokeCount(guestData.lastName);

            // 準備完整的貴賓資料
            const fullGuestData = {
                lastName: guestData.lastName,
                firstName: guestData.firstName,
                fullName: guestData.lastName + guestData.firstName,
                mainTitle: guestData.mainTitle,
                mainOrganization: guestData.mainOrganization,
                gender: guestData.gender,
                otherTitles: guestData.otherTitles || [],
                introductionRecord: guestData.introductionRecord || '',
                guestIntroduction: guestData.guestIntroduction || '',
                photoURL: guestData.photoURL || '',
                strokeCount: strokeCount,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const guestsRef = collection(window.db, this.collectionName);
            const docRef = await addDoc(guestsRef, fullGuestData);

            return { id: docRef.id, ...fullGuestData };
        } catch (error) {
            console.error('新增貴賓失敗:', error);
            throw error;
        }
    }

    // 取得所有貴賓（按姓氏筆畫排序）
    async getAllGuests() {
        try {
            await this.waitForFirestore();
            const { collection, getDocs, query, orderBy } = window.firestoreModule;

            const guestsRef = collection(window.db, this.collectionName);
            const q = query(guestsRef, orderBy('strokeCount'), orderBy('fullName'));
            const querySnapshot = await getDocs(q);

            const guests = [];
            querySnapshot.forEach((doc) => {
                guests.push({ id: doc.id, ...doc.data() });
            });

            return guests;
        } catch (error) {
            console.error('取得貴賓列表失敗:', error);
            throw error;
        }
    }

    // 取得單一貴賓
    async getGuest(guestId) {
        try {
            await this.waitForFirestore();
            const { doc, getDoc } = window.firestoreModule;

            const guestRef = doc(window.db, this.collectionName, guestId);
            const guestDoc = await getDoc(guestRef);

            if (guestDoc.exists()) {
                return { id: guestDoc.id, ...guestDoc.data() };
            } else {
                throw new Error('找不到此貴賓');
            }
        } catch (error) {
            console.error('取得貴賓資料失敗:', error);
            throw error;
        }
    }

    // 更新貴賓
    async updateGuest(guestId, guestData) {
        try {
            await this.waitForFirestore();
            const { doc, updateDoc } = window.firestoreModule;

            // 重新計算姓氏筆畫數（如果姓氏有變更）
            if (guestData.lastName) {
                guestData.strokeCount = getStrokeCount(guestData.lastName);
            }

            // 更新完整姓名（如果姓或名有變更）
            if (guestData.lastName || guestData.firstName) {
                const currentGuest = await this.getGuest(guestId);
                const lastName = guestData.lastName || currentGuest.lastName;
                const firstName = guestData.firstName || currentGuest.firstName;
                guestData.fullName = lastName + firstName;
            }

            guestData.updatedAt = new Date();

            const guestRef = doc(window.db, this.collectionName, guestId);
            await updateDoc(guestRef, guestData);

            return await this.getGuest(guestId);
        } catch (error) {
            console.error('更新貴賓資料失敗:', error);
            throw error;
        }
    }

    // 刪除貴賓
    async deleteGuest(guestId) {
        try {
            await this.waitForFirestore();
            const { doc, deleteDoc } = window.firestoreModule;

            const guestRef = doc(window.db, this.collectionName, guestId);
            await deleteDoc(guestRef);

            return true;
        } catch (error) {
            console.error('刪除貴賓失敗:', error);
            throw error;
        }
    }

    // 批量刪除貴賓
    async deleteMultipleGuests(guestIds) {
        try {
            const deletePromises = guestIds.map(id => this.deleteGuest(id));
            await Promise.all(deletePromises);
            return true;
        } catch (error) {
            console.error('批量刪除貴賓失敗:', error);
            throw error;
        }
    }

    // 搜尋貴賓
    async searchGuests(filters) {
        try {
            // 先取得所有貴賓
            const allGuests = await this.getAllGuests();

            // 客戶端篩選（Firestore 查詢限制較多，使用客戶端篩選更靈活）
            let filteredGuests = allGuests;

            // 關鍵字搜尋（姓名、單位、稱謂）
            if (filters.keyword) {
                const keyword = filters.keyword.toLowerCase();
                filteredGuests = filteredGuests.filter(guest =>
                    guest.fullName.toLowerCase().includes(keyword) ||
                    guest.mainOrganization.toLowerCase().includes(keyword) ||
                    guest.mainTitle.toLowerCase().includes(keyword) ||
                    (guest.otherTitles && guest.otherTitles.some(title => title.toLowerCase().includes(keyword)))
                );
            }

            // 性別篩選
            if (filters.gender) {
                filteredGuests = filteredGuests.filter(guest => guest.gender === filters.gender);
            }

            // 單位篩選
            if (filters.organization) {
                filteredGuests = filteredGuests.filter(guest =>
                    guest.mainOrganization.includes(filters.organization)
                );
            }

            // 稱謂篩選
            if (filters.title) {
                filteredGuests = filteredGuests.filter(guest =>
                    guest.mainTitle.includes(filters.title) ||
                    (guest.otherTitles && guest.otherTitles.some(title => title.includes(filters.title)))
                );
            }

            return filteredGuests;
        } catch (error) {
            console.error('搜尋貴賓失敗:', error);
            throw error;
        }
    }
}

// 建立全域實例
window.guestCRUD = new GuestCRUD();

// 輔助函數：顯示 Loading
function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
}

// 輔助函數：隱藏 Loading
function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

// 輔助函數：顯示通知訊息
function showNotification(message, type = 'info') {
    // 簡單的通知實作（可以之後改用更好的UI）
    alert(message);
}

// 將輔助函數設為全域
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showNotification = showNotification;
