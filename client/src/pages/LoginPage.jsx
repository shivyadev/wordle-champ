import { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from 'axios';
import { UserContext } from "../UserContext";
import { AuthContext } from "../AuthContext";

export default function LoginPage() {
    const [selected, setSelected] = useState(false);
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const { user } = useContext(UserContext);
    const { token, setToken } = useContext(AuthContext);
    let labelStyles = "absolute top-8 left-2 text-gray-500 text-sm transition-all";

    if (token && user !== null) return <Navigate to='/profile' />

    async function handleSubmit(ev) {
        ev.preventDefault();
        try {
            const { data } = await axios.post('/login', {
                mail,
                password,
            })

            if (data) {
                setToken(data);
                console.log('Token set');
                setLoggedIn(true);
            }

        } catch (err) {
            console.error(err);
        }
    }

    if (loggedIn) return <Navigate to="/profile" />

    function handleSelect() {
        if (mail.length > 0 || password.length > 0) {
            setSelected(true);
        } else {
            setSelected(false);
        }
    }

    if (selected) {
        labelStyles = "absolute top-1 left-2 text-gray-400 text-xs transition-all"
    }

    return (
        <div className="flex justify-center items-center w-screen h-screen bg-primary">
            <form onSubmit={handleSubmit} className="p-5 w-96 bg-white rounded-md shadow-sm shadow-black">
                <div className="flex justify-center items-center m-5 mb-10">
                    <h2 className="text-lg">Sign in to continue to Profile</h2>
                </div>
                <section className="relative my-5">
                    <div className="flex justify-end mb-2">
                        <button className="text-xs text-primary">Forgot email?</button>
                    </div>
                    <label className={labelStyles} htmlFor={"mail"}>Email</label>
                    <div className="absolute top-8 right-1 text-gray-400 text-sm">@gmail.com</div>
                    <input onSelect={handleSelect} type="text" id={"mail"} value={mail} onChange={(ev) => setMail(ev.target.value)} autoComplete="off" />
                </section>
                <section className="relative my-5">
                    <div className="flex justify-end mb-2">
                        <button className="text-xs text-primary">Forgot password?</button>
                    </div>
                    <label className={labelStyles} htmlFor={"password"}>Password</label>
                    <input onSelect={handleSelect} type="password" id={"password"} value={password} onChange={(ev) => setPassword(ev.target.value)} autoComplete="off" />
                </section>
                <section className="flex justify-between">
                    <Link to={"/register"} className="mt-10 py-2 pl-1 text-primary text-sm font-semibold cursor-pointer">Create account</Link>
                    <button className="mt-10 px-8 py-2 bg-primary rounded-md text-white">Login</button>
                </section>
            </form>
        </div>
    );
}