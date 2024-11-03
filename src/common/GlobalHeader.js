import { StyleSheet } from 'react-native';
import {Text, View} from 'react-native-animatable';
import Colors  from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';

const GlobalHeader = ({title, leftComponent}) => {
    
  return (
    <View style={styles.headerContainer}>
      {leftComponent && (
        <View style={styles.leftComponent}>{leftComponent}</View>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
  },
  leftComponent: {
    position: 'absolute',
    left: wp(4),
  },
  headerTitle: {
    fontSize: wp(5.5),
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default GlobalHeader;
