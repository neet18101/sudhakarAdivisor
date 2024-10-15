import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext, AuthContextProvider} from './src/utlis/AuthContext';
import AuthStack from './src/navigation/AuthStack';
import AppStack from './src/navigation/AppStack';
import { View } from 'react-native-animatable';
import { ActivityIndicator } from 'react-native';
import { Splash } from './src/screens';

const Stack = createNativeStackNavigator();

const App = () => {
    // const {isLoading,userToken} = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    };
    checkLoginStatus();
  }, []);


  if (isLoading) {
   <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
    <ActivityIndicator size={"large"} />
   </View>
  }

  return (
    <AuthContextProvider>
      <NavigationContainer>
      <Stack.Screen name="Splash" component={Splash} />
        {isLoggedIn ? <AppStack /> : <AuthStack />}
    
      </NavigationContainer>
    </AuthContextProvider>
  );
};

export default App;
