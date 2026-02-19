export type TimeOfDay = "siang" | "sore" | "malam";

export const getTimeOfDay = (): TimeOfDay => {
  const now = new Date();
  const hour = now.getHours();

  // siang: 6 AM - 4:59 PM
  if (hour >= 6 && hour < 16) {
    return "siang";
  }

  // sore: 5 PM - 6:59 PM
  if (hour >= 16 && hour < 19) {
    return "sore";
  }

  // malam: 7 PM - 5:59 AM
  return "malam";
};

export const getAuthImagePath = (): string => {
  const timeOfDay = getTimeOfDay();
  return `/images/auth/${timeOfDay}.webp`;
};
