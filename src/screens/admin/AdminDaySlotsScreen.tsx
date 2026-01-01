import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { fetchSlotsByDate, Slot, updateSlotOpenState } from '../../lib/firestore';

export type AdminDaySlotsScreenProps = {
  route: { params: { date: string } };
  navigation: { navigate: (screen: string, params?: { date: string }) => void };
};

export const AdminDaySlotsScreen = ({ route, navigation }: AdminDaySlotsScreenProps) => {
  const { date } = route.params;
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

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

  const handleToggle = async (slot: Slot) => {
    setUpdatingIds((prev) => new Set(prev).add(slot.id));
    try {
      await updateSlotOpenState(date, slot.time, !slot.isOpen);
      await loadSlots();
    } catch (err) {
      setError('更新に失敗しました');
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(slot.id);
        return next;
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{date} の枠管理</Text>
      <TouchableOpacity style={styles.bookingButton} onPress={() => navigation.navigate('AdminBookings', { date })}>
        <Text style={styles.bookingButtonText}>予約一覧を見る</Text>
      </TouchableOpacity>
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
            const isUpdating = updatingIds.has(item.id);
            return (
              <View style={styles.slotCard}>
                <View>
                  <Text style={styles.slotTime}>{item.time}</Text>
                  <Text style={styles.slotStatus}>{item.isOpen ? '公開中' : '非公開'}</Text>
                  {item.bookedBy ? <Text style={styles.bookedText}>予約済み</Text> : null}
                </View>
                <TouchableOpacity
                  style={[styles.toggleButton, item.isOpen ? styles.toggleOn : styles.toggleOff]}
                  onPress={() => handleToggle(item)}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.toggleText}>{item.isOpen ? '閉じる' : '開ける'}</Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          }}
          ListEmptyComponent={<Text style={styles.emptyText}>時間枠がありません。</Text>}
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
  bookingButton: {
    backgroundColor: '#2f6fed',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12
  },
  bookingButtonText: {
    color: '#fff'
  },
  list: {
    gap: 12
  },
  slotCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  slotTime: {
    fontSize: 18,
    fontWeight: '600'
  },
  slotStatus: {
    marginTop: 4,
    color: '#666'
  },
  bookedText: {
    marginTop: 4,
    color: '#d64545'
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6
  },
  toggleOn: {
    backgroundColor: '#d64545'
  },
  toggleOff: {
    backgroundColor: '#2f6fed'
  },
  toggleText: {
    color: '#fff'
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
