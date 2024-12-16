import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
} from 'react-native';
import Colors from '../../constants/Colors';
import GlobalHeader from '../../common/GlobalHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ComplaintsPicker from '../CompalintsPicker';
import StatusPicker from '../StatusPicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import URLActivity from '../../utlis/URLActivity';
import Toast from '../../common/Toast';

export default function ComplaintsList({ navigation }) {
  const [complaintType, setComplaintType] = useState('');
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [userId, setUserId] = useState('');
  const [userRole, setUserRole] = useState('');
  const [tableData, setTableData] = useState([]);
  const [errors, setErrors] = useState({});


  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loginToken, setLoginToken] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const id = await AsyncStorage.getItem('id');
        const role = await AsyncStorage.getItem('role');
        const LoginToken = await AsyncStorage.getItem('loginToken');
        setLoginToken(LoginToken || '');
        setUserId(id || '');
        setUserRole(role || '');
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleDateChange = (event, selectedDate, setDate, setShowPicker) => {
    setShowPicker(false);
    if (selectedDate) {
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      setDate(`${day}/${month}/${year}`);
    }
  };
  const getFormattedDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0'); // Ensure 2-digit day
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchToken = async () => {
      const id = await AsyncStorage.getItem('id');
      try {
        const formdata = new FormData();
        formdata.append("CustID", id);
        formdata.append("RoleCode", "U");
        formdata.append("TicketTypeID", "1");
        formdata.append("FromDate", "01/01/2001");
        formdata.append("Token", loginToken);
        formdata.append("ToDate", getFormattedDate());

        const requestOptions = {
          method: "POST",
          body: formdata,
          redirect: "follow",
        };
       
        const response = await fetch(URLActivity?.TicketList, requestOptions);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();

        if (result && result.result) {
          const firstResult = result.result[0];

          if (firstResult.IsFound === "False") {
            // console.warn(firstResult["Message "]); // Log the warning message
            setTableData([]); // Set empty data when no tickets are found
          } else {
            setTableData(result.result); // Update the table data when tickets are found
          }
        } else {
          console.warn("Unexpected response format");
          setTableData([]); // Set empty data if the result format is unexpected
        }
      } catch (error) {
        console.error("Error fetching ticket list:", error);
        setTableData([]); // Reset the table data in case of an error
      }
    };

    fetchToken();
  }, []);


  const validateFields = () => {
    const newErrors = {};
    if (!complaintType) newErrors.complaintType = 'Please select a complaint type.';
    if (!status) newErrors.status = 'Please select a status.';
    if (!fromDate) newErrors.fromDate = 'Please select a from date.';
    if (!toDate) newErrors.toDate = 'Please select a to date.';
    if (new Date(fromDate) > new Date(toDate))
      newErrors.dateRange = 'From date cannot be later than To date.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    // if (!validateFields()) {
    //   return;
    // }

    try {
      const formData = new FormData();
      formData.append('CustID', userId);
      formData.append('RoleCode', userRole);
      formData.append('TicketTypeID', complaintType || "-1");
      formData.append('FromDate', fromDate || "01/01/2001");
      formData.append("ToDate", getFormattedDate());
      formData.append("Token", loginToken);
      // console.log("Form Data:", formData);

      const response = await fetch(URLActivity?.TicketList, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      // console.log(result?.result?.[0]?.IsFound);
      if (result && result?.result?.[0]?.IsFound === 'True') {
        setTableData(result.result);
      } else {
        setToastVisible(true);
        const message = result.result[0]?.["Message "] || 'No message available';
        setToastMessage(message);
        setToastType('error');
        setTableData([]);

      }
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
    }
  };

  const renderRow = ({ item, index }) => {
    const createdDate = item?.CreatedOn?.split(' ')[0];
    return (
      <View style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
        <Text style={styles.cell}>{index + 1}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ComplaintsChat', { TicketID: item.TicketNumber })}>
          <Text style={[styles.cell, styles.linkText]}>{item.TicketNumber}</Text>
        </TouchableOpacity>
        <Text style={styles.cell}>{item.CustName}</Text>
        <Text style={styles.cell}>{createdDate}</Text>
        <Text style={[
          styles.cell,
          { color: item.Status1 === 'Close' ? 'red' : item.Status1 === 'Open' ? 'green' : 'black' }
        ]}
        >{item.Status1}</Text>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <GlobalHeader title="Complaints List"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={wp(6)} color={Colors.white} />
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.filterContainer}>
          <Text style={styles.label}>Complaint Type</Text>
          <ComplaintsPicker
            placeholder="Select Complaint Type"
            selectedValue={complaintType}
            onValueChange={setComplaintType}
          />
          {errors.complaintType && <Text style={styles.errorText}>{errors.complaintType}</Text>}

          {/* <Text style={styles.label}>Status</Text> */}
          {/* <StatusPicker placeholder="Select Status" selectedValue={status} onValueChange={setStatus} />
          {errors.status && <Text style={styles.errorText}>{errors.status}</Text>} */}

          <Text style={styles.label}>From Date</Text>
          <TouchableOpacity onPress={() => setShowFromDatePicker(true)} style={styles.input}>
            <Text style={{ color: fromDate ? '#000' : '#888', fontWeight: fromDate ? 'bold' : 'normal' }}>
              {fromDate || 'Select From Date'}
            </Text>
          </TouchableOpacity>
          {showFromDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(event, date) => handleDateChange(event, date, setFromDate, setShowFromDatePicker)}
            />
          )}
          {errors.fromDate && <Text style={styles.errorText}>{errors.fromDate}</Text>}

          <Text style={styles.label}>To Date</Text>
          <TouchableOpacity onPress={() => setShowToDatePicker(true)} style={styles.input}>
            <Text style={{ color: toDate ? '#000' : '#888', fontWeight: toDate ? 'bold' : 'normal' }}>
              {toDate || 'Select To Date'}
            </Text>
          </TouchableOpacity>
          {showToDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(event, date) => handleDateChange(event, date, setToDate, setShowToDatePicker)}
            />
          )}
          {errors.toDate && <Text style={styles.errorText}>{errors.toDate}</Text>}

          <Text style={styles.label}>Agent/Cust Name, Ticket No</Text>
          <TextInput
            style={styles.input}
            placeholder="Agent/Cust Name, Ticket No"
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={onSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setTableData([])}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>

        {
          tableData.length > 0
            ? <ScrollView horizontal style={styles.tableContainer}>
              <FlatList
                data={tableData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderRow}
                ListHeaderComponent={() => (
                  <View style={[styles.row, styles.headerRow]}>
                    <Text style={[styles.cell, styles.headerText]}>Sr No</Text>
                    <Text style={[styles.cell, styles.headerText]}>Ticket No</Text>
                    <Text style={[styles.cell, styles.headerText]}>Name</Text>
                    <Text style={[styles.cell, styles.headerText]}>Created On</Text>
                    <Text style={[styles.cell, styles.headerText]}>Status</Text>
                  </View>
                )}
              />
            </ScrollView>

            : <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No Data Found</Text>
            </View>
        }
        <Toast
          visible={toastVisible}
          message={toastMessage}
          type={toastType}
          onHide={() => setToastVisible(false)}
          duration={3000}
          positionType="bottom-to-top"
        />


      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  filterContainer: {
    padding: wp(3),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: hp(2),
  },
  label: {
    fontSize: wp(4.2),
    color: '#333',
    marginBottom: hp(0.5),
    marginTop: hp(1),
    fontWeight: 'bold',
  },
  input: {
    height: hp(6),
    borderColor: '#ccc',
    color: '#000',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: wp(2),
    justifyContent: 'center',
    marginBottom: hp(1),
    fontWeight: '600',
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
  tableContainer: {
    paddingHorizontal: wp(3),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerRow: {
    backgroundColor: Colors.primary,
  },
  evenRow: {
    backgroundColor: '#e0ffe0',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
  cell: {
    minWidth: wp(18),
    paddingHorizontal: wp(1),
    textAlign: 'center',
    fontSize: wp(3.5),
    color: '#333',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: wp(3.7),
    color: Colors.white,
  },
  linkText: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    fontSize: wp(3.5),
    marginTop: hp(0.5),
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: wp(4),
    color: Colors.red,
    fontWeight: 'bold',
  },
});
