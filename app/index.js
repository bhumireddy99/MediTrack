import messaging from "@react-native-firebase/messaging";
import * as Notifications from 'expo-notifications';
import { useEffect } from "react";
import { Provider } from "react-redux";
import RootNavigator from "./navigation/RootNavigator";
import { store } from "./redux/store";

export default function Index() {
  useEffect(() => {
    const initializeFCM = async () => {
      await requestUserPermission();

      try {
        await messaging().subscribeToTopic("allUsers");
        console.log("Subscribed to topic: allUsers");
      } catch (error) {
        console.error("Failed to subscribe to topic:", error);
      }

      const unsubscribeForeground = messaging().onMessage(
        async (remoteMessage) => {
          console.log("Foreground Notification:", remoteMessage);
        }
      );

      const unsubscribeBackground = messaging().onNotificationOpenedApp(
        (remoteMessage) => {
          console.log(
            "Notification caused app to open from background:",
            remoteMessage
          );
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

      return () => {
        unsubscribeForeground();
        unsubscribeBackground();
      };
    };

    initializeFCM();
  }, []);

  useEffect(() => {
  Notifications.getExpoPushTokenAsync().then(token => {
    console.log("Expo Push Token:", token.data);
  });
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
