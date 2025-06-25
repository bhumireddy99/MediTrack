import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserFromStorage } from "../authStore";
import { login } from "../redux/auth";
import LoginStack from "./StackNavigation/LoginStack";
import MainStack from "./StackNavigation/MainStack";

export default function RootNavigator() {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const CheckUsr = async () => {
      const storedUser = await getUserFromStorage();
      if (storedUser) {
        dispatch(login(storedUser));
      }
      setLoading(false);
    };
    CheckUsr();
  }, []);

  if (loading) return null;

  return user ? <MainStack /> : <LoginStack />;
}
