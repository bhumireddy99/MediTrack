import { Provider } from "react-redux";
import RootNavigator from "./navigation/RootNavigator";
import { store } from "./redux/store";

export default function index() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
