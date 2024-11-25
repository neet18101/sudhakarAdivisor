import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, PermissionsAndroid, Platform } from 'react-native';
import Icon from "react-native-vector-icons/Feather";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Colors from "../../constants/Colors";
import RNFetchBlob from 'rn-fetch-blob';

const AReportDownload = ({ headers, data, onActionPress, actionText }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBenefit, setSelectedBenefit] = useState('');
    const [selectedDescription, setSelectedDescription] = useState('');
    const handleIconPress = (benefit, description) => {
        setSelectedBenefit(benefit);
        setSelectedDescription(description);
        setModalVisible(true);
    };
    const requestStoragePermission = async () => {
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                ]);

                if (
                    granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
                ) {
                    console.log('Storage permissions granted');
                    return true;
                } else {
                    console.log('Storage permissions denied');
                    return false;
                }
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else {

            return true;
        }
    };
    const handleFileDownload = async (url) => {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
            alert('Storage permission is required to proceed.');
            return;
        }

        // Proceed with the file download logic here
        downloadFile(url);
    };
    const downloadFile = async (url) => {
        const granted = await requestStoragePermission();
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            alert('Storage permission is required to download the file.');
            return;
        }

        const { config, fs } = RNFetchBlob;
        const date = new Date();
        const time = date.getTime();
        const fileName = `${time}.pdf`;
        const path = fs.dirs.DownloadDir + '/' + fileName;

        const options = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path,
                mime: 'application/pdf',
            },
        };

        try {
            await config(options).fetch('GET', url);
            alert('File Saved Successfully.');
        } catch (err) {
            console.log('Download Error:', err);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.tableHeader}>
                {headers.map((header, index) => (
                    <Text key={index} style={[
                        styles.headerCell,
                        index === 0 && styles.srNoHeader,
                        index === 1 && styles.departHeader,
                        index === 2 && styles.yearHeader,
                        index > 2 && styles.flexibleHeader,
                    ]}>
                        {header}
                    </Text>
                ))}
            </View>

            {data.map((item, index) => (
                <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
                    <Text style={[styles.cell, styles.srNoCell]}>{item.srNo}</Text>
                    <Text style={[styles.cell, styles.departCell]}>{item.DepartmentName}</Text>
                    <Text style={[styles.cell, styles.yearCell]}>{item.year}</Text>
                    <View style={styles.buttonCell}>
                        <TouchableOpacity style={styles.button} onPress={() => handleFileDownload(item?.downloadUrl)}>
                            <Text style={styles.buttonText}>{actionText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

            {modalVisible && (
                <Modal
                    transparent={true}
                    visible={modalVisible}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Details</Text>
                            <View style={styles.tableContainer}>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableHeaderCell}>Benefit</Text>
                                    <Text style={styles.tableHeaderCell}>Description</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{selectedBenefit}</Text>
                                    <Text style={styles.tableCell}>{selectedDescription}</Text>
                                </View>
                            </View>
                            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: Colors.primary,
        paddingVertical: wp(2),
    },
    headerCell: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
        padding: wp(1),
    },
    srNoHeader: {
        width: wp(15),
    },
    departHeader: {
        width: wp(40),
    },
    yearHeader: {
        width: wp(25),
    },
    flexibleHeader: {
        width: wp(20),
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: wp(2),
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    evenRow: {
        backgroundColor: '#f9f9f9',
    },
    oddRow: {
        backgroundColor: '#fff',
    },
    cell: {
        paddingHorizontal: wp(2),
        textAlign: 'center',
        color: '#000',
    },
    srNoCell: {
        width: wp(15),
    },
    departCell: {
        width: wp(40),
        textAlign: 'left',
    },
    yearCell: {
        width: wp(25),
    },
    buttonCell: {
        width: wp(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: Colors.primary,
        paddingVertical: wp(1),
        paddingHorizontal: wp(3),
        borderRadius: wp(1),
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: wp(3),
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: wp(5),
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: wp(4.5),
        fontWeight: 'bold',
        marginBottom: wp(4),
        color: Colors.black,
    },
    closeButton: {
        backgroundColor: Colors.primary,
        padding: wp(2),
        borderRadius: 5,
        marginTop: wp(3),
    },
    closeButtonText: {
        color: '#fff',
        fontSize: wp(3.5),
        textAlign: 'center',
    },
});

export default AReportDownload;
