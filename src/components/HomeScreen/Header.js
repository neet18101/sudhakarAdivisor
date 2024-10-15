import {Image, StatusBar, StyleSheet, Text, View} from "react-native";
import colors from "../../constants/Colors";
import avatar from "../../assets/images/avatar.png";
import Colors from "../../constants/Colors";

const Header = () => {
    return (
        <View style={styles.container}>
            {/* StatusBar Settings */}
            <StatusBar
                animated={true}
                backgroundColor={colors.primary}  // Set background color of StatusBar
                barStyle="light-content"          // Set StatusBar icons to white
                translucent={false}               // Set to true if you want a transparent status bar
            />

            {/* Header Section */}
            <View style={styles.header}>
                <Image
                    source={avatar}
                    style={styles.avatar}
                />
                <View>
                    <Text style={{color: colors.white,fontSize:12}}>Welcome</Text>
                    <Text style={styles.userName}>Navneet!</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingTop: 25,
        backgroundColor: Colors.primary,  // Background color of the whole container
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,  // For spacing between avatar and text
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 99,
    },
    userName: {
        fontSize: 18,
        fontFamily: 'OpenSans-SemiBold',
        fontWeight: '700',
        color: colors.white,
    },
});


export default Header;
