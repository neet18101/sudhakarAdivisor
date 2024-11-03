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
import URLActivity, {RegisterLICAgent} from '../utlis/URLActivity';

export default function Signup({navigation}) {
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    DeviceInfo.getAndroidId().then((id) => {
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

  const validateForm = () => {
    let valid = true;
    let nameError = '';
    let phoneError = '';
    let panError = '';
    let tanError = '';
    let organizationError = '';
    if (form.name.trim() === '') {
      nameError = 'Name is required';
      valid = false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(form.phone)) {
      phoneError = 'Phone number must be 10 digits';
      valid = false;
    }
    if (
      form.RegisTypeId === 'Other than Employee(26Q)' ||
      form.RegisTypeId === 'Employee(24Q)'
    ) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(form.panNumber)) {
        panError = 'Invalid PAN number format';
        valid = false;
      }
    } else if (form.RegisTypeId === 'Employee(27A)') {
      const tanRegex = /^[A-Z]{4}[0-9]{4}[A-Z]{1}$/;
      if (!tanRegex.test(form.tanNumber)) {
        tanError = 'Invalid TAN number format';
        valid = false;
      }
    }
    if (form.organization === '') {
      organizationError = 'Please select an organization';
      valid = false;
    }
    setErrors({
      name: nameError,
      phone: phoneError,
      panNumber: panError,
      tanNumber: tanError,
      organization: organizationError,
    });
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
    const formData = new FormData();
    formData.append('Name', form.name);
    formData.append('MobileNo', form.MobileNo);
    formData.append('Pan', form.RegisTypeId === 3 ? form.tanNumber : form.pan);
    formData.append('EmailId', form.EmailId);
    formData.append('DeviceId', deviceId);
    formData.append('M25_DepartmentId', form.M25_DepartmentId);
    formData.append('M04_CityId', form.M04_CityId);
    formData.append('RegisTypeId', form.RegisTypeId);
    console.log('Form Data:', formData);
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
      const rawText = (await response.text()).trim();
      let responseData;
      try {
        responseData = rawText ? JSON.parse(rawText) : {};
      } catch (parseError) {
        throw new Error('Failed to parse JSON response');
      }
      const message =
        responseData.result && responseData.result[0]
          ? typeof responseData.result[0]['Message '] === 'string'
            ? responseData.result[0]['Message '].trim()
            : 'No message available'
          : 'No message available';

      Alert.alert('Response', message);

      if (responseData.result[0]?.IsFound === 'True') {
        navigation.navigate('Login');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to submit the form: ${error.message}`);
      console.error('Error:', error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
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
                onPress={() =>
                  setForm({...form, RegisTypeId: 1, pan: '', tanNumber: ''})
                }
              />
              <RadioButton
                label="Employee(24Q)"
                selected={form.RegisTypeId === 2}
                onPress={() =>
                  setForm({...form, RegisTypeId: 2, pan: '', tanNumber: ''})
                }
              />
              <RadioButton
                label="Employee(27A)"
                selected={form.RegisTypeId === 3}
                onPress={() =>
                  setForm({...form, RegisTypeId: 3, pan: '', tanNumber: ''})
                }
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Name.</Text>
              <TextInput
                clearButtonMode="while-editing"
                onChangeText={name => setForm({...form, name})}
                placeholder="Name"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.name}
              />
              {errors.name ? (
                <Text style={styles.errorText}>{errors.name}</Text>
              ) : null}
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Mobile No.</Text>
              <TextInput
                keyboardType="numeric"
                onChangeText={MobileNo => setForm({...form, MobileNo})}
                placeholder="Mobile No."
                maxLength={10}
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.MobileNo}
              />
              {errors.MobileNo ? (
                <Text style={styles.errorText}>{errors.MobileNo}</Text>
              ) : null}
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Email Id </Text>
              <TextInput
                keyboardType="email-address"
                onChangeText={EmailId => setForm({...form, EmailId})}
                placeholder="Email Id"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.EmailId}
              />
            </View>

            {form.RegisTypeId === 3 ? (
              <View style={styles.input}>
                <Text style={styles.inputLabel}>TAN No.</Text>
                <TextInput
                  autoCapitalize="characters"
                  onChangeText={tanNumber => setForm({...form, tanNumber})}
                  placeholder="Enter Tan No."
                  maxLength={10}
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  value={form.tanNumber}
                />
                {errors.tanNumber ? (
                  <Text style={styles.errorText}>{errors.tanNumber}</Text>
                ) : null}
              </View>
            ) : (
              <View style={styles.input}>
                <Text style={styles.inputLabel}>PAN No.</Text>
                <TextInput
                  autoCapitalize="characters"
                  onChangeText={pan => setForm({...form, pan})}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  value={form.pan}
                />
                {errors.pan ? (
                  <Text style={styles.errorText}>{errors.pan}</Text>
                ) : null}
              </View>
            )}
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Organization.</Text>
              <CustomPicker
                selectedValue={form.M25_DepartmentId}
                onValueChange={value =>
                  setForm({...form, M25_DepartmentId: value})
                }
                placeholder="Select Organization"
                style={{color: '#000'}}
              />
            </View>
            {errors.organization ? (
              <Text style={styles.errorText}>{errors.organization}</Text>
            ) : null}

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Cities.</Text>
              <CitiesPicker
                selectedValue={form.M04_CityId}
                onValueChange={value => setForm({...form, M04_CityId: value})}
                placeholder="Select City"
              />
            </View>

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
