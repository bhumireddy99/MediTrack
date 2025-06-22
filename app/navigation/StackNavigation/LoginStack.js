import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPasswordScreen from "../../screens/ForgotPassword";
import LoginScreen from "../../screens/Login";
const Stack = createNativeStackNavigator();

export default function LoginStack({ onLogin }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" options={{ headerShown: false }}>
        {(props) => <LoginScreen {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
