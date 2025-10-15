import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { WelcomeScreen } from '@screens/auth/WelcomeScreen';
import { SignInScreen } from '@screens/auth/SignInScreen';
import { SignUpScreen } from '@screens/auth/SignUpScreen';

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F2F2F7' },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};