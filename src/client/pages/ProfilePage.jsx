import axios from "axios";
import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
import img from '../../images/image1.jpg';
import DisplayWordle from "../components/DisplayWordle";
import FullWordleDisplay from "../components/FullWordleDisplay";

export default function ProfilePage() {

    const [redirect, setRedirect] = useState('');
    const { user, ready, setUser } = useContext(UserContext);
    const [selectedWordleIndex, setSelectedWordleIndex] = useState(null);
    const [displayFullWindow, setDisplayFullWindow] = useState(false);

    if (!ready && user === null) {
        return "Loading...";
    }

    function handleClick(idx) {
        setSelectedWordleIndex(idx);
        setDisplayFullWindow(true);
    }

    async function logout() {
        axios.post('/logout')
        setRedirect('/');
        setUser(null);
    }

    const wordleWords = [
        ['h', 'e', 'l', 'l', 'o'],
        ['f', 'a', 'r', 'm', 's'],
        ['t', 'e', 'e', 't', 'h'],
        ['f', 'e', 't', 'c', 'h'],
        ['t', 'e', 'a', 'c', 'h']
    ];

    const wordleWords2 = [
        ['h', 'e', 'l', 'l', 'o'],
        ['f', 'a', 'r', 'm', 's'],
        ['t', 'e', 'e', 't', 'h'],
        ['f', 'e', 'a', 's', 't'],
        ['t', 'e', 'a', 'c', 'h']
    ];

    const wordleArr = [
        wordleWords,
        wordleWords2,
        wordleWords,
        wordleWords
    ]

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
            <div className="grid grid-cols-7 mx-10 my-[4%]">
                <div className="flex flex-col col-span-3 items-center">
                    <div className="text-center">
                        <div className="mt-10 w-52 h-52 rounded-full overflow-hidden">
                            <img src={img} className="object-cover w-full h-full" />
                        </div>
                        <div className="mt-5 text-lg font-semibold">{user?.name}</div>
                    </div>
                    <div className="mt-5 border-2">
                        <div className="flex items-center gap-2 py-6 pl-6 pr-40 text-left">
                            Edit Profile
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </div>
                        <div className="flex gap-2 py-6 pl-6 pr-40">
                            Friends List
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                        <div className="py-6 pl-6 pr-40 text-left">
                            Logout
                        </div>
                    </div>
                </div>
                <div className="col-span-4">
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
                            <div className="relative grid grid-cols-2 gap-5">
                                {
                                    wordleArr.map((val, i) => (
                                        <div className="m-auto" onClick={() => handleClick(i)}>
                                            <DisplayWordle key={i} wordleWords={val} targetWord={"teach"} />
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