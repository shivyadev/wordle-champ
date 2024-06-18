import { Routes, Route } from "react-router-dom";
import HomePage from "./client/pages/HomePage";
import LoginPage from "./client/pages/LoginPage";
import RegisterPage from "./client/pages/RegisterPage";
import axios from 'axios';
import ProfilePage from "./client/pages/ProfilePage";
import { UserContextProvider } from "./UserContext";
import './App.css';
import WordlePage from "./client/pages/WordlePage";
import SearchPage from "./client/pages/SearchPage";
import FriendsProfilePage from "./client/pages/FriendsProfilePage";
import FriendsPage from "./client/pages/FriendsPage";
import { AuthContextProvider } from "./AuthContext";

axios.defaults.baseURL = 'http://localhost:5000';
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
          <Route path="/profile/:id" element={<FriendsProfilePage />} />
          <Route path="/friends/:id" element={<FriendsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/wordle" element={<WordlePage />} />
        </Routes>
      </UserContextProvider>
    </AuthContextProvider>
  );
}

export default App;