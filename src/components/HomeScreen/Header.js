import React, {useEffect, useState} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import avatar from '../../assets/images/avatar.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../../utlis/AuthContext';
import Colors from '../../constants/Colors';

const Header = ({navigation}) => {
  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState(null);
  const {logout} = useAuth();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        const email = await AsyncStorage.getItem('email');
        if (username && email) {
          setUserName(username);
          setEmail(email);
        }
      } catch (error) {
        console.error('Error retrieving user token:', error);
      }
    };

    fetchToken();
  }, []);

  const handleLogout = async () => {
    await logout(); // Call logout from AuthContext
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}], // Navigate to the Login screen
    });
  };
  const dayColors = [
    Colors.darkHeaderColor,         // Sunday
    Colors.green2,           // Monday
    Colors.steelBlue,        // Tuesday
    Colors.primaryAlpha,     // Wednesday
    Colors.darkGray2,        // Thursday
    Colors.purpleAlpha,      // Friday
    Colors.primary,  // Saturday
  ];
  const backgroundColor = dayColors[new Date().getDay()];

  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor={Colors.primary}
        barStyle="light-content"
        translucent={false}
      />
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={avatar} style={styles.avatar} />
          <View>
            <Text
              style={{color: Colors.white, fontSize: 12, fontWeight: '700'}}>
              Welcome
            </Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Icon name="logout" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
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
    color: Colors.white,
  },
});

export default Header;
