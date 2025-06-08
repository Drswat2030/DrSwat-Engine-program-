from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import mysql.connector
import os
import json
from datetime import datetime

app = Flask(__name__, static_folder='../frontend')
CORS(app)  # للسماح بطلبات CORS

# إعدادات قاعدة البيانات
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',  # قم بتغيير كلمة المرور حسب إعداداتك
    'database': 'drswat_skills'
}

# دالة للاتصال بقاعدة البيانات
def get_db_connection():
    try:
        return mysql.connector.connect(**db_config)
    except mysql.connector.Error as err:
        print(f"خطأ في الاتصال بقاعدة البيانات: {err}")
        return None

# الصفحة الرئيسية
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

# خدمة الملفات الثابتة
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

# استرجاع جميع المهارات
@app.route('/api/skills')
def get_skills():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "خطأ في الاتصال بقاعدة البيانات"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT s.*, c.name as category_name, c.icon as category_icon
            FROM skills s
            JOIN skill_categories c ON s.category_id = c.id
            ORDER BY s.priority_order
        """)
        
        skills = cursor.fetchall()
        
        # تحويل datetime إلى string للتسلسل JSON
        for skill in skills:
            if skill['created_at']:
                skill['created_at'] = skill['created_at'].isoformat()
            if skill['updated_at']:
                skill['updated_at'] = skill['updated_at'].isoformat()
        
        return jsonify(skills)
    
    except mysql.connector.Error as err:
        return jsonify({"error": f"خطأ في استرجاع المهارات: {err}"}), 500
    
    finally:
        cursor.close()
        conn.close()

# استرجاع مهارة محددة مع مكوناتها وتمارينها ومواردها
@app.route('/api/skills/<int:skill_id>')
def get_skill(skill_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "خطأ في الاتصال بقاعدة البيانات"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    try:
        # استرجاع معلومات المهارة
        cursor.execute("""
            SELECT s.*, c.name as category_name, c.icon as category_icon
            FROM skills s
            JOIN skill_categories c ON s.category_id = c.id
            WHERE s.id = %s
        """, (skill_id,))
        
        skill = cursor.fetchone()
        
        if not skill:
            return jsonify({"error": "المهارة غير موجودة"}), 404
        
        # تحويل datetime إلى string
        if skill['created_at']:
            skill['created_at'] = skill['created_at'].isoformat()
        if skill['updated_at']:
            skill['updated_at'] = skill['updated_at'].isoformat()
        
        # استرجاع مكونات المهارة
        cursor.execute("""
            SELECT * FROM skill_components
            WHERE skill_id = %s
            ORDER BY order_index
        """, (skill_id,))
        
        components = cursor.fetchall()
        for component in components:
            if component['created_at']:
                component['created_at'] = component['created_at'].isoformat()
            if component['updated_at']:
                component['updated_at'] = component['updated_at'].isoformat()
        
        skill['components'] = components
        
        # استرجاع تمارين المهارة
        cursor.execute("""
            SELECT * FROM skill_exercises
            WHERE skill_id = %s
            ORDER BY order_index
        """, (skill_id,))
        
        exercises = cursor.fetchall()
        for exercise in exercises:
            if exercise['created_at']:
                exercise['created_at'] = exercise['created_at'].isoformat()
            if exercise['updated_at']:
                exercise['updated_at'] = exercise['updated_at'].isoformat()
        
        skill['exercises'] = exercises
        
        # استرجاع موارد المهارة
        cursor.execute("""
            SELECT * FROM skill_resources
            WHERE skill_id = %s
            ORDER BY order_index
        """, (skill_id,))
        
        resources = cursor.fetchall()
        for resource in resources:
            if resource['created_at']:
                resource['created_at'] = resource['created_at'].isoformat()
            if resource['updated_at']:
                resource['updated_at'] = resource['updated_at'].isoformat()
        
        skill['resources'] = resources
        
        return jsonify(skill)
    
    except mysql.connector.Error as err:
        return jsonify({"error": f"خطأ في استرجاع المهارة: {err}"}), 500
    
    finally:
        cursor.close()
        conn.close()

# استرجاع تقدم المستخدم
@app.route('/api/progress/<int:user_id>')
def get_user_progress(user_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "خطأ في الاتصال بقاعدة البيانات"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT usp.*, s.title as skill_title, s.emoji as skill_emoji
            FROM user_skill_progress usp
            JOIN skills s ON usp.skill_id = s.id
            WHERE usp.user_id = %s
            ORDER BY s.priority_order
        """, (user_id,))
        
        progress = cursor.fetchall()
        
        # تحويل datetime إلى string
        for item in progress:
            if item['last_activity_date']:
                item['last_activity_date'] = item['last_activity_date'].isoformat()
            if item['created_at']:
                item['created_at'] = item['created_at'].isoformat()
            if item['updated_at']:
                item['updated_at'] = item['updated_at'].isoformat()
        
        return jsonify(progress)
    
    except mysql.connector.Error as err:
        return jsonify({"error": f"خطأ في استرجاع التقدم: {err}"}), 500
    
    finally:
        cursor.close()
        conn.close()

# تحديث تقدم المستخدم
@app.route('/api/progress', methods=['POST'])
def update_progress():
    data = request.json
    user_id = data.get('user_id')
    skill_id = data.get('skill_id')
    progress_percentage = data.get('progress_percentage')
    completed_components = data.get('completed_components')
    completed_exercises = data.get('completed_exercises')
    notes = data.get('notes', '')
    
    if not all([user_id, skill_id, progress_percentage is not None]):
        return jsonify({"error": "بيانات غير مكتملة"}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "خطأ في الاتصال بقاعدة البيانات"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    try:
        # التحقق من وجود سجل سابق
        cursor.execute("""
            SELECT * FROM user_skill_progress
            WHERE user_id = %s AND skill_id = %s
        """, (user_id, skill_id))
        
        existing = cursor.fetchone()
        
        if existing:
            # تحديث السجل الموجود
            cursor.execute("""
                UPDATE user_skill_progress
                SET progress_percentage = %s,
                    completed_components = %s,
                    completed_exercises = %s,
                    notes = %s,
                    last_activity_date = NOW(),
                    updated_at = NOW()
                WHERE user_id = %s AND skill_id = %s
            """, (progress_percentage, completed_components, completed_exercises, notes, user_id, skill_id))
        else:
            # إنشاء سجل جديد
            cursor.execute("""
                INSERT INTO user_skill_progress
                (user_id, skill_id, progress_percentage, completed_components, completed_exercises, notes, last_activity_date)
                VALUES (%s, %s, %s, %s, %s, %s, NOW())
            """, (user_id, skill_id, progress_percentage, completed_components, completed_exercises, notes))
        
        conn.commit()
        return jsonify({"success": True, "message": "تم تحديث التقدم بنجاح"})
    
    except mysql.connector.Error as err:
        conn.rollback()
        return jsonify({"error": f"خطأ في تحديث التقدم: {err}"}), 500
    
    finally:
        cursor.close()
        conn.close()

# تحليل النص (الوظيفة الموجودة حالياً)
@app.route('/api/analyze', methods=['POST'])
def analyze_text():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({"error": "النص مطلوب"}), 400
    
    words = text.split()
    word_count = len(words)
    
    positive_words = ["نجاح", "أمل", "قوة", "فرح", "تقدم", "سلام", "حياة", "سعادة", "حب", "إيجابية", "تفاؤل", "ثقة", "راحة", "استقرار", "نمو", "تطور", "إنجاز", "فخر", "امتنان", "شكر"]
    negative_words = ["خوف", "ضعف", "حزن", "تعب", "يأس", "قلق", "وحدة", "اكتئاب", "غضب", "إحباط", "فشل", "ألم", "معاناة", "توتر", "ضغط", "كآبة", "يأس", "انتكاسة", "صعوبة", "مشكلة"]
    
    positive_count = sum(1 for word in words if word in positive_words)
    negative_count = sum(1 for word in words if word in negative_words)
    
    positive_percentage = 0
    if positive_count + negative_count > 0:
        positive_percentage = round((positive_count / (positive_count + negative_count)) * 100)
    elif positive_count == 0 and negative_count == 0:
        positive_percentage = 50  # محايد
    
    overall_mood = "محايدة"
    mood_emoji = "😐"
    suggestions = []
    
    if positive_count > negative_count:
        overall_mood = "إيجابية"
        mood_emoji = "😊"
        suggestions = [
            "استمر في هذا المسار الإيجابي",
            "شارك هذه المشاعر الإيجابية مع الآخرين",
            "استخدم هذه الطاقة الإيجابية لتحقيق أهدافك"
        ]
    elif negative_count > positive_count:
        overall_mood = "سلبية"
        mood_emoji = "😢"
        suggestions = [
            "جرب تمارين التنفس العميق للتهدئة",
            "دوّن ثلاثة أشياء إيجابية حدثت اليوم",
            "تواصل مع شخص داعم للتحدث عن مشاعرك",
            "مارس تمرين الوعي الذاتي لفهم مشاعرك بشكل أفضل",
            "خذ استراحة وامنح نفسك وقتاً للراحة"
        ]
    else:
        suggestions = [
            "حاول التعبير عن مشاعرك بشكل أكثر تفصيلاً",
            "استخدم تمارين الوعي الذاتي لاستكشاف حالتك الداخلية"
        ]
    
    return jsonify({
        "word_count": word_count,
        "positive_count": positive_count,
        "negative_count": negative_count,
        "positive_percentage": positive_percentage,
        "overall_mood": overall_mood,
        "mood_emoji": mood_emoji,
        "suggestions": suggestions
    })

# استرجاع تصنيفات المهارات
@app.route('/api/categories')
def get_categories():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "خطأ في الاتصال بقاعدة البيانات"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM skill_categories ORDER BY id")
        categories = cursor.fetchall()
        
        # تحويل datetime إلى string
        for category in categories:
            if category['created_at']:
                category['created_at'] = category['created_at'].isoformat()
            if category['updated_at']:
                category['updated_at'] = category['updated_at'].isoformat()
        
        return jsonify(categories)
    
    except mysql.connector.Error as err:
        return jsonify({"error": f"خطأ في استرجاع التصنيفات: {err}"}), 500
    
    finally:
        cursor.close()
        conn.close()

# فحص حالة الخادم
@app.route('/api/health')
def health_check():
    conn = get_db_connection()
    if conn:
        conn.close()
        db_status = "متصل"
    else:
        db_status = "غير متصل"
    
    return jsonify({
        "status": "ok",
        "database": db_status,
        "timestamp": datetime.now().isoformat()
    })

# معالجة الأخطاء
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "الصفحة غير موجودة"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "خطأ داخلي في الخادم"}), 500

# تشغيل التطبيق
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)


"""
DrSwat Engine - تطبيق Flask
ملف التطبيق الرئيسي لتشغيل خادم Flask وربط واجهة المستخدم بخدمة تحليل المشاعر
"""

from flask import Flask, request, jsonify, send_from_directory
from sentiment_analysis import analyze
import os

# إنشاء تطبيق Flask
app = Flask(__name__)

# المسار الرئيسي للملفات الثابتة
STATIC_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
def index():
    """
    الصفحة الرئيسية
    """
    return send_from_directory(STATIC_DIR, 'index.html')

@app.route('/<path:path>')
def static_files(path):
    """
    خدمة الملفات الثابتة
    """
    return send_from_directory(STATIC_DIR, path)

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

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    فحص حالة الخادم
    """
    return jsonify({'status': 'healthy', 'message': 'DrSwat Engine API is running'})

# تشغيل التطبيق
if __name__ == '__main__':
    # تحديد المنفذ
    port = int(os.environ.get('PORT', 5000))
    
    # تشغيل الخادم
    app.run(host='0.0.0.0', port=port, debug=True)


