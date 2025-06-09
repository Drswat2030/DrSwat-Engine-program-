/**
 * DrSwat Engine - ملف JavaScript الرئيسي
 */

// عناصر DOM
const userInput = document.getElementById('userInput');
const analyzeButton = document.getElementById('analyzeButton');
const resultDiv = document.getElementById('result');
const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إعداد مستمعي الأحداث
    setupEventListeners();
});

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // زر تحليل النص
    if (analyzeButton) {
        analyzeButton.addEventListener('click', analyzeText);
    }
    
    // أزرار النافذة المنبثقة
    if (openModalBtn) {
        openModalBtn.addEventListener('click', openModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // إغلاق النافذة المنبثقة عند النقر خارجها
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
}

// تحليل النص
async function analyzeText() {
    const text = userInput.value.trim();
    
    if (!text) {
        alert('الرجاء إدخال نص للتحليل');
        return;
    }
    
    // عرض حالة التحميل
    resultDiv.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p>جاري تحليل النص...</p></div>';
    resultDiv.style.display = 'block';
    
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        
        if (!response.ok) {
            throw new Error('حدث خطأ أثناء تحليل النص');
        }
        
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">خطأ: ${error.message}</div>`;
    }
}

// عرض نتائج التحليل
function displayResults(data) {
    let html = `
        <div class="result-item">
            <span class="result-label">الحالة العامة:</span>
            <span class="result-value">${data.mood_emoji} ${data.overall_mood}</span>
        </div>
        <div class="result-item">
            <span class="result-label">نسبة الإيجابية:</span>
            <span class="result-value">${data.positive_percentage}%</span>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${data.positive_percentage}%"></div>
            </div>
        </div>
        <div class="result-item">
            <span class="result-label">عدد الكلمات:</span>
            <span class="result-value">${data.word_count}</span>
        </div>
        <div class="result-item">
            <span class="result-label">الكلمات الإيجابية:</span>
            <span class="result-value">${data.positive_count}</span>
        </div>
        <div class="result-item">
            <span class="result-label">الكلمات السلبية:</span>
            <span class="result-value">${data.negative_count}</span>
        </div>
    `;
    
    // إضافة الاقتراحات
    if (data.suggestions && data.suggestions.length > 0) {
        html += `
            <div class="suggestions">
                <h4>اقتراحات:</h4>
                <ul>
                    ${data.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    resultDiv.innerHTML = html;
    resultDiv.style.display = 'block';
}

// فتح النافذة المنبثقة
function openModal() {
    if (modal) {
        modal.style.display = 'block';
    }
}

// إغلاق النافذة المنبثقة
function closeModal() {
    if (modal) {
        modal.style.display = 'none';
    }
}

