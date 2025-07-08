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
      }
    );

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("Notification caused app to open from quit state:", remoteMessage);
        }
      });

    const unsubscribeBackground = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        console.log("Notification caused app to open from background:", remoteMessage);
      }
    );

    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
      // database().ref("/patientRecords").off("value", onValueChange);
    };
  }, []);

  return (
    <Provider store={store}>
      <RootNavigator />
      {/* <View style={{ padding: 20 }}>
        <Text allowFontScaling={false} style={{ fontSize: 20, fontWeight: "bold" }}>Items:</Text>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text allowFontScaling={false} style={{ paddingVertical: 5 }}>{item.name}</Text>
          )}
        />
      </View> */}
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