Skills_routes.py
from flask import Blueprint, jsonify
from model.skills_model import Skill, SkillComponent
from model import db

skills_bp = Blueprint('skills', __name__)

@skills_bp.route('/skills', methods=['GET'])
def get_skills():
    skills = Skill.query.order_by(Skill.priority_order).all()
    return jsonify([
        {
            'id': skill.id,
            'title': skill.title,
            'emoji': skill.emoji,
            'description': skill.description
        } for skill in skills
    ])

@skills_bp.route('/skills/<int:skill_id>', methods=['GET'])
def get_skill_detail(skill_id):
    skill = Skill.query.get_or_404(skill_id)
    components = SkillComponent.query.filter_by(skill_id=skill.id).order_by(SkillComponent.order).all()
    return jsonify({
        'id': skill.id,
        'title': skill.title,
        'emoji': skill.emoji,
        'description': skill.description,
        'components': [
            {
                'section_title': comp.section_title,
                'content': comp.content,
                'order': comp.order
            } for comp in components
        ]
    })
