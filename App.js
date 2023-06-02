import { StatusBar } from "expo-status-bar";
import { StyleSheet, Button, View } from "react-native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});
 
 
//// START: NEWLY ADDED FUNCTIONS ////
const allowsNotificationsAsync = async () => {
  const settings = await Notifications.getPermissionsAsync();
  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
};
 
const requestPermissionsAsync = async () => {
  return await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });
};
//// END: NEWLY ADDED FUNCTIONS ////
 
export default function App() {
  const scheduleNotificationHandler = async () => {
 
    //// START: CALL FUNCTIONS HERE ////
    const hasPushNotificationPermissionGranted =
      await allowsNotificationsAsync();
 
 
    if (!hasPushNotificationPermissionGranted) {
      await requestPermissionsAsync();
    }
    //// END: CALL FUNCTIONS HERE ////
 
    Notifications.scheduleNotificationAsync({
      content: {
        title: "My first local notification",
        body: "This is th body of the notification.",
        data: { userName: "100packabs" },
      },
      trigger: {
        seconds: 2,
      },
    });
  };
 
  return (
    <View style={styles.container}>
      <Button
        title='Schedule Notification'
        onPress={scheduleNotificationHandler}
      />
 
      <StatusBar style='auto' />
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});