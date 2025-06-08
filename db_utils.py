def get_skill_by_id(skill_id):
    return Skill.query.get(skill_id)

def get_all_skills():
    return Skill.query.order_by(Skill.priority_order).all()
