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


