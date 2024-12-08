import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import colors from '../../constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom Header Component
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

const FormSixteenList = () => {
  const navigation = useNavigation();
  const [isRegisType, setRegisType] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const regisType = await AsyncStorage.getItem('RegisType');
      if (regisType === '2') setRegisType(true);
    };
    fetchData();
  }, []);

  const options = [
    {
      icon: 'document-text-outline',
      name: 'Form 16 Part A',
      navigation: 'FormPartA',
    },
    {
      icon: 'document-outline',
      name: 'Form 16 Part B',
      navigation: 'FormPartB',
    },
  ];
  const Employee26 = [
    {
      icon: 'document-text-outline',
      name: 'Form 16 (26Q)',
      navigation: 'FormPartA26Q' 
    },
  ];

  return (
    <>
      <Header
        title="Form 16"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={wp(6)} color={colors.white} />
          </TouchableOpacity>
        }
      />
      <View style={styles.container}>
        <Text style={styles.featuresText}>Form 16 Options</Text>
        <FlatList
          data={isRegisType ? Employee26 : options}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => navigation.navigate(item.navigation)}>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
  },
  leftComponent: {
    position: 'absolute',
    left: wp(4),
  },
  headerTitle: {
    fontSize: wp(5.5),
    color: colors.white,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    backgroundColor: colors.background,
  },
  featuresText: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: hp(2),
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
    borderRadius: 8,
    width: wp(40),
    marginBottom: hp(2),
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Shadow for Android
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

export default FormSixteenList;
