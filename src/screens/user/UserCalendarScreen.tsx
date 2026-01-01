import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { fetchOpenDaysInMonth } from '../../lib/firestore';
import { pad2 } from '../../lib/time';

export type UserCalendarScreenProps = {
  navigation: { navigate: (screen: string, params?: { date: string }) => void };
};

export const UserCalendarScreen = ({ navigation }: UserCalendarScreenProps) => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const [openDays, setOpenDays] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const loadOpenDays = useCallback(async (targetYear: number, targetMonth: number) => {
    setLoading(true);
    setError(null);
    try {
      const openDaysSet = await fetchOpenDaysInMonth(targetYear, targetMonth);
      setOpenDays(openDaysSet);
    } catch (err) {
      setError('読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOpenDays(year, month);
  }, [loadOpenDays, year, month]);

  const markedDates = useMemo(() => {
    const marks: Record<string, { disabled?: boolean; marked?: boolean; dotColor?: string }> = {};
    openDays.forEach((date) => {
      marks[date] = {
        disabled: false,
        marked: true,
        dotColor: '#2f6fed'
      };
    });
    return marks;
  }, [openDays]);

  const handleDayPress = (day: DateData) => {
    if (!openDays.has(day.dateString)) {
      return;
    }
    navigation.navigate('UserDaySlots', { date: day.dateString });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>予約可能日を選択</Text>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.statusText}>読み込み中...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadOpenDays(year, month)}>
            <Text style={styles.retryText}>再読み込み</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Calendar
          key={`${year}-${month}`}
          current={`${year}-${pad2(month)}-01`}
          markedDates={markedDates}
          disabledByDefault
          onDayPress={handleDayPress}
          onMonthChange={(date) => {
            setYear(date.year);
            setMonth(date.month);
          }}
          enableSwipeMonths
          style={styles.calendar}
          theme={{
            todayTextColor: '#2f6fed',
            arrowColor: '#2f6fed',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14
          }}
        />
      )}
      <Text style={styles.note}>※グレーの日時は予約できません。</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24
  },
  statusText: {
    marginTop: 8,
    color: '#666'
  },
  errorText: {
    color: '#d64545',
    marginBottom: 12
  },
  retryButton: {
    backgroundColor: '#2f6fed',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6
  },
  retryText: {
    color: '#fff'
  },
  note: {
    marginTop: 12,
    color: '#666'
  }
});
