from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class Skill(db.Model):
    __tablename__ = 'skills'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    emoji = db.Column(db.String(10))
    description = db.Column(db.Text)
    priority_order = db.Column(db.Integer)
    components = db.relationship('SkillComponent', backref='skill', lazy=True)

class SkillComponent(db.Model):
    __tablename__ = 'skill_components'
    id = db.Column(db.Integer, primary_key=True)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'), nullable=False)
    section_title = db.Column(db.String(255))
    content = db.Column(db.Text)
    order = db.Column(db.Integer)
