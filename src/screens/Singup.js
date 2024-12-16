import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  FlatList,
  StatusBar,
} from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardAwareFlatList,
} from 'react-native-keyboard-aware-scroll-view';
import FeatherIcon from 'react-native-vector-icons/Feather';
import RadioButton from '../components/RadioButton';
import colors from '../constants/Colors';
import CustomPicker from '../components/CustomPicker';
import CitiesPicker from '../components/CitiesPicker';
import DeviceInfo from 'react-native-device-info';
import URLActivity from '../utlis/URLActivity';
import Toast from '../common/Toast';

export default function Signup({navigation}) {
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    DeviceInfo.getAndroidId().then(id => {
      setDeviceId(id);
    });
  }, []);
  const [form, setForm] = useState({
    name: '',
    MobileNo: '',
    EmailId: '',
    DeviceId: deviceId,
    pan: '',
    RegisTypeId: '',
    tanNumber: '',
    M25_DepartmentId: '',
    M04_CityId: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    MobileNo: '',
    EmailId: '',
    DeviceId: '',
    pan: '',
    tanNumber: '',
    M25_DepartmentId: '',
    RegisTypeId: '',
  });
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    if (!/^[0-9]{10}$/.test(form.MobileNo)) {
      newErrors.MobileNo = 'Mobile number must be 10 digits';
      valid = false;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.EmailId)) {
      newErrors.EmailId = 'Invalid email format';
      valid = false;
    }
    if (!form.RegisTypeId) {
      newErrors.RegisTypeId = 'Registration type is required';
      valid = false;
    }
    if (
      ['1', '2'].includes(form.RegisTypeId) &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan)
    ) {
      newErrors.pan = 'Invalid PAN number format';
      valid = false;
    }
    if (
      form.RegisTypeId === '3' &&
      !/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(form.tanNumber)
    ) {
      newErrors.tanNumber = 'Invalid TAN number format';
      valid = false;
    }
    if (!form.M25_DepartmentId) {
      newErrors.M25_DepartmentId = 'Please select an organization';
      valid = false;
    }
    if (!form.M04_CityId) {
      newErrors.M04_CityId = 'Please select a city';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };
  const getKeyboardType = value => {
    if (value.length < 5 || value.length === 9) {
      return 'default';
    } else {
      return 'numeric';
    }
  };
  const handleFormSubmit = async () => {
    if (!validateForm()) {
      setToastVisible(true);
      setToastMessage('Please check the errors in the form.');
      setToastType('error');
      return;
    }

    const formData = new FormData();
    formData.append('Name', form.name);
    formData.append('MobileNo', form.MobileNo);
    formData.append('Pan', form.RegisTypeId === 3 ? form.tanNumber : form.pan);
    formData.append('EmailId', form.EmailId);
    formData.append('DeviceId', deviceId);
    formData.append('M25_DepartmentId', form.M25_DepartmentId);
    formData.append('M04_CityId', form.M04_CityId);
    formData.append('RegisTypeId', form.RegisTypeId);

    try {
      const response = await fetch(URLActivity.RegisterLICAgent, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      // console.log(responseData, 'ji');

      const result = responseData.result?.[0];
      if (result?.IsFound === 'True') {
        setToastVisible(true);
        setToastMessage(result?.['Message ']);
        setToastType('success');
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } else {
        // console.log(result);
        setToastVisible(true);
        const message = result?.['Message '] || 'No message available';
        setToastMessage(message);
        setToastType('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setToastVisible(true);
      setToastMessage('Network error: ' + error.message);
      setToastType('error');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerBack}
              onPress={() => navigation.goBack()}>
              <FeatherIcon color="#1D2A32" name="chevron-left" size={30} />
            </TouchableOpacity>
            <Text style={styles.title}>Let's Get Started!</Text>
            <Text style={styles.subtitle}>
              Fill in the fields below to get started with your new account.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.radio}>
              <Text style={styles.inputLabel}>Employee Type</Text>
              <RadioButton
                label="Other than Employee(26Q)"
                selected={form.RegisTypeId === 1}
                onPress={() => {
                  setForm({...form, RegisTypeId: 1, pan: '', tanNumber: ''});
                  setErrors({
                    ...errors,
                    RegisTypeId: '',
                    pan: '',
                    tanNumber: '',
                  });
                }}
              />
              <RadioButton
                label="Employee(24Q)"
                selected={form.RegisTypeId === 2}
                onPress={() => {
                  setForm({...form, RegisTypeId: 2, pan: '', tanNumber: ''});
                  setErrors({
                    ...errors,
                    RegisTypeId: '',
                    pan: '',
                    tanNumber: '',
                  });
                }}
              />
              <RadioButton
                label="Employee(27A)"
                selected={form.RegisTypeId === 3}
                onPress={() => {
                  setForm({...form, RegisTypeId: 3, pan: '', tanNumber: ''});
                  setErrors({
                    ...errors,
                    RegisTypeId: '',
                    pan: '',
                    tanNumber: '',
                  });
                }}
              />
            </View>
            {errors.RegisTypeId && (
              <Text style={styles.errorText}>{errors.RegisTypeId}</Text>
            )}

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Name.</Text>
              <TextInput
                clearButtonMode="while-editing"
                placeholder="Name"
                placeholderTextColor="#6b7280"
                onChangeText={name => {
                  setForm({...form, name});
                  if (name.trim()) setErrors({...errors, name: ''});
                }}
                style={styles.inputControl}
                value={form.name}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Mobile No.</Text>
              <TextInput
                keyboardType="numeric"
                onChangeText={MobileNo => {
                  setForm({...form, MobileNo});
                  if (/^[0-9]{10}$/.test(MobileNo))
                    setErrors({...errors, MobileNo: ''});
                }}
                placeholder="Mobile No."
                maxLength={10}
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.MobileNo}
              />
              {errors.MobileNo && (
                <Text style={styles.errorText}>{errors.MobileNo}</Text>
              )}
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Email Id </Text>
              <TextInput
                keyboardType="email-address"
                onChangeText={EmailId => {
                  setForm({...form, EmailId});
                  if (/^\S+@\S+\.\S+$/.test(EmailId))
                    setErrors({...errors, EmailId: ''});
                }}
                placeholder="Email Id"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.EmailId}
              />
              {errors.EmailId && (
                <Text style={styles.errorText}>{errors.EmailId}</Text>
              )}
            </View>

            {form.RegisTypeId === 3 ? (
              <View style={styles.input}>
                <Text style={styles.inputLabel}>TAN No.</Text>
                <TextInput
                  autoCapitalize="characters"
                  onChangeText={tanNumber => {
                    setForm({...form, tanNumber});
                    if (/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(tanNumber))
                      setErrors({...errors, tanNumber: ''});
                  }}
                  placeholder="Enter Tan No."
                  maxLength={10}
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  value={form.tanNumber}
                />
                {errors.tanNumber && (
                  <Text style={styles.errorText}>{errors.tanNumber}</Text>
                )}
              </View>
            ) : (
              <View style={styles.input}>
                <Text style={styles.inputLabel}>PAN No.</Text>
                <TextInput
                  autoCapitalize="characters"
                  onChangeText={pan => {
                    setForm({...form, pan});
                    if (/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan))
                      setErrors({...errors, pan: ''});
                  }}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  value={form.pan}
                />
                {errors.pan && (
                  <Text style={styles.errorText}>{errors.pan}</Text>
                )}
              </View>
            )}
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Organization.</Text>
              <CustomPicker
                selectedValue={form.M25_DepartmentId}
                onValueChange={value => {
                  setForm({...form, M25_DepartmentId: value});
                  if (value) setErrors({...errors, M25_DepartmentId: ''});
                }}
                placeholder="Select Organization"
                style={{color: '#000'}}
              />
            </View>
            {errors.M25_DepartmentId && (
              <Text style={styles.errorText}>{errors.M25_DepartmentId}</Text>
            )}

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Cities.</Text>
              <CitiesPicker
                selectedValue={form.M04_CityId}
                onValueChange={value => {
                  setForm({...form, M04_CityId: value});
                  if (value) setErrors({...errors, M04_CityId: ''});
                }}
                placeholder="Select City"
              />
            </View>
            {errors.M04_CityId && (
              <Text style={styles.errorText}>{errors.M04_CityId}</Text>
            )}

            <View style={styles.formAction}>
              <TouchableOpacity onPress={handleFormSubmit}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Get Started</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.formFooter}>
          <Text style={styles.formFooterSingup}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={{
                color: colors.primary,
                textDecorationLine: 'underline',
                fontWeight: '700',
              }}>
              {' '}
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
        duration={3000}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  header: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  headerBack: {
    padding: 8,
    paddingTop: 0,
    position: 'relative',
    marginLeft: -16,
    marginBottom: 6,
  },
  form: {
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formFooterSingup: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  radio: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  pickerContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
  },
  pickerButton: {
    height: 50,
    borderRadius: 10,
    borderWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: '#8e8e8e',
  },
  pickerButtonText: {
    fontWeight: '600',
  },
  dropdownContainer: {
    elevation: 5,
    marginTop: 20,
    height: 300,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    alignSelf: 'center',
  },
  searchInput: {
    width: '90%',
    height: 50,
    alignSelf: 'center',
    borderWidth: 0.2,
    borderColor: '#8e8e8e',
    borderRadius: 7,
    marginTop: 20,
    paddingLeft: 20,
  },
  listItem: {
    width: '85%',
    alignSelf: 'center',
    height: 50,
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#8e8e8e',
  },
  listItemText: {
    fontWeight: '600',
  },
  upperCase: {
    textTransform: 'uppercase',
  },
});
