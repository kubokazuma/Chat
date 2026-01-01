export const TIME_START_MIN = 9 * 60;
export const TIME_END_MIN = 18 * 60;
export const TIME_STEP_MIN = 30;

export const pad2 = (value: number) => value.toString().padStart(2, '0');

export const minutesToTimeString = (minutes: number) => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${pad2(hour)}:${pad2(minute)}`;
};

export const timeStringToMinutes = (time: string) => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
};

export const generateTimeSlots = () => {
  const slots: { minutes: number; label: string }[] = [];
  for (let minutes = TIME_START_MIN; minutes < TIME_END_MIN; minutes += TIME_STEP_MIN) {
    slots.push({ minutes, label: minutesToTimeString(minutes) });
  }
  return slots;
};

export const daysInMonth = (year: number, month: number) => {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
};

export const buildDateString = (year: number, month: number, day: number) => {
  return `${year}-${pad2(month)}-${pad2(day)}`;
};

export const monthRange = (year: number, month: number) => {
  const start = buildDateString(year, month, 1);
  const endDay = daysInMonth(year, month);
  const end = buildDateString(year, month, endDay);
  return { start, end };
};
