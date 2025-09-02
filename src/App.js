import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store"; // ✅ only this
import { PersistGate } from "redux-persist/integration/react"; // ✅ import

function App() {
  return (
    <Router>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppRoutes />
          <ToastContainer />
        </PersistGate>
      </Provider>
    </Router>
  );
}

export default App;
