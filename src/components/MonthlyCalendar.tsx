import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
} from "react-native";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type MonthlyCalendarProps = {
  openDays: string[];
  year: number;
  monthIndex: number; // 0-based (0=Jan)
};

const formatDateString = (year: number, monthIndex: number, day: number) => {
  const month = String(monthIndex + 1).padStart(2, "0");
  const date = String(day).padStart(2, "0");
  return `${year}-${month}-${date}`;
};

const buildCalendarDays = (year: number, monthIndex: number) => {
  const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const slots: Array<number | null> = [];
  for (let i = 0; i < firstDayOfWeek; i += 1) {
    slots.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    slots.push(day);
  }

  return slots;
};

const MonthlyCalendar = ({ openDays, year, monthIndex }: MonthlyCalendarProps) => {
  const openDaySet = useMemo(() => new Set(openDays), [openDays]);
  const daySlots = useMemo(
    () => buildCalendarDays(year, monthIndex),
    [year, monthIndex]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {year}-{String(monthIndex + 1).padStart(2, "0")}
      </Text>
      <View style={styles.weekRow}>
        {WEEK_DAYS.map((label) => (
          <Text key={label} style={styles.weekLabel}>
            {label}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {daySlots.map((day, index) => {
          if (day === null) {
            return <View key={`empty-${index}`} style={styles.cell} />;
          }

          const dateString = formatDateString(year, monthIndex, day);
          const isOpen = openDaySet.has(dateString);
          const cellStyle: ViewStyle[] = [styles.cell, styles.dateCell];
          const textStyle = [styles.dateText];

          if (isOpen) {
            cellStyle.push(styles.openCell);
            textStyle.push(styles.openText);
          } else {
            cellStyle.push(styles.closedCell);
            textStyle.push(styles.closedText);
          }

          return (
            <Pressable
              key={dateString}
              style={cellStyle}
              disabled={!isOpen}
              onPress={() => console.log(`Selected: ${dateString}`)}
            >
              <Text style={textStyle}>{day}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  weekLabel: {
    width: "14.28%",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  dateCell: {
    borderRadius: 6,
  },
  dateText: {
    fontSize: 14,
  },
  openCell: {
    backgroundColor: "#e0f2fe",
  },
  openText: {
    color: "#0f4c81",
    fontWeight: "600",
  },
  closedCell: {
    backgroundColor: "#f1f1f1",
  },
  closedText: {
    color: "#a0a0a0",
  },
});

export default MonthlyCalendar;
