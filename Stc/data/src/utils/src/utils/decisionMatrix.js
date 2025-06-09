src/utils/decisionMatrix.js

export function evaluateOptions(options, criteriaWeights) {
  return options.map(option => {
    let score = 0;
    for (let criterion in criteriaWeights) {
      score += option[criterion] * criteriaWeights[criterion];
    }
    return { name: option.name, score };
  }).sort((a, b) => b.score - a.score);
}

✅ مثال استخدام:

const options = [
  { name: "وظيفة A", دخل: 7, راحة: 8, تطوير: 6 },
  { name: "وظيفة B", دخل: 6, راحة: 9, تطوير: 9 },
  { name: "وظيفة C", دخل: 8, راحة: 5, تطوير: 7 }
];

const criteriaWeights = { دخل: 0.4, راحة: 0.3, تطوير: 0.3 };

const result = evaluateOptions(options, criteriaWeights);
console.log(result); // يعرض أفضل خيار بناءً على الأوزان


---
