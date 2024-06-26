import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import axios from 'axios';
import ProfilePage from "./pages/ProfilePage";
import { UserContextProvider } from "./UserContext";
import './App.css';
import WordlePage from "./pages/WordlePage";
import SearchPage from "./pages/SearchPage";
import FriendsProfilePage from "./pages/FriendsProfilePage";
import FriendsPage from "./pages/FriendsPage";
import AuthContextProvider from "./AuthContext";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <AuthContextProvider>
      <UserContextProvider>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:name" element={<FriendsProfilePage />} />
          <Route path="/friends/:name" element={<FriendsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/wordle" element={<WordlePage />} />
        </Routes>
      </UserContextProvider>
    </AuthContextProvider>
  );
}

export default App;