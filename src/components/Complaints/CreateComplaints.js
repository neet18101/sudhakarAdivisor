import React, {useState} from 'react';
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
import CompalintsPicker from '../CompalintsPicker';
import GlobalHeader from '../../common/GlobalHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
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
  const handleSave = () => {
    let isValid = true;
    let newErrors = {issueCategory: '', subject: '', description: ''};
    if (!form.issueCategory) {
      newErrors.issueCategory = 'Please choose an issue category';
      isValid = false;
    }
    if (!form.subject) {
      newErrors.subject = 'Subject is required';
      isValid = false;
    }
    if (!form.description) {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    setErrors(newErrors);
    if (isValid) {
      Alert.alert(
        'Complaint Submitted',
        'Your complaint has been saved successfully!',
      );
      setForm({issueCategory: '', subject: '', description: ''});
    } else {
      Alert.alert('Error', 'Please fill in all required fields.');
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
          <CompalintsPicker
            selectedValue={form.issueCategory}
            onValueChange={value => setForm({...form, issueCategory: value})}
            placeholder="--Select--"
            options={['Issue 1', 'Issue 2', 'Issue 3']}
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
