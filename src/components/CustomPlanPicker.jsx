import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Modal,
} from 'react-native';
import colors from '../constants/Colors';
import URLActivity from "../utlis/URLActivity";

const CustomPlanPicker = ({ selectedValue, onValueChange, placeholder, planTypeId }) => {
    const [search, setSearch] = useState('');
    const [clicked, setClicked] = useState(false);
    const [selectedCategoryName, setSelectedCategoryName] = useState('');
    const [data, setData] = useState([]);
    const searchRef = useRef();

    useEffect(() => {
        const fetchPlanCategories = async () => {
            if (!planTypeId) return; // Ensure planTypeId is available before fetching

            const formdata = new FormData();
            formdata.append("PlanId", "-1");
            formdata.append("PlanCategoryId", planTypeId);
            formdata.append("Status", "Z");

            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow",
            };

            try {
                const response = await fetch(URLActivity.GetPlan, requestOptions);
                const result = await response.json();
                setData(result?.result || []);
            } catch (error) {
                console.error("Error fetching plans:", error);
            }
        };

        fetchPlanCategories();
    }, [planTypeId]);

    return (
        <View style={styles.pickerContainer}>
            {!planTypeId ? (
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => setClicked(true)}
                        disabled={!planTypeId}>
                        <Text style={styles.validationText}>Please select a plan type</Text>
                        {/*<Text style={styles.pickerButtonText}>*/}
                        {/*    {selectedCategoryName === '' ? placeholder : selectedCategoryName}*/}
                        {/*</Text>*/}
                    </TouchableOpacity>
                // <Text style={styles.validationText}>Please select a plan type</Text>
            ) : (
                <>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => setClicked(true)}
                        disabled={!planTypeId}>
                        <Text style={styles.pickerButtonText}>
                            {selectedCategoryName === '' ? placeholder : selectedCategoryName}
                        </Text>
                    </TouchableOpacity>
                    {clicked && (
                        <Modal
                            transparent={true}
                            animationType="slide"
                            visible={clicked}
                            onRequestClose={() => setClicked(false)}>
                            <View style={styles.modalContainer}>
                                <View style={styles.dropdownContainer}>
                                    <FlatList
                                        data={data}
                                        keyExtractor={item => item.PlanId}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.listItem}
                                                onPress={() => {
                                                    setSelectedCategoryName(item.PlanName);
                                                    onValueChange(item?.PlanId);
                                                    setClicked(false);
                                                }}>
                                                <Text style={styles.listItemText}>{item.PlanName}</Text>
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
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    pickerContainer: {
        width: '100%',
        alignSelf: 'center',
    },
    validationText: {
        color: 'red',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 10,
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
        color: '#000',
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

export default CustomPlanPicker;
