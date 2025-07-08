import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PrescriptionScreen from '../../screens/Prescription';
import PrescriptionDetails from '../../screens/PrescriptionDetails';
import PrescriptionView from '../../screens/PrescriptionView';

const Stack = createNativeStackNavigator();

const PrescriptionStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Prescription"
                component={PrescriptionScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PrescriptionDetails"
                component={PrescriptionDetails}
                options={{ title: 'Details' }}
            />
            <Stack.Screen
                name="PrescriptionView"
                component={PrescriptionView}
                options={{ title: 'View' }}
            />
        </Stack.Navigator>
    );
};

export default PrescriptionStack;
