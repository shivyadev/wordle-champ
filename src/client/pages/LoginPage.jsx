import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
    const [selected, setSelected] = useState(false);
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    let labelStyles = "absolute top-8 left-2 text-gray-500 text-sm transition-all";

    function handleSelect(ev) {
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
            <form className="p-5 w-96 bg-white rounded-md shadow-sm shadow-black">
                <div className="flex justify-center items-center m-5 mb-10">
                    <h2 className="text-lg">Sign in to continue to Profile</h2>
                </div>
                <div className="relative my-5">
                    <div className="flex justify-end mb-2">
                        <button className="text-xs text-primary">Forgot email?</button>
                    </div>
                    <label className={labelStyles} for={"mail"}>Email</label>
                    <div className="absolute top-8 right-1 text-gray-400 text-sm">@gmail.com</div>
                    <input onSelect={handleSelect} type="text" id={"mail"} value={mail} onChange={(ev) => setMail(ev.target.value)} autoComplete="off" />
                </div>
                <div className="relative my-5">
                    <div className="flex justify-end mb-2">
                        <button className="text-xs text-primary">Forgot password?</button>
                    </div>
                    <label className={labelStyles} for={"password"}>Password</label>
                    <input onSelect={handleSelect} type="password" id={"password"} value={password} onChange={(ev) => setPassword(ev.target.value)} autoComplete="off" />
                </div>
                <div className="flex justify-between">
                    <Link to={"/register"} className="mt-10 py-2 pl-1 text-primary text-sm font-semibold cursor-pointer">Create account</Link>
                    <button className="mt-10 px-8 py-2 bg-primary rounded-md text-white">Login</button>
                </div>
            </form>
        </div>
    );
}