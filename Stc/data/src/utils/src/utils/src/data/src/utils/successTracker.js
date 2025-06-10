src/utils/successTracker.js
import achievements from "../data/achievements.json";

export function getWeeklyAchievements(startDate, endDate) {
  return achievements.filter(a => {
    const date = new Date(a.date);
    return date >= new Date(startDate) && date <= new Date(endDate);
  });

