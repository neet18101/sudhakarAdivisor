import { Text, View } from "react-native-animatable";
import GlobalHeader from "../../common/GlobalHeader";
import { StyleSheet } from "react-native";
import { ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useEffect, useState } from "react";
import CustomPlanTypePicker from "../CustomPlanTypePicker";
import CustomPlanPicker from "../CustomPlanPicker";
import PaymentMethodPicker from "../PaymentMethodPicker";
export function MemeberPlanReport({ navigation }) {
    const [memberId, setMemberId] = useState('');
    const [data, setData] = useState(null);
    const [form, setForm] = useState({
        tan: '',
        planType: '',
        plan: '',
        paymentMode: '',
        transactionNo: '',
        status: "",
    });
    useEffect(() => {
        const formdata = new FormData();
        formdata.append("MemberPlanId", "-1");
        formdata.append("MemberId", "-1");
        formdata.append("PlanDetailId", "-1");
        formdata.append("MemberPlanNo", "");
        formdata.append("Status", "Z");
        formdata.append("Tan", "");
        formdata.append("TransactionId", "");
        formdata.append("FromDate", "03/11/2024");
        formdata.append("ToDate", "23/11/2024");

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
        };
        fetch("https://paytds.com/JsonService/MemberPlanDetail.aspx", requestOptions)
            .then((response) => {
                // Check content type to decide how to parse
                const contentType = response.headers.get("Content-Type");
                if (contentType && contentType.includes("application/json")) {
                    return response.json(); // Parse as JSON
                } else {
                    return response.text(); // Parse as plain text
                }
            })
            .then((data) => {
                if (typeof data === "string") {
                    const parsedResponse = JSON.parse(data);
                    console.log("Raw Text Response:", parsedResponse);
                } else {
                    console.log("Parsed JSON Response:", data);
                }
            })
            .catch((error) => console.error("Error:", error));

    }, []);

    console.log(data);
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.stickyHeader}>
                <GlobalHeader
                    title="Member Plan Report"
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
                            TAN <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={form.transactionNo}
                            onChangeText={tan => {
                                setForm({ ...form, tan });
                            }}
                            placeholder="Enter TAN No."
                            placeholderTextColor="#6b7280"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Plan Type <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <CustomPlanTypePicker
                            placeholder="--Select--"
                            onValueChange={value => {
                                setForm({ ...form, planType: value });

                            }}
                        />
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
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Payment Method <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <PaymentMethodPicker
                            placeholder="Select a payment method"
                            onValueChange={value => {
                                setForm({ ...form, paymentMode: value });

                            }}
                        />

                    </View>
                </View>
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
});
