// 主應用程式邏輯

class VIPManagementApp {
    constructor() {
        this.currentPage = 'guests';
        this.selectMode = false;
        this.selectedGuests = new Set();
        this.currentEditingGuest = null;
        this.otherTitles = [];
    }

    // 初始化應用程式
    async init() {
        console.log('應用程式初始化中...');

        // 等待 Firestore 準備就緒
        try {
            await window.guestCRUD.waitForFirestore();
            console.log('Firestore 已就緒');
        } catch (error) {
            console.error('Firestore 初始化失敗:', error);
            showNotification('資料庫連接失敗，請檢查 Firebase 配置', 'error');
            return;
        }

        // 初始化模態框
        this.initGuestModal();
        this.initDeleteModal();
        window.bulkUploadManager.initBulkUploadModal();

        // 初始化導航
        this.initNavigation();

        // 顯示貴賓頁面
        this.showGuestsPage();
    }

    // 初始化導航
    initNavigation() {
        const navGuestsBtn = document.getElementById('navGuestsBtn');
        const navSearchBtn = document.getElementById('navSearchBtn');

        navGuestsBtn.addEventListener('click', () => {
            this.showGuestsPage();
            this.setActiveNavBtn('navGuestsBtn');
        });

        navSearchBtn.addEventListener('click', () => {
            this.showSearchPage();
            this.setActiveNavBtn('navSearchBtn');
        });

        // 設定初始狀態
        this.setActiveNavBtn('navGuestsBtn');
    }

    // 設定活動導航按鈕
    setActiveNavBtn(btnId) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(btnId)?.classList.add('active');
    }

    // 顯示貴賓頁面
    async showGuestsPage() {
        this.currentPage = 'guests';
        this.selectMode = false;
        this.selectedGuests.clear();

        try {
            showLoading();
            const guests = await window.guestCRUD.getAllGuests();
            this.renderGuestsPage(guests);
            hideLoading();
        } catch (error) {
            console.error('載入貴賓列表失敗:', error);
            hideLoading();
            showNotification('載入貴賓列表失敗', 'error');
        }
    }

    // 渲染貴賓頁面
    renderGuestsPage(guests) {
        const mainContent = document.getElementById('mainContent');

        mainContent.innerHTML = `
            <div class="page-header">
                <h2 class="page-title">貴賓資料庫</h2>
                <div class="page-actions">
                    <button class="btn btn-primary" id="addGuestBtn">新增</button>
                    <button class="btn btn-secondary" id="selectModeBtn">選取</button>
                    <button class="btn btn-secondary" id="bulkUploadBtn">大量上傳</button>
                </div>
            </div>
            <div class="guests-grid" id="guestsGrid">
                <!-- 貴賓卡片將顯示在這裡 -->
            </div>
        `;

        // 顯示貴賓卡片
        this.displayGuests(guests);

        // 綁定按鈕事件
        document.getElementById('addGuestBtn').addEventListener('click', () => {
            this.showAddGuestModal();
        });

        document.getElementById('selectModeBtn').addEventListener('click', () => {
            this.toggleSelectMode();
        });

        document.getElementById('bulkUploadBtn').addEventListener('click', () => {
            window.bulkUploadManager.showBulkUploadModal();
        });
    }

    // 顯示貴賓卡片
    displayGuests(guests) {
        const guestsGrid = document.getElementById('guestsGrid');

        if (guests.length === 0) {
            guestsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">👥</div>
                    <p class="empty-state-text">尚無貴賓資料，請點擊「新增」開始建立</p>
                </div>
            `;
            return;
        }

        guestsGrid.innerHTML = guests.map(guest => this.createGuestCard(guest)).join('');

        // 綁定卡片事件
        this.attachGuestCardListeners();
    }

    // 建立貴賓卡片 HTML
    createGuestCard(guest) {
        const photoHtml = guest.photoURL
            ? `<img src="${guest.photoURL}" alt="${guest.fullName}" class="guest-card-photo">`
            : `<div class="guest-card-photo placeholder">${guest.lastName}</div>`;

        const genderText = guest.gender === 'male' ? '男' : '女';

        const checkboxHtml = this.selectMode
            ? `<input type="checkbox" class="guest-card-checkbox" data-guest-id="${guest.id}">`
            : '';

        const selectingClass = this.selectMode ? 'selecting' : '';

        return `
            <div class="guest-card ${selectingClass}" data-guest-id="${guest.id}">
                ${checkboxHtml}
                ${photoHtml}
                <div class="guest-card-name">${guest.fullName}</div>
                <div class="guest-card-title">${guest.mainTitle}</div>
                <div class="guest-card-organization">${guest.mainOrganization}</div>
                <div class="guest-card-gender">性別：${genderText}</div>
            </div>
        `;
    }

    // 綁定貴賓卡片事件監聽器
    attachGuestCardListeners() {
        const cards = document.querySelectorAll('.guest-card');

        cards.forEach(card => {
            if (this.selectMode) {
                // 選取模式：綁定 checkbox
                const checkbox = card.querySelector('.guest-card-checkbox');
                if (checkbox) {
                    checkbox.addEventListener('change', (e) => {
                        e.stopPropagation();
                        this.handleGuestSelection(card.dataset.guestId, checkbox.checked);
                    });
                }
            } else {
                // 一般模式：點擊顯示詳情
                card.addEventListener('click', () => {
                    this.showGuestDetail(card.dataset.guestId);
                });
            }
        });
    }

    // 切換選取模式
    async toggleSelectMode() {
        this.selectMode = !this.selectMode;
        this.selectedGuests.clear();

        if (this.selectMode) {
            // 進入選取模式
            const guests = await window.guestCRUD.getAllGuests();
            this.renderSelectMode(guests);
        } else {
            // 離開選取模式
            this.showGuestsPage();
        }
    }

    // 渲染選取模式
    renderSelectMode(guests) {
        const mainContent = document.getElementById('mainContent');

        mainContent.innerHTML = `
            <div class="page-header">
                <h2 class="page-title">選取貴賓</h2>
                <div class="page-actions">
                    <button class="btn btn-secondary" id="exitSelectModeBtn">完成</button>
                </div>
            </div>
            <div class="guests-grid" id="guestsGrid">
                <!-- 貴賓卡片將顯示在這裡 -->
            </div>
            <div class="selection-toolbar">
                <div class="selection-info">
                    已選取 <span id="selectedCount">0</span> 位貴賓
                </div>
                <div class="selection-actions">
                    <button class="btn btn-secondary" id="selectAllBtn">全選</button>
                    <button class="btn btn-secondary" id="deselectAllBtn">取消全選</button>
                    <button class="btn btn-delete" id="deleteSelectedBtn" disabled>批量刪除</button>
                </div>
            </div>
        `;

        // 顯示貴賓卡片（選取模式）
        this.displayGuests(guests);

        // 綁定按鈕事件
        document.getElementById('exitSelectModeBtn').addEventListener('click', () => {
            this.toggleSelectMode();
        });

        document.getElementById('selectAllBtn').addEventListener('click', () => {
            this.selectAllGuests(guests);
        });

        document.getElementById('deselectAllBtn').addEventListener('click', () => {
            this.deselectAllGuests();
        });

        document.getElementById('deleteSelectedBtn').addEventListener('click', () => {
            this.showDeleteSelectedModal();
        });
    }

    // 處理貴賓選取
    handleGuestSelection(guestId, isChecked) {
        if (isChecked) {
            this.selectedGuests.add(guestId);
        } else {
            this.selectedGuests.delete(guestId);
        }

        this.updateSelectionCount();
    }

    // 更新選取數量顯示
    updateSelectionCount() {
        const selectedCount = document.getElementById('selectedCount');
        const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');

        if (selectedCount) {
            selectedCount.textContent = this.selectedGuests.size;
        }

        if (deleteSelectedBtn) {
            deleteSelectedBtn.disabled = this.selectedGuests.size === 0;
        }
    }

    // 全選
    selectAllGuests(guests) {
        guests.forEach(guest => {
            this.selectedGuests.add(guest.id);
        });

        // 更新 checkbox
        document.querySelectorAll('.guest-card-checkbox').forEach(checkbox => {
            checkbox.checked = true;
        });

        this.updateSelectionCount();
    }

    // 取消全選
    deselectAllGuests() {
        this.selectedGuests.clear();

        // 更新 checkbox
        document.querySelectorAll('.guest-card-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });

        this.updateSelectionCount();
    }

    // 顯示貴賓詳情
    async showGuestDetail(guestId) {
        try {
            showLoading();
            const guest = await window.guestCRUD.getGuest(guestId);
            this.renderGuestDetail(guest);
            hideLoading();
        } catch (error) {
            console.error('載入貴賓詳情失敗:', error);
            hideLoading();
            showNotification('載入貴賓詳情失敗', 'error');
        }
    }

    // 渲染貴賓詳情
    renderGuestDetail(guest) {
        const mainContent = document.getElementById('mainContent');

        const photoHtml = guest.photoURL
            ? `<img src="${guest.photoURL}" alt="${guest.fullName}" class="detail-photo">`
            : `<div class="detail-photo placeholder">${guest.lastName}</div>`;

        const genderText = guest.gender === 'male' ? '男' : '女';

        const otherTitlesHtml = guest.otherTitles && guest.otherTitles.length > 0
            ? `<div class="detail-section">
                   <h3>其他頭銜</h3>
                   <div class="detail-tags">
                       ${guest.otherTitles.map(title => `<span class="tag">${title}</span>`).join('')}
                   </div>
               </div>`
            : '';

        const introductionHtml = guest.guestIntroduction
            ? `<div class="detail-section">
                   <h3>貴賓介紹</h3>
                   <p>${guest.guestIntroduction}</p>
               </div>`
            : '';

        const recordHtml = guest.introductionRecord
            ? `<div class="detail-section">
                   <h3>介紹紀錄</h3>
                   <p>${guest.introductionRecord}</p>
               </div>`
            : '';

        mainContent.innerHTML = `
            <div class="guest-detail">
                <div class="detail-header">
                    <div class="detail-photo-section">
                        ${photoHtml}
                    </div>
                    <div class="detail-info">
                        <div class="detail-name">${guest.fullName}</div>
                        <div class="detail-title">${guest.mainTitle}</div>
                        <div class="detail-organization">${guest.mainOrganization}</div>
                        <div class="detail-gender">性別：${genderText}</div>
                    </div>
                </div>

                ${otherTitlesHtml}
                ${introductionHtml}
                ${recordHtml}

                <div class="detail-actions">
                    <button class="btn btn-secondary" id="backBtn">返回</button>
                    <button class="btn btn-primary" id="editGuestBtn">編輯</button>
                    <button class="btn btn-delete" id="deleteGuestBtn">刪除</button>
                </div>
            </div>
        `;

        // 綁定按鈕事件
        document.getElementById('backBtn').addEventListener('click', () => {
            this.showGuestsPage();
        });

        document.getElementById('editGuestBtn').addEventListener('click', () => {
            this.showEditGuestModal(guest);
        });

        document.getElementById('deleteGuestBtn').addEventListener('click', () => {
            this.showDeleteModal(guest.id, guest.fullName);
        });
    }

    // 顯示搜尋頁面
    showSearchPage() {
        this.currentPage = 'search';
        window.searchManager.renderSearchPage();
    }

    // ===== 模態框相關 =====

    // 初始化貴賓模態框
    initGuestModal() {
        const modal = document.getElementById('guestModal');
        const modalCloseBtn = document.getElementById('modalCloseBtn');
        const formCancelBtn = document.getElementById('formCancelBtn');
        const guestForm = document.getElementById('guestForm');
        const otherTitlesInput = document.getElementById('otherTitlesInput');

        // 關閉模態框
        modalCloseBtn.addEventListener('click', () => {
            this.closeGuestModal();
        });

        formCancelBtn.addEventListener('click', () => {
            this.closeGuestModal();
        });

        // 點擊模態框背景關閉
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeGuestModal();
            }
        });

        // 其他頭銜輸入（Enter 新增標籤）
        otherTitlesInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = otherTitlesInput.value.trim();
                if (value) {
                    this.addOtherTitle(value);
                    otherTitlesInput.value = '';
                }
            }
        });

        // 表單提交
        guestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleGuestFormSubmit();
        });
    }

    // 顯示新增貴賓模態框
    showAddGuestModal() {
        const modal = document.getElementById('guestModal');
        const modalTitle = document.getElementById('modalTitle');

        modalTitle.textContent = '新增貴賓';
        this.currentEditingGuest = null;
        this.otherTitles = [];

        this.resetGuestForm();
        modal.classList.add('show');
    }

    // 顯示編輯貴賓模態框
    showEditGuestModal(guest) {
        const modal = document.getElementById('guestModal');
        const modalTitle = document.getElementById('modalTitle');

        modalTitle.textContent = '編輯貴賓';
        this.currentEditingGuest = guest;
        this.otherTitles = guest.otherTitles || [];

        this.populateGuestForm(guest);
        modal.classList.add('show');
    }

    // 關閉貴賓模態框
    closeGuestModal() {
        const modal = document.getElementById('guestModal');
        modal.classList.remove('show');
        this.resetGuestForm();
    }

    // 重置表單
    resetGuestForm() {
        const guestForm = document.getElementById('guestForm');
        guestForm.reset();
        this.otherTitles = [];
        this.renderOtherTitles();
    }

    // 填充表單（編輯時）
    populateGuestForm(guest) {
        document.getElementById('lastName').value = guest.lastName;
        document.getElementById('firstName').value = guest.firstName;
        document.getElementById('mainTitle').value = guest.mainTitle;
        document.getElementById('mainOrganization').value = guest.mainOrganization;
        document.getElementById('gender').value = guest.gender;
        document.getElementById('photoURL').value = guest.photoURL || '';
        document.getElementById('guestIntroduction').value = guest.guestIntroduction || '';
        document.getElementById('introductionRecord').value = guest.introductionRecord || '';

        this.renderOtherTitles();
    }

    // 新增其他頭銜
    addOtherTitle(title) {
        if (!this.otherTitles.includes(title)) {
            this.otherTitles.push(title);
            this.renderOtherTitles();
        }
    }

    // 移除其他頭銜
    removeOtherTitle(index) {
        this.otherTitles.splice(index, 1);
        this.renderOtherTitles();
    }

    // 渲染其他頭銜標籤
    renderOtherTitles() {
        const tagsDisplay = document.getElementById('tagsDisplay');

        tagsDisplay.innerHTML = this.otherTitles.map((title, index) => `
            <div class="tag-item">
                ${title}
                <button type="button" class="tag-remove" data-index="${index}">&times;</button>
            </div>
        `).join('');

        // 綁定移除按鈕
        tagsDisplay.querySelectorAll('.tag-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                this.removeOtherTitle(parseInt(btn.dataset.index));
            });
        });
    }

    // 處理表單提交
    async handleGuestFormSubmit() {
        const guestData = {
            lastName: document.getElementById('lastName').value.trim(),
            firstName: document.getElementById('firstName').value.trim(),
            mainTitle: document.getElementById('mainTitle').value.trim(),
            mainOrganization: document.getElementById('mainOrganization').value.trim(),
            gender: document.getElementById('gender').value,
            photoURL: document.getElementById('photoURL').value.trim(),
            guestIntroduction: document.getElementById('guestIntroduction').value.trim(),
            introductionRecord: document.getElementById('introductionRecord').value.trim(),
            otherTitles: this.otherTitles
        };

        try {
            showLoading();

            if (this.currentEditingGuest) {
                // 更新
                await window.guestCRUD.updateGuest(this.currentEditingGuest.id, guestData);
                showNotification('貴賓資料已更新', 'success');
            } else {
                // 新增
                await window.guestCRUD.createGuest(guestData);
                showNotification('貴賓已新增', 'success');
            }

            this.closeGuestModal();
            this.showGuestsPage();
            hideLoading();
        } catch (error) {
            console.error('儲存貴賓資料失敗:', error);
            hideLoading();
            showNotification('儲存失敗，請稍後再試', 'error');
        }
    }

    // 初始化刪除確認模態框
    initDeleteModal() {
        const modal = document.getElementById('deleteModal');
        const deleteModalCancelBtn = document.getElementById('deleteModalCancelBtn');
        const deleteModalConfirmBtn = document.getElementById('deleteModalConfirmBtn');

        deleteModalCancelBtn.addEventListener('click', () => {
            this.closeDeleteModal();
        });

        deleteModalConfirmBtn.addEventListener('click', () => {
            this.confirmDelete();
        });

        // 點擊背景關閉
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeDeleteModal();
            }
        });
    }

    // 顯示刪除確認模態框（單一貴賓）
    showDeleteModal(guestId, guestName) {
        const modal = document.getElementById('deleteModal');
        const deleteTargetInfo = document.getElementById('deleteTargetInfo');

        deleteTargetInfo.textContent = `將刪除：${guestName}`;
        modal.dataset.deleteType = 'single';
        modal.dataset.guestId = guestId;

        modal.classList.add('show');
    }

    // 顯示刪除確認模態框（批量刪除）
    showDeleteSelectedModal() {
        if (this.selectedGuests.size === 0) {
            showNotification('請先選擇要刪除的貴賓', 'error');
            return;
        }

        const modal = document.getElementById('deleteModal');
        const deleteTargetInfo = document.getElementById('deleteTargetInfo');

        deleteTargetInfo.textContent = `將刪除 ${this.selectedGuests.size} 位貴賓`;
        modal.dataset.deleteType = 'multiple';

        modal.classList.add('show');
    }

    // 關閉刪除確認模態框
    closeDeleteModal() {
        const modal = document.getElementById('deleteModal');
        modal.classList.remove('show');
    }

    // 確認刪除
    async confirmDelete() {
        const modal = document.getElementById('deleteModal');
        const deleteType = modal.dataset.deleteType;

        try {
            showLoading();
            this.closeDeleteModal();

            if (deleteType === 'single') {
                const guestId = modal.dataset.guestId;
                await window.guestCRUD.deleteGuest(guestId);
                showNotification('貴賓已刪除', 'success');
                this.showGuestsPage();
            } else if (deleteType === 'multiple') {
                await window.guestCRUD.deleteMultipleGuests(Array.from(this.selectedGuests));
                showNotification(`已刪除 ${this.selectedGuests.size} 位貴賓`, 'success');
                this.toggleSelectMode(); // 離開選取模式並重新整理
            }

            hideLoading();
        } catch (error) {
            console.error('刪除失敗:', error);
            hideLoading();
            showNotification('刪除失敗，請稍後再試', 'error');
        }
    }
}

// 當 DOM 載入完成後初始化應用程式
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 載入完成，準備初始化應用程式...');
    window.app = new VIPManagementApp();

    // 等待 Firebase 初始化完成
    if (window.firebaseApp && window.db) {
        // Firebase 已經準備好，直接初始化
        console.log('Firebase 已就緒，開始初始化應用程式');
        window.app.init();
    } else {
        // 等待 Firebase 初始化完成事件
        console.log('等待 Firebase 初始化...');
        window.addEventListener('firebaseReady', () => {
            console.log('收到 Firebase 就緒事件，開始初始化應用程式');
            window.app.init();
        });

        // 備援：如果 10 秒後還沒收到事件，顯示錯誤
        setTimeout(() => {
            if (!window.firebaseApp || !window.db) {
                console.error('Firebase 初始化超時');
                alert('Firebase 初始化失敗，請重新整理頁面或檢查 Firebase 配置');
            }
        }, 10000);
    }
});
