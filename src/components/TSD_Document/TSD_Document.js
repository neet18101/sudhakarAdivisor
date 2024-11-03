import {StyleSheet, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalHeader from '../../common/GlobalHeader';
import {useNavigation} from '@react-navigation/native';
import { Text, View } from 'react-native-animatable';
import { FlatList } from 'react-native-gesture-handler';

const TSD_Document = () => {
  const navigation = useNavigation();

  const options = [
    {
      icon: 'folder-open-outline', // Changed icon name
      name: 'TDS 27A Report',
      navigation: 'TDSForm',
    },
    {
      icon: 'file-tray-full-outline', // Changed icon name
      name: 'Challan Receipt Report',
      navigation: 'ChallanForm',
    },
    {
      icon: 'cloud-upload', // Changed icon name
      name: 'Tax Audit Report',
      navigation: 'TaxAuditForm',
    },
    {
      icon: 'cloud-download', // Changed icon name
      name: 'Acknowledgement Receipt Report',
      navigation: 'AcknowledgementReceiptForm',
    },
    {
      icon: 'receipt', // Changed icon name
      name: 'Acknowledgement Updated Receipt Report',
      navigation: 'AcknowledgementUpdateReceiptForm',
    },
  ];

  return (
    <>
      <GlobalHeader
        title="TDS Document"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={wp(6)} color={colors.white} />
          </TouchableOpacity>
        }
      />
      <View style={styles.container}>
        <FlatList
          data={options}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => navigation.navigate(item.navigation)}
            >
              <Icon
                name={item.icon}
                size={wp(10)}
                color={colors.white}
                style={styles.optionIcon}
              />
              <Text style={styles.optionText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    backgroundColor: colors.background,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  flatListContainer: {
    paddingBottom: hp(10),
  },
  optionButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
    width: wp(42),
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(0.3) },
    shadowOpacity: 0.3,
    shadowRadius: wp(2),
    elevation: 5,
  },
  optionIcon: {
    marginBottom: hp(1),
  },
  optionText: {
    fontSize: wp(4),
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
  },
});

export default TSD_Document;
