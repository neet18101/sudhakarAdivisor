import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ITRUpload, Profile } from '../screens'; // Ensure Profile is imported
import { Colors } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon,{ Icons } from './Icon';

const BottomTab = createMaterialBottomTabNavigator();

const TabArr = [
    { route: "Home", label: 'Home', icon: 'home', component: Home, tabBarColor: Colors.green, badge: false },
    { route: "ITR", label: 'ITR', icon: 'files-o', component: ITRUpload, tabBarColor: Colors.green, badge: false },
    { route: "Account", label: 'Account', icon: 'user-circle-o', component: Profile, tabBarColor: Colors.green, badge: false },
];

export default function Tab() {    
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <BottomTab.Navigator
                shifting={true}
                barStyle={{ height: 70 }}
            >
                {TabArr.map((tab, index) => (
                    <BottomTab.Screen
                        key={index}
                        name={tab.route}
                        component={tab.component}
                        options={{
                            tabBarLabel: tab.label,
                            tabBarColor: tab.tabBarColor,
                            tabBarIcon: ({ color }) => (
                                <Icon name={tab.icon} type="font-awesome" color={color} />
                            ),
                        }}
                    />
                ))}
            </BottomTab.Navigator>
        </SafeAreaView>
    );
}
