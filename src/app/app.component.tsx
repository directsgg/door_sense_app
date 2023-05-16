import React from 'react';
import 'react-native-gesture-handler';
//import AppNavigator from '../navigation/user/home.navigator';
import HomeScreen from '../scenes/home/home';
import {Colors} from 'react-native-ui-lib';
Colors.loadColors({
  $backgroundPrimaryMedium: '#7CB3BA',
  $backgroundPrimaryHeavy: '#6BA2A9',
});
export default () => (
  <>
    <HomeScreen />
  </>
);
