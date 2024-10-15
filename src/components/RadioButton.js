import React from 'react';
import { View, Text,Pressable, TouchableOpacity, StyleSheet } from 'react-native';

const RadioButton = ({ label, selected, onPress }) => {
    return (
        <Pressable  style={styles.container} onPress={onPress}>
            <View style={[styles.radioCircle, selected && styles.selectedRadio]}>
                {selected && <View style={styles.selectedDot} />}
            </View>
            <Text style={styles.label}>{label}</Text>
        </Pressable >
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#003f69', // Outer circle color
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    selectedRadio: {
        backgroundColor: '#fff', // Outer circle background when selected
    },
    selectedDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#003f69', // Inner circle color when selected
    },
    label: {
        fontSize: 16,
        color : '#000',
    },
});

export default RadioButton;
