import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/Ionicons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Colors from '../../constants/Colors';

export default function Plan({ navigation }) {


  const options = [
    {
      icon: 'cart-outline',
      name: 'Buy Plan',
      navigation: 'BuyPlan',
    },
    {
      icon: 'list-outline',
      name: 'Member Plan Report',
      navigation: 'MemeberPlanReport',
    },
  ];
  return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Subscription</Text>
        </View>
        <FlatList
            data={options}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => navigation.navigate(item.navigation)}>
                  <Icon
                      name={item.icon}
                      size={wp(8)}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    backgroundColor: Colors.background,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.red,
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
    marginVertical: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.25,
    shadowRadius: wp(1),
    elevation: 5,
    width: '100%',
  },
  title: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  flatListContainer: {
    paddingBottom: hp(12),
  },
  optionButton: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: hp(3),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
    width: wp(45),
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.3,
    shadowRadius: wp(1),
    elevation: 5,
  },
  optionIcon: {
    marginBottom: hp(1.5),
  },
  optionText: {
    fontSize: wp(4),
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
  },
});
