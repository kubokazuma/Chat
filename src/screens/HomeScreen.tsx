import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type HomeScreenProps = {
  navigation: { navigate: (screen: string) => void };
};

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>日程調整アプリ</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserCalendar')}>
        <Text style={styles.buttonText}>利用者モード</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminLogin')}>
        <Text style={styles.buttonText}>管理者モード</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16
  },
  button: {
    backgroundColor: '#2f6fed',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 200
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
  }
});
