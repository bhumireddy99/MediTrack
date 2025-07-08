import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
    ActivityIndicator,
    Image,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const ForgotPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const validateForgotPassword = (password, confirmPassword) => {
    const errors = {};

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    return errors;
  };

  const onResetPassword = () => {
    const errors = validateForgotPassword(password, confirmPassword);
    if (Object.keys(errors).length > 0) {
      setErrors(errors); // Show errors to the user
      return;
    }
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Image
          style={styles.tinyLogo}
          source={require("../../assets/images/appIcon.png")}
        />
        <Modal transparent visible={loading} animationType="fade">
          <View style={styles.modalOverlay}>
            <ActivityIndicator size="large" color="#734BD1" />
          </View>
        </Modal>
        <Text allowFontScaling={false} style={styles.title}>Meditrack</Text>
        <Text allowFontScaling={false} style={styles.subtitle}>Patient Portal</Text>

        <Text allowFontScaling={false} style={styles.label}>Enter Password</Text>
        <View style={styles.input}>
          <TextInput
            placeholder="*****"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#aaa"
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.iconButton}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text allowFontScaling={false} style={{ color: "red" }}>{errors.password}</Text>
        )}
        <Text allowFontScaling={false} style={styles.label}>Confirm Password</Text>
        <View style={styles.input}>
          <TextInput
            placeholder="*****"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!isConfirmPasswordVisible}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            onPress={toggleConfirmPasswordVisibility}
            style={styles.iconButton}
          >
            <Ionicons
              name={isConfirmPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && (
          <Text allowFontScaling={false} style={{ color: "red" }}>{errors.confirmPassword}</Text>
        )}
        <TouchableOpacity
          onPress={() => onResetPassword()}
          style={styles.signInButton}
        >
          <Text allowFontScaling={false} style={styles.signInText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#734BD1",
    justifyContent: "center",
    padding: 20,
  },
  tinyLogo: {
    width: 150,
    height: 150,
    alignSelf: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  iconBox: {
    backgroundColor: "#734BD1",
    alignSelf: "center",
    paddingHorizontal: 15,
    paddingVertical: 7.5,
    borderRadius: 8,
    marginBottom: 10,
  },
  exclamation: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#888",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 12,
  },
  iconButton: {
    marginTop: 7,
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#999",
    marginRight: 6,
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: "#734BD1",
    borderColor: "#734BD1",
  },
  checkboxLabel: {
    color: "#333",
  },
  link: {
    color: "#734BD1",
    fontWeight: "500",
  },
  signInButton: {
    backgroundColor: "#734BD1",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  signInText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footerText: {
    textAlign: "center",
    marginTop: 20,
    color: "#444",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
