import axios from "axios";
import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
import img from '../../images/image1.jpg';

export default function ProfilePage() {

    const [redirect, setRedirect] = useState('');
    const { user, ready, setUser } = useContext(UserContext);

    if (!ready && user === null) {
        return "Loading...";
    }

    async function logout() {
        axios.post('/logout')
        setRedirect('/');
        setUser(null);
    }

    if (redirect != '') return <Navigate to={redirect} />

    return (
        <div>
            <div className="fixed top-5 left-5">
                <button className="bg-red-400 p-1 rounded-full" onClick={logout}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="grid grid-cols-3 mx-10 my-[4%]">
                <div className="flex flex-col col-span-1 items-center">
                    <div className="fixed text-center">
                        <div className="mt-10 w-52 h-52 rounded-full overflow-hidden">
                            <img src={img} className="object-cover w-full h-full" />
                        </div>
                        <div className="mt-5 text-lg font-semibold">{user?.name}</div>
                        <button className="mt-5 p-1 px-8 rounded-xl text-gray-200 font-semibold text-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-800 hover:to-green-600">Play</button>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="p-8 border-b-[3px] border-gray-200 shadow-lg">
                        <h1 className="text-3xl font-semibold mb-6">Player Stats</h1>
                        <ul>
                            <li>Number of games played: </li>
                            <li>Number of games completed: </li>
                            <li>Success Rate: </li>
                        </ul>
                    </div>
                    <div>
                        <div className="mt-2 p-8 border-b-[3px] border-gray-200 shadow-lg">
                            <h1 className="text-3xl font-semibold mb-10">Previous Games</h1>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="w-56 h-56 border-2 m-auto">Box</div>
                                <div className="w-56 h-56 border-2 m-auto">Box</div>
                                <div className="w-56 h-56 border-2 m-auto">Box</div>
                                <div className="w-56 h-56 border-2 m-auto">Box</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}