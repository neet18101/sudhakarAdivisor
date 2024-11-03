import {Text, View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const Header = ({title, leftComponent}) => {
  return (
    <View style={styles.headerContainer}>
      {leftComponent && (
        <View style={styles.leftComponent}>{leftComponent}</View>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const FormPartA = ({navigation}) => {
  return (
    <Header
      title="Form 16 Part A"
      leftComponent={
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={wp(6)} color={colors.white} />
        </TouchableOpacity>
      }
    />
  );
};
export default FormPartA;
