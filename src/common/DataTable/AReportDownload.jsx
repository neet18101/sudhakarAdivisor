import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, PermissionsAndroid } from 'react-native';
import Icon from "react-native-vector-icons/Feather";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Colors from "../../constants/Colors";
import RNFetchBlob from 'rn-fetch-blob';
const AReportDownload = ({ headers, data, onActionPress, actionText }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBenefit, setSelectedBenefit] = useState('');
    const [selectedDescription, setSelectedDescription] = useState('');
    const handleIconPress = (benefit, description) => {
        // console.log(description , benefit);
        setSelectedBenefit(benefit);
        setSelectedDescription(description);
        setModalVisible(true);
    };
    // console.log(data, "data")
    const requestStoragePermission = async (item) => {
        downloadFile(item?.downloadUrl);
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission Required',
                    message:
                        'This app needs access to your device storage to download and save files. ' +
                        'Please grant permission to continue.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {

            } else {
                console.log('Storage permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };
    const downloadFile = async (url) => {
        const { config, fs } = RNFetchBlob;
        const { dirs } = RNFetchBlob.fs;
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
        }
        config(options)
            .fetch('GET', url)
            .then((res) => {
                console.log('res -> ', JSON.stringify(res));
                alert('File Saved Successfully.');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <View style={styles.container}>
            {/* <Modal
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
            </Modal> */}

            <View style={styles.tableHeader}>
                {headers.map((header, index) => (
                    <Text key={index} style={[
                        styles.headerCell,
                        index === 0 && styles.srNoHeader,
                        index === 1 && styles.priceHeader,
                        index === 2 && styles.benefitHeader,
                        index > 2 && styles.flexibleHeader,
                    ]}>
                        {header}
                    </Text>
                ))}
            </View>
            {data.map((item, index) => (
                <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
                    <Text style={[styles.cell, styles.srNoCell]}>{item.srNo}</Text>
                    <Text style={[styles.cell, styles.priceCell]}>{item.DepartmentName}</Text>
                    <Text style={[styles.cell, styles.srNoCell]}>{item.year}</Text>
                    {/* <Text style={[styles.cell, styles.benefitCell]}>
                        <TouchableOpacity onPress={() => handleIconPress(item?.benefit, item?.description)}>
                            <Icon name="help-circle" size={wp(4)} color={Colors.primary} />
                        </TouchableOpacity>
                    </Text> */}
                    <View style={styles.buttonCell}>
                        <TouchableOpacity style={styles.button} onPress={() => requestStoragePermission(item)}>
                            <Text style={styles.buttonText}>{actionText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // margin: wp(1),
        width: '100%',
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
    tableContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: wp(2),
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    tableHeaderCell: {
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        color: Colors.black
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        paddingHorizontal: wp(1),
        color: Colors.primary,
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
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: Colors.primary,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        color: Colors.white
    },
    cell: {
        padding: wp(0),
        textAlign: 'center',
        color: '#000',
    },
    srNoCell: {
        width: wp(15),
        fontWeight: '600',


    },
    priceCell: {
        width: wp(30),
        fontWeight: '600',
        textAlign: 'left'
    },
    benefitCell: {
        width: wp(30),
        flexWrap: 'wrap',
    },
    buttonCell: {
        width: wp(20),
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: wp(3),
    },
    button: {
        backgroundColor: '#0056b3',
        paddingVertical: wp(1),
        paddingHorizontal: wp(2),
        borderRadius: wp(1),
        paddingBottom: wp(2),
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: wp(3),
    },
    evenRow: {
        backgroundColor: '#ffffff',
    },
    oddRow: {
        backgroundColor: '#f9f9f9',
    },
    headerCell: {
        padding: wp(1),
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
    },
    srNoHeader: {
        width: wp(15),
    },
    priceHeader: {
        width: wp(30),
    },
    benefitHeader: {
        width: wp(30),
    },
    flexibleHeader: {
        width: wp(20),
    },
});

export default AReportDownload;
