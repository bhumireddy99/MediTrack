import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../../screens/Login';

const Stack = createNativeStackNavigator();

export default function LoginStack({ onLogin }) {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" options={{ headerShown: false }}>
                {props => <LoginScreen {...props} onLogin={onLogin} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
