import {Image, StatusBar, StyleSheet, Text, View} from "react-native";
import colors from "../../../src/constants/Colors";
import Header from "../../../src/components/HomeScreen/Header";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import FormSixteenList from "../components/FormSixteen/FormSixteenList";

const FromSixteenScreen = () => {
    return (
        <>
            {/* <Header/> */}
            <FormSixteenList/>

        </>

    );
};
export default FromSixteenScreen;
