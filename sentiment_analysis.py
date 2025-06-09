"""
DrSwat Engine - تحليل المشاعر
ملف Python لتحليل المشاعر في النصوص العربية
"""

from flask import Flask, request, jsonify
import re
import json

# قائمة الكلمات الإيجابية والسلبية
positive_words = [
    "نجاح", "أمل", "قوة", "فرح", "تقدم", "سلام", "حياة", "سعادة", "إيجابية", 
    "تفاؤل", "صحة", "عافية", "حب", "خير", "بركة", "نعمة", "شكر", "رضا", 
    "سرور", "بهجة", "انتصار", "إنجاز", "تطور", "تحسن", "ثقة", "عزيمة"
]

negative_words = [
    "خوف", "ضعف", "حزن", "تعب", "يأس", "قلق", "وحدة", "غضب", "إحباط", 
    "فشل", "ألم", "مرض", "حرمان", "ظلم", "خسارة", "ندم", "أسف", "عجز", 
    "صعوبة", "مشكلة", "صراع", "توتر", "ضغط", "إرهاق", "اكتئاب", "قسوة"
]

# إنشاء تطبيق Flask
app = Flask(__name__)

@app.route('/api/analyze', methods=['POST'])
def analyze_sentiment():
    """
    تحليل المشاعر في النص المرسل
    """
    try:
        # استلام البيانات
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'النص مطلوب'}), 400
        
        text = data['text']
        
        # تحليل النص
        result = analyze(text)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def analyze(text):
    """
    تحليل المشاعر في النص
    
    Args:
        text (str): النص المراد تحليله
        
    Returns:
        dict: نتائج التحليل
    """
    # تنظيف النص
    text = clean_text(text)
    
    # تقسيم النص إلى كلمات
    words = text.split()
    word_count = len(words)
    
    # حساب عدد الكلمات الإيجابية والسلبية
    positive_count = sum(1 for word in words if word in positive_words)
    negative_count = sum(1 for word in words if word in negative_words)
    
    # حساب نسبة الإيجابية
    total_sentiment_words = positive_count + negative_count
    positive_percentage = 0
    
    if total_sentiment_words > 0:
        positive_percentage = round((positive_count / total_sentiment_words) * 100)
    
    # تحديد الحالة العامة
    overall_mood = "محايدة"
    mood_emoji = "😐"
    
    if positive_count > negative_count:
        overall_mood = "إيجابية"
        mood_emoji = "😊"
    elif negative_count > positive_count:
        overall_mood = "سلبية"
        mood_emoji = "😢"
    
    # إعداد الاقتراحات
    suggestions = []
    
    if negative_count > positive_count:
        suggestions = [
            "جرب تمارين التنفس العميق للتهدئة",
            "دوّن ثلاثة أشياء إيجابية حدثت اليوم",
            "تواصل مع شخص داعم للتحدث عن مشاعرك"
        ]
    
    # إعداد النتائج
    result = {
        'word_count': word_count,
        'positive_count': positive_count,
        'negative_count': negative_count,
        'positive_percentage': positive_percentage,
        'overall_mood': overall_mood,
        'mood_emoji': mood_emoji,
        'suggestions': suggestions
    }
    
    return result

def clean_text(text):
    """
    تنظيف النص من الرموز غير المرغوب فيها
    
    Args:
        text (str): النص المراد تنظيفه
        
    Returns:
        str: النص بعد التنظيف
    """
    # إزالة علامات الترقيم
    text = re.sub(r'[^\w\s]', ' ', text)
    
    # إزالة المسافات الزائدة
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

# تشغيل التطبيق إذا تم تنفيذ الملف مباشرة
if __name__ == '__main__':
    # يمكن تجربة التحليل محلياً
    sample_text = input("أدخل جملة لتحليل المشاعر: ")
    result = analyze(sample_text)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    
    # تشغيل خادم Flask
    # app.run(host='0.0.0.0', port=5000, debug=True)

