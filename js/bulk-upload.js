// 大量上傳功能模組

class BulkUploadManager {
    constructor() {
        this.selectedFile = null;
        this.parsedData = [];
    }

    // 初始化大量上傳模態框
    initBulkUploadModal() {
        const modal = document.getElementById('bulkUploadModal');
        const selectFileBtn = document.getElementById('selectFileBtn');
        const bulkUploadFile = document.getElementById('bulkUploadFile');
        const bulkUploadSubmitBtn = document.getElementById('bulkUploadSubmitBtn');
        const bulkUploadCancelBtn = document.getElementById('bulkUploadCancelBtn');
        const bulkUploadCloseBtn = document.getElementById('bulkUploadCloseBtn');

        // 選擇檔案
        selectFileBtn.addEventListener('click', () => {
            bulkUploadFile.click();
        });

        // 檔案選擇變更
        bulkUploadFile.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0]);
        });

        // 開始上傳
        bulkUploadSubmitBtn.addEventListener('click', () => {
            this.uploadData();
        });

        // 取消/關閉
        bulkUploadCancelBtn.addEventListener('click', () => {
            this.closeBulkUploadModal();
        });

        bulkUploadCloseBtn.addEventListener('click', () => {
            this.closeBulkUploadModal();
        });

        // 點擊模態框背景關閉
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeBulkUploadModal();
            }
        });
    }

    // 顯示大量上傳模態框
    showBulkUploadModal() {
        const modal = document.getElementById('bulkUploadModal');
        modal.classList.add('show');
        this.resetUploadForm();
    }

    // 關閉大量上傳模態框
    closeBulkUploadModal() {
        const modal = document.getElementById('bulkUploadModal');
        modal.classList.remove('show');
        this.resetUploadForm();
    }

    // 重置上傳表單
    resetUploadForm() {
        const bulkUploadFile = document.getElementById('bulkUploadFile');
        const selectedFileName = document.getElementById('selectedFileName');
        const bulkUploadSubmitBtn = document.getElementById('bulkUploadSubmitBtn');
        const uploadProgress = document.getElementById('uploadProgress');

        bulkUploadFile.value = '';
        selectedFileName.textContent = '';
        bulkUploadSubmitBtn.disabled = true;
        uploadProgress.style.display = 'none';
        this.selectedFile = null;
        this.parsedData = [];
    }

    // 處理檔案選擇
    handleFileSelect(file) {
        if (!file) return;

        const selectedFileName = document.getElementById('selectedFileName');
        const bulkUploadSubmitBtn = document.getElementById('bulkUploadSubmitBtn');

        // 檢查檔案類型
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (fileExtension !== 'csv' && fileExtension !== 'json') {
            showNotification('請選擇 CSV 或 JSON 檔案', 'error');
            return;
        }

        this.selectedFile = file;
        selectedFileName.textContent = `已選擇：${file.name}`;

        // 解析檔案
        this.parseFile(file, fileExtension);
    }

    // 解析檔案
    async parseFile(file, fileExtension) {
        try {
            const fileContent = await this.readFileContent(file);

            if (fileExtension === 'csv') {
                this.parsedData = this.parseCSV(fileContent);
            } else if (fileExtension === 'json') {
                this.parsedData = this.parseJSON(fileContent);
            }

            // 驗證資料
            const validationResult = this.validateData(this.parsedData);

            if (validationResult.valid) {
                const bulkUploadSubmitBtn = document.getElementById('bulkUploadSubmitBtn');
                bulkUploadSubmitBtn.disabled = false;
                showNotification(`檔案解析成功，共 ${this.parsedData.length} 筆資料`, 'success');
            } else {
                showNotification(`資料驗證失敗：${validationResult.errors.join(', ')}`, 'error');
            }
        } catch (error) {
            console.error('解析檔案失敗:', error);
            showNotification('檔案解析失敗，請檢查格式是否正確', 'error');
        }
    }

    // 讀取檔案內容
    readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file, 'UTF-8');
        });
    }

    // 解析 CSV
    parseCSV(csvContent) {
        const lines = csvContent.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            throw new Error('CSV 檔案格式錯誤');
        }

        // 解析標題行
        const headers = lines[0].split(',').map(h => h.trim());

        // 解析資料行
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            const row = {};

            // 對應欄位
            headers.forEach((header, index) => {
                const value = values[index] || '';
                switch (header) {
                    case '姓氏':
                        row.lastName = value;
                        break;
                    case '名字':
                        row.firstName = value;
                        break;
                    case '主要稱謂':
                        row.mainTitle = value;
                        break;
                    case '主要單位':
                        row.mainOrganization = value;
                        break;
                    case '性別':
                        row.gender = value === '女' || value === 'female' ? 'female' : 'male';
                        break;
                    case '其他頭銜':
                        row.otherTitles = value ? value.split('|').map(t => t.trim()) : [];
                        break;
                    case '照片URL':
                        row.photoURL = value;
                        break;
                    case '貴賓介紹':
                        row.guestIntroduction = value;
                        break;
                    case '介紹紀錄':
                        row.introductionRecord = value;
                        break;
                }
            });

            if (row.lastName && row.firstName) {
                data.push(row);
            }
        }

        return data;
    }

    // 解析 CSV 行（處理逗號和引號）
    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        values.push(current.trim());
        return values;
    }

    // 解析 JSON
    parseJSON(jsonContent) {
        try {
            const data = JSON.parse(jsonContent);

            if (!Array.isArray(data)) {
                throw new Error('JSON 格式必須是陣列');
            }

            // 標準化資料格式
            return data.map(item => ({
                lastName: item.lastName || item.姓氏,
                firstName: item.firstName || item.名字,
                mainTitle: item.mainTitle || item.主要稱謂,
                mainOrganization: item.mainOrganization || item.主要單位,
                gender: item.gender || (item.性別 === '女' ? 'female' : 'male'),
                otherTitles: item.otherTitles || item.其他頭銜 || [],
                photoURL: item.photoURL || item.照片URL || '',
                guestIntroduction: item.guestIntroduction || item.貴賓介紹 || '',
                introductionRecord: item.introductionRecord || item.介紹紀錄 || ''
            }));
        } catch (error) {
            throw new Error('JSON 解析失敗：' + error.message);
        }
    }

    // 驗證資料
    validateData(data) {
        const errors = [];

        if (!data || data.length === 0) {
            errors.push('沒有有效的資料');
            return { valid: false, errors };
        }

        data.forEach((item, index) => {
            if (!item.lastName) {
                errors.push(`第 ${index + 1} 筆：缺少姓氏`);
            }
            if (!item.firstName) {
                errors.push(`第 ${index + 1} 筆：缺少名字`);
            }
            if (!item.mainTitle) {
                errors.push(`第 ${index + 1} 筆：缺少主要稱謂`);
            }
            if (!item.mainOrganization) {
                errors.push(`第 ${index + 1} 筆：缺少主要單位`);
            }
            if (!item.gender || (item.gender !== 'male' && item.gender !== 'female')) {
                errors.push(`第 ${index + 1} 筆：性別格式錯誤`);
            }
        });

        // 限制錯誤訊息數量
        if (errors.length > 5) {
            errors.splice(5);
            errors.push('...(還有更多錯誤)');
        }

        return { valid: errors.length === 0, errors };
    }

    // 上傳資料
    async uploadData() {
        if (!this.parsedData || this.parsedData.length === 0) {
            showNotification('沒有可上傳的資料', 'error');
            return;
        }

        const uploadProgress = document.getElementById('uploadProgress');
        const progressBarFill = document.getElementById('progressBarFill');
        const progressText = document.getElementById('progressText');
        const bulkUploadSubmitBtn = document.getElementById('bulkUploadSubmitBtn');

        try {
            uploadProgress.style.display = 'block';
            bulkUploadSubmitBtn.disabled = true;

            let successCount = 0;
            let failCount = 0;

            for (let i = 0; i < this.parsedData.length; i++) {
                try {
                    await window.guestCRUD.createGuest(this.parsedData[i]);
                    successCount++;
                } catch (error) {
                    console.error(`上傳第 ${i + 1} 筆失敗:`, error);
                    failCount++;
                }

                // 更新進度條
                const progress = ((i + 1) / this.parsedData.length) * 100;
                progressBarFill.style.width = `${progress}%`;
                progressText.textContent = `已上傳 ${i + 1} / ${this.parsedData.length}`;
            }

            // 上傳完成
            showNotification(`上傳完成！成功：${successCount} 筆，失敗：${failCount} 筆`, 'success');
            this.closeBulkUploadModal();

            // 重新整理貴賓列表
            if (window.app && window.app.currentPage === 'guests') {
                window.app.showGuestsPage();
            }
        } catch (error) {
            console.error('批量上傳失敗:', error);
            showNotification('上傳失敗，請稍後再試', 'error');
        } finally {
            uploadProgress.style.display = 'none';
            bulkUploadSubmitBtn.disabled = false;
        }
    }
}

// 建立全域實例
window.bulkUploadManager = new BulkUploadManager();
