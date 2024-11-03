import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login, Onboarding, Signup, Splash } from '../screens';
import BottomTab from './BottomTab';
import FormSixteenList from '../components/FormSixteen/FormSixteenList';

const Stack = createNativeStackNavigator();
const AuthStack = () => {
    
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="HomeScreen" component={BottomTab} />
    <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  )
}

export default AuthStack

const styles = StyleSheet.create({})