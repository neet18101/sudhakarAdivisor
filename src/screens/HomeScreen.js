import React, {useEffect, useState} from 'react';
import {Image, Text, View, StyleSheet, StatusBar} from 'react-native';
import colors from '../constants/Colors';
import Slider from '../components/HomeScreen/Slider';
import Fetaure from '../components/HomeScreen/Fetaure';
import Header from '../components/HomeScreen/Header';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import URLActivity from '../utlis/URLActivity';

const Home = ({navigation}) => {
  const [macAddress, setMacAddress] = useState('');
  const [userDetails, setUserDetails] = useState([]);
  const [employee27Api, setEmoployee27Api] = useState(false);
  useEffect(() => {
    const fetchMacAddress = async () => {
      const address = await DeviceInfo.getUniqueId();
      setMacAddress(address);
    };
    fetchMacAddress();
  }, []);
  useEffect(() => {
    const fetchPhoneNumberAndData = async () => {
      try {
        const phoneNum = await AsyncStorage.getItem('phoneNo');
        const tanNumber = await AsyncStorage.getItem('userToken');
        const regisType = await AsyncStorage.getItem('RegisType');
        if (regisType === '3') setEmoployee27Api(true);

        if (phoneNum) {
          await userDetailsAPI(phoneNum, tanNumber);
        }
      } catch (error) {
        console.error('Error retrieving user token:', error);
      }
    };
    fetchPhoneNumberAndData();
  }, []);
  const userDetailsAPI = async (phoneNo, tan) => {
    const formdata = new FormData();
    formdata.append('MobileNo', phoneNo);
    formdata.append('TAN_PAN', tan);
    formdata.append('EmailId', '');

    try {
      const response = await fetch(URLActivity?.GetUserDetails, {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      });
      const result = await response.json();

      if (result.result && result.result.length > 0) {
        await AsyncStorage.setItem(
          'TanDepartId',
          JSON.stringify(result.result),
        );
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Header navigation={navigation} />
      </View>
      <Slider />
      <Fetaure navigation={navigation} Employee27={employee27Api} />
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
    gap: 10,
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
