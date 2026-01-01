import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { bookSlotWithTransaction, BookingErrorCode } from '../../lib/firestore';

export type BookingScreenProps = {
  route: { params: { date: string; time: string } };
  navigation: { navigate: (screen: string) => void };
};

export const BookingScreen = ({ route, navigation }: BookingScreenProps) => {
  const { date, time } = route.params;
  const [facilityName, setFacilityName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedName = facilityName.trim();
  const canSubmit = trimmedName.length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError('事業所名を入力してください');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await bookSlotWithTransaction({ date, time, facilityName: trimmedName });
      Alert.alert('予約が確定しました', `${date} ${time}`);
      navigation.navigate('UserCalendar');
    } catch (err) {
      const message = (err as Error).message as BookingErrorCode;
      if (message === 'closed') {
        setError('受付終了しました。再読み込みしてください。');
      } else if (message === 'filled') {
        setError('埋まりました。別の枠を選択してください。');
      } else {
        setError('予約に失敗しました。通信状況をご確認ください。');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>予約内容の確認</Text>
      <View style={styles.card}>
        <Text style={styles.label}>日付</Text>
        <Text style={styles.value}>{date}</Text>
        <Text style={styles.label}>時間</Text>
        <Text style={styles.value}>{time}</Text>
      </View>
      <Text style={styles.label}>事業所名（必須）</Text>
      <TextInput
        style={styles.input}
        value={facilityName}
        onChangeText={setFacilityName}
        placeholder="事業所名を入力"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={[styles.button, !canSubmit && styles.buttonDisabled]} onPress={handleSubmit} disabled={!canSubmit}>
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>予約を確定する</Text>}
      </TouchableOpacity>
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
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f4f7ff',
    marginBottom: 16
  },
  label: {
    color: '#666',
    marginTop: 8
  },
  value: {
    fontSize: 18,
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 8
  },
  errorText: {
    color: '#d64545',
    marginTop: 8
  },
  button: {
    marginTop: 16,
    backgroundColor: '#2f6fed',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonDisabled: {
    backgroundColor: '#a0b5f5'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
