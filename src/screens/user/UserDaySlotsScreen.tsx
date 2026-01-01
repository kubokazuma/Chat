import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchSlotsByDate, Slot } from '../../lib/firestore';

export type UserDaySlotsScreenProps = {
  route: { params: { date: string } };
  navigation: { navigate: (screen: string, params: { date: string; time: string }) => void };
};

export const UserDaySlotsScreen = ({ route, navigation }: UserDaySlotsScreenProps) => {
  const { date } = route.params;
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSlots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await fetchSlotsByDate(date);
      setSlots(results);
    } catch (err) {
      setError('時間枠の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{date} の時間枠</Text>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.statusText}>読み込み中...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadSlots}>
            <Text style={styles.retryText}>再読み込み</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={slots}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const isAvailable = item.isOpen && !item.bookedBy;
            const statusText = item.isOpen
              ? item.bookedBy
                ? '予約済み'
                : '予約可能'
              : '受付不可';
            return (
              <TouchableOpacity
                style={[styles.slotCard, !isAvailable && styles.slotDisabled]}
                disabled={!isAvailable}
                onPress={() => navigation.navigate('Booking', { date, time: item.time })}
              >
                <View>
                  <Text style={styles.slotTime}>{item.time}</Text>
                  <Text style={styles.slotStatus}>{statusText}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={<Text style={styles.emptyText}>この日の枠はまだありません。</Text>}
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
  slotCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f4f7ff',
    borderWidth: 1,
    borderColor: '#d6e0ff'
  },
  slotDisabled: {
    backgroundColor: '#f2f2f2',
    borderColor: '#ddd'
  },
  slotTime: {
    fontSize: 18,
    fontWeight: '600'
  },
  slotStatus: {
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
