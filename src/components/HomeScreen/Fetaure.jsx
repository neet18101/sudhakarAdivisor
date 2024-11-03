import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import colors from "../../constants/Colors";

export default function Feature({ navigation }) {
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.featuresText}>Features</Text>

                {/* Start E-Filing */}
                <View style={[styles.listCategory, { backgroundColor: '#a7f3d0' }]}>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <View style={styles.listOption}>
                            <Image source={require('../../assets/images/filling.png')} style={styles.icon} />
                            <Text style={styles.listText}>Start E-Filing</Text>
                        </View>
                        <Text style={styles.listParagraph}>
                            Click Here and Start E-Filing of your Income Tax Return with Expert Assistance.
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Company e-KYC */}
                <View style={[styles.listCategory, { backgroundColor: '#99d1f6' }]}>
                    <View style={styles.listOption}>
                        <Image source={require('../../assets/images/kyc.png')} style={styles.icon} />
                        <Text style={styles.listText}>Company e-KYC</Text>
                    </View>
                    <Text style={styles.listParagraph}>
                        File e-Form Active (INC-22A) of your company for Active Company Tagging.
                    </Text>
                </View>

                {/* Form 16 */}
                <View style={[styles.listCategory, { backgroundColor: '#A5F3FCFF' }]}>
                    <TouchableOpacity onPress={() => navigation.navigate('FormSixteen')}>
                        <View style={styles.listOption}>
                            <Image source={require('../../assets/images/form.png')} style={styles.icon} />
                            <Text style={styles.listText}>Form 16</Text>
                        </View>
                        <Text style={styles.listParagraph}>
                            Finding it tough to calculate taxes and deductions? Here are some tools that can help solve your problem.
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Download Challan Receipt */}
                <View style={[styles.listCategory, { backgroundColor: '#FCD5A5' }]}>
                    <TouchableOpacity onPress={() => navigation.navigate('TDS_Document')}>
                        <View style={styles.listOption}>
                            <Image source={require('../../assets/images/challan.png')} style={styles.icon} />
                            <Text style={styles.listText}>TDS Document</Text>
                        </View>
                        <Text style={styles.listParagraph}>
                            Easily download your tax challan receipts for quick access and record-keeping
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingBottom: hp(10),
    },
    container: {
        flex: 1,
        paddingVertical: hp(2),
        paddingHorizontal: wp(3),
    },
    featuresText: {
        fontSize: wp(5.2),
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: hp(1),
    },
    listCategory: {
        padding: wp(2),
        borderRadius: 12,
        marginVertical: hp(1),
        borderWidth: 1,
        borderColor: colors.primary,
    },
    listOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(0.1),
    },
    icon: {
        height: hp(4),
        width: hp(4),
    },
    listText: {
        fontWeight: 'bold',
        color: colors.primary,
        paddingLeft: wp(2),
        fontSize: wp(4.8),
    },
    listParagraph: {
        fontSize: wp(3.5),
        color: colors.black,
        fontWeight: '500',
        marginTop: hp(0.5),
    },
});
