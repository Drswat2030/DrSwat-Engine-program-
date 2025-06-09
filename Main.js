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

document.addEventListener('DOMContentLoaded', function() {
console.log("DrSwat Engine Loaded. Ready for data analysis.");
إعداد زر تحليل النص //
const analyzeButton = document.getElementById('analyzeButton');
if (analyzeButton) {
analyzeButton.addEventListener('click', analyzeText);
}
إعداد النافذة المنبثقة //
const openModal = document.getElementById('openModal');
const closeModal = document.getElementById('closeModal');
const modal = document.getElementById('modal');
if (openModal && closeModal && modal) {
openModal.addEventListener('click', function() {
modal.style.display = "block";
});
closeModal.addEventListener('click', function() {
modal.style.display = "none";
});
window.addEventListener('click', function(event) {
if (event.target == modal) {
modal.style.display = "none";
}
});
}
});
تحليل النص //
async function analyzeText() {
const input = document.getElementById("userInput").value;
const result = document.getElementById("result");
    f (!input.trim()) {
;".الرجاء إدخال نص للتحليل" = textContent.result
return
}
عرض مؤشر التحميل //
result.innerHTML = '<div class="loading">النص تحليل جاري...>/div>';
try {
const response = await fetch('/api/analyze', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({ text: input })
});
if (!response.ok) {
throw new Error(`HTTP error! status: ${response.status}`);
}
const data = await response.json();
عرض النتائج //
let resultHTML = `
<3h/<:نتائج التحليل<3h <
 <p> الكلمات عدد: $}data.word_count}</p>
 <p> إيجابية كلمات: $}data.positive_count}</p>
 <p>⚠ سلبية كلمات: $}data.negative_count}</p>
 <p> الإيجابية نسبة: $}data.positive_percentage}%</p>
 <p> العامة الحالة: $}data.overall_mood} ${data.mood_emoji}</p>
 `;
إضافة اقتراحات إذا كانت متوفرة //
if (data.suggestions && data.suggestions.length > 0) {
resultHTML += `
<4h/<:اقتراحات للتحسين<4h <
 <ul>
${data.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
 </ul>
 `;
}
result.innerHTML = resultHTML;
} catch (error) {
console.error('Error analyzing text:', error);
result.innerHTML = `
 <div class="error-message">
 <p>ً
،ً حدث خطأ أثناء تحليل النص. يرجى المحاولة مرة أخرى لاحقا
<p/<.عذرا
 </div>
 `;
}
}

