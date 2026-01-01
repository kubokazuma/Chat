import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Booking, fetchBookingsForDate } from '../../lib/firestore';

export type AdminBookingsScreenProps = {
  route: { params: { date: string } };
};

const extractTimeFromSlotId = (slotId: string) => {
  const parts = slotId.split('_');
  return parts.length > 1 ? parts[1] : '';
};

export const AdminBookingsScreen = ({ route }: AdminBookingsScreenProps) => {
  const { date } = route.params;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await fetchBookingsForDate(date);
      setBookings(results);
    } catch (err) {
      setError('予約一覧の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{date} の予約一覧</Text>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.statusText}>読み込み中...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadBookings}>
            <Text style={styles.retryText}>再読み込み</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.time}>{extractTimeFromSlotId(item.slotId)}</Text>
              <Text style={styles.facility}>{item.facilityName}</Text>
              <Text style={styles.subText}>ID: {item.id}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>予約はまだありません。</Text>}
        />
      )}
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
  list: {
    gap: 12
  },
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f4f7ff',
    borderWidth: 1,
    borderColor: '#d6e0ff'
  },
  time: {
    fontSize: 18,
    fontWeight: '600'
  },
  facility: {
    marginTop: 4,
    fontSize: 16
  },
  subText: {
    marginTop: 4,
    color: '#666'
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 24
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
  }
});
