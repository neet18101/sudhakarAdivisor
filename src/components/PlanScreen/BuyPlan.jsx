import React, { useState, useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import Colors from "../../constants/Colors";
import GlobalHeader from "../../common/GlobalHeader";
import CustomPlanTypePicker from "../CustomPlanTypePicker";
import CustomPlanPicker from "../CustomPlanPicker";
import PaymentMethodPicker from "../PaymentMethodPicker";
import DataTable from "../DataTable";
import URLActivity from "../../utlis/URLActivity";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function BuyPlan({ navigation }) {
    const [deviceId, setDeviceId] = useState('');
    const [memberId, setMemberId] = useState('');
    const [loginToken, setLoginToken] = useState('');
    useEffect(() => {
        DeviceInfo.getAndroidId().then((id) => {
            setDeviceId(id);
        });
        const fetchToken = async () => {
            try {
                const member_id = await AsyncStorage.getItem('member_id');
                const LoginToken = await AsyncStorage.getItem('loginToken');
                setLoginToken(LoginToken || '');
                if (member_id) {
                    setMemberId(member_id);
                }
            } catch (error) {
                console.error('Error retrieving user token:', error);
            }
        };
        fetchToken();
    }, [])
    const [form, setForm] = useState({
        planType: '',
        plan: '',
        paymentMode: '',
        transactionNo: '',
        remark: ''
    });
    const [error, setError] = useState({
        planType: '',
        plan: '',
        paymentMode: '',
        transactionNo: '',
        remark: ''
    });
    const [tableData, setTableData] = useState([]);
    const validateForm = () => {
        let valid = true;
        let newError = {};

        if (!form.planType) {
            newError.planType = 'Plan Type is required';
            valid = false;
        }
        if (!form.plan) {
            newError.plan = 'Plan is required';
            valid = false;
        }
        if (!form.paymentMode) {
            newError.paymentMode = 'Payment Method is required';
            valid = false;
        }
        if (!form.transactionNo) {
            newError.transactionNo = 'Transaction No is required';
            valid = false;
        }

        setError(newError);
        return valid;
    };
    const handleSubmit = (item) => {
        if (validateForm()) {
            const formdata = new FormData();
            formdata.append("PlanDetailId", item.PlanDetailId);
            formdata.append("MemberId", memberId);
            formdata.append("Price", item.price);
            formdata.append("Benifit", item.benefit);
            formdata.append("Description", item.description);
            formdata.append("TransactionNo", form.transactionNo);
            formdata.append("PaymentModeId", form.paymentMode);
            formdata.append("Remark", form.remark);
            formdata.append("Token", loginToken);
            formdata.append("DeviceID", deviceId);
            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow"
            };
            fetch(URLActivity?.BuyMemberPlan, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    if (result.result && result.result[0]) {
                        const keys = Object.keys(result.result[0]);
                        const messageKey = keys.find((key) => key.trim() === "Message");
                        const message = result.result[0][messageKey] || "Message not found";
                        const status = result.result[0].status || "Status not found";
                        if (status === "201") {
                            Alert.alert("Success", message, [{ text: "OK" }]);
                        } else if (status === "409") {
                            Alert.alert("Status", message, [{ text: "OK" }]);
                        } else {
                            Alert.alert("Error", "Unexpected response", [{ text: "OK" }]);
                        }
                    } else {
                        Alert.alert("Error", "Invalid response structure", [{ text: "OK" }]);
                    }
                })
                .catch((error) => {
                    console.error("Fetch error:", error);
                    Alert.alert("Network Error", "Failed to connect to server", [{ text: "OK" }]);
                });
        } else {
            Alert.alert('Error', 'Please fill in all the required fields.');
        }
    };
    const fetchGetPlanDetails = () => {
        const formdata = new FormData();
        formdata.append("PlanDetailId", "-1");
        formdata.append("PlanId", form.plan);
        formdata.append("PlanCategoryId", form.planType);
        formdata.append("Status", "Z");
        formdata.append("Token", loginToken);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch(URLActivity.GetPlanDetail, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result && result.result) {
                    setTableData(result.result);
                } else {
                    Alert.alert("Error", "No data found for the selected plan.");
                }
            })
            .catch((error) => {
                console.error("Error fetching plan details:", error);
                Alert.alert("Error", "Failed to load plan details.");
            });
    };
    useEffect(() => {
        if (form.planType && form.plan) {
            fetchGetPlanDetails();
        }
    }, [form.planType, form.plan]);
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.stickyHeader}>
                <GlobalHeader
                    title="Buy Plan"
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
                            Plan Type <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <CustomPlanTypePicker
                            placeholder="--Select--"
                            onValueChange={value => {
                                setForm({ ...form, planType: value });
                                setError({ ...error, planType: '' });
                            }}
                        />
                        {error.planType ? <Text style={styles.errorText}>{error.planType}</Text> : null}
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Plan <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <CustomPlanPicker
                            placeholder="--Select--"
                            onValueChange={value => {
                                setForm({ ...form, plan: value });
                                setError({ ...error, plan: '' });
                            }}
                            planTypeId={form.planType}
                        />
                        {error.plan ? <Text style={styles.errorText}>{error.plan}</Text> : null}
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Payment Method <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <PaymentMethodPicker
                            placeholder="Select a payment method"
                            onValueChange={value => {
                                setForm({ ...form, paymentMode: value });
                                setError({ ...error, paymentMode: '' });
                            }}
                        />
                        {error.paymentMode ? <Text style={styles.errorText}>{error.paymentMode}</Text> : null}
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Transaction No <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={form.transactionNo}
                            onChangeText={transactionNo => {
                                setForm({ ...form, transactionNo });
                                setError({ ...error, transactionNo: '' });
                            }}
                            placeholder="Enter Transaction No"
                            placeholderTextColor="#6b7280"
                        />
                        {error.transactionNo ? <Text style={styles.errorText}>{error.transactionNo}</Text> : null}
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Remark <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.textArea}
                            multiline={true}
                            numberOfLines={4}
                            value={form.remark}
                            onChangeText={remark => {
                                setForm({ ...form, remark });

                            }}
                            placeholder="Enter Remark"
                            placeholderTextColor="#6b7280"
                        />
                        {error.remark ? <Text style={styles.errorText}>{error.remark}</Text> : null}
                    </View>
                </View>
                {tableData && tableData?.length > 0 && (
                    <DataTable
                        headers={['Sr. No.', 'Price (Rs.)', 'Description', 'Action']}
                        data={tableData.map((item, index) => ({
                            srNo: index + 1,
                            price: item.Price,
                            description: item.Description,
                            benefit: item.Benifit,
                            PlanDetailId: item.PlanDetailId,
                        }))}
                        onActionPress={(item) => handleSubmit(item)}
                        actionText="Buy Now"
                    />
                )}
            </ScrollView>
        </View>
    );
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
});
