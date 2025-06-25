import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "LOGGED_IN_USER";

export const saveUserToStorage = async (user) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("Failed to save user:", e);
  }
};

export const getUserFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Failed to load user:", e);
    return null;
  }
};

export const clearUserFromStorage = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error("Failed to clear user:", e);
  }
};
