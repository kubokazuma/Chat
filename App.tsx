import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import MonthlyCalendar from "./src/components/MonthlyCalendar";

const openDays = ["2026-01-05", "2026-01-10", "2026-01-18"];

export default function App() {
  const today = new Date();
  const year = today.getFullYear();
  const monthIndex = today.getMonth();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MonthlyCalendar openDays={openDays} year={year} monthIndex={monthIndex} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
