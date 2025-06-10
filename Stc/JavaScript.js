JavaScript.js
/*** DrSwat Engine - JavaScript
 * هذا الملف يحتوي على وظائف تفاعلية لمنصة DrSwat Engine
 */

// الكلمات المستخدمة في تحليل المشاعر
const positiveWords = ["نجاح", "أمل", "قوة", "فرح", "تقدم", "سلام", "حياة", "سعادة", "إيجابية", "تفاؤل", "صحة", "عافية"];
const negativeWords = ["خوف", "ضعف", "حزن", "تعب", "يأس", "قلق", "وحدة", "غضب", "إحباط", "فشل", "ألم", "مرض"];

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log("DrSwat Engine Loaded. Ready for data analysis.");

    // ربط الأحداث
    addEventListeners();
});

/**
 * ربط مستمعي الأحداث لعناصر الصفحة
 */
function addEventListeners() {
    document.getElementById("analyzeButton")?.addEventListener("click", analyzeText);
    document.getElementById("openModal")?.addEventListener("click", openModal);
    document.getElementById("closeModal")?.addEventListener("click", closeModal);

    window.addEventListener("click", event => {
        if (event.target === document.getElementById("modal")) {
            closeModal();
        }
    });
}

/**
 * تحليل النص المدخل من المستخدم
 */
function analyzeText() {
    const input = document.getElementById("userInput").value.trim();
    const result = document.getElementById("result");

    if (!input) {
        return displayMessage(result, "الرجاء إدخال نص للتحليل.");
    }

    const words = input.split(/\s+/);
    const wordCount = words.length;

    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach(word => {
        if (positiveWords.includes(word)) positiveCount++;
        else if (negativeWords.includes(word)) negativeCount++;
    });

    const totalSentimentWords = positiveCount + negativeCount;
    const positivePercentage = totalSentimentWords ? Math.round((positiveCount / totalSentimentWords) * 100) : 0;
    const overallMood = getMood(positiveCount, negativeCount);

    displayResult(result, wordCount, positiveCount, negativeCount, positivePercentage, overallMood);
}

/**
 * تحديد المزاج العام للنص
 */
function getMood(positive, negative) {
    if (positive > negative) return "إيجابية 😊";
    if (negative > positive) return "سلبية 😢";
    return "محايدة 😐";
}

/**
 * عرض نتائج التحليل
 */
function displayResult(container, wordCount, positiveCount, negativeCount, percentage, mood) {
    container.innerHTML = `
        <h3>نتائج التحليل:</h3>
        <p>✅ عدد الكلمات: ${wordCount}</p>
        <p>💚 كلمات إيجابية: ${positiveCount}</p>
        <p>⚠️ كلمات سلبية: ${negativeCount}</p>
        <p>📊 نسبة الإيجابية: ${percentage}%</p>
        <p>🔍 الحالة العامة: ${mood}</p>
    `;

    if (negativeCount > positiveCount) {
        container.innerHTML += getImprovementTips();
    }
}

/**
 * عرض اقتراحات لتحسين المزاج
 */
function getImprovementTips() {
    return `
        <h4>اقتراحات للتحسين:</h4>
        <ul>
            <li>جرب تمارين التنفس العميق للتهدئة</li>
            <li>دوّن ثلاثة أشياء إيجابية حدثت اليوم</li>
            <li>تواصل مع شخص داعم للتحدث عن مشاعرك</li>
        </ul>
    `;
}

/**
 * عرض رسالة بسيطة
 */
function displayMessage(container, message) {
    container.textContent = message;
}

/**
 * فتح النافذة المنبثقة
 */
function openModal() {
    document.getElementById("modal").style.display = "block";
}

/**
 * إغلاق النافذة المنبثقة
 */
function closeModal() {
    document.getElementById("modal").style.display = "none";
}

/**
 * إرسال النص إلى خادم Python لتحليل المشاعر (للتطوير المستقبلي)
 */
async function analyzeSentimentWithPython(text) {
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (!response.ok) throw new Error('فشل في الاتصال بالخادم');

        return await response.json();
    } catch (error) {
        console.error('خطأ في تحليل المشاعر:', error);
        return { error: error.message };
    }
}
