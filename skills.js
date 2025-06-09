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

