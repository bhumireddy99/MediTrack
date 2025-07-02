import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { saveUserToStorage } from "../authStore";
import { login } from "../redux/auth";

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validateLogin = (email, password) => {
    const errors = {};

    if (!email) {
      errors.email = "Email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = "Please enter a valid email address.";
      }
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    return errors;
  };

  const loginButtonPressed = async () => {
    setLoading(true);
    const validationErrors = validateLogin(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
    if (
      email.toLowerCase() === "bhumika@gmail.com" &&
      password === "123456"
    ) {
      const user = { email };
      dispatch(login(user));
      await saveUserToStorage(user);
      onLogin();
    } else {
      setErrors({ email: "User not found or password incorrect" });
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Image
          style={styles.tinyLogo}
          source={require("../../assets/images/app.png")}
        />
        <Text style={styles.title}>Meditrack</Text>
        <Text style={styles.subtitle}>Patient Portal</Text>

        <Text style={styles.label}>Mobile Number / Email</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter mobile or email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#aaa"
        />
        {errors.email && <Text style={{ color: "red" }}>{errors.email}</Text>}
        <Text style={styles.label}>Password</Text>
        <View style={styles.textInput}>
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
          <Text style={{ color: "red" }}>{errors.password}</Text>
        )}
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.link}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => loginButtonPressed()}
          style={styles.signInButton}
        >
          <Text style={styles.signInText}>
            {loading ? "Logging in..." : "Sign in"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

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
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  iconButton: {
    marginTop: 7,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 12,
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
