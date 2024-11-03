import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContextProvider, useAuth } from './src/utlis/AuthContext';
import AuthStack from './src/navigation/AuthStack';
import AppStack from './src/navigation/AppStack';
import Splash from './src/screens/Splash';
import Onboarding from './src/screens/Onboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const MainApp = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      setIsFirstLaunch(hasLaunched === null);
      if (hasLaunched === null) await AsyncStorage.setItem('hasLaunched', 'true');
    };
    checkFirstLaunch();
  }, []);

  if (isLoading || isFirstLaunch === null) return <Splash />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isFirstLaunch ? (
        <Stack.Screen name="Onboarding" component={Onboarding} />
      ) : isLoggedIn ? (
        <Stack.Screen name="AppStack" component={AppStack} />
      ) : (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

const App = () => (
  <AuthContextProvider>
    <NavigationContainer>
      <MainApp />
    </NavigationContainer>
  </AuthContextProvider>
);

export default App;
