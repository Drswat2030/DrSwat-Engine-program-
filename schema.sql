-- إنشاء قاعدة البيانات
CREATE DATABASE IF NOT EXISTS drswat_skills;
USE drswat_skills;

-- جدول تصنيفات المهارات
CREATE TABLE skill_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول المهارات
CREATE TABLE skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    title VARCHAR(255) NOT NULL,
    emoji VARCHAR(10),
    description TEXT,
    priority_order INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES skill_categories(id)
);

-- جدول المحاور لكل مهارة
CREATE TABLE skill_components (
    id INT PRIMARY KEY AUTO_INCREMENT,
    skill_id INT NOT NULL,
    section_title VARCHAR(255) NOT NULL,
    content TEXT,
    order_index INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (skill_id) REFERENCES skills(id)
);

-- جدول تمارين المهارات
CREATE TABLE skill_exercises (
    id INT PRIMARY KEY AUTO_INCREMENT,
    skill_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(50),
    difficulty_level ENUM('beginner', 'intermediate', 'advanced'),
    instructions TEXT,
    expected_outcome TEXT,
    order_index INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (skill_id) REFERENCES skills(id)
);

-- جدول موارد المهارات
CREATE TABLE skill_resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    skill_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    type ENUM('video', 'audio', 'article', 'infographic', 'worksheet', 'quiz'),
    url VARCHAR(255),
    file_path VARCHAR(255),
    description TEXT,
    duration VARCHAR(50),
    order_index INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (skill_id) REFERENCES skills(id)
);

-- جدول المستخدمين
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول تقدم المستخدم
CREATE TABLE user_skill_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    progress_percentage INT DEFAULT 0,
    completed_components TEXT,
    completed_exercises TEXT,
    last_activity_date DATETIME,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (skill_id) REFERENCES skills(id)
);

