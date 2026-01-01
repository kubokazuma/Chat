import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const DEFAULT_PASSWORD = '0000';

export type AdminLoginScreenProps = {
  navigation: { navigate: (screen: string) => void };
};

export const AdminLoginScreen = ({ navigation }: AdminLoginScreenProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    if (password === DEFAULT_PASSWORD) {
      navigation.navigate('AdminCalendar');
      return;
    }
    setError('パスワードが違います');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>管理者ログイン</Text>
      <Text style={styles.label}>パスワード</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError(null);
        }}
        placeholder="0000"
        secureTextEntry
        keyboardType="number-pad"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ログイン</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16
  },
  label: {
    color: '#666'
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
