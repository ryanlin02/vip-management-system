// 搜尋功能模組

class SearchManager {
    constructor() {
        this.searchResults = [];
        this.currentFilters = {};
    }

    // 渲染搜尋頁面
    renderSearchPage() {
        const mainContent = document.getElementById('mainContent');

        mainContent.innerHTML = `
            <div class="search-container">
                <h2 class="search-title">搜尋貴賓</h2>
                <div class="search-filters">
                    <div class="filter-group">
                        <label for="searchKeyword">關鍵字</label>
                        <input type="text" id="searchKeyword" placeholder="搜尋姓名、單位或稱謂">
                    </div>
                    <div class="filter-group">
                        <label for="searchGender">性別</label>
                        <select id="searchGender">
                            <option value="">全部</option>
                            <option value="male">男</option>
                            <option value="female">女</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="searchOrganization">單位</label>
                        <input type="text" id="searchOrganization" placeholder="例：嘉義市政府">
                    </div>
                    <div class="filter-group">
                        <label for="searchTitle">稱謂</label>
                        <input type="text" id="searchTitle" placeholder="例：市長、局長">
                    </div>
                </div>
            </div>

            <div class="search-results-header">
                <h3 class="results-count" id="resultsCount">共 0 筆結果</h3>
            </div>

            <div class="guests-grid" id="searchResultsGrid">
                <!-- 搜尋結果將顯示在這裡 -->
            </div>
        `;

        this.attachSearchListeners();
        this.performSearch(); // 初始顯示所有貴賓
    }

    // 綁定搜尋相關的事件監聽器
    attachSearchListeners() {
        const searchKeyword = document.getElementById('searchKeyword');
        const searchGender = document.getElementById('searchGender');
        const searchOrganization = document.getElementById('searchOrganization');
        const searchTitle = document.getElementById('searchTitle');

        // 即時搜尋（輸入時延遲執行）
        let searchTimeout;
        const handleSearch = () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch();
            }, 300);
        };

        searchKeyword.addEventListener('input', handleSearch);
        searchGender.addEventListener('change', handleSearch);
        searchOrganization.addEventListener('input', handleSearch);
        searchTitle.addEventListener('input', handleSearch);
    }

    // 執行搜尋
    async performSearch() {
        try {
            showLoading();

            // 收集搜尋條件
            const filters = {};
            const keyword = document.getElementById('searchKeyword')?.value.trim();
            const gender = document.getElementById('searchGender')?.value;
            const organization = document.getElementById('searchOrganization')?.value.trim();
            const title = document.getElementById('searchTitle')?.value.trim();

            if (keyword) filters.keyword = keyword;
            if (gender) filters.gender = gender;
            if (organization) filters.organization = organization;
            if (title) filters.title = title;

            this.currentFilters = filters;

            // 執行搜尋
            this.searchResults = await window.guestCRUD.searchGuests(filters);

            // 顯示結果
            this.displayResults();

            hideLoading();
        } catch (error) {
            console.error('搜尋失敗:', error);
            hideLoading();
            showNotification('搜尋失敗，請稍後再試', 'error');
        }
    }

    // 顯示搜尋結果
    displayResults() {
        const resultsGrid = document.getElementById('searchResultsGrid');
        const resultsCount = document.getElementById('resultsCount');

        if (!resultsGrid) return;

        // 更新結果數量
        resultsCount.textContent = `共 ${this.searchResults.length} 筆結果`;

        // 如果沒有結果
        if (this.searchResults.length === 0) {
            resultsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <p class="empty-state-text">找不到符合條件的貴賓</p>
                </div>
            `;
            return;
        }

        // 顯示結果卡片
        resultsGrid.innerHTML = this.searchResults.map(guest => this.createGuestCard(guest)).join('');

        // 綁定卡片點擊事件
        resultsGrid.querySelectorAll('.guest-card').forEach(card => {
            card.addEventListener('click', () => {
                const guestId = card.dataset.guestId;
                if (window.app) {
                    window.app.showGuestDetail(guestId);
                }
            });
        });
    }

    // 建立貴賓卡片 HTML
    createGuestCard(guest) {
        const photoHtml = guest.photoURL
            ? `<img src="${guest.photoURL}" alt="${guest.fullName}" class="guest-card-photo">`
            : `<div class="guest-card-photo placeholder">${guest.lastName}</div>`;

        const genderText = guest.gender === 'male' ? '男' : '女';

        return `
            <div class="guest-card" data-guest-id="${guest.id}">
                ${photoHtml}
                <div class="guest-card-name">${guest.fullName}</div>
                <div class="guest-card-title">${guest.mainTitle}</div>
                <div class="guest-card-organization">${guest.mainOrganization}</div>
                <div class="guest-card-gender">性別：${genderText}</div>
            </div>
        `;
    }

    // 取得所有不重複的單位列表（用於篩選器）
    async getOrganizations() {
        try {
            const guests = await window.guestCRUD.getAllGuests();
            const organizations = [...new Set(guests.map(g => g.mainOrganization))];
            return organizations.sort();
        } catch (error) {
            console.error('取得單位列表失敗:', error);
            return [];
        }
    }

    // 取得所有不重複的稱謂列表（用於篩選器）
    async getTitles() {
        try {
            const guests = await window.guestCRUD.getAllGuests();
            const titles = new Set();
            guests.forEach(g => {
                titles.add(g.mainTitle);
                if (g.otherTitles) {
                    g.otherTitles.forEach(t => titles.add(t));
                }
            });
            return Array.from(titles).sort();
        } catch (error) {
            console.error('取得稱謂列表失敗:', error);
            return [];
        }
    }
}

// 建立全域實例
window.searchManager = new SearchManager();
