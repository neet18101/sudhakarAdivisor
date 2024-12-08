import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTab from './BottomTab';
import FormSixteenList from '../components/FormSixteen/FormSixteenList';
import {
  CreateComplaints,
  FormPartA,
  Login,
  TDS_Document,
  ComplaintsList,
  ComplaintsChat,
  BuyPlan,
  TDSForm,
  ChallanReport,
  TaxAuditForm,
  AcknowledgementReceiptForm,
  AcknowledgementUpdateReceiptForm,
  FormPartB,
  ITRUpload,
  FormPart26Q,
  MemeberPlanReport,
} from '../screens';


const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={BottomTab} />
      <Stack.Screen name="FormSixteen" component={FormSixteenList} />
      <Stack.Screen name="FormPartA" component={FormPartA} />
      <Stack.Screen name="ITRUpload" component={ITRUpload} />
      <Stack.Screen name="FormPartB" component={FormPartB} />
      <Stack.Screen name="TDS_Document" component={TDS_Document} />
      <Stack.Screen name="CreateComplaints" component={CreateComplaints} />
      <Stack.Screen name="ComplaintsList" component={ComplaintsList} />
      <Stack.Screen name="ComplaintsChat" component={ComplaintsChat} />
      <Stack.Screen name="BuyPlan" component={BuyPlan} />
      <Stack.Screen name="MemeberPlanReport" component={MemeberPlanReport} />
      <Stack.Screen name="TDSForm" component={TDSForm} />
      <Stack.Screen name="ChallanForm" component={ChallanReport} />
      <Stack.Screen name="TaxAuditForm" component={TaxAuditForm} />
      <Stack.Screen name="FormPartA26Q" component={FormPart26Q} />
      <Stack.Screen
        name="AcknowledgementReceiptForm"
        component={AcknowledgementReceiptForm}
      />
      <Stack.Screen name="AcknowledgementUpdateReceiptForm" component={AcknowledgementUpdateReceiptForm} />
    </Stack.Navigator>
  );
};

export default AppStack;

const styles = StyleSheet.create({});
