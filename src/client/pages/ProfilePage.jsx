import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
import img from '../../images/image1.jpg';
import DisplayWordle from "../components/DisplayWordle";
import FullWordleDisplay from "../components/FullWordleDisplay";
import Navbar from "../components/Navbar";

export default function ProfilePage() {

    const [redirect, setRedirect] = useState('');
    const { user, ready, setUser } = useContext(UserContext);
    const [selectedWordleIndex, setSelectedWordleIndex] = useState(null);
    const [displayFullWindow, setDisplayFullWindow] = useState(false);
    const [gameRecord, setGameRecord] = useState(null);

    useEffect(() => {
        axios.get(`/gamerecord/${user._id}`).then(response => {
            const { data } = response;
            console.log(data);
            setGameRecord(data);
        })
    }, []);

    function handleClick(idx) {
        setSelectedWordleIndex(idx);
        setDisplayFullWindow(true);
    }

    function logout() {
        axios.post('/logout')
        setRedirect('/');
        setUser(null);
    }

    const wordleArr = [];

    if (redirect !== '') return <Navigate to={redirect} />

    if (!ready && user === null) {

        if (user === null) {
            return < Navigate to={'/login'} />
        }

        return "Loading...";
    }

    return (
        <div>
            <Navbar onPage={'profile'} />
            <form className="w-[30%] m-auto mt-2">
                <input type="text" id="searchInput" className="text-center bg-gray-50 rounded-2xl" placeholder="Search Profile" />
            </form>
            <div className="grid grid-cols-7 mx-10 my-[4%]">
                <div className="flex flex-col col-span-3 items-center">
                    <div className="text-center">
                        <div className="mt-10 w-52 h-52 rounded-full overflow-hidden">
                            <img src={img} className="object-cover w-full h-full" />
                        </div>
                        <div className="mt-5 text-lg font-semibold">{user?.name}</div>
                    </div>
                    <div className="mt-5 border-[1px] shadow-xl cursor-pointer">
                        <div className="flex justify-between items-center gap-2 w-80 h-[4.5rem] border-b-2 hover:bg-slate-200 duration-700">
                            <div className="flex gap-2 pl-4">
                                Edit Profile
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </div>
                            <div className="pr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex justify-between items-center gap-2 w-80 h-[4.5rem] border-b-2 hover:bg-slate-200 duration-700">
                            <div className="flex gap-2 pl-4">
                                Friends List
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                            </div>
                            <div className="pr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex justify-between items-center gap-2 w-80 h-[4.5rem] hover:bg-slate-200 duration-700" onClick={logout}>
                            <div className="flex gap-2 pl-4">
                                Logout
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 rotate-180">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                </svg>
                            </div>
                            <div className="pr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-4">
                    <div className="p-8 border-b-[3px] border-gray-200 shadow-lg">
                        <h1 className="text-3xl font-semibold mb-6">Player Stats</h1>
                        <ul>
                            <li>Number of games played: {gameRecord?.gamesCompleted}</li>
                            <li>Number of games completed: {gameRecord?.gamesWon}</li>
                            <li>Success Rate: {(gameRecord?.gamesWon / gameRecord?.gamesCompleted).toFixed(2) * 100}%</li>
                        </ul>
                    </div>
                    <div>
                        <div className="mt-2 p-8 border-b-[3px] border-gray-200 shadow-lg">
                            <h1 className="text-3xl font-semibold mb-10">Previous Games</h1>
                            <div className="relative grid grid-cols-2 gap-5">
                                {
                                    wordleArr.map((val, i) => (
                                        <div key={i} className="m-auto" onClick={() => handleClick(i)}>
                                            <DisplayWordle wordleWords={val} targetWord={"teach"} />
                                        </div>
                                    ))
                                }

                                {displayFullWindow && selectedWordleIndex !== null && (
                                    <div className="full-window">
                                        <FullWordleDisplay val={wordleArr[selectedWordleIndex]} targetWord={"teach"} setDisplayFullWindow={setDisplayFullWindow} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}