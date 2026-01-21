import React from 'react';
import { StatusBar } from 'expo-status-bar';
import WaitlistScreen from './src/screens/WaitlistScreen';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <WaitlistScreen />
    </>
  );
}
