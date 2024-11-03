import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTab from './BottomTab';
import FormSixteenList from '../components/FormSixteen/FormSixteenList';
import {CreateComplaints, FormPartA, Login, TDS_Document} from '../screens';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={BottomTab} />
      <Stack.Screen name="FormSixteen" component={FormSixteenList} />
      {/* <Stack.Screen name="FormPartA" component={FormPartA} /> */}
      <Stack.Screen name="TDS_Document" component={TDS_Document} />
      <Stack.Screen name="CreateComplaints" component={CreateComplaints} />
      
    </Stack.Navigator>
  );
};

export default AppStack;

const styles = StyleSheet.create({});
