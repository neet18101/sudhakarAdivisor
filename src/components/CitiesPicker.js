import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Modal,
} from 'react-native';
import colors from "../constants/Colors";
import useFetch from '../hook/useFetch';
import URLActivity from '../utlis/URLActivity';

const CitiesPicker = ({ selectedValue, onValueChange, placeholder }) => {
    const { data, loading, error } = useFetch(URLActivity.FillCity);
    const [search, setSearch] = useState('');
    const [clicked, setClicked] = useState(false); // Use this to toggle Modal
    const [filteredData, setFilteredData] = useState(data);
    const [selectedCategoryName, setSelectedCategoryName] = useState('');
    const searchRef = useRef();
    return (

        <View style={styles.pickerContainer}>
            <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setClicked(true)} // Toggle modal
            >
                <Text style={styles.pickerButtonText}>
                    {selectedCategoryName === '' ? placeholder : selectedCategoryName}
                </Text>
            </TouchableOpacity>

            {/* Use Modal for Dropdown */}
            {clicked && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={clicked}
                    onRequestClose={() => setClicked(false)} // Close Modal on Back Button
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.dropdownContainer}>
                           
                            <FlatList
                                data={data}
                                keyExtractor={(item,index) =>index}  // Ensure `CatId` is unique and converted to string if necessary
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.listItem}
                                        onPress={() => {
                                            setSelectedCategoryName(item.City);
                                            onValueChange(item.CityID);  // Update the selected value
                                            setClicked(false);  // Close the modal after selecting
                                        }}
                                    >
                                        <Text style={styles.listItemText}>{item.City}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity onPress={() => setClicked(false)}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
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
        color: "#000"
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
        color: "#000"
    },
    listItemText: {
        fontWeight: '600',
        color: "#000"
    },
    closeButtonText: {
        textAlign: 'center',
        padding: 10,
        marginTop: 10,
        fontWeight: '600',
        backgroundColor: colors.primary,
        color: "#fff"
    },
});

export default CitiesPicker;
