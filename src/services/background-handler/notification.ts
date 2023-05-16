export const notificationTask = {
  name: 'NotificationBackgroundHandler',
  async notificationHandler(notificationData: any) {
    if (notificationData['event'] === 'my_event') {
      doSomething(notoficationData);
    }
  },
};
