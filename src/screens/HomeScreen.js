import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/HomeScreen/Header';

const HomeScreen = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };
    fetchUsername();
  }, []);
  return (
    <>
      <View style={styles.container}>
        <StatusBar
          animated={true}
          backgroundColor={colors.primary} // Set background color of StatusBar
          barStyle="light-content" // Set StatusBar icons to white
          translucent={false} // Set to true if you want a transparent status bar
        />
        <Header />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 25,
    backgroundColor: colors.primary, // Background color of the whole container
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // For spacing between avatar and text
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 99,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'OpenSans-SemiBold',
    fontWeight: '700',
    color: colors.white,
  },
});

export default HomeScreen;
