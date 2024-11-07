import {View, Text, StyleSheet, StatusBar} from 'react-native';
import React from 'react';
import {Colors} from '../constants';
import Header from '../components/HomeScreen/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
export default function IRTUplaod({navigation}) {
  const options = [
    {
      icon: 'add-circle-outline',
      name: 'Create Complaints',
      navigation: 'CreateComplaints',
    },
    {
      icon: 'list-circle-outline',
      name: 'Complaints List',
      navigation: 'ComplaintsList',
    },
  ];
  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <Header navigation={navigation} />
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Complaints</Text>
        </View>
        <FlatList
          data={options}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => navigation.navigate(item.navigation)}>
              <Icon
                name={item.icon}
                size={wp(10)}
                color={Colors.white}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    backgroundColor: Colors.background,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.red,
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
    marginVertical: hp(2),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
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
    backgroundColor: Colors.primary,
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
    width: wp(42),
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: hp(0.3)},
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
    color: Colors.white,
    textAlign: 'center',
  },
});
