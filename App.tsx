import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { UserCalendarScreen } from './src/screens/user/UserCalendarScreen';
import { UserDaySlotsScreen } from './src/screens/user/UserDaySlotsScreen';
import { BookingScreen } from './src/screens/user/BookingScreen';
import { AdminLoginScreen } from './src/screens/admin/AdminLoginScreen';
import { AdminCalendarScreen } from './src/screens/admin/AdminCalendarScreen';
import { AdminDaySlotsScreen } from './src/screens/admin/AdminDaySlotsScreen';
import { AdminBookingsScreen } from './src/screens/admin/AdminBookingsScreen';

export type RootStackParamList = {
  Home: undefined;
  UserCalendar: undefined;
  UserDaySlots: { date: string };
  Booking: { date: string; time: string };
  AdminLogin: undefined;
  AdminCalendar: undefined;
  AdminDaySlots: { date: string };
  AdminBookings: { date: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'モード選択' }} />
        <Stack.Screen name="UserCalendar" component={UserCalendarScreen} options={{ title: '利用者カレンダー' }} />
        <Stack.Screen name="UserDaySlots" component={UserDaySlotsScreen} options={{ title: '時間枠一覧' }} />
        <Stack.Screen name="Booking" component={BookingScreen} options={{ title: '予約' }} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ title: '管理者ログイン' }} />
        <Stack.Screen name="AdminCalendar" component={AdminCalendarScreen} options={{ title: '管理者カレンダー' }} />
        <Stack.Screen name="AdminDaySlots" component={AdminDaySlotsScreen} options={{ title: '枠管理' }} />
        <Stack.Screen name="AdminBookings" component={AdminBookingsScreen} options={{ title: '予約一覧' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
