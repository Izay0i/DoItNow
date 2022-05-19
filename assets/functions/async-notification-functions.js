import * as Notifications from 'expo-notifications';

export async function subscribeLocalNotificationAsync(content, trigger) {
  return await Notifications.scheduleNotificationAsync({content, trigger});
}

export async function unsubscribeLocalNotificationAsync(id) {
  return await Notifications.cancelScheduledNotificationAsync(id);
}

export async function unsubscribeAllLocalNotificationAsync() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}