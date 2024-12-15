import { Text, View } from "react-native-animatable";
import GlobalHeader from "../../common/GlobalHeader";
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalDepartmentByUserPhoneNumber from "../../common/GlobalDepartmentByUserPhoneNumber";
import { useEffect, useState } from "react";
import CustomYearPicker from "../../common/Year";
import CustomQuartorPicker from "../../common/Quarter";
import URLActivity from "../../utlis/URLActivity";
import DataTable from "../DataTable";
import AReportDownload from "../../common/DataTable/AReportDownload";
import CustomMonthPicker from "../../common/Month";
export default function ChallanReport({ navigation }) {
    const [form, setForm] = useState({
        DepartmentTANId: "",
        YearId: "",
        MonthId: ""
    });
    const [downloadChallanfile, setDownloadChallanfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loginToken, setLoginToken] = useState(null);
    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const formdata = new FormData();
            formdata.append("DepartmentTANId", form.DepartmentTANId);
            formdata.append("YearId", form.YearId);
            formdata.append("MonthId", form.MonthId);
            formdata.append("Token", loginToken);

            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow",
            };
            const response = await fetch(URLActivity?.DownloadChallanFile, requestOptions);
            const result = await response.json();
            setIsLoading(false);
            if (result?.result?.[0]?.IsFound === "True") {
                setDownloadChallanfile(result.result);
            } else {
                console.log("No Data Found:", result?.result?.[0]?.Message);
                setDownloadChallanfile([]);
            }
        } catch (error) {
            console.error("Error during API call:", error);
            Alert.alert("Error", "Failed to fetch data. Please try again later.");
        }
    };
    useEffect(() => {
        const fetch27AFile = async () => {
            const Token = await AsyncStorage.getItem('loginToken');
            setLoginToken(Token || '');
            setIsLoading(true);
            try {
                const formdata = new FormData();
                formdata.append("DepartmentTANId", form.DepartmentTANId);
                formdata.append("YearId", "-1");
                formdata.append("MonthId", "-1");
                formdata.append("Token", loginToken);

                const requestOptions = {
                    method: "POST",
                    body: formdata,
                    redirect: "follow",
                };
                const response = await fetch(URLActivity?.DownloadChallanFile, requestOptions);
                const result = await response.json();
                setIsLoading(false);
                if (result?.result?.[0]?.IsFound === "True") {

                    setDownloadChallanfile(result.result);
                } else {
                    console.log("No Data Found:", result?.result?.[0]?.Message);
                    setDownloadChallanfile([]);
                }
            } catch (error) {
                console.error("Error during API call:", error);
                Alert.alert("Error", "Failed to fetch data. Please try again later.");
            }
        };
        fetch27AFile();
    }, [form.DepartmentTANId])

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.stickyHeader}>
                <GlobalHeader
                    title={"Challan Report"}
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
                            Department <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <GlobalDepartmentByUserPhoneNumber
                            placeholder="Select Department"
                            onValueChange={value => {
                                setForm({ ...form, DepartmentTANId: value });
                            }}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Year <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <CustomYearPicker
                            placeholder={"Select Year"}
                            onValueChange={value => {
                                setForm({ ...form, YearId: value });
                            }}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Month <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <CustomMonthPicker
                            placeholder={"Select Month"}
                            onValueChange={value => {
                                setForm({ ...form, MonthId: value });
                            }}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSearch}>
                            <Text style={styles.buttonText}>Search</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.cancelButton}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>
                {isLoading ? <ActivityIndicator size="large" color={Colors.primary} /> :
                    downloadChallanfile && downloadChallanfile.length > 0 ? (
                        <AReportDownload
                            headers={['Sr. No', 'DepartmentName', 'TAN', 'Year', 'Action']}
                            data={downloadChallanfile.map((item, index) => ({
                                srNo: index + 1,
                                DepartmentName: item.DepartmentName,
                                year: item.Year,
                                downloadUrl: item.Path,
                            }))}
                            actionText="Download"
                        />
                    ) : (
                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            <Text style={{ fontSize: wp(5), fontWeight: 'bold' , color:Colors.red }}>
                                No Data Found
                            </Text>
                        </View>
                    )
                }
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
        zIndex: 1000,
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
});
