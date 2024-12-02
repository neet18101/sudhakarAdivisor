import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../constants';
import Header from '../components/HomeScreen/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import GlobalHeader from '../common/GlobalHeader';
import SessionPicker from '../common/SessionPicker';
import {launchImageLibrary} from 'react-native-image-picker';
import {Image} from 'react-native-animatable';
import URLActivity from '../utlis/URLActivity';

export default function IRTUpload({navigation}) {
  const defaultAadhaarImage = require('../assets/images/aadharcard.jpg');
  const defaultPanImage = require('../assets/images/pancard.jpg');
  const defaultPassbookImage = require('../assets/images/bankimg.jpg');
  const defaultForm16Image = require('../assets/images/bankimg.jpg');
  const [selectedSession, setSelectedSession] = useState('');
  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [panImage, setPanImage] = useState(null);
  const [passbookImage, setPassbookImage] = useState(null);
  const [form16Image, setForm16Image] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async setImage => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    if (
      !selectedSession ||
      !aadhaarImage ||
      !panImage ||
      !passbookImage ||
      !form16Image
    ) {
      alert('Please fill all fields and upload all required images.');
      return;
    } else {
     
      const formData = new FormData();
      formData.append('SessionId', selectedSession);
      formData.append('Aadhar', aadhaarImage);
      formData.append('Pan', panImage);
      formData.append('Passbook', passbookImage);
      formData.append('Form16', form16Image);
      console.log('Form Data:', formData);

      fetch(URLActivity.ITRRequest, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log('Response:', data);
          setIsSubmitting(false);
          // if (data.status === 200) {
          //   alert(data.message);
          //   navigation.goBack();
          // } else {
          //   alert(data.message);
          // }
        })
        .catch(error => {
          console.error('Error:', error);
          setIsSubmitting(false);
        });
    }
  };

  return (
    <View contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.stickyHeader}>
        <GlobalHeader
          title={'ITR Upload'}
          leftComponent={
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={wp(6)} color={Colors.white} />
            </TouchableOpacity>
          }
        />
      </View>
      <ScrollView contentContainerStyle={{flexGrow: 1, paddingTop: hp(5)}}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Session Id<Text style={styles.asterisk}>*</Text>
            </Text>
            <SessionPicker
              placeholder={'Select Financial Year'}
              onValueChange={value => {
                setSelectedSession(value);
              }}
            />
          </View>
          {/* Aadhaar Card */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Aadhaar Card:</Text>
            <View style={styles.imageContainer}>
              <Image
                source={
                  aadhaarImage ? {uri: aadhaarImage} : defaultAadhaarImage
                }
                style={styles.image}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => pickImage(setAadhaarImage)}>
                <Text style={styles.buttonText}>upload Image</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* PAN Card */}
          <Text style={styles.label}>PAN Card:</Text>
          <View style={styles.imageContainer}>
            <Image
              source={panImage ? {uri: panImage} : defaultPanImage}
              style={styles.image}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => pickImage(setPanImage)}>
              <Text style={styles.buttonText}>upload Image</Text>
            </TouchableOpacity>
          </View>

          {/* Passbook */}
          <Text style={styles.label}>Passbook:</Text>
          <View style={styles.imageContainer}>
            <Image
              source={
                passbookImage ? {uri: passbookImage} : defaultPassbookImage
              }
              style={styles.image}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => pickImage(setPassbookImage)}>
              <Text style={styles.buttonText}>upload Image</Text>
            </TouchableOpacity>
          </View>

          {/* Form16 */}
          <Text style={styles.label}>Form16:</Text>
          <View style={styles.imageContainer}>
            <Image
              source={form16Image ? {uri: form16Image} : defaultForm16Image}
              style={styles.image}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => pickImage(setForm16Image)}>
              <Text style={styles.buttonText}>upload Image</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Text style={styles.submitButtonText}>REQUEST NOW</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingVertical: hp(3),
  },
  inputContainer: {
    marginBottom: hp(2),
  },
  label: {
    fontSize: wp(4.2),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp(0.5),
  },
  asterisk: {
    color: 'red',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: hp(1.2),
  },
  image: {
    width: wp(50),
    height: wp(50),
    borderRadius: wp(2),
    marginBottom: hp(1),
  },
  placeholder: {
    color: '#999',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(1),
    paddingHorizontal: wp(5),
    borderRadius: wp(2),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp(4),
    fontWeight: '600',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(1.5),
    marginHorizontal: wp(5),
    borderRadius: wp(2),
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: wp(4.5),
    fontWeight: 'bold',
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingVertical: hp(3),
  },
  inputContainer: {
    marginBottom: hp(2),
  },
  label: {
    fontSize: wp(4.2),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp(0.5),
  },
  asterisk: {
    color: 'red',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: hp(1.2),
  },
  image: {
    width: wp(50),
    height: wp(50),
    borderRadius: wp(2),
    marginBottom: hp(1),
    borderWidth: 2,
    borderColor: Colors.gray,
  },
  placeholder: {
    color: '#999',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(1),
    paddingHorizontal: wp(5),
    borderRadius: wp(2),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp(4),
    fontWeight: '600',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(1.5),
    marginHorizontal: wp(5),
    borderRadius: wp(2),
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: wp(4.5),
    fontWeight: 'bold',
  },
});
