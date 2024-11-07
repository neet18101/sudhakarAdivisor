import React, {useEffect, useState} from 'react';
import {Image, Text, View, StyleSheet, StatusBar} from 'react-native';
import colors from '../constants/Colors';
import Slider from '../components/HomeScreen/Slider';
import Fetaure from '../components/HomeScreen/Fetaure';
import Header from '../components/HomeScreen/Header';
import DeviceInfo from 'react-native-device-info';

const Home = ({navigation}) => {
  const [macAddress, setMacAddress] = useState('');
  useEffect(() => {
    const fetchMacAddress = async () => {
      const address = await DeviceInfo.getUniqueId();
      setMacAddress(address);
    };
    fetchMacAddress();
  }, []);
  console.log(macAddress);
  return (
    <>
      <View style={styles.container}>
        <Header navigation={navigation} />
      </View>
      <Slider />
      <Fetaure navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
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

export default Home;
