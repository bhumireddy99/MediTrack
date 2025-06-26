import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { Provider } from "react-redux";
import RootNavigator from "./navigation/RootNavigator";
import { store } from "./redux/store";

export default function Index() {
  useEffect(() => {
    requestUserPermission();

    const unsubscribeForeground = messaging().onMessage(
      async (remoteMessage) => {
        console.log("Foreground Notification:", remoteMessage);
        // Alert.alert(
        //   remoteMessage.notification?.title || "New Notification",
        //   remoteMessage.notification?.body || ""
        // );
      }
    );

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage
          );
        }
      });

    const unsubscribeBackground = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        console.log(
          "Notification caused app to open from background:",
          remoteMessage
        );
      }
    );

    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
    };
  }, []);

  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Notification permission status:", authStatus);
    const fcmToken = await messaging().getToken();
    console.log("FCM Token:", fcmToken);
  } else {
    console.log("Notification permission not granted");
  }

  messaging().onTokenRefresh((token) => {
    console.log("New FCM Token:", token);
  });
}
