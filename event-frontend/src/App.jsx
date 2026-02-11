import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import EventsList from "./pages/EventsList/EventsList";
import EventDetail from "./pages/EventDetail/EventDetail";
import CreateEvent from "./pages/CreateEvent/CreateEvent";
import EditEvent from "./pages/EditEvent/EditEvent";
import MyEvents from "./pages/MyEvents/MyEvents";
import Profile from "./pages/Profile/Profile"; // ✅ ajout de la page profil
import NotFound from "./pages/NotFound/NotFound";

import "./App.scss";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<EventsList />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/events/:id" element={<EventDetail />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/events/new"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/events/:id/edit"
            element={
              <ProtectedRoute>
                <EditEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-events"
            element={
              <ProtectedRoute>
                <MyEvents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
