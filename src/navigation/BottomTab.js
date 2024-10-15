import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, ITRUpload, Profile } from '../screens';
import { Colors } from '../constants';
import Icon from "react-native-vector-icons/FontAwesome";
import * as Animatable from 'react-native-animatable';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: {
                    fontSize: 14,
                    paddingBottom: 5,
                    fontWeight: '700',
                    fontFamily: 'OpenSans-SemiBold',
                },

                tabBarStyle: {
                    height: 60,
                    paddingTop: 5,

                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    right: 20,
                    borderRadius: 20,
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Animatable.View
                            animation={focused ? 'bounceIn' : 'fadeIn'}
                            duration={500}
                        >
                            <Icon
                                name="home"
                                size={22}
                                color={focused ? Colors.primary : 'grey'}
                            />
                        </Animatable.View>
                    ),headerShown:false
                }}
            />
            <Tab.Screen
                name="ITRUpload"
                component={ITRUpload}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Animatable.View
                            animation={focused ? 'bounceIn' : 'fadeIn'}
                            duration={500}
                        >
                            <Icon
                                name="upload"
                                size={22}
                                color={focused ? Colors.primary : 'grey'}
                            />
                        </Animatable.View>
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Animatable.View
                            animation={focused ? 'bounceIn' : 'fadeIn'}
                            duration={500}
                        >
                            <Icon
                                name="user"
                                size={22}
                                color={focused ? Colors.primary : 'grey'}
                            />
                        </Animatable.View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default BottomTab;
