

import { Text, View } from "react-native-animatable";
import GlobalHeader from "../../common/GlobalHeader";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { useEffect, useState } from "react";
import URLActivity from "../../utlis/URLActivity";
import AReportDownload from "../../common/DataTable/AReportDownload";
import SessionPicker from "../../common/SessionPicker";
import CustomQuartorPicker from "../../common/Quarter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "../../common/Toast";

export default function FormPartA26Q({ navigation }) {
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');


    const [form, setForm] = useState({
        Pan: "",
        Quarter: "",
        SessionId: ""
    });
    useEffect(() => {
        const fetchUserToken = async () => {
            try {
                const userToken = await AsyncStorage.getItem('userToken');
                setForm(prevForm => ({
                    ...prevForm,
                    Pan: userToken || ""
                }));
            } catch (error) {
                console.error('Error fetching user token:', error);
            }
        };

        fetchUserToken();
    }, []);

    const [downloadChallanfile, setDownloadChallanfile] = useState(null);
    const handleSearch = async () => {
        try {
            const formdata = new FormData();
            formdata.append("Pan", form.Pan);
            formdata.append("Quarter", form.Quarter);
            formdata.append("SessionId", form.SessionId);
            console.log('Form Data:', formdata);
            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow",
            };
            const response = await fetch(URLActivity?.Form16Quarterly, requestOptions);
            const result = await response.json();
            if (result?.result?.[0]?.IsFound === "True") {
                Alert.alert("Data Found");
                setDownloadChallanfile(result.result);
            } else {


                setToastVisible(true);
                const message = result[0]?.Message || 'No message available';
                setToastMessage(message);
                setToastType('error');
                setDownloadChallanfile([]);
            }
        } catch (error) {
            console.error("Error during API call:", error);
            Alert.alert("Error", "Failed to fetch data. Please try again later.");
        }
    };
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.stickyHeader}>
                <GlobalHeader
                    title={"Form 16 (26Q)"}
                    leftComponent={
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icon name="arrow-back" size={wp(6)} color={Colors.white} />
                        </TouchableOpacity>
                    }
                />
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: hp(5) }}>
                <View style={styles.container}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Quarter Year <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <CustomQuartorPicker
                            placeholder={"Select Quarter Year"}
                            onValueChange={value => {
                                setForm({ ...form, Quarter: value });
                            }}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Financial Year <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <SessionPicker
                            placeholder={"Select Financial Year"}
                            onValueChange={value => {
                                setForm({ ...form, SessionId: value });
                            }}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Pan <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <TextInput

                            autoCapitalize="characters"
                            autoCorrect={false}
                            clearButtonMode="while-editing"
                            keyboardType="email-address"
                            onChangeText={Pan => setForm({ ...form, Pan })}
                            placeholder="Enter a Pan"
                            placeholderTextColor="#6b7280"
                            maxLength={10}
                            style={styles.inputControl}
                            value={form.Pan}
                            editable={false}
                        />


                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSearch}>
                            <Text style={styles.buttonText}>Search</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    downloadChallanfile && downloadChallanfile.length > 0 ? (
                        <AReportDownload
                            headers={['Sr. No', 'Pan', 'Session', 'Action']}
                            data={downloadChallanfile.map((item, index) => ({
                                srNo: index + 1,
                                DepartmentName: item?.Pan,
                                year: item?.M02_SessionId,
                                downloadUrl: item?.Path,
                            }))}
                            actionText="Download"
                        />
                    ) : (
                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            <Text style={{ fontSize: wp(5), fontWeight: 'bold' }}>
                                No Data Found
                            </Text>
                        </View>
                    )
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
    )
}
const styles = StyleSheet.create({
    stickyHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: Colors.primary,
    },
    container: {
        flex: 1,
        paddingHorizontal: wp(5),
        paddingVertical: hp(3),
        // backgroundColor: '#fff',
    },
    inputContainer: {
        marginBottom: hp(2),
    },
    label: {
        fontSize: wp(4.2),
        fontWeight: '600',
        color: '#333',
        marginBottom: hp(0.5),
    },
    asterisk: {
        color: 'red',
    },
    input: {
        height: hp(6),
        borderColor: Colors.gray,
        borderWidth: 1,
        borderRadius: wp(2),
        paddingHorizontal: wp(3),
        fontSize: wp(4),
        backgroundColor: '#fff',
        color: '#333',
    },
    textArea: {
        borderColor: Colors.gray,
        borderWidth: 1,
        borderRadius: wp(2),
        paddingHorizontal: wp(3),
        paddingVertical: hp(1.5),
        fontSize: wp(4),
        backgroundColor: '#fff',
        color: '#333',
        textAlignVertical: 'top',
    },
    errorText: {
        color: 'red',
        fontSize: wp(3.2),
        marginTop: hp(0.5),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp(1),
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
    inputControl: {
        height: 50,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
        borderWidth: 1,
        borderColor: '#C9D3DB',
        borderStyle: 'solid',
        flex: 1, // Ensures TextInput expands fully in row layout
    },
});
