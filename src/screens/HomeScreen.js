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
  useEffect(() => {
    const fetchMacAddress = async () => {
      const address = await DeviceInfo.getUniqueId();
      setMacAddress(address);
    };
    fetchMacAddress();
  }, []);
  console.log(macAddress);

  useEffect(() => {
    const fetchPhoneNumberAndData = async () => {
      try {
        const phoneNum = await AsyncStorage.getItem('phoneNo');
        if (phoneNum) {
          await callApi(phoneNum);
        }
      } catch (error) {
        console.error('Error retrieving user token:', error);
      }
    };
    fetchPhoneNumberAndData();
  }, []);

  const callApi = async phoneNum => {
    const formdata = new FormData();
    formdata.append('TanDepartId', '-1');
    formdata.append('TanMemberId', '-1');
    formdata.append('CityId', '-1');
    formdata.append('RegisCode', '');
    formdata.append('MobileNo', phoneNum);
    formdata.append('Name', '');
    formdata.append('TAN', '');
    formdata.append('DeviceID', '');
    formdata.append('Status', '"Z"');
    formdata.append('', '');
    const requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };
    try {
      const response = await fetch(
        URLActivity?.TanDepartmentList,
        requestOptions,
      );
      const result = await response.json();
      // console.log(result);

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
