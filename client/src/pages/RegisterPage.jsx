import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function RegisterPage() {
    const [selected, setSelected] = useState(false);
    const [name, setName] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [signedUp, setSignedUp] = useState(false);
    const { user, setUser } = useContext(UserContext);
    let labelStyles = "absolute top-2 left-2 text-gray-500 text-sm transition-all";

    if (user != null) return <Navigate to='/profile' />

    async function handleSubmit(ev) {
        ev.preventDefault();
        try {
            const { data } = await axios.post('/register', {
                name,
                mail,
                password,
            })

            if (data) {
                setSignedUp(true);
                setUser(data);
            }
        } catch (err) {
            console.error(err);
        }
    }

    if (signedUp) return <Navigate to={'/login'} />

    function handleSelect() {
        if (name.length > 0 || mail.length > 0 || password.length > 0) {
            setSelected(true);
        } else {
            setSelected(false);
        }
    }

    if (selected) {
        labelStyles = "absolute -top-4 left-2 text-gray-400 text-xs transition-all";
    }

    return (
        <div className="flex justify-center items-center w-screen h-screen bg-primary">
            <form onSubmit={handleSubmit} className="p-5 w-96 bg-white rounded-md shadow-sm shadow-black">
                <section className="flex justify-center items-center m-5 mb-10">
                    <h2 className="text-lg">Sign up</h2>
                </section>
                <section className="relative my-7">
                    <label className={labelStyles} htmlFor={"name"}>Username</label>
                    <input onSelect={handleSelect} type="text" id={"name"} value={name} onChange={(ev) => setName(ev.target.value)} autoComplete="off" />
                </section>
                <section className="relative my-7">
                    <label className={labelStyles} htmlFor={"mail"}>Email</label>
                    <div className="absolute top-2 right-1 text-gray-400 text-sm">@gmail.com</div>
                    <input onSelect={handleSelect} type="text" id={"mail"} value={mail} onChange={(ev) => setMail(ev.target.value)} autoComplete="off" />
                </section>
                <section className="relative my-7">
                    <label className={labelStyles} htmlFor={"password"}>Password</label>
                    <input onSelect={handleSelect} type="password" id={"password"} value={password} onChange={(ev) => setPassword(ev.target.value)} autoComplete="off" />
                </section>
                <section className="flex justify-between">
                    <Link to={"/login"} className="mt-11 py-2 pl-1 text-primary text-sm font-semibold cursor-pointer">Sign in</Link>
                    <button className="mt-10 px-8 py-2 bg-primary rounded-md text-white">Register</button>
                </section>
            </form>
        </div>
    );
}