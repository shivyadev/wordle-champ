import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function HomePage() {
    const [toLogin, setToLogin] = useState(false);

    if (toLogin) {
        return <Navigate to={"/login"} />
    }

    return (
        <button onClick={() => setToLogin(true)} className="m-3 p-3 border border-black">Login</button>
    );
}