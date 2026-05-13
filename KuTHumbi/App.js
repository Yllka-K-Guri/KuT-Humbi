import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, Platform } from 'react-native';
import { colors } from './src/theme';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import CreatePostScreen from './src/screens/CreatePostScreen';

if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.innerHTML = `
    html, body, #root { 
      height: 100%; 
      overflow: auto;
      margin: 0;
      padding: 0;
    }
    ::-webkit-scrollbar { display: none; }
  `;
  document.head.appendChild(style);
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}