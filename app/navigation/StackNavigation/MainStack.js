import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import HomeScreen from "../../screens/Home";
import ReminderScreen from "../../screens/Reminders";
import PrescriptionStack from "./PrescriptionStack";

const Tab = createBottomTabNavigator();

export default function MainStack() {
  const CustomTabBar = ({ state, descriptors, navigation }) => {
    // Check if we're in a nested screen that should hide the tab bar
    const currentRoute = state.routes[state.index];
    const shouldHideTabBar =
      currentRoute.name === "Prescription" &&
      currentRoute.state &&
      (currentRoute.state.routes[currentRoute.state.index]?.name ===
        "PrescriptionDetails" ||
        currentRoute.state.routes[currentRoute.state.index]?.name ===
          "PrescriptionView");

    if (shouldHideTabBar) {
      return null;
    }

    return (
      <View style={styles.tabBarContainer}>
        <LinearGradient
          colors={["#667eea", "#764ba2", "#f093fb"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            let iconName;
            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Prescription") {
              iconName = "plus-circle";
            } else if (route.name === "Reminder") {
              iconName = "bell";
            }

            return (
              <View key={route.key} style={styles.tabItem}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    isFocused && styles.activeTabButton,
                  ]}
                  onPress={onPress}
                  activeOpacity={0.7}
                >
                  <Feather
                    name={iconName}
                    size={24}
                    color={isFocused ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)"}
                    style={styles.icon}
                  />
                  <View style={styles.tabLabel}>
                    <View
                      style={[
                        styles.labelText,
                        isFocused && styles.activeTabLabel,
                      ]}
                    >
                      {label}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </LinearGradient>
      </View>
    );
  };

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Prescription" component={PrescriptionStack} />
      <Tab.Screen name="Reminder" component={ReminderScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    height: 80,
    backgroundColor: "transparent",
  },
  gradientBackground: {
    flex: 1,
    borderRadius: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    backgroundColor: "transparent",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    minWidth: 60,
  },
  activeTabButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  icon: {
    marginBottom: 4,
  },
  tabLabel: {
    alignItems: "center",
  },
  labelText: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  activeTabLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
