import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PrescriptionScreen from '../../screens/Prescription';
import PrescriptionDetails from '../../screens/PrescriptionDetails';


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
        </Stack.Navigator>
    );
};

export default PrescriptionStack;
