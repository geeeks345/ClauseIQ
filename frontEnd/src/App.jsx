import { BrowserRouter, Routes, Route } from "react-router-dom";

import MyContracts from "./pages/myContracts";
import Upload from "./pages/upload";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
            element={
              <ProtectedRoute>
              <Dashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/upload"
  element={
    <ProtectedRoute>
      <Upload />
    </ProtectedRoute>
  }
/>

<Route
  path="/contracts"
  element={
    <ProtectedRoute>
      <MyContracts />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
