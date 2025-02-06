import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import TabBar from "@/components/tabbar/TabBar"

export default function TabLayout() {

  return (
    <Tabs
      tabBar={props=> <TabBar {...props}/>}
      screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
        }}
      />
    </Tabs>
  );
}
