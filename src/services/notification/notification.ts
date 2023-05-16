import {Colors} from 'react-native-ui-lib';
import notifee from '@notifee/react-native';

export const onDisplayNotificationTocToc = async () => {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'toctoc',
    name: 'Toc Toc',
    sound: 'doorbellring',
  });

  // Display a notification
  await notifee.displayNotification({
    id: '1',
    title: '¡Toc Toc!',
    body: 'Alguien esta tocando la puerta',
    android: {
      channelId,
      color: Colors.$backgroundPrimaryHeavy,
      sound: 'doorbellring',
      //smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
};
