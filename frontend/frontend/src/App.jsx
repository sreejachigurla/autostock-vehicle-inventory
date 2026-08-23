
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ==============================
// AUTH
// ==============================
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// ==============================
// ADMIN
// ==============================
import AdminDashboard from "./pages/AdminDashboard";
import Vehicles from "./pages/Vehicles";
import AddVehicle from "./pages/AddVehicle";
import Restock from "./pages/Restock";
import Users from "./pages/Users";
import Reports from "./pages/Reports";

// ==============================
// USER
// ==============================
import UserDashboard from "./pages/UserDashboard";
import UserVehicles from "./pages/UserVehicles";
import MyVehicles from "./pages/MyVehicles";
import PurchaseHistory from "./pages/PurchaseHistory";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =================================
            LOGIN
        ================================= */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =================================
            REGISTER
        ================================= */}

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =================================
            ADMIN DASHBOARD
        ================================= */}

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />


        {/* =================================
            ADMIN VEHICLES
        ================================= */}

        <Route
          path="/vehicles"
          element={<Vehicles />}
        />


        {/* =================================
            ADD VEHICLE
        ================================= */}

        <Route
          path="/add-vehicle"
          element={<AddVehicle />}
        />


        {/* =================================
            RESTOCK
        ================================= */}

        <Route
          path="/restock"
          element={<Restock />}
        />


        {/* =================================
            USERS
        ================================= */}

        <Route
          path="/users"
          element={<Users />}
        />


        {/* =================================
            REPORTS
        ================================= */}

        <Route
          path="/reports"
          element={<Reports />}
        />


        {/* =================================
            USER DASHBOARD
        ================================= */}

        <Route
          path="/user-dashboard"
          element={<UserDashboard />}
        />

        <Route
          path="/dashboard"
          element={<UserDashboard />}
        />


        {/* =================================
            USER AVAILABLE VEHICLES
        ================================= */}

        <Route
          path="/user-vehicles"
          element={<UserVehicles />}
        />


        {/* =================================
            USER PURCHASED VEHICLES
        ================================= */}

        <Route
          path="/my-vehicles"
          element={<MyVehicles />}
        />


        {/* =================================
            USER PURCHASE HISTORY
        ================================= */}

        <Route
          path="/purchase-history"
          element={<PurchaseHistory />}
        />


        {/* =================================
            USER PROFILE
        ================================= */}

        <Route
          path="/profile"
          element={<Profile />}
        />


        {/* =================================
            UNKNOWN URL
        ================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;

