import axios from "axios";
import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

export default function ProfilePage() {

    const [redirect, setRedirect] = useState('');
    const { user, ready, setUser } = useContext(UserContext);

    if (!ready && user === null) {
        return "Loading...";
    }

    async function tokenCheck() {
        axios.post('/tokencheck');
    }

    async function logout() {
        axios.post('/logout')
        setRedirect('/');
        setUser(null);
    }

    if (redirect != '') return <Navigate to={redirect} />

    return (
        <div>
            {user?.name}
            <button onClick={logout}>Logout</button>
        </div>
    );
}