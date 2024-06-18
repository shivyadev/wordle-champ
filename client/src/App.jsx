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

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

function App() {
  return (
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
  );
}

export default App;