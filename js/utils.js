// 工具函數

// 常見姓氏筆畫對照表（按筆畫數排序）
const LAST_NAME_STROKES = {
    // 1畫
    '丁': 1,
    // 2畫
    '卜': 2, '刀': 2, '力': 2,
    // 3畫
    '于': 3, '干': 3, '弓': 3, '山': 3, '千': 3, '大': 3, '小': 3, '女': 3, '川': 3, '士': 3, '么': 3,
    // 4畫
    '王': 4, '尹': 4, '尤': 4, '毛': 4, '支': 4, '文': 4, '方': 4, '火': 4, '井': 4, '公': 4, '孔': 4, '牛': 4, '水': 4, '元': 4, '巴': 4, '仇': 4, '区': 4, '丑': 4,
    // 5畫
    '古': 5, '白': 5, '石': 5, '包': 5, '左': 5, '平': 5, '田': 5, '史': 5, '司': 5, '申': 5, '甘': 5, '卉': 5, '丘': 5, '令': 5, '正': 5, '冉': 5, '弘': 5, '皮': 5, '布': 5, '北': 5,
    // 6畫
    '朱': 6, '牟': 6, '伍': 6, '米': 6, '江': 6, '向': 6, '危': 6, '吉': 6, '成': 6, '池': 6, '竹': 6, '曲': 6, '安': 6, '年': 6, '全': 6, '伏': 6, '仲': 6, '任': 6, '伊': 6, '有': 6, '宇': 6, '羊': 6, '后': 6, '印': 6, '匡': 6, '戎': 6, '邢': 6, '羽': 6, '衣': 6, '西': 6,
    // 7畫
    '李': 7, '何': 7, '吳': 7, '呂': 7, '宋': 7, '杜': 7, '汪': 7, '沈': 7, '車': 7, '辛': 7, '余': 7, '阮': 7, '巫': 7, '邢': 7, '吾': 7, '沙': 7, '利': 7, '伯': 7, '言': 7, '邱': 7, '佘': 7, '束': 7, '冷': 7, '别': 7, '求': 7, '谷': 7, '汲': 7, '初': 7, '言': 7, '冶': 7,
    // 8畫
    '林': 8, '周': 8, '金': 8, '官': 8, '孟': 8, '季': 8, '易': 8, '卓': 8, '尚': 8, '邵': 8, '岳': 8, '武': 8, '屈': 8, '宗': 8, '沃': 8, '阿': 8, '房': 8, '芮': 8, '羌': 8, '花': 8, '茅': 8, '邰': 8, '居': 8, '幸': 8, '明': 8, '尚': 8, '卓': 8, '宓': 8, '於': 8, '牧': 8, '汾': 8, '空': 8, '居': 8, '松': 8, '苗': 8,
    // 9畫
    '胡': 9, '施': 9, '柯': 9, '姚': 9, '姜': 9, '柳': 9, '俞': 9, '段': 9, '紀': 9, '查': 9, '冒': 9, '洪': 9, '紅': 9, '韋': 9, '宣': 9, '秋': 9, '柏': 9, '封': 9, '南': 9, '保': 9, '皇': 9, '侯': 9, '咸': 9, '計': 9, '郁': 9, '胥': 9, '羿': 9, '柴': 9, '狄': 9, '茹': 9, '扈': 9, '衡': 9, '革': 9,
    // 10畫
    '徐': 10, '馬': 10, '翁': 10, '高': 10, '夏': 10, '孫': 10, '唐': 10, '秦': 10, '袁': 10, '柴': 10, '祝': 10, '倪': 10, '凌': 10, '席': 10, '班': 10, '桂': 10, '晏': 10, '烏': 10, '翟': 10, '時': 10, '容': 10, '家': 10, '索': 10, '殷': 10, '宮': 10, '桑': 10, '原': 10, '師': 10, '浦': 10, '柴': 10, '翁': 10, '莫': 10, '恩': 10, '倉': 10, '畢': 10, '益': 10, '祖': 10, '凌': 10, '烈': 10, '秘': 10, '耿': 10, '海': 10,
    // 11畫
    '張': 11, '陳': 11, '許': 11, '曹': 11, '章': 11, '崔': 11, '梁': 11, '康': 11, '區': 11, '商': 11, '國': 11, '梅': 11, '莊': 11, '盛': 11, '常': 11, '荷': 11, '習': 11, '麥': 11, '終': 11, '戚': 11, '閉': 11, '尉': 11, '苟': 11, '寇': 11, '鄂': 11, '荀': 11, '邸': 11, '郭': 11, '眭': 11, '從': 11, '通': 11, '連': 11, '符': 11, '畢': 11, '陶': 11, '隆': 11,
    // 12畫
    '黃': 12, '彭': 12, '曾': 12, '游': 12, '賀': 12, '傅': 12, '馮': 12, '程': 12, '童': 12, '雲': 12, '湯': 12, '舒': 12, '項': 12, '費': 12, '閔': 12, '鈕': 12, '雄': 12, '焦': 12, '富': 12, '賁': 12, '越': 12, '荊': 12, '嵇': 12, '景': 12, '喬': 12, '單': 12, '華': 12, '寒': 12, '惠': 12, '邰': 12, '甯': 12, '賀': 12, '敖': 12, '買': 12, '游': 12, '陽': 12, '湛': 12, '舜': 12, '植': 12,
    // 13畫
    '楊': 13, '葉': 13, '詹': 13, '萬': 13, '廉': 13, '路': 13, '鄒': 13, '雷': 13, '農': 13, '賈': 13, '溫': 13, '鄔': 13, '解': 13, '經': 13, '賴': 13, '督': 13, '楚': 13, '裘': 13, '鮑': 13, '詹': 13, '郝': 13, '鈴': 13, '葛': 13, '鄔': 13, '簡': 13, '雷': 13, '虞': 13, '路': 13, '萬': 13, '陸': 13, '靳': 13, '裴': 13, '雍': 13,
    // 14畫
    '趙': 14, '劉': 14, '蔡': 14, '廖': 14, '鄭': 14, '熊': 14, '管': 14, '寧': 14, '滕': 14, '蒙': 14, '臧': 14, '榮': 14, '裴': 14, '樂': 14, '鳳': 14, '蓋': 14, '郎': 14, '漆': 14, '赫': 14, '齊': 14, '銀': 14, '蔣': 14, '種': 14, '滿': 14, '臺': 14, '蒲': 14, '端': 14, '甄': 14, '翠': 14, '慕': 14, '綦': 14, '藍': 14, '僕': 14, '譚': 14, '嘉': 14, '廣': 14,
    // 15畫
    '劉': 15, '鄧': 15, '葉': 15, '潘': 15, '魯': 15, '蔣': 15, '蔡': 15, '衛': 15, '黎': 15, '樊': 15, '諸': 15, '歐': 15, '盧': 15, '鞏': 15, '齊': 15, '緱': 15, '慕': 15, '養': 15, '黎': 15, '樊': 15, '璩': 15, '鮮': 15, '廣': 15, '顏': 15, '嬴': 15, '歐': 15, '厲': 15, '稽': 15, '慶': 15, '滕': 15, '劇': 15, '誼': 15, '德': 15, '慕': 15, '慶': 15,
    // 16畫
    '盧': 16, '賴': 16, '錢': 16, '穆': 16, '陸': 16, '閻': 16, '樺': 16, '蕭': 16, '蔚': 16, '錢': 16, '龍': 16, '燕': 16, '衡': 16, '霍': 16, '錫': 16, '諾': 16, '魏': 16, '褚': 16, '融': 16, '盧': 16, '蕭': 16, '龍': 16, '賴': 16, '閻': 16, '陸': 16, '橋': 16, '冀': 16, '糜': 16, '遲': 16, '霍': 16, '穆': 16, '融': 16, '隨': 16,
    // 17畫
    '謝': 17, '韓': 17, '應': 17, '戴': 17, '鍾': 17, '鄺': 17, '翼': 17, '闞': 17, '駱': 17, '蔣': 17, '聶': 17, '闕': 17, '戴': 17, '隆': 17, '謝': 17, '韓': 17, '戴': 17, '鍾': 17, '應': 17, '隆': 17,
    // 18畫
    '顏': 18, '魏': 18, '藍': 18, '簡': 18, '豐': 18, '雙': 18, '闕': 18, '顏': 18, '職': 18, '魏': 18, '豐': 18, '瞿': 18, '藍': 18, '簡': 18, '雙': 18, '聶': 18,
    // 19畫
    '鄧': 19, '鄭': 19, '鄒': 19, '鄔': 19, '鄺': 19, '關': 19, '薄': 19, '譚': 19, '鄧': 19, '鄭': 19, '關': 19, '譚': 19, '鄒': 19, '薄': 19, '鄔': 19, '鄺': 19,
    // 20畫及以上
    '蘇': 20, '嚴': 20, '竇': 20, '蘇': 20, '嚴': 20, '竇': 20, '寶': 20, '繆': 20, '釋': 20, '藏': 20, '籍': 20,
    '蘭': 21, '顧': 21, '龔': 21, '蘭': 21, '顧': 21, '龔': 21, '櫻': 21,
    '羅': 22, '蘇': 22, '羅': 22, '籍': 22, '蘇': 22,
    '龔': 23, '龔': 23
};

/**
 * 獲取姓氏的筆畫數
 * @param {string} lastName - 姓氏
 * @returns {number} 筆畫數，如果不在對照表中返回 999
 */
function getLastNameStrokes(lastName) {
    if (!lastName) return 999;
    const firstChar = lastName.charAt(0);
    return LAST_NAME_STROKES[firstChar] || 999;
}

/**
 * 按姓氏筆畫排序貴賓資料
 * @param {Array} vipList - 貴賓資料陣列
 * @returns {Array} 排序後的貴賓資料
 */
function sortVipsByLastName(vipList) {
    return [...vipList].sort((a, b) => {
        const strokesA = getLastNameStrokes(a.lastName);
        const strokesB = getLastNameStrokes(b.lastName);

        // 先按筆畫數排序
        if (strokesA !== strokesB) {
            return strokesA - strokesB;
        }

        // 筆畫數相同，按姓氏的 Unicode 碼排序
        if (a.lastName !== b.lastName) {
            return a.lastName.localeCompare(b.lastName, 'zh-TW');
        }

        // 姓氏相同，按名字排序
        return a.firstName.localeCompare(b.firstName, 'zh-TW');
    });
}

/**
 * 格式化日期
 * @param {Date|string} date - 日期
 * @returns {string} 格式化後的日期字串 (YYYY-MM-DD)
 */
function formatDate(date) {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 解析字串陣列（以逗號或分號分隔）
 * @param {string} str - 輸入字串
 * @returns {Array} 字串陣列
 */
function parseStringArray(str) {
    if (!str || typeof str !== 'string') return [];
    return str.split(/[,;，；]/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
}

/**
 * 搜尋過濾貴賓資料
 * @param {Array} vipList - 貴賓資料陣列
 * @param {Object} filters - 過濾條件
 * @returns {Array} 過濾後的貴賓資料
 */
function filterVips(vipList, filters) {
    return vipList.filter(vip => {
        // 關鍵字搜尋
        if (filters.keyword) {
            const keyword = filters.keyword.toLowerCase();
            const searchText = `${vip.lastName}${vip.firstName}${vip.mainTitle}${vip.mainOrganization}${vip.introduction || ''}`.toLowerCase();
            if (!searchText.includes(keyword)) {
                return false;
            }
        }

        // 性別篩選
        if (filters.gender && vip.gender !== filters.gender) {
            return false;
        }

        // 單位篩選
        if (filters.organization) {
            const org = filters.organization.toLowerCase();
            if (!vip.mainOrganization.toLowerCase().includes(org)) {
                return false;
            }
        }

        // 標籤篩選
        if (filters.tags && filters.tags.length > 0) {
            if (!vip.tags || vip.tags.length === 0) {
                return false;
            }
            // 檢查是否包含任一標籤
            const hasTag = filters.tags.some(tag =>
                vip.tags.some(vipTag => vipTag.toLowerCase().includes(tag.toLowerCase()))
            );
            if (!hasTag) {
                return false;
            }
        }

        return true;
    });
}

/**
 * 解析 CSV 檔案
 * @param {string} csvContent - CSV 檔案內容
 * @returns {Array} 解析後的資料陣列
 */
function parseCSV(csvContent) {
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
        throw new Error('CSV 檔案格式錯誤');
    }

    // 跳過標題行
    const dataLines = lines.slice(1);
    const vipList = [];

    dataLines.forEach((line, index) => {
        try {
            const values = parseCSVLine(line);
            if (values.length < 5) {
                console.warn(`第 ${index + 2} 行資料不完整，已跳過`);
                return;
            }

            const vip = {
                lastName: values[0]?.trim() || '',
                firstName: values[1]?.trim() || '',
                mainTitle: values[2]?.trim() || '',
                mainOrganization: values[3]?.trim() || '',
                gender: values[4]?.trim() || '',
                otherTitles: parseStringArray(values[5] || ''),
                introduction: values[6]?.trim() || '',
                photoUrl: values[7]?.trim() || '',
                tags: parseStringArray(values[8] || ''),
                introducedRecords: []
            };

            // 驗證必填欄位
            if (!vip.lastName || !vip.firstName || !vip.mainTitle || !vip.mainOrganization || !vip.gender) {
                console.warn(`第 ${index + 2} 行缺少必填欄位，已跳過`);
                return;
            }

            vipList.push(vip);
        } catch (error) {
            console.error(`第 ${index + 2} 行解析錯誤:`, error);
        }
    });

    return vipList;
}

/**
 * 解析 CSV 單行（處理包含逗號的欄位）
 * @param {string} line - CSV 行
 * @returns {Array} 欄位陣列
 */
function parseCSVLine(line) {
    const values = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            values.push(currentValue);
            currentValue = '';
        } else {
            currentValue += char;
        }
    }

    values.push(currentValue);
    return values.map(v => v.replace(/^"|"$/g, '').trim());
}

/**
 * 產生 CSV 內容
 * @param {Array} vipList - 貴賓資料陣列
 * @returns {string} CSV 檔案內容
 */
function generateCSV(vipList) {
    const headers = ['姓氏', '姓名', '主要稱謂', '主要單位', '性別', '其他頭銜', '貴賓介紹', '照片URL', '標籤'];
    const rows = vipList.map(vip => [
        vip.lastName,
        vip.firstName,
        vip.mainTitle,
        vip.mainOrganization,
        vip.gender,
        (vip.otherTitles || []).join(';'),
        vip.introduction || '',
        vip.photoUrl || '',
        (vip.tags || []).join(';')
    ].map(value => `"${value}"`).join(','));

    return [headers.join(','), ...rows].join('\n');
}

/**
 * 驗證貴賓資料
 * @param {Object} vip - 貴賓資料
 * @returns {Object} { valid: boolean, errors: Array }
 */
function validateVip(vip) {
    const errors = [];

    if (!vip.lastName || !vip.lastName.trim()) {
        errors.push('姓氏為必填欄位');
    }

    if (!vip.firstName || !vip.firstName.trim()) {
        errors.push('姓名為必填欄位');
    }

    if (!vip.mainTitle || !vip.mainTitle.trim()) {
        errors.push('主要稱謂為必填欄位');
    }

    if (!vip.mainOrganization || !vip.mainOrganization.trim()) {
        errors.push('主要單位為必填欄位');
    }

    if (!vip.gender || !vip.gender.trim()) {
        errors.push('性別為必填欄位');
    } else if (!['男', '女'].includes(vip.gender)) {
        errors.push('性別必須為「男」或「女」');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
