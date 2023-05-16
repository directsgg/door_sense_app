import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AudioScreen from '../../scenes/audio/audio.component';
import CamaraScreen from '../../scenes/camara/camara.component';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Audio" component={AudioScreen} />
      <Tab.Screen name="Camara" component={CamaraScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home Bell" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator;
