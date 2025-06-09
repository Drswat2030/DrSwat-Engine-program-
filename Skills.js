/**
 * DrSwat Engine - ملف JavaScript لصفحة المهارات
 */

// متغيرات عامة
let allSkills = [];
let userProgress = {};
let currentSkillId = null;
const currentUserId = 1; // معرف المستخدم التجريبي

// عناصر DOM
const skillsContainer = document.getElementById('skillsContainer');
const skillDetail = document.getElementById('skill-detail');
const skillDetailContainer = document.getElementById('skillDetail');
const categoryTabs = document.querySelectorAll('.category-tab');
const progressModal = document.getElementById('progressModal');
const closeProgressModalBtn = document.getElementById('closeProgressModal');
const progressPercentage = document.getElementById('progressPercentage');
const progressValue = document.getElementById('progressValue');
const progressNotes = document.getElementById('progressNotes');
const saveProgressBtn = document.getElementById('saveProgress');
const cancelProgressBtn = document.getElementById('cancelProgress');

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadSkills();
    loadUserProgress();
});

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // تبويبات التصنيفات
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.dataset.category;
            filterSkillsByCategory(category);
            
            // تحديث التبويب النشط
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // نافذة تحديث التقدم
    if (closeProgressModalBtn) {
        closeProgressModalBtn.addEventListener('click', closeProgressModal);
    }
    
    if (cancelProgressBtn) {
        cancelProgressBtn.addEventListener('click', closeProgressModal);
    }
    
    if (saveProgressBtn) {
        saveProgressBtn.addEventListener('click', saveProgress);
    }
    
    if (progressPercentage) {
        progressPercentage.addEventListener('input', function() {
            progressValue.textContent = this.value + '%';
        });
    }
    
    // إغلاق النافذة المنبثقة عند النقر خارجها
    window.addEventListener('click', function(event) {
        if (event.target === progressModal) {
            closeProgressModal();
        }
    });
}

// تحميل المهارات
async function loadSkills() {
    try {
        const response = await fetch('/api/skills');
        if (!response.ok) {
            throw new Error('فشل في تحميل المهارات');
        }
        
        allSkills = await response.json();
        displaySkills(allSkills);
        updateStats();
    } catch (error) {
        skillsContainer.innerHTML = `<div class="error">خطأ في تحميل المهارات: ${error.message}</div>`;
    }
}

// تحميل تقدم المستخدم
async function loadUserProgress() {
    try {
        const response = await fetch(`/api/progress/${currentUserId}`);
        if (response.ok) {
            const progressData = await response.json();
            userProgress = {};
            progressData.forEach(item => {
                userProgress[item.skill_id] = item;
            });
            
            // إعادة عرض المهارات مع التقدم
            if (allSkills.length > 0) {
                displaySkills(allSkills);
                updateStats();
            }
        }
    } catch (error) {
        console.error('خطأ في تحميل تقدم المستخدم:', error);
    }
}

// عرض المهارات
function displaySkills(skills) {
    if (skills.length === 0) {
        skillsContainer.innerHTML = '<div class="no-skills">لا توجد مهارات متاحة</div>';
        return;
    }
    
    const html = skills.map(skill => {
        const progress = userProgress[skill.id] || { progress_percentage: 0 };
        const progressPercentage = progress.progress_percentage || 0;
        
        return `
            <div class="skill-card" data-skill-id="${skill.id}" data-category="${skill.category_id}">
                <div class="skill-header">
                    <span class="skill-emoji">${skill.emoji}</span>
                    <h3 class="skill-title">${skill.title}</h3>
                    <p class="skill-category">${skill.category_name}</p>
                </div>
                <div class="skill-body">
                    <p class="skill-description">${skill.description}</p>
                    <div class="skill-progress">
                        <div class="progress-label">
                            <span>التقدم</span>
                            <span>${progressPercentage}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                        </div>
                    </div>
                    <div class="skill-actions">
                        <button class="btn" onclick="viewSkillDetail(${skill.id})">عرض التفاصيل</button>
                        <button class="btn secondary" onclick="updateProgress(${skill.id})">تحديث التقدم</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    skillsContainer.innerHTML = html;
}

// تصفية المهارات حسب التصنيف
function filterSkillsByCategory(category) {
    if (category === 'all') {
        displaySkills(allSkills);
    } else {
        const filteredSkills = allSkills.filter(skill => skill.category_id == category);
        displaySkills(filteredSkills);
    }
}

// عرض تفاصيل المهارة
async function viewSkillDetail(skillId) {
    try {
        const response = await fetch(`/api/skills/${skillId}`);
        if (!response.ok) {
            throw new Error('فشل في تحميل تفاصيل المهارة');
        }
        
        const skill = await response.json();
        displaySkillDetail(skill);
        
        // التمرير إلى قسم التفاصيل
        skillDetail.style.display = 'block';
        skillDetail.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        alert(`خطأ في تحميل تفاصيل المهارة: ${error.message}`);
    }
}

// عرض تفاصيل المهارة
function displaySkillDetail(skill) {
    const progress = userProgress[skill.id] || { progress_percentage: 0 };
    
    let html = `
        <div class="skill-detail-header">
            <span class="skill-emoji">${skill.emoji}</span>
            <h2>${skill.title}</h2>
            <p>${skill.description}</p>
            <div class="skill-progress">
                <div class="progress-label">
                    <span>تقدمك في هذه المهارة</span>
                    <span>${progress.progress_percentage || 0}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress.progress_percentage || 0}%"></div>
                </div>
            </div>
        </div>
        <div class="skill-detail-body">
    `;
    
    // عرض مكونات المهارة
    if (skill.components && skill.components.length > 0) {
        html += '<div class="skill-components">';
        skill.components.forEach(component => {
            html += `
                <div class="component">
                    <h3>${component.section_title}</h3>
                    <div class="component-content">${component.content}</div>
                </div>
            `;
        });
        html += '</div>';
    }
    
    // عرض التمارين
    if (skill.exercises && skill.exercises.length > 0) {
        html += `
            <div class="exercises-section">
                <h3>التمارين العملية</h3>
        `;
        skill.exercises.forEach(exercise => {
            html += `
                <div class="exercise-card">
                    <div class="exercise-header">
                        <h4 class="exercise-title">${exercise.title}</h4>
                        <span class="exercise-difficulty difficulty-${exercise.difficulty_level}">
                            ${getDifficultyLabel(exercise.difficulty_level)}
                        </span>
                    </div>
                    <p class="exercise-description">${exercise.description}</p>
                    ${exercise.duration ? `<p><strong>المدة:</strong> ${exercise.duration}</p>` : ''}
                    ${exercise.instructions ? `
                        <div class="exercise-instructions">
                            <h4>التعليمات:</h4>
                            <ol>
                                ${exercise.instructions.split('\n').filter(line => line.trim()).map(line => `<li>${line.replace(/^\d+\.\s*/, '')}</li>`).join('')}
                            </ol>
                        </div>
                    ` : ''}
                    ${exercise.expected_outcome ? `
                        <div class="exercise-outcome">
                            <h4>النتيجة المتوقعة:</h4>
                            <p>${exercise.expected_outcome}</p>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        html += '</div>';
    }
    
    // عرض الموارد
    if (skill.resources && skill.resources.length > 0) {
        html += `
            <div class="resources-section">
                <h3>الموارد التعليمية</h3>
        `;
        skill.resources.forEach(resource => {
            html += `
                <div class="resource-card">
                    <div class="resource-header">
                        <h4 class="resource-title">${resource.title}</h4>
                        <span class="resource-type">${getResourceTypeLabel(resource.type)}</span>
                    </div>
                    <p class="resource-description">${resource.description}</p>
                    ${resource.duration ? `<p><strong>المدة:</strong> ${resource.duration}</p>` : ''}
                    ${resource.url ? `<p><a href="${resource.url}" target="_blank" class="btn">الوصول للمورد</a></p>` : ''}
                </div>
            `;
        });
        html += '</div>';
    }
    
    html += `
            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn" onclick="updateProgress(${skill.id})">تحديث التقدم</button>
                <button class="btn secondary" onclick="hideSkillDetail()">العودة للمهارات</button>
            </div>
        </div>
    `;
    
    skillDetailContainer.innerHTML = html;
}

// إخفاء تفاصيل المهارة
function hideSkillDetail() {
    skillDetail.style.display = 'none';
    document.getElementById('skills-list').scrollIntoView({ behavior: 'smooth' });
}

// تحديث التقدم
function updateProgress(skillId) {
    currentSkillId = skillId;
    const progress = userProgress[skillId] || { progress_percentage: 0, notes: '' };
    
    progressPercentage.value = progress.progress_percentage || 0;
    progressValue.textContent = (progress.progress_percentage || 0) + '%';
    progressNotes.value = progress.notes || '';
    
    progressModal.style.display = 'block';
}

// حفظ التقدم
async function saveProgress() {
    if (!currentSkillId) return;
    
    const progressData = {
        user_id: currentUserId,
        skill_id: currentSkillId,
        progress_percentage: parseInt(progressPercentage.value),
        completed_components: '', // يمكن تطويرها لاحقاً
        completed_exercises: '', // يمكن تطويرها لاحقاً
        notes: progressNotes.value
    };
    
    try {
        const response = await fetch('/api/progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(progressData)
        });
        
        if (!response.ok) {
            throw new Error('فشل في حفظ التقدم');
        }
        
        // تحديث البيانات المحلية
        userProgress[currentSkillId] = {
            ...userProgress[currentSkillId],
            progress_percentage: progressData.progress_percentage,
            notes: progressData.notes
        };
        
        // إعادة عرض المهارات
        displaySkills(allSkills);
        updateStats();
        
        // إعادة عرض تفاصيل المهارة إذا كانت مفتوحة
        if (skillDetail.style.display === 'block') {
            viewSkillDetail(currentSkillId);
        }
        
        closeProgressModal();
        alert('تم حفظ التقدم بنجاح!');
    } catch (error) {
        alert(`خطأ في حفظ التقدم: ${error.message}`);
    }
}

// إغلاق نافذة تحديث التقدم
function closeProgressModal() {
    progressModal.style.display = 'none';
    currentSkillId = null;
}

// تحديث الإحصائيات
function updateStats() {
    const totalSkills = allSkills.length;
    const completedSkills = Object.values(userProgress).filter(p => p.progress_percentage >= 100).length;
    const totalProgress = Object.values(userProgress).reduce((sum, p) => sum + (p.progress_percentage || 0), 0);
    const overallProgress = totalSkills > 0 ? Math.round(totalProgress / totalSkills) : 0;
    
    document.getElementById('totalSkills').textContent = totalSkills;
    document.getElementById('completedSkills').textContent = completedSkills;
    document.getElementById('overallProgress').textContent = overallProgress + '%';
}

// الحصول على تسمية مستوى الصعوبة
function getDifficultyLabel(level) {
    const labels = {
        'beginner': 'مبتدئ',
        'intermediate': 'متوسط',
        'advanced': 'متقدم'
    };
    return labels[level] || level;
}

// الحصول على تسمية نوع المورد
function getResourceTypeLabel(type) {
    const labels = {
        'video': 'فيديو',
        'audio': 'صوتي',
        'article': 'مقال',
        'infographic': 'رسم بياني',
        'worksheet': 'ورقة عمل',
        'quiz': 'اختبار'
    };
    return labels[type] || type;
}
async function fetchSkills() {
try {
const response = await fetch('/api/skills');
if (!response.ok) {
throw new Error(`HTTP error! status: ${response.status}`);
    
const skills = await response.json();
displaySkills(skills);
    } catch (error) {
console.error('Error fetching skills:', error);
document.getElementById('skillsContainer').innerHTML = `
 <div class="error-message">
 <p>ً
،ً حدث خطأ أثناء تحميل المهارات. يرجى المحاولة مرة أخرى لاحقا
<p/<.عذرا
 <button onclick="fetchSkills()">المحاولة إعادة>/button>
 </div>
 `;
}
}
عرض المهارات في الصفحة //
function displaySkills(skills, categoryFilter = 'all') {
const container = document.getElementById('skillsContainer');
container.innerHTML = '';
تصفية المهارات حسب الفئة إذا تم تحديد فئة //
const filteredSkills = categoryFilter === 'all'
? skills
: skills.filter(skill => skill.category_id == categoryFilter);
if (filteredSkills.length === 0) {
;'<p/<.لا توجد مهارات في هذه الفئة<p = '<innerHTML.container
return;
}
filteredSkills.forEach(skill => {
const skillCard = document.createElement('div');
skillCard.className = 'skill-card';
استرجاع تقدم المستخدم )يمكن تعديله حسب نظام تسجيل الدخول( //
const progress = getUserProgress(skill.id) || 0;
skillCard.innerHTML = `
 <div class="skill-emoji">${skill.emoji}</div>
 <h2 class="skill-title">${skill.title}</h2>
 <p class="skill-description">${skill.description}</p>
 <div class="skill-progress">
 <div class="skill-progress-bar" style="width: ${progress}%"></div>
 </div>
 <p>${progress}% مكتمل>/p>
 <button class="skill-button" onclick="loadSkillDetail(${skill.id})">المهارة عرض>/
button>
 `;
container.appendChild(skillCard);
});
}
استرجاع تقدم المستخدم )مثال بسيط - يمكن تعديله( //
function getUserProgress(skillId) {
    const progressData = {
%الوعي الذاتي - 60 // 60, 1:
%التنفس العلاجي - 45 // 45, 2:
%التخطيط الذكي - 30 // 30, 3:
باقي المهارات ... //
};
return progressData[skillId] || 0;
}
تحميل تفاصيل مهارة محددة //
async function loadSkillDetail(skillId) {
try {
عرض مؤشر التحميل //
document.getElementById('skillDetail').innerHTML = '<div class="loading">جاري
;'<div/<...تحميل تفاصيل المهارة
document.getElementById('skill-detail').style.display = 'block';
const response = await fetch(`/api/skills/${skillId}`);
if (!response.ok) {
throw new Error(`HTTP error! status: ${response.status}`);
}
const skillData = await response.json();
displaySkillDetail(skillData);
} catch (error) {
console.error('Error loading skill detail:', error);
document.getElementById('skillDetail').innerHTML = `
 <div class="error-message">
 <p>ً
،ً حدث خطأ أثناء تحميل تفاصيل المهارة. يرجى المحاولة مرة أخرى لاحقا
<p/<.عذرا
 <button onclick="loadSkillDetail(${skillId})">المحاولة إعادة>/button>
 </div>
 `;
}
}
عرض تفاصيل المهارة //
function displaySkillDetail(skillData) {
const detailContainer = document.getElementById('skillDetail');
التمرير إلى قسم التفاصيل //
detailContainer.scrollIntoView({ behavior: 'smooth' });
let componentsHTML = '';
if (skillData.components && skillData.components.length > 0) {
skillData.components.forEach(component => {
componentsHTML += `
 <div class="component-section">
 <h3 class="component-title">${component.section_title}</h3>
 <div>${component.content}</div>
 </div>
 `;
});
}
let exercisesHTML = '';
if (skillData.exercises && skillData.exercises.length > 0) {
exercisesHTML = '<h2>العملية التمارين>/h2>';
skillData.exercises.forEach(exercise => {
exercisesHTML += `
 <div class="exercise-card">
 <h3 class="exercise-title">${exercise.title}</h3>
 <p class="exercise-description">${exercise.description}</p>
 <p>المدة: $}exercise.duration} | المستوى: $
{getArabicDifficulty(exercise.difficulty_level)}</p>
<4h/<:خطوات التمرين<4h <
 <div class="exercise-instructions">${exercise.instructions}</div>
<4h/<:النتيجة المتوقعة<4h <
 <p>${exercise.expected_outcome}</p>
 </div>
 `;
});
}
let resourcesHTML = '';
if (skillData.resources && skillData.resources.length > 0) {
resourcesHTML = '<h2>إضافية موارد>/h2>';
skillData.resources.forEach(resource => {
resourcesHTML += `
 <div class="resource-item">
 <h3>${resource.title}</h3>
 <p>النوع: $}getArabicResourceType(resource.type)}</p>
${resource.url ? `<p><a href="${resource.url}" target="_blank">فتح
المورد>/a></p>` : ''}
 <p>${resource.description}</p>
 </div>
 `;
});
}
detailContainer.innerHTML = `
 <div class="skill-header">
 <div class="skill-emoji-large">${skillData.emoji}</div>
 <div class="skill-title-container">
 <h1>${skillData.title}</h1>
 <p>${skillData.description}</p>
 </div>
 </div>
${componentsHTML}
${exercisesHTML}
${resourcesHTML}
 <div class="skill-actions">
 <button class="skill-button" onclick="markProgress(${skillData.id})">تحديث
<button/<التقدم
 <button class="skill-button secondary" 
onclick="document.getElementById('skill-detail').style.display = 'none'">إغلاق>/
button>
 </div>
 `;
}
تحويل مستوى الصعوبة إلى العربية //
function getArabicDifficulty(level) {
const levels = {
,'مبتدئ' :'beginner'
,'متوسط' :'intermediate'
'متقدم' :'advanced'
};
return levels[level] || level;
}
تحويل نوع المورد إلى العربية //
function getArabicResourceType(type) {
const types = {
,'فيديو' :'video'
,'صوت' :'audio'
,'مقال' :'article'
,'رسم معلوماتي' :'infographic'
,'ورقة عمل' :'worksheet'
'اختبار' :'quiz'
};
return types[type] || type;
}
تحديث تقدم المستخدم )مثال بسيط( //
async function markProgress(skillId) {
try {
في التطبيق الحقيقي، يجب إرسال البيانات إلى الخادم //
const response = await fetch('/api/progress', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({
يجب استبدال هذا بمعرف المستخدم الحقيقي // 1, :id_user
skill_id: skillId,
    ً يمكن حساب هذه القيمة بناء على تقدم المستخدم الفعلي // 75, :percentage_progress

completed_components: '1,2,3',

completed_exercises: '1,2'

})

});

if (!response.ok) {

throw new Error(`HTTP error! status: ${response.status}`);

}

const result = await response.json();

if (result.success) {

;('!تم تحديث التقدم بنجاح')alert

إعادة تحميل المهارات لتحديث شريط التقدم //

fetchSkills();

} else {

;('فشل تحديث التقدم')Error new throw

}

} catch (error) {

console.error('Error updating progress:', error);

alert('

ً

،ً حدث خطأ أثناء تحديث التقدم. يرجى المحاولة مرة أخرى لاحقا

;('.عذرا

}

}

إعداد أزرار تصفية الفئات //

function setupCategoryTabs() {

const tabs = document.querySelectorAll('.category-tab');

tabs.forEach(tab => {

tab.addEventListener('click', function() {

إزالة الفئة النشطة من جميع الأزرار //

tabs.forEach(t => t.classList.remove('active'));

إضافة الفئة النشطة إلى الزر المحدد //

this.classList.add('active');

تصفية المهارات حسب الفئة المحددة //

const categoryId = this.getAttribute('data-category');

إعادة تحميل المهارات مع تصفية الفئة //

fetch('/api/skills')

.then(response => response.json())

.then(skills => displaySkills(skills, categoryId))

.catch(error => console.error('Error:', error));

});

});

}

تحميل المهارات عند تحميل الصفحة //
    window.onload = function() {
fetchSkills();
setupCategoryTabs();
