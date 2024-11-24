import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Modal,
} from 'react-native';
import colors from '../constants/Colors';

const PaymentMethodPicker = ({ selectedValue, onValueChange, placeholder }) => {
    const [clicked, setClicked] = useState(false);
    const [selectedCategoryName, setSelectedCategoryName] = useState('');

    const data = [
        { paymentId: 1, paymentName: 'UPI' },
        { paymentId: 2, paymentName: 'NEFT' },
        { paymentId: 3, paymentName: 'IMPS' },
        { paymentId: 4, paymentName: 'CASH' },
    ];

    return (
        <View style={styles.pickerContainer}>
            <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setClicked(true)}
            >
                <Text style={styles.pickerButtonText}>
                    {selectedCategoryName === '' ? placeholder : selectedCategoryName}
                </Text>
            </TouchableOpacity>
            {clicked && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={clicked}
                    onRequestClose={() => setClicked(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.dropdownContainer}>
                            <FlatList
                                data={data}
                                keyExtractor={item => item.paymentId.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.listItem}
                                        onPress={() => {
                                            setSelectedCategoryName(item.paymentName);
                                            onValueChange(item.paymentId);
                                            setClicked(false);
                                        }}
                                    >
                                        <Text style={styles.listItemText}>{item.paymentName}</Text>
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

export default PaymentMethodPicker;
