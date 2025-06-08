# DrSwat-Engine-program- 
echo "# DrSwat-Engine-program-" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Drswat2030/DrSwat-Engine-program-.git
git push -u origin main 
# إنشاء المجلد الرئيسي
mkdir DrSwat-Engine && cd DrSwat-Engine

# إنشاء مجلدات رئيسية
mkdir public src backend docs tests

# مجلدات فرعية داخل src
mkdir -p src/assets src/components src/pages src/layouts src/utils src/data

# إنشاء بعض الملفات الفارغة الأساسية
touch README.md .gitignore index.html package.json

# داخل public
touch public/logo.png public/favicon.ico

# داخل src/data
touch src/data/skills12+2.json

# داخل backend
touch backend/db.sqlite3 backend/api.py

# داخل docs
touch docs/"ملف العقل الشامل.md" docs/"خطة التنفيذ.md"

# داخل tests
touch tests/test_skills.js
