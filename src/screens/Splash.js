import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, StatusBar, Image} from 'react-native';
import {Colors} from '../../src/constants';
import Logo from '../assets/images/logo.png';

const Splash = ({navigation}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  setTimeout(() => {
    navigation.replace('Onboarding');
  }, 3000);
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#465bd8"
      />
      <Image source={Logo} />
      <Text
        style={{
          fontFamily: 'OpenSans-Bold',
          fontSize: 30,
          color: '#003f69',
          marginVertical: 20,
        }}>
        Sudhkar Advisors
      </Text>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({});
