import { Image, StyleSheet, Text, View } from "react-native";
import colors from "../../constants/Colors";
import Icon from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const OptionList = ({ image }) => {
    return (
        <View style={{ padding: 10, backgroundColor: colors.white, borderRadius: 10, width: "45%", justifyContent: 'center', alignItems: 'center' }}>
            <Icon name={image.icon} size={wp(10)} color={colors.primary} style={styles.optionIcon} />
            <Text style={styles.optionText}>{image.name}</Text>
            {/* <View style={{ backgroundColor: colors.primary, borderRadius: 8, padding: 8, margin: 4 }}>
                <Text
                    style={{ color: colors.white, fontSize: 14, textAlign: 'center' }}
                    numberOfLines={2} 
                    ellipsizeMode="head" 
                >
                    {image.name}
                </Text>
            </View> */}
        </View>
    )
}

const styles = StyleSheet.create({
    optionText: {
        fontSize: wp(4),
        fontWeight: '600',
        color: colors.primary,
        textAlign: 'center',
    },
})
export default OptionList