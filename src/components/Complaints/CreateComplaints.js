import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Colors from '../../constants/Colors';
import ComplaintsPicker from '../CompalintsPicker';
import GlobalHeader from '../../common/GlobalHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import URLActivity from '../../utlis/URLActivity';

export default function CreateComplaints({navigation}) {
  const [form, setForm] = useState({
    issueCategory: '',
    subject: '',
    description: '',
  });
  const [errors, setErrors] = useState({
    issueCategory: '',
    subject: '',
    description: '',
  });
  const [userId, setUserId] = useState('');
  const [userRole, setUserRole] = useState('');
  // Fetch user data from AsyncStorage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const id = await AsyncStorage.getItem('id');
        const role = await AsyncStorage.getItem('role');
        setUserId(id || '');
        setUserRole(role || '');
      } catch (error) {
        console.log('Error retrieving data from AsyncStorage:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('ComplaintsID', '-1');
    formData.append('Description', 'Description For Complaint'.trim());
    formData.append('TicketTypeID', '1'); 
    formData.append('SendByID', '4173'); 
    formData.append('SendByRole', 'U'.trim());
    formData.append('Subject', 'Subject of Complaint'.trim());
    try {
      const response = await fetch('https://paytds.com//JsonService/CreateTicket.aspx', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });
  
      const result = await response.json();
      console.log('API Response:', result);
  
      if (response.ok && result.result && result.result[0]?.IsFound === 'True') {
        Alert.alert(
          'Complaint Submitted',
          'Your complaint has been saved successfully!'
        );
        setForm({ issueCategory: '', subject: '', description: '' });
      } else {
        const errorMessage = result.result[0]?.Message || 'Unknown error';
        console.error('Response Error:', errorMessage);
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert(
        'Error',
        'An error occurred while submitting your complaint. Please try again later.'
      );
    }
  };
  

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <GlobalHeader
        title="Create Complaints"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={wp(6)} color={Colors.white} />
          </TouchableOpacity>
        }
      />
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Choose Issue Category*</Text>
          <ComplaintsPicker
            selectedValue={form.issueCategory}
            onValueChange={value => setForm({...form, issueCategory: value})}
            placeholder="--Select--"
          />
          {errors.issueCategory ? (
            <Text style={styles.errorText}>{errors.issueCategory}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Subject*</Text>
          <TextInput
            style={styles.input}
            value={form.subject}
            onChangeText={subject => setForm({...form, subject})}
            placeholder="Enter Subject"
            placeholderTextColor="#6b7280"
          />
          {errors.subject ? (
            <Text style={styles.errorText}>{errors.subject}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>General Description*</Text>
          <TextInput
            style={styles.textArea}
            value={form.description}
            onChangeText={description => setForm({...form, description})}
            placeholder="Enter Description"
            placeholderTextColor="#6b7280"
            multiline={true}
            numberOfLines={4}
          />
          {errors.description ? (
            <Text style={styles.errorText}>{errors.description}</Text>
          ) : null}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingVertical: hp(3),
    backgroundColor: '#fff',
  },
  title: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: hp(2),
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: hp(2),
  },
  label: {
    fontSize: wp(4.5),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp(0.5),
  },
  input: {
    height: hp(6),
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    fontSize: wp(4),
    backgroundColor: '#fff',
    color: '#333',
  },
  textArea: {
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    fontSize: wp(4),
    backgroundColor: '#fff',
    color: '#333',
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    fontSize: wp(3.2),
    marginTop: hp(0.5),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(3),
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: wp(2),
    flex: 1,
    marginRight: wp(2),
  },
  cancelButton: {
    backgroundColor: Colors.red,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: wp(2),
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: wp(4),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
