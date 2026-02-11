import * as Notifications from "expo-notifications";

const SYNC_NOTIFICATION_ID = "category-sync-notification";

export async function requestNotificationPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === "granted";
}

export async function showSyncNotification(progress: number, total: number, titleOverride?: string) {
  const isFinished = progress === total;
  const title = titleOverride || (isFinished ? "Categories synced successfully" : "Syncing categories...");
  const body = `Synced ${progress} of ${total} categories`;

  await Notifications.scheduleNotificationAsync({
    identifier: SYNC_NOTIFICATION_ID,
    content: {
      title,
      body,
      sticky: !isFinished,
      autoDismiss: isFinished,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null,
  });
}

export async function showSyncErrorNotification(message: string) {
  await Notifications.scheduleNotificationAsync({
    identifier: SYNC_NOTIFICATION_ID,
    content: {
      title: "Failed to sync categories",
      body: message,
      sticky: false,
      autoDismiss: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null,
  });
}

export async function dismissSyncNotification() {
  await Notifications.dismissNotificationAsync(SYNC_NOTIFICATION_ID);
}
