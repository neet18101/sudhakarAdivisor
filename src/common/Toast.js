import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    Animated,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Toast = ({
    visible,
    message,
    description,
    duration = 1000,
    onHide,
    type = 'success', // Default type
}) => {
    const [show, setShow] = useState(visible);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(
        new Animated.Value(Dimensions.get('window').height) // Start off-screen at the bottom
    ).current;

    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (visible) {
            setShow(true);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0, // Move to the visible position
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();

            setTimeout(() => {
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: Dimensions.get('window').height, // Move off-screen again
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    setShow(false);
                    if (onHide) onHide();
                });
            }, duration);
        }
    }, [visible, fadeAnim, slideAnim, duration, onHide]);

    if (!show) return null;

    const getIconName = () => {
        switch (type) {
            case 'success':
                return 'checkmark-circle-outline';
            case 'info':
                return 'information-circle-outline';
            case 'error':
                return 'close-circle-outline';
            default:
                return 'alert-circle-outline';
        }
    };

    return (
        <Animated.View
            style={[
                styles.toastContainer,
                {
                    bottom: insets.bottom + 20, // Position above the safe area
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                    backgroundColor:
                        type === 'success'
                            ? Colors.green
                            : type === 'info'
                            ? '#8b3dff'
                            : Colors.red,
                },
            ]}
        >
            <View style={styles.toastMessage}>
                <Icon
                    size={24}
                    color={Colors.white}
                    name={getIconName()}
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.message}>{message}</Text>
                    {description && <Text style={styles.description}>{description}</Text>}
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        left: 20,
        right: 20,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    message: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    description: {
        color: Colors.white,
        fontSize: 14,
        marginTop: 5,
    },
    toastMessage: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
});

export default Toast;
