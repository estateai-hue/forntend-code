import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "../src/routes";
import React from "react";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// ✅ FIX marker once only
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function App() {
  return (
    <React.StrictMode>
     <BrowserRouter>
       <AuthProvider>
             <AppRoutes />
       </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
  );
}

export default App;