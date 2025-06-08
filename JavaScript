/*** DrSwat Engine - JavaScript
 * هذا الملف يحتوي على وظائف تفاعلية لمنصة DrSwat Engine
 */

// تهيئة المتغيرات والثوابت
const positiveWords = ["نجاح", "أمل", "قوة", "فرح", "تقدم", "سلام", "حياة", "سعادة", "إيجابية", "تفاؤل", "صحة", "عافية"];
const negativeWords = ["خوف", "ضعف", "حزن", "تعب", "يأس", "قلق", "وحدة", "غضب", "إحباط", "فشل", "ألم", "مرض"];

// تنفيذ الكود عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log("DrSwat Engine Loaded. Ready for data analysis.");
    
    // إضافة مستمعي الأحداث
    document.getElementById("analyzeButton").addEventListener("click", analyzeText);
    document.getElementById("openModal").addEventListener("click", openModal);
    document.getElementById("closeModal").addEventListener("click", closeModal);
    
    // إغلاق النافذة المنبثقة عند النقر خارجها
    window.addEventListener("click", function(event) {
        if (event.target == document.getElementById("modal")) {
            closeModal();
        }
    });
});

/**
 * تحليل النص المدخل من المستخدم
 */
function analyzeText() {
    // الحصول على النص المدخل
    const input = document.getElementById("userInput").value;
    const result = document.getElementById("result");
    
    // التحقق من وجود نص
    if (!input.trim()) {
        result.textContent = "الرجاء إدخال نص للتحليل.";
        return;
    }
    
    // تحليل النص
    const words = input.trim().split(/\s+/);
    const wordCount = words.length;
    
    // حساب عدد الكلمات الإيجابية والسلبية
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
        if (positiveWords.includes(word)) {
            positiveCount++;
        } else if (negativeWords.includes(word)) {
            negativeCount++;
        }
    });
    
    // حساب نسبة الإيجابية
    const totalSentimentWords = positiveCount + negativeCount;
    let positivePercentage = 0;
    
    if (totalSentimentWords > 0) {
        positivePercentage = Math.round((positiveCount / totalSentimentWords) * 100);
    }
    
    // تحديد الحالة العامة
    let overallMood = "محايدة 😐";
    if (positiveCount > negativeCount) {
        overallMood = "إيجابية 😊";
    } else if (negativeCount > positiveCount) {
        overallMood = "سلبية 😢";
    }
    
    // عرض النتائج
    result.innerHTML = `
        <h3>نتائج التحليل:</h3>
        <p>✅ عدد الكلمات: ${wordCount}</p>
        <p>💚 كلمات إيجابية: ${positiveCount}</p>
        <p>⚠️ كلمات سلبية: ${negativeCount}</p>
        <p>📊 نسبة الإيجابية: ${positivePercentage}%</p>
        <p>🔍 الحالة العامة: ${overallMood}</p>
    `;
    
    // إضافة اقتراحات بناءً على التحليل
    if (negativeCount > positiveCount) {
        result.innerHTML += `
            <h4>اقتراحات للتحسين:</h4>
            <ul>
                <li>جرب تمارين التنفس العميق للتهدئة</li>
                <li>دوّن ثلاثة أشياء إيجابية حدثت اليوم</li>
                <li>تواصل مع شخص داعم للتحدث عن مشاعرك</li>
            </ul>
        `;
    }
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
 * @param {string} text - النص المراد تحليله
 * @returns {Promise} وعد يحتوي على نتيجة التحليل
 */
async function analyzeSentimentWithPython(text) {
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });
        
        if (!response.ok) {
            throw new Error('فشل في الاتصال بالخادم');
        }
        
        return await response.json();
    } catch (error) {
        console.error('خطأ في تحليل المشاعر:', error);
        return { error: error.message };
    }
}

