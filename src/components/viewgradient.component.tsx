import React from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Defs, Rect, LinearGradient, Stop} from 'react-native-svg';

const FROM_COLOR = 'rgb(2, 19, 47)';
const TO_COLOR = 'rgb(107, 162, 169)';

const ViewGradient = ({children}) => {
  return (
    <View style={style.containerViewGradient}>
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="10%" x2="0%" y2="100%">
            <Stop offset="0" stopColor={FROM_COLOR} />
            <Stop offset="1" stopColor={TO_COLOR} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grad)" />
      </Svg>
      {children}
    </View>
  );
};

const style = StyleSheet.create({
  containerViewGradient: {
    flex: 1,
  },
});

export default ViewGradient;
