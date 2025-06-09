Skills Module
 * هذا الملف يتعامل مع عرض المهارات وإدارتها وتحليل التقدم
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Skills module loaded.");
    fetchSkills();
});

// متغيرات عامة
let allSkills = [];
let userProgress = {};
let currentUserId = 1; // عدّل حسب نظام تسجيل الدخول
let currentSkillId = null;

// استرجاع المهارات من الخادم
async function fetchSkills() {
    try {
        const response = await fetch('/api/skills');
        if (!response.ok) throw new Error('فشل تحميل المهارات');

        const data = await response.json();
        allSkills = data.skills;
        userProgress = data.progress || {};
        displaySkills(allSkills);
        updateStats();
    } catch (error) {
        console.error('حدث خطأ أثناء تحميل المهارات:', error);
    }
}

// عرض المهارات على الصفحة
function displaySkills(skills) {
    const skillsContainer = document.getElementById('skillsContainer');
    if (!skillsContainer) return;

    skillsContainer.innerHTML = skills.map(skill => {
        const progress = userProgress[skill.id]?.progress_percentage || 0;
        return `
            <div class="skill-card">
                <h3>${skill.name}</h3>
                <p>التصنيف: ${skill.category}</p>
                <p>المستوى: ${getDifficultyLabel(skill.difficulty)}</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%;"></div>
                    <span>${progress}%</span>
                </div>
                <button onclick="viewSkillDetail(${skill.id})">تفاصيل</button>
                <button onclick="updateProgress(${skill.id})">تحديث التقدم</button>
            </div>
        `;
    }).join('');
}

// عرض تفاصيل مهارة محددة
function viewSkillDetail(skillId) {
    const skill = allSkills.find(s => s.id === skillId);
    const skillDetailContainer = document.getElementById('skillDetail');
    if (!skill || !skillDetailContainer) return;

    let html = `
        <div class="skill-detail-body">
            <h2>${skill.name}</h2>
            <p><strong>الوصف:</strong> ${skill.description}</p>
            <p><strong>التصنيف:</strong> ${skill.category}</p>
            <p><strong>المستوى:</strong> ${getDifficultyLabel(skill.difficulty)}</p>
    `;

    if (skill.exercises && skill.exercises.length > 0) {
        html += '<div class="skill-exercises"><h3>التمارين:</h3>';
        skill.exercises.forEach(exercise => {
            html += `
                <div class="exercise-card">
                    <h4>${exercise.title}</h4>
                    <p>${exercise.description}</p>
                    ${exercise.instructions ? `
                        <div class="exercise-instructions">
                            <h4>التعليمات:</h4>
                            <p>${exercise.instructions}</p>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        html += '</div>';
    }

    html += '</div>'; // إغلاق skill-detail-body
    skillDetailContainer.innerHTML = html;
}

// فتح نافذة تحديث التقدم
function updateProgress(skillId) {
    currentSkillId = skillId;
    const current = userProgress[skillId] || { progress_percentage: 0, notes: '' };

    document.getElementById('progressPercentage').value = current.progress_percentage || 0;
    document.getElementById('progressValue').textContent = `${current.progress_percentage || 0}%`;
    document.getElementById('progressNotes').value = current.notes || '';

    document.getElementById('progressModal').style.display = 'block';
}

// حفظ التقدم في المهارة
async function saveProgress() {
    const percentage = parseInt(document.getElementById('progressPercentage').value);
    const notes = document.getElementById('progressNotes').value;

    const payload = {
        skill_id: currentSkillId,
        user_id: currentUserId,
        progress_percentage: percentage,
        notes: notes
    };

    try {
        const response = await fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('فشل في حفظ التقدم');

        userProgress[currentSkillId] = payload;
        closeProgressModal();
        displaySkills(allSkills);
        updateStats();

    } catch (error) {
        alert('حدث خطأ أثناء الحفظ: ' + error.message);
    }
}

// إغلاق نافذة التحديث
function closeProgressModal() {
    document.getElementById('progressModal').style.display = 'none';
    currentSkillId = null;
}

// تصنيف مستوى الصعوبة
function getDifficultyLabel(level) {
    switch (level) {
        case 1: return 'سهل';
        case 2: return 'متوسط';
        case 3: return 'صعب';
        default: return 'غير معروف';
    }
}

// تحديث الإحصائيات العامة
function updateStats() {
    const total = allSkills.length;
    const completed = Object.values(userProgress).filter(p => p.progress_percentage === 100).length;

    const statsContainer = document.getElementById('skillStats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <p>📈 المهارات المكتملة: ${completed} من ${total}</p>
        `;
    }
}


---

✅ جاهز للاستخدام مع العناصر التالية في HTML:

<div id="skillStats"></div>
<div id="skillsContainer"></div>
<div id="skillDetail"></div>

<!-- نافذة التحديث -->
<div id="progressModal" style="display:none;">
    <input type="range" id="progressPercentage" min="0" max="100" />
    <span id="progressValue">0%</span>
    <textarea id="progressNotes" placeholder="ملاحظاتك..."></textarea>
    <button onclick="saveProgress()">💾 حفظ</button>
    <button onclick="closeProgressModal()">❌ إغلاق</button>
</div>
