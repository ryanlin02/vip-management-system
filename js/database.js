// 資料庫操作模組

/**
 * 資料庫服務類
 */
class DatabaseService {
    constructor() {
        this.vipCollection = db.collection(COLLECTIONS.VIP);
    }

    /**
     * 獲取所有貴賓資料
     * @returns {Promise<Array>} 貴賓資料陣列
     */
    async getAllVips() {
        try {
            const snapshot = await this.vipCollection.get();
            const vips = [];

            snapshot.forEach(doc => {
                vips.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return sortVipsByLastName(vips);
        } catch (error) {
            console.error('獲取貴賓資料失敗:', error);
            throw error;
        }
    }

    /**
     * 根據 ID 獲取單個貴賓資料
     * @param {string} id - 貴賓 ID
     * @returns {Promise<Object>} 貴賓資料
     */
    async getVipById(id) {
        try {
            const doc = await this.vipCollection.doc(id).get();

            if (!doc.exists) {
                throw new Error('貴賓資料不存在');
            }

            return {
                id: doc.id,
                ...doc.data()
            };
        } catch (error) {
            console.error('獲取貴賓資料失敗:', error);
            throw error;
        }
    }

    /**
     * 新增貴賓資料
     * @param {Object} vipData - 貴賓資料
     * @returns {Promise<Object>} 新增的貴賓資料（包含 ID）
     */
    async addVip(vipData) {
        try {
            // 驗證資料
            const validation = validateVip(vipData);
            if (!validation.valid) {
                throw new Error(validation.errors.join(', '));
            }

            // 準備資料
            const data = {
                ...vipData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            // 新增到資料庫
            const docRef = await this.vipCollection.add(data);

            return {
                id: docRef.id,
                ...vipData
            };
        } catch (error) {
            console.error('新增貴賓資料失敗:', error);
            throw error;
        }
    }

    /**
     * 更新貴賓資料
     * @param {string} id - 貴賓 ID
     * @param {Object} vipData - 更新的貴賓資料
     * @returns {Promise<void>}
     */
    async updateVip(id, vipData) {
        try {
            // 驗證資料
            const validation = validateVip(vipData);
            if (!validation.valid) {
                throw new Error(validation.errors.join(', '));
            }

            // 準備資料
            const data = {
                ...vipData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            // 更新資料庫
            await this.vipCollection.doc(id).update(data);
        } catch (error) {
            console.error('更新貴賓資料失敗:', error);
            throw error;
        }
    }

    /**
     * 刪除貴賓資料
     * @param {string} id - 貴賓 ID
     * @returns {Promise<void>}
     */
    async deleteVip(id) {
        try {
            await this.vipCollection.doc(id).delete();
        } catch (error) {
            console.error('刪除貴賓資料失敗:', error);
            throw error;
        }
    }

    /**
     * 批量新增貴賓資料
     * @param {Array} vipList - 貴賓資料陣列
     * @returns {Promise<Object>} { success: number, failed: number, errors: Array }
     */
    async batchAddVips(vipList) {
        const results = {
            success: 0,
            failed: 0,
            errors: []
        };

        for (const vip of vipList) {
            try {
                await this.addVip(vip);
                results.success++;
            } catch (error) {
                results.failed++;
                results.errors.push({
                    vip: `${vip.lastName}${vip.firstName}`,
                    error: error.message
                });
            }
        }

        return results;
    }

    /**
     * 批量更新貴賓標籤
     * @param {Array} ids - 貴賓 ID 陣列
     * @param {Array} tags - 標籤陣列
     * @returns {Promise<Object>} { success: number, failed: number }
     */
    async batchUpdateTags(ids, tags) {
        const results = {
            success: 0,
            failed: 0
        };

        // 使用批次寫入
        const batch = db.batch();

        try {
            for (const id of ids) {
                const docRef = this.vipCollection.doc(id);
                batch.update(docRef, {
                    tags: tags,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            await batch.commit();
            results.success = ids.length;
        } catch (error) {
            console.error('批量更新標籤失敗:', error);
            results.failed = ids.length;
            throw error;
        }

        return results;
    }

    /**
     * 搜尋貴賓資料
     * @param {Object} filters - 搜尋條件
     * @returns {Promise<Array>} 搜尋結果
     */
    async searchVips(filters) {
        try {
            // 由於 Firestore 查詢限制，先獲取所有資料再過濾
            const allVips = await this.getAllVips();
            return filterVips(allVips, filters);
        } catch (error) {
            console.error('搜尋貴賓資料失敗:', error);
            throw error;
        }
    }
}

// 建立資料庫服務實例
const dbService = new DatabaseService();
