import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ImageBackground,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from '../../src/constants';
import Buttons from '../components/Buttons';

const Onboarding = ({navigation}) => {
  const handleFinishOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasOnboarded', true);
      navigation.navigate('AuthStack');
    } catch (error) {
      Alert.alert('Error', 'Failed to complete onboarding. Try again.');
      console.error('AsyncStorage error: ', error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* handshake image */}
      <View style={{flex: 3, flexDirection: 'column', backgroundColor: '#ddd'}}>
        <ImageBackground
          source={require('../assets/images/handshake.png')}
          style={{flex: 1, width: '100%', backgroundColor: '#fff'}}
        />
      </View>
      {/* button and text */}
      <View style={{flex: 2, backgroundColor: '#fff'}}>
        {/* Text part */}
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}>
          <Text
            style={{
              fontFamily: 'OpenSans-Bold',
              color: Colors.black,
              fontSize: 30,
            }}>
            Sudhkar Advisors
          </Text>
          <Text
            style={{
              maxWidth: '50%',
              fontFamily: 'OpenSans-Medium',
              color: '#999',
              fontSize: 14,
              textAlign: 'center',
              paddingTop: 10,
            }}>
            All new in one place, be the first to know last new
          </Text>
        </View>
        {/* Button */}
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <Buttons
            btn_text={'Get Started'}
            on_press={() => handleFinishOnboarding()}
          />
        </View>
      </View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({});
