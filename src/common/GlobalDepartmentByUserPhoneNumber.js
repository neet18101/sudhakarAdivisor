import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from 'react-native';
import colors from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GlobalDepartmentByUserPhoneNumber = ({onValueChange, placeholder}) => {
  const [clicked, setClicked] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [data, setData] = useState([]);
  const [defaultTANDepartmentId, setDefaultTANDepartmentId] = useState(null);
  useEffect(() => {
    const fetchDataFromStorage = async () => {
      try {
        const storedData = await AsyncStorage.getItem('TanDepartId');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData && parsedData.length > 0) {
            setData(parsedData);
            const defaultItem = parsedData[0];
            console.log('defaultItem', defaultItem);
            setSelectedCategoryName(defaultItem.DepartmentName);
            setDefaultTANDepartmentId(defaultItem.MemberId);
            onValueChange(defaultItem.MemberId);
          }
        }
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
      }
    };
    fetchDataFromStorage();
  }, []);

  return (
    <View style={styles.pickerContainer}>
      <TouchableOpacity
        style={[
          styles.pickerButton,
          {backgroundColor: selectedCategoryName === '' ? '#fff' : '#e0e0e0'},
        ]}
        onPress={() => setClicked(true)}
        disabled={selectedCategoryName !== ''}>
        <Text style={styles.pickerButtonText}>
          {selectedCategoryName === '' ? placeholder : selectedCategoryName}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    width: '100%',
    alignSelf: 'center',
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
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '90%',
    height: '60%',
    alignSelf: 'center',
    paddingTop: 20,
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
    color: '#000',
  },
  closeButtonText: {
    textAlign: 'center',
    padding: 10,
    marginTop: 10,
    fontWeight: '600',
    backgroundColor: colors.primary,
    color: '#fff',
  },
});

export default GlobalDepartmentByUserPhoneNumber;
