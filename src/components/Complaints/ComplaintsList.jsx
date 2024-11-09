import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Button,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../../constants/Colors';
import GlobalHeader from '../../common/GlobalHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Picker } from '@react-native-picker/picker';

export default function ComplaintsList({ navigation }) {
  const [complaintType, setComplaintType] = useState('');
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const handleDateChange = (event, selectedDate, setDate, setShowPicker) => {
    setShowPicker(false); // Close the date picker
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString();
      setDate(formattedDate); // Set the formatted date as a string
    }
  };
  const tableData = [
    { id: '1', ticketNumber: 'CMP00000006', name: 'Yogendra Rai', mobile: '1234567890', createdOn: '07/11/2024 22:15:16', status: 'Close' },
    { id: '2', ticketNumber: 'CMP00000011', name: 'Yogendra Rai', mobile: '1234567890', createdOn: '07/11/2024 22:55:04', status: 'Open' },
  ];

  const renderRow = ({ item, index }) => (
    <View style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={[styles.cell, styles.linkText]}>{item.ticketNumber}</Text>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.mobile}</Text>
      <Text style={styles.cell}>{item.createdOn}</Text>
      <Text style={styles.cell}>{item.status}</Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <GlobalHeader
        title="Complaints List"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={wp(6)} color={Colors.white} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.filterContainer}>
          <Text style={styles.label}>Complaint Type</Text>
          <Picker
            selectedValue={complaintType}
            onValueChange={(itemValue) => setComplaintType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="--Select--" value="" color='#000' />
          </Picker>

          <Text style={styles.label}>Status</Text>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="-- All --" value="" />
          </Picker>

          <Text style={styles.label}>From Date</Text>
          <TouchableOpacity onPress={() => setShowFromDatePicker(true)} style={styles.input}>
            <Text style={{ color: fromDate ? '#000' : '#888' }}>{fromDate || 'Select From Date'}</Text>
          </TouchableOpacity>
          {showFromDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(event, date) => handleDateChange(event, date, setFromDate, setShowFromDatePicker)}
            />
          )}

          <Text style={styles.label}>To Date</Text>
          <TouchableOpacity onPress={() => setShowToDatePicker(true)} style={styles.input}>
            <Text style={{ color: toDate ? '#000' : '#888' }}>{toDate || 'Select To Date'}</Text>
          </TouchableOpacity>
          {showToDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(event, date) => handleDateChange(event, date, setToDate, setShowToDatePicker)}
            />
          )}

          <Text style={styles.label}>Agent/Cust Name, Ticket No</Text>
          <TextInput
            style={styles.input}
            placeholder="Agent/Cust Name, Ticket No"
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Button title="Search" color="#FFA726" onPress={() => { /* Handle search */ }} />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Reset" color="#F44336" onPress={() => { /* Handle reset */ }} />
            </View>
          </View>

        </View>


        <View style={styles.container}>
          <ScrollView horizontal>
            <View>
              <View style={styles.headerRow}>
                <Text style={styles.headerCell}>SrNo</Text>
                <Text style={styles.headerCell}>Ticket Number</Text>
                <Text style={styles.headerCell}>Name</Text>
                <Text style={styles.headerCell}>Mobile</Text>
                <Text style={styles.headerCell}>Created On</Text>
                <Text style={styles.headerCell}>Status</Text>
              </View>
              <FlatList
                data={tableData}
                renderItem={renderRow}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.tableBody}
              />
            </View>
          </ScrollView>
        </View>
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
    padding: wp(2),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: hp(2),
    
  },
  label: {
    fontSize: wp(4),
    color: '#333',
    marginBottom: hp(0.5),
    marginTop: hp(1),
  },
  picker: {
    height: hp(6),
    backgroundColor: '#f9f9f9',
    color: '#000',
    marginBottom: hp(1),
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 4,
  },
  input: {
    height: hp(5),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: wp(2),
    justifyContent: 'center',
    marginBottom: hp(1),
    backgroundColor: '#f9f9f9',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    paddingVertical: hp(1),
    borderTopLeftRadius: wp(1),
    borderTopRightRadius: wp(1),
  },
  headerCell: {
    width: wp(20),
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp(3.5),
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2),
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: wp(1),
  },
});
