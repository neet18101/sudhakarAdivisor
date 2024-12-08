import { Text, View, ScrollView, TextInput, TouchableOpacity, FlatList } from "react-native";
import GlobalHeader from "../../common/GlobalHeader";
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useEffect, useState } from "react";
import CustomPlanTypePicker from "../CustomPlanTypePicker";
import CustomPlanPicker from "../CustomPlanPicker";
import PaymentMethodPicker from "../PaymentMethodPicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../constants";
import DataTable from "../DataTable";
import MemberPlanReportTable from "../../common/DataTable/MemberPlanReportTable";

export default function MemeberPlanReport({ navigation }) {
    const [memberId, setMemberId] = useState('');
    const [data, setData] = useState([]);
    const [form, setForm] = useState({
        tan: '',
        planType: '',
        plan: '',
        paymentMode: '',
        transactionNo: '',
        status: "",
        fromDate: '',
        toDate: '',
    });

    useEffect(() => {
        const fetchToken = async () => {
            const formdata = new FormData();
            const member_id = await AsyncStorage.getItem('member_id');
            formdata.append("MemberPlanId", "-1");
            formdata.append("MemberId", member_id);
            formdata.append("PlanDetailId", "-1");
            formdata.append("MemberPlanNo", "");
            formdata.append("Status", "Z");
            formdata.append("Tan", "");
            formdata.append("TransactionId", "");
            formdata.append("FromDate", "01/01/2001");
            formdata.append("ToDate", "23/11/2024");

            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow",
            };
            fetch("https://paytds.com/JsonService/MemberPlanDetail.aspx", requestOptions)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((result) => {
                    setData(result?.result);
                })
                .catch((error) => console.error('Error:', error));
        };

        fetchToken();
    }, []);

    const TableHeader = () => (
        <View style={styles.tableHeader}>
            <Text style={styles.headerText}>Plan Name</Text>
            <Text style={styles.headerText}>Benefit</Text>
            <Text style={styles.headerText}>Price</Text>
            <Text style={styles.headerText}>Status</Text>
        </View>
    );

    const TableRow = ({ item }) => (
        <View style={styles.tableRow}>
            <Text style={styles.rowText}>{item.PlanName}</Text>
            <Text style={styles.rowText}>{item.Benifit}</Text>
            <Text style={styles.rowText}>{item.Price}</Text>
            <Text style={styles.rowText}>{item.Status}</Text>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.stickyHeader}>
                <GlobalHeader
                    title="Member Plan Report"
                    leftComponent={
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icon name="arrow-back" size={wp(6)} color="#fff" />
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

                    <View style={styles.inputContainer}>
                        <TouchableOpacity style={styles.saveButton}>
                            <Text style={styles.buttonText}>Search</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {data&&data?.length > 0 &&(
                    <MemberPlanReportTable
                        headers={['Sr. No.', 'Price (Rs.)', 'Description', 'Action']}
                        data={data.map((item, index) => ({
                            srNo: index + 1,
                            price: item.Price,
                            description: item,
                            // benefit: item.ApprovalRemark,
                            Status: item.ApprovalRemark,

                        }))}
                        onActionPress={(item) => handleSubmit(item)}
                       
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
        backgroundColor: '#1E88E5',
    },
    container: {
        flex: 1,
        paddingHorizontal: wp(5),
        paddingVertical: hp(3),
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
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: wp(2),
        paddingHorizontal: wp(3),
        fontSize: wp(4),
        backgroundColor: '#fff',
        color: '#333',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f1f1f1',
        paddingVertical: 10,
        backgroundColor: Colors.primary,
    },
    headerText: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: wp(4),
        textAlign: 'center',
        color: '#fff',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    },
    rowText: {
        flex: 1,
        fontSize: wp(4),
        textAlign: 'center',
        color: '#333',
    },
    saveButton: {
        backgroundColor:  Colors.primary,
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(6),
        borderRadius: wp(2),
        flex: 1,
        marginRight: wp(2),
    },
    buttonText: {
        color: '#fff',
        fontSize: wp(4),
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
