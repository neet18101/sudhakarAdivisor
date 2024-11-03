import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import logoImage from '../assets/images/logo.png';
import {Colors} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../utlis/AuthContext';
import URLActivity from '../utlis/URLActivity';

export default function Login({navigation}) {
  const {login, userToken, isloading} = useContext(AuthContext);
  const [form, setForm] = useState({
    userID: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const {userID, password} = form;
    const formData = new FormData();
    formData.append('UserId', userID);
    formData.append('Password', password);
    formData.append('DeviceID', '');
    console.log('Form Data:', formData);

    try {
      const response = await fetch(URLActivity.LoginLICAgent, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      if (data?.result[0]?.IsFound === 'True') {
        await AsyncStorage.setItem('userToken', data?.result[0]?.UserCode);
        await AsyncStorage.setItem('username', data?.result[0]?.Name);
        await AsyncStorage.setItem('email', data?.result[0]?.Mail);
        await AsyncStorage.setItem('phoneNo', data?.result[0]?.Mobile);
        await AsyncStorage.setItem('username', data?.result[0]?.Name);
        const userToken = data?.result[0]?.UserCode;
        await login(userToken);
        navigation.navigate('HomeScreen');
      } else {
        Alert.alert('Error', data.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  if (isloading) {
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator
        size={'large'}
        color={Colors.primary}></ActivityIndicator>
    </View>;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.header}>
            <Image
              alt="App Logo"
              resizeMode="contain"
              style={styles.headerImg}
              source={logoImage}
            />
            <Text style={styles.title}>
              <Text style={{color: '#478e30'}}>Sudhkar Advisors</Text>
            </Text>
            <Text style={styles.subtitle}>Tax Made Simple, Smarter</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>User ID</Text>
              <TextInput
                autoCapitalize="characters"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="email-address"
                onChangeText={userID => setForm({...form, userID})}
                placeholder="Enter your user ID"
                placeholderTextColor="#6b7280"
                maxLength={10}
                style={styles.inputControl}
                value={form.userID}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  keyboardType="number-pad"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  onChangeText={password => setForm({...form, password})}
                  placeholder="********"
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  maxLength={10}
                  secureTextEntry={!showPassword} // Show password based on state
                  value={form.password}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}>
                  <Icon
                    name={showPassword ? 'visibility' : 'visibility-off'} // Choose icon based on showPassword state
                    size={24}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formAction}>
              <TouchableOpacity onPress={handleLogin}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Sign in</Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.formLink}>Forgot password?</Text>
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.formFooter}>
          <Text style={styles.formFooterSingup}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text
              style={{
                color: Colors.primary,
                textDecorationLine: 'underline',
                fontWeight: '700',
              }}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12, // Adjust to align icon on the right side
    padding: 4, // Add some padding for easier tapping
  },
  togglePasswordText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 20,
  },
  form: {
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003f69',
    textAlign: 'center',
  },
  formFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formFooterSingup: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderStyle: 'solid',
    flex: 1, // Ensures TextInput expands fully in row layout
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#003f69',
    borderColor: '#003f69',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});
