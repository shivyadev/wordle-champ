import { Routes, Route } from "react-router-dom";
import HomePage from "./client/pages/HomePage";
import LoginPage from "./client/pages/LoginPage";
import RegisterPage from "./client/pages/RegisterPage";
import axios from 'axios';
import ProfilePage from "./client/pages/ProfilePage";
import { UserContextProvider } from "./UserContext";
import './App.css';
import WordlePage from "./client/pages/WordlePage";

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
        <Route path="/wordle" element={<WordlePage />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;