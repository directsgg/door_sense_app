//import React from 'react';
import {ToastAndroid} from 'react-native';

export const showToastShort = (message: string) => {
  ToastAndroid.show(message, ToastAndroid.SHORT);
};
export const showToastLong = (message: string) => {
  ToastAndroid.show(message, ToastAndroid.LONG);
};
