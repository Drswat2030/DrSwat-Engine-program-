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

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import mysql.connector
import os
import json
from datetime import datetime
app = Flask(__name__, static_folder='../frontend')
CORS(app) # بطلبات للسماح CORS
إعدادات قاعدة البيانات #
db_config = {
'host': 'localhost',
'user': 'root',
قم بتغيير كلمة المرور حسب إعداداتك # ,'' :'password'
'database': 'drswat_skills'
}
دالة للاتصال بقاعدة البيانات #
def get_db_connection():
return mysql.connector.connect(**db_config)
الصفحة الرئيسية #
@app.route('/')
def index():
return send_from_directory(app.static_folder, 'index.html')
استرجاع جميع المهارات #
@app.route('/api/skills')
def get_skills():
conn = get_db_connection()
cursor = conn.cursor(dictionary=True)
cursor.execute("""
 SELECT s.*, c.name as category_name, c.icon as category_icon
 FROM skills s
 JOIN skill_categories c ON s.category_id = c.id
 ORDER BY s.priority_order
 """)
skills = cursor.fetchall()
cursor.close()
conn.close()
return jsonify(skills)
استرجاع مهارة محددة مع مكوناتها وتمارينها ومواردها #
@app.route('/api/skills/<int:skill_id>')
def get_skill(skill_id):
conn = get_db_connection()
cursor = conn.cursor(dictionary=True)
استرجاع معلومات المهارة #
cursor.execute("""
 SELECT s.*, c.name as category_name, c.icon as category_icon
 FROM skills s
 JOIN skill_categories c ON s.category_id = c.id
 WHERE s.id = %s
 """, (skill_id,))
skill = cursor.fetchone()
if not skill:
cursor.close()
conn.close()
404 ,({"المهارة غير موجودة" :"error({"jsonify return
استرجاع مكونات المهارة #
cursor.execute("""
 SELECT * FROM skill_components
 WHERE skill_id = %s
 ORDER BY order_index
 """, (skill_id,))
components = cursor.fetchall()
skill['components'] = components
استرجاع تمارين المهارة #
cursor.execute("""
 SELECT * FROM skill_exercises
 WHERE skill_id = %s
 ORDER BY order_index
 """, (skill_id,))
exercises = cursor.fetchall()
skill['exercises'] = exercises
استرجاع موارد المهارة #
cursor.execute("""
 SELECT * FROM skill_resources
 WHERE skill_id = %s
 ORDER BY order_index
 """, (skill_id,))

resources = cursor.fetchall()

skill['resources'] = resources

cursor.close()

conn.close()

return jsonify(skill)

تحديث تقدم المستخدم #

@app.route('/api/progress', methods=['POST'])

def update_progress():

data = request.json

user_id = data.get('user_id')

skill_id = data.get('skill_id')

progress_percentage = data.get('progress_percentage')

completed_components = data.get('completed_components')

completed_exercises = data.get('completed_exercises')

if not all([user_id, skill_id, progress_percentage]):

400 ,({"بيانات غير مكتملة" :"error({"jsonify return

conn = get_db_connection()

cursor = conn.cursor(dictionary=True)

التحقق من وجود سجل سابق #

cursor.execute("""

 SELECT * FROM user_skill_progress

 WHERE user_id = %s AND skill_id = %s

 """, (user_id, skill_id))

existing = cursor.fetchone()

if existing:

تحديث السجل الموجود #

cursor.execute("""

 UPDATE user_skill_progress

 SET progress_percentage = %s,

 completed_components = %s,

 completed_exercises = %s,

 last_activity_date = NOW(),

 updated_at = NOW()

 WHERE user_id = %s AND skill_id = %s

 """, (progress_percentage, completed_components, completed_exercises,

user_id, skill_id))

else:

إنشاء سجل جديد #

cursor.execute("""

 INSERT INTO user_skill_progress
 (user_id, skill_id, progress_percentage, completed_components,
 completed_exercises, last_activity_date)
 VALUES (%s, %s, %s, %s, %s, NOW())
 """, (user_id, skill_id, progress_percentage, completed_components,
completed_exercises))
conn.commit()
cursor.close()
conn.close()
return jsonify({"success": True})
# )ً
تحليل النص )الوظيفة الموجودة حاليا
@app.route('/api/analyze', methods=['POST'])
def analyze_text():
data = request.json
text = data.get('text', '')
if not text:
return jsonify({"error": "مطلوب النص({", 400
words = text.split()
word_count = len(words)
["حياة" ,"سلام" ,"تقدم" ,"فرح" ,"قوة" ,"أمل" ,"نجاح"] = words_positive
["وحدة" ,"قلق" ,"يأس" ,"تعب" ,"حزن" ,"ضعف" ,"خوف"] = words_negative
positive_count = sum(1 for word in words if word in positive_words)
negative_count = sum(1 for word in words if word in negative_words)
positive_percentage = 0
if positive_count + negative_count > 0:
positive_percentage = round((positive_count / (positive_count +
negative_count)) * 100)
overall_mood = "محايدة"
mood_emoji = " "
suggestions = []
if positive_count > negative_count:
overall_mood = "إيجابية"
mood_emoji = " "
elif negative_count > positive_count:
overall_mood = "سلبية"
mood_emoji = " "
suggestions = [
,"جرب تمارين التنفس العميق للتهدئة"
," ّدون ثلاثة أشياء إيجابية حدثت اليوم"
"تواصل مع شخص داعم للتحدث عن مشاعرك"
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

فحص حالة الخادم #

@app.route('/api/health')

def health_check():

return jsonify({"status": "ok", "timestamp": datetime.now().isoformat()})

تشغيل التطبيق #

if __name__ == '__main__':

app.run(debug=True, host='0.0.0.0', port=5000)
