src/utils/goalGenerator.js

src/utils/goalGenerator.js

import goalTemplates from "../data/goal_templates.json";

export function suggestGoals(userProfile) {
  const suggestions = [];

  // إذا دخله ضعيف يقترح هدف مالي
  if (userProfile.income < 3000) {
    suggestions.push(goalTemplates.find(g => g.domain === "مالي"));
  }

  // إذا عنده ضغط نفسي أو توتر
  if (userProfile.stressLevel >= 7) {
    suggestions.push(goalTemplates.find(g => g.domain === "نفسي/روحي"));
  }

  // إذا عنده اهتمام بالصحة
  if (userProfile.interests.includes("الصحة")) {
    suggestions.push(goalTemplates.find(g => g.domain === "شخصي"));
  }

  return suggestions;
}


---

3. 🧪 مثال استدعاء الدالة:

const user = {
  income: 2500,
  stressLevel: 8,
  interests: ["الزراعة", "الصحة", "التسويق"]
};

const goals = suggestGoals(user);
console.log(goals);


---
