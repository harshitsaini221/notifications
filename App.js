import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Button, View, Alert, Platform } from "react-native";
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

export default function App() {
  //push notifications can be handled after pressing a button or when you navigate to a certain screen.
  //here, including when the App is getting started

  useEffect(() => {
    async function configurePushNotifications() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      //android givess sending notification permission by default

      if (Platform.OS === "ios" && finalStatus !== "granted") {
        const { status } = await Notifications.getPermissionsAsync();
        finalStatus = status;
      }

      if (Platform.OS === "ios" && finalStatus !== "granted") {
        Alert.alert(
          "Enable Notifications Permissions",
          "Need To Give Notifications Permission"
        );

        return;
      }

      const pushTokenData = await Notifications.getExpoPushTokenAsync();
      //can store the data in a DB, and then send the Push Notifications to all those Tokens
      console.log(pushTokenData);

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT, //sets Notification Priority, kindof
        });
      }
    }

    configurePushNotifications();
  }, []);

  //using useEffect for adding Event Listeners,
  //it is also recommended to use event handler remover to handle memory leaks

  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("NOTIFICATION RECEIVED");
        console.log(notification);
        const userName = notification.request.content.data.userName;
        console.log(userName);
      }
    );

    //for user responded to the notification

    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("NOTIFICATION RESPONSE RECEIVED");
        console.log(response);
        const userName = response.notification.request.content.data.userName;
        console.log(userName);
      }
    );

    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

  function scheduleNotificationHandler() {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "My first local notification",
        body: "This is the body of the notification.",
        data: { userName: "Harshit" },
      },
      trigger: {
        seconds: 5,
      },
    });
  }

  //can use https://expo.dev/notifications tool as well to test your notification

  function sendPushNotificationHandler() {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: "Your Token", //in real app, not hardcoded, fetch from DB
        title: "Test - sent from a device!",
        body: "This is a test!",
      }),
    });
  }

  return (
    <View style={styles.container}>
      <Button
        title="Schedule Local Notification"
        onPress={scheduleNotificationHandler}
      />
      <View style={styles.separtaion}></View>
      <Button
        title="Send Push Notification"
        onPress={sendPushNotificationHandler}
      />
      <StatusBar style="auto" />
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
  separtaion: {
    margin: 24,
  },
});
