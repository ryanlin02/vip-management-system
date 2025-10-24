// UI 互動邏輯

// 狀態管理
const appState = {
    currentPage: 'vip-list',
    selectMode: false,
    selectedVips: new Set(),
    allVips: [],
    currentEditingVip: null
};

// DOM 元素
let elements = {};

// 初始化應用程式
document.addEventListener('DOMContentLoaded', () => {
    initElements();
    initEventListeners();
    loadVipList();
});

/**
 * 初始化 DOM 元素引用
 */
function initElements() {
    elements = {
        // 導航
        navButtons: document.querySelectorAll('.nav-btn'),

        // 頁面
        vipListPage: document.getElementById('vip-list-page'),
        searchPage: document.getElementById('search-page'),

        // 貴賓列表頁面
        addVipBtn: document.getElementById('add-vip-btn'),
        toggleSelectBtn: document.getElementById('toggle-select-btn'),
        bulkUploadBtn: document.getElementById('bulk-upload-btn'),
        selectActions: document.getElementById('select-actions'),
        editTagsBtn: document.getElementById('edit-tags-btn'),
        cancelSelectBtn: document.getElementById('cancel-select-btn'),
        selectCount: document.getElementById('select-count'),
        vipGrid: document.getElementById('vip-grid'),

        // 搜尋頁面
        searchKeyword: document.getElementById('search-keyword'),
        searchGender: document.getElementById('search-gender'),
        searchOrganization: document.getElementById('search-organization'),
        searchTags: document.getElementById('search-tags'),
        searchBtn: document.getElementById('search-btn'),
        resetSearchBtn: document.getElementById('reset-search-btn'),
        searchResults: document.getElementById('search-results'),
        resultCount: document.getElementById('result-count'),
        searchGrid: document.getElementById('search-grid'),

        // 貴賓表單模態框
        vipModal: document.getElementById('vip-modal'),
        closeModal: document.getElementById('close-modal'),
        modalTitle: document.getElementById('modal-title'),
        vipForm: document.getElementById('vip-form'),
        vipId: document.getElementById('vip-id'),
        lastName: document.getElementById('lastName'),
        firstName: document.getElementById('firstName'),
        mainTitle: document.getElementById('mainTitle'),
        gender: document.getElementById('gender'),
        mainOrganization: document.getElementById('mainOrganization'),
        otherTitles: document.getElementById('otherTitles'),
        photoUrl: document.getElementById('photoUrl'),
        tags: document.getElementById('tags'),
        introduction: document.getElementById('introduction'),
        recordsContainer: document.getElementById('records-container'),
        addRecordBtn: document.getElementById('add-record-btn'),
        cancelFormBtn: document.getElementById('cancel-form-btn'),

        // 大量上傳模態框
        bulkUploadModal: document.getElementById('bulk-upload-modal'),
        closeBulkModal: document.getElementById('close-bulk-modal'),
        csvFileInput: document.getElementById('csv-file-input'),
        selectFileBtn: document.getElementById('select-file-btn'),
        fileName: document.getElementById('file-name'),
        uploadCsvBtn: document.getElementById('upload-csv-btn'),
        cancelBulkBtn: document.getElementById('cancel-bulk-btn'),

        // 批量編輯標籤模態框
        editTagsModal: document.getElementById('edit-tags-modal'),
        closeTagsModal: document.getElementById('close-tags-modal'),
        selectedCount: document.getElementById('selected-count'),
        bulkTagsInput: document.getElementById('bulk-tags-input'),
        saveBulkTagsBtn: document.getElementById('save-bulk-tags-btn'),
        cancelTagsBtn: document.getElementById('cancel-tags-btn')
    };
}

/**
 * 初始化事件監聽器
 */
function initEventListeners() {
    // 導航按鈕
    elements.navButtons.forEach(btn => {
        btn.addEventListener('click', () => handleNavigation(btn.dataset.page));
    });

    // 貴賓列表頁面
    elements.addVipBtn.addEventListener('click', () => openVipModal());
    elements.toggleSelectBtn.addEventListener('click', toggleSelectMode);
    elements.bulkUploadBtn.addEventListener('click', openBulkUploadModal);
    elements.editTagsBtn.addEventListener('click', openEditTagsModal);
    elements.cancelSelectBtn.addEventListener('click', toggleSelectMode);

    // 搜尋頁面
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.resetSearchBtn.addEventListener('click', resetSearch);

    // 貴賓表單模態框
    elements.closeModal.addEventListener('click', closeVipModal);
    elements.cancelFormBtn.addEventListener('click', closeVipModal);
    elements.vipForm.addEventListener('submit', handleVipFormSubmit);
    elements.addRecordBtn.addEventListener('click', addRecordField);
    elements.vipModal.addEventListener('click', (e) => {
        if (e.target === elements.vipModal) closeVipModal();
    });

    // 大量上傳模態框
    elements.closeBulkModal.addEventListener('click', closeBulkUploadModal);
    elements.cancelBulkBtn.addEventListener('click', closeBulkUploadModal);
    elements.selectFileBtn.addEventListener('click', () => elements.csvFileInput.click());
    elements.csvFileInput.addEventListener('change', handleFileSelect);
    elements.uploadCsvBtn.addEventListener('click', handleCsvUpload);
    elements.bulkUploadModal.addEventListener('click', (e) => {
        if (e.target === elements.bulkUploadModal) closeBulkUploadModal();
    });

    // 批量編輯標籤模態框
    elements.closeTagsModal.addEventListener('click', closeEditTagsModal);
    elements.cancelTagsBtn.addEventListener('click', closeEditTagsModal);
    elements.saveBulkTagsBtn.addEventListener('click', handleBulkTagsUpdate);
    elements.editTagsModal.addEventListener('click', (e) => {
        if (e.target === elements.editTagsModal) closeEditTagsModal();
    });
}

/**
 * 處理導航
 */
function handleNavigation(page) {
    appState.currentPage = page;

    // 更新導航按鈕狀態
    elements.navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === page);
    });

    // 切換頁面顯示
    elements.vipListPage.classList.toggle('active', page === 'vip-list');
    elements.searchPage.classList.toggle('active', page === 'search');

    // 重置選取模式
    if (appState.selectMode) {
        toggleSelectMode();
    }
}

/**
 * 載入貴賓列表
 */
async function loadVipList() {
    try {
        elements.vipGrid.innerHTML = '<div class="loading">載入中...</div>';
        const vips = await dbService.getAllVips();
        appState.allVips = vips;
        renderVipList(vips);
    } catch (error) {
        console.error('載入貴賓列表失敗:', error);
        elements.vipGrid.innerHTML = '<div class="loading">載入失敗，請重新整理頁面</div>';
        alert('載入貴賓列表失敗: ' + error.message);
    }
}

/**
 * 渲染貴賓列表
 */
function renderVipList(vips, container = elements.vipGrid) {
    if (vips.length === 0) {
        container.innerHTML = '<div class="loading">暫無貴賓資料</div>';
        return;
    }

    container.innerHTML = vips.map(vip => createVipCard(vip)).join('');

    // 添加事件監聽器
    container.querySelectorAll('.vip-card').forEach(card => {
        const vipId = card.dataset.id;

        if (appState.selectMode) {
            // 選取模式：點擊卡片選取/取消選取
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('vip-card-checkbox')) {
                    const checkbox = card.querySelector('.vip-card-checkbox');
                    checkbox.checked = !checkbox.checked;
                    handleVipSelect(vipId, checkbox.checked);
                }
            });

            // 複選框事件
            const checkbox = card.querySelector('.vip-card-checkbox');
            checkbox.addEventListener('change', (e) => {
                handleVipSelect(vipId, e.target.checked);
            });
        } else {
            // 一般模式：點擊卡片查看詳情
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('btn')) {
                    const vip = appState.allVips.find(v => v.id === vipId);
                    openVipModal(vip);
                }
            });

            // 編輯按鈕
            const editBtn = card.querySelector('.edit-vip-btn');
            if (editBtn) {
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const vip = appState.allVips.find(v => v.id === vipId);
                    openVipModal(vip);
                });
            }

            // 刪除按鈕
            const deleteBtn = card.querySelector('.delete-vip-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleDeleteVip(vipId);
                });
            }
        }
    });
}

/**
 * 建立貴賓卡片 HTML
 */
function createVipCard(vip) {
    const fullName = `${vip.lastName}${vip.firstName}`;
    const tagsHtml = vip.tags && vip.tags.length > 0
        ? `<div class="vip-tags">${vip.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`
        : '';

    const photoHtml = vip.photoUrl
        ? `<div class="vip-photo"><img src="${vip.photoUrl}" alt="${fullName}"></div>`
        : `<div class="vip-photo">無照片</div>`;

    const selectCheckbox = appState.selectMode
        ? `<input type="checkbox" class="vip-card-checkbox" ${appState.selectedVips.has(vip.id) ? 'checked' : ''}>`
        : '';

    const actions = !appState.selectMode
        ? `<div class="vip-actions">
                <button class="btn btn-secondary edit-vip-btn">編輯</button>
                <button class="btn btn-danger delete-vip-btn">刪除</button>
            </div>`
        : '';

    return `
        <div class="vip-card ${appState.selectMode ? 'selectable' : ''} ${appState.selectedVips.has(vip.id) ? 'selected' : ''}" data-id="${vip.id}">
            ${selectCheckbox}
            ${photoHtml}
            <div class="vip-info">
                <div class="vip-name">${fullName}</div>
                <div class="vip-title">${vip.mainTitle}</div>
                <div class="vip-organization">${vip.mainOrganization}</div>
                ${tagsHtml}
                ${actions}
            </div>
        </div>
    `;
}

/**
 * 切換選取模式
 */
function toggleSelectMode() {
    appState.selectMode = !appState.selectMode;
    appState.selectedVips.clear();

    // 更新 UI
    elements.selectActions.style.display = appState.selectMode ? 'flex' : 'none';
    elements.toggleSelectBtn.textContent = appState.selectMode ? '取消選取' : '選取';

    // 重新渲染列表
    renderVipList(appState.allVips);
    updateSelectCount();
}

/**
 * 處理貴賓選取
 */
function handleVipSelect(vipId, selected) {
    if (selected) {
        appState.selectedVips.add(vipId);
    } else {
        appState.selectedVips.delete(vipId);
    }

    // 更新卡片樣式
    const card = elements.vipGrid.querySelector(`[data-id="${vipId}"]`);
    if (card) {
        card.classList.toggle('selected', selected);
    }

    updateSelectCount();
}

/**
 * 更新選取數量顯示
 */
function updateSelectCount() {
    const count = appState.selectedVips.size;
    elements.selectCount.textContent = `已選取 ${count} 位`;
}

/**
 * 開啟貴賓表單模態框
 */
function openVipModal(vip = null) {
    appState.currentEditingVip = vip;

    if (vip) {
        // 編輯模式
        elements.modalTitle.textContent = '編輯貴賓';
        elements.vipId.value = vip.id;
        elements.lastName.value = vip.lastName;
        elements.firstName.value = vip.firstName;
        elements.mainTitle.value = vip.mainTitle;
        elements.gender.value = vip.gender;
        elements.mainOrganization.value = vip.mainOrganization;
        elements.otherTitles.value = (vip.otherTitles || []).join(', ');
        elements.photoUrl.value = vip.photoUrl || '';
        elements.tags.value = (vip.tags || []).join(', ');
        elements.introduction.value = vip.introduction || '';

        // 渲染介紹紀錄
        renderRecords(vip.introducedRecords || []);
    } else {
        // 新增模式
        elements.modalTitle.textContent = '新增貴賓';
        elements.vipForm.reset();
        elements.recordsContainer.innerHTML = '';
    }

    elements.vipModal.classList.add('active');
}

/**
 * 關閉貴賓表單模態框
 */
function closeVipModal() {
    elements.vipModal.classList.remove('active');
    elements.vipForm.reset();
    appState.currentEditingVip = null;
}

/**
 * 渲染介紹紀錄
 */
function renderRecords(records) {
    elements.recordsContainer.innerHTML = records.map((record, index) =>
        createRecordField(record.date, record.event, index)
    ).join('');

    // 添加刪除按鈕事件
    elements.recordsContainer.querySelectorAll('.remove-record-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => removeRecordField(index));
    });
}

/**
 * 建立介紹紀錄欄位
 */
function createRecordField(date = '', event = '', index = 0) {
    return `
        <div class="record-item" data-index="${index}">
            <input type="date" class="record-date" value="${date}" placeholder="日期">
            <input type="text" class="record-event" value="${event}" placeholder="活動名稱">
            <button type="button" class="btn btn-danger btn-small remove-record-btn">刪除</button>
        </div>
    `;
}

/**
 * 新增介紹紀錄欄位
 */
function addRecordField() {
    const index = elements.recordsContainer.children.length;
    const html = createRecordField('', '', index);
    elements.recordsContainer.insertAdjacentHTML('beforeend', html);

    // 添加刪除按鈕事件
    const newRecord = elements.recordsContainer.lastElementChild;
    const removeBtn = newRecord.querySelector('.remove-record-btn');
    removeBtn.addEventListener('click', () => removeRecordField(index));
}

/**
 * 移除介紹紀錄欄位
 */
function removeRecordField(index) {
    const record = elements.recordsContainer.querySelector(`[data-index="${index}"]`);
    if (record) {
        record.remove();
    }
}

/**
 * 處理貴賓表單提交
 */
async function handleVipFormSubmit(e) {
    e.preventDefault();

    try {
        // 收集表單資料
        const vipData = {
            lastName: elements.lastName.value.trim(),
            firstName: elements.firstName.value.trim(),
            mainTitle: elements.mainTitle.value.trim(),
            gender: elements.gender.value,
            mainOrganization: elements.mainOrganization.value.trim(),
            otherTitles: parseStringArray(elements.otherTitles.value),
            photoUrl: elements.photoUrl.value.trim(),
            tags: parseStringArray(elements.tags.value),
            introduction: elements.introduction.value.trim(),
            introducedRecords: collectRecords()
        };

        // 驗證資料
        const validation = validateVip(vipData);
        if (!validation.valid) {
            alert(validation.errors.join('\n'));
            return;
        }

        // 新增或更新
        const vipId = elements.vipId.value;
        if (vipId) {
            await dbService.updateVip(vipId, vipData);
            alert('貴賓資料已更新');
        } else {
            await dbService.addVip(vipData);
            alert('貴賓資料已新增');
        }

        // 關閉模態框並重新載入列表
        closeVipModal();
        await loadVipList();
    } catch (error) {
        console.error('儲存貴賓資料失敗:', error);
        alert('儲存失敗: ' + error.message);
    }
}

/**
 * 收集介紹紀錄
 */
function collectRecords() {
    const records = [];
    elements.recordsContainer.querySelectorAll('.record-item').forEach(item => {
        const date = item.querySelector('.record-date').value;
        const event = item.querySelector('.record-event').value.trim();

        if (date && event) {
            records.push({ date, event });
        }
    });
    return records;
}

/**
 * 處理刪除貴賓
 */
async function handleDeleteVip(vipId) {
    const vip = appState.allVips.find(v => v.id === vipId);
    const fullName = `${vip.lastName}${vip.firstName}`;

    if (!confirm(`確定要刪除 ${fullName} 的資料嗎？此操作無法復原。`)) {
        return;
    }

    try {
        await dbService.deleteVip(vipId);
        alert('貴賓資料已刪除');
        await loadVipList();
    } catch (error) {
        console.error('刪除貴賓資料失敗:', error);
        alert('刪除失敗: ' + error.message);
    }
}

/**
 * 開啟大量上傳模態框
 */
function openBulkUploadModal() {
    elements.fileName.textContent = '';
    elements.csvFileInput.value = '';
    elements.uploadCsvBtn.disabled = true;
    elements.bulkUploadModal.classList.add('active');
}

/**
 * 關閉大量上傳模態框
 */
function closeBulkUploadModal() {
    elements.bulkUploadModal.classList.remove('active');
}

/**
 * 處理檔案選擇
 */
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        elements.fileName.textContent = `已選擇: ${file.name}`;
        elements.uploadCsvBtn.disabled = false;
    } else {
        elements.fileName.textContent = '';
        elements.uploadCsvBtn.disabled = true;
    }
}

/**
 * 處理 CSV 上傳
 */
async function handleCsvUpload() {
    const file = elements.csvFileInput.files[0];
    if (!file) {
        alert('請選擇檔案');
        return;
    }

    try {
        const content = await readFileAsText(file);
        const vipList = parseCSV(content);

        if (vipList.length === 0) {
            alert('CSV 檔案中沒有有效的資料');
            return;
        }

        if (!confirm(`即將上傳 ${vipList.length} 筆貴賓資料，確定繼續嗎？`)) {
            return;
        }

        const results = await dbService.batchAddVips(vipList);

        let message = `上傳完成\n成功: ${results.success} 筆\n失敗: ${results.failed} 筆`;
        if (results.errors.length > 0) {
            message += '\n\n失敗項目:\n' + results.errors.map(e => `${e.vip}: ${e.error}`).join('\n');
        }

        alert(message);
        closeBulkUploadModal();
        await loadVipList();
    } catch (error) {
        console.error('CSV 上傳失敗:', error);
        alert('上傳失敗: ' + error.message);
    }
}

/**
 * 讀取檔案為文字
 */
function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file, 'UTF-8');
    });
}

/**
 * 開啟批量編輯標籤模態框
 */
function openEditTagsModal() {
    if (appState.selectedVips.size === 0) {
        alert('請先選取貴賓');
        return;
    }

    elements.selectedCount.textContent = appState.selectedVips.size;
    elements.bulkTagsInput.value = '';
    elements.editTagsModal.classList.add('active');
}

/**
 * 關閉批量編輯標籤模態框
 */
function closeEditTagsModal() {
    elements.editTagsModal.classList.remove('active');
}

/**
 * 處理批量更新標籤
 */
async function handleBulkTagsUpdate() {
    const tagsInput = elements.bulkTagsInput.value.trim();
    const tags = parseStringArray(tagsInput);

    if (!confirm(`確定要將 ${appState.selectedVips.size} 位貴賓的標籤更新為「${tags.join(', ')}」嗎？`)) {
        return;
    }

    try {
        const ids = Array.from(appState.selectedVips);
        await dbService.batchUpdateTags(ids, tags);

        alert('標籤已更新');
        closeEditTagsModal();
        toggleSelectMode();
        await loadVipList();
    } catch (error) {
        console.error('批量更新標籤失敗:', error);
        alert('更新失敗: ' + error.message);
    }
}

/**
 * 處理搜尋
 */
async function handleSearch() {
    const filters = {
        keyword: elements.searchKeyword.value.trim(),
        gender: elements.searchGender.value,
        organization: elements.searchOrganization.value.trim(),
        tags: parseStringArray(elements.searchTags.value)
    };

    try {
        const results = await dbService.searchVips(filters);
        elements.resultCount.textContent = results.length;
        elements.searchResults.style.display = 'block';
        renderVipList(results, elements.searchGrid);
    } catch (error) {
        console.error('搜尋失敗:', error);
        alert('搜尋失敗: ' + error.message);
    }
}

/**
 * 重置搜尋
 */
function resetSearch() {
    elements.searchKeyword.value = '';
    elements.searchGender.value = '';
    elements.searchOrganization.value = '';
    elements.searchTags.value = '';
    elements.searchResults.style.display = 'none';
    elements.searchGrid.innerHTML = '';
}
