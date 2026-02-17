const searchInput = document.getElementById('search-input');
const searchBox = document.getElementById('search-box');
const suggestionsContainer = document.getElementById('suggestions');
const clearBtn = document.getElementById('clear-btn');
const searchForm = document.getElementById('search-form');

const commonSuggestions = [
    'tarjimon',
    'ob-havo',
    'valyuta kursi',
    'namoz vaqtlari',
    'taqvim',

    'telegram web',
    'youtube',
    'uzum market',
    'olx.uz',
    'aliexpress',
    'avtoelon',
    'payme',
    'click',
    'uzum bank',
    'my.gov.uz',
    'uzimei',
    'hemis',
    'test natijalari',
    'newlms.pdp.university/',
    'kun.uz',
    'daryo.uz',
    'gazeta.uz',
    'yandex go',
    'hh.uz',
    'vakansiyalar',
    'chatgpt',
    'claude',
    'google.com',
    'mail',
    'mohirdev',
    'gemini'
];

let selectedSuggestionIndex = -1;

searchInput.addEventListener('input', function() {
    if (this.value.length > 0) {
        clearBtn.style.display = 'flex';
        showSuggestions(this.value);
    } else {
        clearBtn.style.display = 'none';
        hideSuggestions();
    }
});

clearBtn.addEventListener('click', function() {
    searchInput.value = '';
    searchInput.focus();
    clearBtn.style.display = 'none';
    hideSuggestions();
});

function showSuggestions(query) {
    if (!query.trim()) {
        hideSuggestions();
        return;
    }
    
    const filtered = commonSuggestions
        .filter(s => s.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
    
    if (filtered.length === 0) {
        hideSuggestions();
        return;
    }
    
    suggestionsContainer.innerHTML = filtered
        .map((suggestion, index) => `
            <div class="suggestion-item" data-index="${index}" data-query="${suggestion}">
                <svg class="suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                </svg>
                <span class="suggestion-text">${suggestion}</span>
            </div>
        `)
        .join('');
    
    suggestionsContainer.style.display = 'block';
    selectedSuggestionIndex = -1;
    
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            const query = this.dataset.query;
            performSearch(query);
        });
    });
}

function hideSuggestions() {
    suggestionsContainer.style.display = 'none';
    selectedSuggestionIndex = -1;
}

searchInput.addEventListener('keydown', function(e) {
    const suggestions = document.querySelectorAll('.suggestion-item');
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (suggestions.length > 0) {
            selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, suggestions.length - 1);
            updateSelectedSuggestion(suggestions);
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (suggestions.length > 0) {
            selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
            updateSelectedSuggestion(suggestions);
        }
    } else if (e.key === 'Escape') {
        hideSuggestions();
    }
});

function updateSelectedSuggestion(suggestions) {
    suggestions.forEach((item, index) => {
        if (index === selectedSuggestionIndex) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let query;
    if (selectedSuggestionIndex >= 0) {
        const suggestions = document.querySelectorAll('.suggestion-item');
        query = suggestions[selectedSuggestionIndex].dataset.query;
    } else {
        query = searchInput.value.trim();
    }
    
    if (query) {
        performSearch(query);
    }
});

function performSearch(query) {
    if (query.includes('.') && !query.includes(' ')) {
        let url = query;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        window.location.href = url;
    } else {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
}

document.addEventListener('click', function(e) {
    if (!searchBox.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        hideSuggestions();
    }
});

let previousValues = {
    hours: null,
    minutes: null,
    seconds: null
};

function updateTime() {
    const now = new Date();
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    updateTimeDigit('hours', hours);
    updateTimeDigit('minutes', minutes);
    updateTimeDigit('seconds', seconds);
    
    const dayNames = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
    const monthNames = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 
                       'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    
    const dateStr = `${dayNames[now.getDay()]}, ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    document.getElementById('date-info').textContent = dateStr;
}

function updateTimeDigit(id, newValue) {
    const element = document.getElementById(id);
    const oldValue = previousValues[id];
    
    if (oldValue !== newValue) {
        element.textContent = newValue;
        element.classList.add('changed');
        setTimeout(() => element.classList.remove('changed'), 300);
        previousValues[id] = newValue;
    }
}

function updateProgress() {
    const now = new Date();
    
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const dayProgress = ((now - startOfDay) / (endOfDay - startOfDay)) * 100;
    
    const dayElapsedMs = now - startOfDay;
    const dayRemainingMs = endOfDay - now;
    const dayElapsedH = Math.floor(dayElapsedMs / 3600000);
    const dayElapsedM = Math.floor((dayElapsedMs % 3600000) / 60000);
    const dayRemainingH = Math.floor(dayRemainingMs / 3600000);
    const dayRemainingM = Math.floor((dayRemainingMs % 3600000) / 60000);
    
    document.getElementById('day-percent').textContent = dayProgress.toFixed(4) + '%';
    document.getElementById('day-fill').style.width = dayProgress + '%';
    document.getElementById('day-elapsed').textContent = `${dayElapsedH}s ${dayElapsedM}m`;
    document.getElementById('day-remaining').textContent = `${dayRemainingH}s ${dayRemainingM}m`;
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthProgress = ((now - startOfMonth) / (endOfMonth - startOfMonth)) * 100;
    
    const monthElapsedDays = Math.floor((now - startOfMonth) / 86400000);
    const monthRemainingDays = Math.ceil((endOfMonth - now) / 86400000);
    
    document.getElementById('month-percent').textContent = monthProgress.toFixed(6) + '%';
    document.getElementById('month-fill').style.width = monthProgress + '%';
    document.getElementById('month-elapsed').textContent = `${monthElapsedDays} kun`;
    document.getElementById('month-remaining').textContent = `${monthRemainingDays} kun`;
    
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
    const yearProgress = ((now - startOfYear) / (endOfYear - startOfYear)) * 100;
    
    const yearElapsedDays = Math.floor((now - startOfYear) / 86400000);
    const yearRemainingDays = Math.ceil((endOfYear - now) / 86400000);
    
    document.getElementById('year-percent').textContent = yearProgress.toFixed(7) + '%';
    document.getElementById('year-fill').style.width = yearProgress + '%';
    document.getElementById('year-elapsed').textContent = `${yearElapsedDays} kun`;
    document.getElementById('year-remaining').textContent = `${yearRemainingDays} kun`;
}

document.addEventListener('DOMContentLoaded', function() {
    updateTime();
    updateProgress();
    
    setInterval(updateTime, 80);
    setInterval(updateProgress, 80);
    
    searchInput.focus();
});