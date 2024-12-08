import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import avatar from '../../assets/images/avatar.png';
import URLActivity from '../../utlis/URLActivity';
import colors from '../../constants/Colors';
import CustomPicker from '../CustomPicker';
import ProfileCitySelet from '../../common/ProfileCitySelet';
import ProfileDepartmentSelect from '../../common/ProfileDepartmentSelect';
import Toast from '../../common/Toast';

export default function MainProfile() {
  const [form, setForm] = useState({
    emailNotifications: true,
    pushNotifications: false,
    name: '',
    email: '',
    phoneNo: '',
    regisType: '',
    city: '',
    DepartmentId: '',
    userToken: '',
  });
  const [isModalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const toggleModal = () => setModalVisible(!isModalVisible);


  const fetchToken = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      const email = await AsyncStorage.getItem('email');
      const phoneNo = await AsyncStorage.getItem('phoneNo');
      const regisType = await AsyncStorage.getItem('RegisType');
      const userToken = await AsyncStorage.getItem('userToken');
      await userDetailsAPI(phoneNo, userToken);

      setForm((prevForm) => ({
        ...prevForm,
        name: username || prevForm.name,
        email: email || prevForm.email,
        phoneNo: phoneNo || prevForm.phoneNo,
        regisType: regisType || prevForm.regisType,
        userToken: userToken || prevForm.userToken,
      }));
    } catch (error) {
      console.error('Error retrieving user token:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchToken();
  }, []);

  useEffect(() => {
    if (userInfo && userInfo[0]) {
      setForm((prevForm) => ({
        ...prevForm,
        city: userInfo[0]?.CityId || prevForm.city, // Set default city
        DepartmentId: userInfo[0]?.DepartmentId || prevForm.DepartmentId, // Set default department
      }));
    }
  }, [userInfo]);

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
        setUserInfo(result.result);
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formdata = new FormData();
      formdata.append("CityID", form.city);
      formdata.append("Mobile", form.phoneNo);
      formdata.append("Address", "Address"); // Correct spelling
      formdata.append("EmailId", form.email);
      formdata.append("DepartmentID", form.DepartmentId);
      formdata.append("Name", form.name);
      formdata.append("regisType", form.regisType);
      formdata.append("TAN_PAN", form.userToken);

      console.log("Submitting form data:", {
        CityID: form.city,
        Mobile: form.phoneNo,
        Address: "Address",
        EmailId: form.email,
        DepartmentID: form.DepartmentId,
        Name: form.name,
        regisType: form.regisType,
        TAN_PAN: form.userToken,
      });

      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      const response = await fetch(URLActivity?.UpdateUserDetails, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Server response:", result);
      if (result && result.result[0]?.IsFound === "True") {
        const message = result.result[0]?.["Message "] || "Profile updated successfully!";
        console.log("Success message:", message);
        setToastVisible(true);
        setToastMessage(message);
        setToastType("success");

        // Re-fetch updated profile information
        await fetchToken();

        // Close the modal
        toggleModal();
      } else {
        const errorMessage = result.result[0]?.["Message "] || "Failed to update profile.";
        console.error("Update failed:", errorMessage);


        setToastVisible(true);
        setToastMessage(errorMessage);
        setToastType("error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);


      setToastVisible(true);
      setToastMessage("An error occurred while updating your profile.");
      setToastType("error");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <>
            <View style={[styles.section, { paddingTop: 4 }]}>
              <Text style={styles.sectionTitle}>Account</Text>
              <View style={styles.sectionBody}>
                <TouchableOpacity onPress={toggleModal} style={styles.profile}>
                  <Image source={avatar} style={styles.profileAvatar} />
                  <View style={styles.profileBody}>
                    <Text style={styles.profileName}>{form.name || 'N/A'}</Text>
                    <Text style={styles.profileHandle}>{form.email || 'N/A'}</Text>
                  </View>
                  <FeatherIcon color="#bcbcbc" name="chevron-right" size={22} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>User Information</Text>
              <View style={styles.sectionBody}>
                <View style={[styles.rowWrapper, styles.rowFirst]}>
                  <TouchableOpacity style={styles.row}>
                    <Text style={styles.rowLabel}>
                      {form.regisType === '3' ? 'Tan No.' : 'Pan No.'}
                    </Text>
                    <View style={styles.rowSpacer} />
                    <Text style={styles.rowValue}>
                      {userInfo[0]?.TANPAN || 'N/A'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.rowWrapper}>
                  <TouchableOpacity style={styles.row}>
                    <Text style={styles.rowLabel}>Email</Text>
                    <View style={styles.rowSpacer} />
                    <Text style={styles.rowValue}>
                      {userInfo[0]?.Email || 'N/A'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.rowWrapper}>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Department</Text>
                    <View style={styles.rowSpacer} />
                    <Text style={[styles.rowValue, { textTransform: 'capitalize', fontSize: 13 }]}>
                      {userInfo[0]?.DepartmentName || 'N/A'}
                    </Text>
                  </View>
                </View>
                <View style={[styles.rowWrapper, styles.rowLast]}>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>City</Text>
                    <View style={styles.rowSpacer} />
                    <Text style={[styles.rowValue, { textTransform: 'capitalize' }]}>
                      {userInfo[0]?.CityName || 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.section}>
              <View style={styles.sectionBody}>
                <View style={[styles.rowWrapper, styles.rowFirst, styles.rowLast, { alignItems: 'center' }]}>
                  <TouchableOpacity style={styles.row}>
                    <Text style={[styles.rowLabel, styles.rowLabelLogout]}>
                      Log Out
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Modal
              isVisible={isModalVisible}
              onBackdropPress={toggleModal}
              onSwipeComplete={toggleModal}
              animationIn="slideInUp"
              animationOut="slideOutDown"
              animationInTiming={600}
              animationOutTiming={600}
              style={styles.modal}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Update Profile</Text>
                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Name</Text>
                    <TextInput
                      style={styles.inputControl}
                      placeholder="Enter your name"
                      placeholderTextColor="#aaa"
                      value={form.name}
                      onChangeText={(name) => setForm({ ...form, name })}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                      style={styles.inputControl}
                      placeholder="Enter your email"
                      placeholderTextColor="#aaa"
                      keyboardType="email-address"
                      value={form.email}
                      onChangeText={(email) => setForm({ ...form, email })}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Mobile No.</Text>
                    <TextInput
                      style={styles.inputControl}
                      placeholder="Enter your mobile number"
                      placeholderTextColor="#aaa"
                      keyboardType="numeric"
                      value={form.phoneNo}
                      onChangeText={(phoneNo) => setForm({ ...form, phoneNo })}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Department</Text>

                    <ProfileDepartmentSelect
                      selectedValue={userInfo[0]?.DepartmentId}
                      onValueChange={(DepartmentId) => {
                        const selectedDepartment = userInfo?.find((item) => parseInt(item.DepartmentId) === parseInt(DepartmentId)) || setForm({ ...form, DepartmentId });
                        setForm({ ...form, DepartmentId: DepartmentId });
                      }}
                      placeholder="Select Department"
                    />



                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>City</Text>
                    <ProfileCitySelet
                      selectedValue={userInfo[0]?.CityId}
                      onValueChange={(cityId) => {
                        console.log(cityId, 'cityId');
                        const selectedCity = userInfo?.find((item) => parseInt(item.CityId) === parseInt(cityId)) || setForm({ ...form, cityId });
                        setForm({ ...form, city: cityId || userInfo[0]?.CityId });
                      }}
                      placeholder="Select City" // Placeholder if no default is set
                    />
                  </View>
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSaveProfile}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={toggleModal}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Text style={styles.contentFooter}>App Version 2.24 #50491</Text>
          </>
        )}
      </ScrollView>

      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
        duration={3000}
        positionType="bottom-to-top"
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
    paddingHorizontal: 6,
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '600',
    color: '#000',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    textAlign: 'center',
  },
  /** Content */
  content: {
    paddingHorizontal: 16,
  },
  contentFooter: {
    marginTop: 24,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    color: '#a69f9f',
  },
  /** Section */
  section: {
    paddingVertical: 12,
  },
  sectionTitle: {
    margin: 8,
    marginLeft: 12,
    fontSize: 13,
    letterSpacing: 0.33,
    fontWeight: '500',
    color: '#000',
    textTransform: 'uppercase',
  },
  sectionBody: {
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  /** Profile */
  profile: {
    padding: 12,
    // backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
    marginRight: 12,
  },
  profileBody: {
    marginRight: 'auto',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292929',
  },
  profileHandle: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: '400',
    color: '#858585',
  },
  /** Row */
  row: {
    height: 44,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 12,
  },
  rowWrapper: {
    paddingLeft: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
  },
  rowFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rowLabel: {
    fontSize: 16,
    letterSpacing: 0.24,
    color: '#000',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ababab',
    marginRight: 4,
  },
  rowLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  rowLabelLogout: {
    width: '100%',
    textAlign: 'center',
    fontWeight: '600',
    color: '#dc2626',
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


  modal: {
    justifyContent: 'flex-end',
    margin: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  inputControl: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: colors.primary || '#4caf50',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },


});
