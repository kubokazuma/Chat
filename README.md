# Chat

React Native Expo で日程調整アプリを作るためのサンプル実装です。

## 推奨ライブラリ
- Expo (managed workflow)
- React Navigation (`@react-navigation/native`, `@react-navigation/stack`)
- カレンダー UI: `react-native-calendars`
- Firestore SDK: `firebase`

## 導入手順
```bash
npm install
npm run start
```

Firebase の設定値は `src/firebaseConfig.ts` に入力してください。

## フォルダ構成
```
src/
  firebaseConfig.ts
  lib/
    firestore.ts
    time.ts
  screens/
    HomeScreen.tsx
    admin/
      AdminLoginScreen.tsx
      AdminCalendarScreen.tsx
      AdminDaySlotsScreen.tsx
      AdminBookingsScreen.tsx
    user/
      UserCalendarScreen.tsx
      UserDaySlotsScreen.tsx
      BookingScreen.tsx
```

## Firestore ルール例（MVP）
> 管理者はクライアント側の admin 判定と併用する想定です。

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /slots/{slotId} {
      allow read: if true;
      allow create, update: if request.auth != null && request.auth.token.admin == true;
      allow delete: if false;
    }

    match /bookings/{bookingId} {
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow create: if true;
      allow update, delete: if false;
    }
  }
}
```

> ※ ログインなしで使う場合は、Firestore ルールの設計を必ず見直してください。
