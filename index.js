/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';
//import {notificationTask} from './src/services/background-handler/notification';

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;
  // check if the user pressed action default
  if (type === EventType.ACTION_PRESS && pressAction.id === 'default') {
    // remove the notification
    await notifee.cancelNotification(notification.id);
  }
});

/*AppRegistry.registerHeadlessTask('setIntervalTask', () =>
  require('setIntervalTask.js'),
);*/
/*const disconnectTask = () => async () => {
  if (connectionIsActive) {
    user.goOffline();
  }
};*/

//AppRegistry.registerHeadlessTask('disconnect', disconnectTask);

const LogLocation = async data => {
  console.log('position.coords');
  /*navigator.geolocation.getCurrentPosition(position => {
    console.log(position.coords);
  });*/
};
AppRegistry.registerHeadlessTask('LogLocation', () => LogLocation);
AppRegistry.registerComponent(appName, () => App);
