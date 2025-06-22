import React, { useState } from 'react';
import LoginStack from './StackNavigation/LoginStack';
import MainStack from './StackNavigation/MainStack';


export default function RootNavigator() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return isLoggedIn ? <MainStack /> : <LoginStack onLogin={handleLogin} />;
}
