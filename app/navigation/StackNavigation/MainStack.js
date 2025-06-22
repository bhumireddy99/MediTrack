import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../../screens/Home';
import PrescriptionScreen from '../../screens/Prescription';
import ReminderScreen from '../../screens/Reminders';

const Tab = createBottomTabNavigator();

export default function MainStack() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = 'home-outline';
                    } else if (route.name === 'Prescription') {
                        iconName = 'add-circle-outline';
                    } else if (route.name === 'Reminder') {
                        iconName = 'notifications-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Prescription" component={PrescriptionScreen} />
            <Tab.Screen name="Reminder" component={ReminderScreen} />
        </Tab.Navigator>
    );
}
