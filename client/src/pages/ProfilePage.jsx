import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import DisplayWordle from "../components/DisplayWordle";
import FullWordleDisplay from "../components/FullWordleDisplay";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import Icons from "../components/Icons";
import FriendsList from "../components/FriendsList";
import AddImage from "../components/AddImage";
import { AuthContext } from "../AuthContext";

export default function ProfilePage() {

    const { setToken, axiosGET } = useContext(AuthContext);
    const { user, ready, setUser } = useContext(UserContext);
    const [selectedWordleIndex, setSelectedWordleIndex] = useState(null);
    const [displayFullWindow, setDisplayFullWindow] = useState(false);
    const [gameHistory, setGameHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showFriendList, setShowFriendList] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) return;

        const getGameRecords = async () => {
            const { data } = await axiosGET(`/gamerecord/${user?._id}`);
            setGameHistory(data[0]);
            setUser(data[1]);
            setLoading(false);
        }

        getGameRecords();
    }, []);

    function handleClick(idx) {
        setSelectedWordleIndex(idx);
        setDisplayFullWindow(true);
    }

    async function logout() {
        await axios.post('/logout');
        setUser(null);
        setToken(undefined);
        navigate('/');
    }


    if (!ready && user === null) {
        if (user === null) {
            return < Navigate to={'/login'} />
        }
        return "Loading...";
    }

    return (
        <div>
            <Navbar onPage={'profile'} />
            <SearchBar />
            <div className="grid grid-cols-7 mx-10 my-[4%]">
                <div className="flex flex-col col-span-3 items-center">
                    <div className="relative text-center">
                        <AddImage imageUrl={user?.imageUrl} username={user?.name} />
                        {user?.imageUrl?.length > 0 &&
                            (<div className="mt-10 w-52 h-52 rounded-full overflow-hidden">
                                <img src={user?.imageUrl} className="object-cover w-full h-full" />
                            </div>)}
                        {user?.imageUrl?.length <= 0 && (
                            <div className="bg-gray-200 rounded-full">
                                <Icons iconName={"profile"} styles="w-52 h-52" />
                            </div>
                        )}
                        <div className="mt-5 text-lg font-semibold">{user?.name}</div>
                    </div>
                    <div className="mt-5 border-[1px] shadow-xl cursor-pointer">
                        <div onClick={() => setShowFriendList(!showFriendList)} className="flex justify-between items-center gap-2 w-80 h-[4.5rem] border-b-2 hover:bg-slate-200 duration-700">
                            <div className="flex gap-2 pl-4">
                                Friends List
                                <Icons iconName={"friendProfile"} />
                            </div>
                            <div className="pr-4">
                                {showFriendList && <Icons iconName={"sideArrow"} styles="w-6 h-6 rotate-90" />}
                                {!showFriendList && <Icons iconName={"sideArrow"} />}
                            </div>
                        </div>
                        {showFriendList && <FriendsList profile={user} />}
                        <div className="flex justify-between items-center gap-2 w-80 h-[4.5rem] border-t-2 hover:bg-slate-200 duration-700" onClick={logout}>
                            <div className="flex gap-2 pl-4">
                                Logout
                                <Icons iconName={"exit"} styles="w-6 h-6 rotate-180" />
                            </div>
                            <div className="pr-4">
                                <Icons iconName={"sideArrow"} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-4">
                    <div className="p-8 border-b-[3px] border-gray-200 shadow-lg">
                        <h1 className="text-3xl font-semibold mb-6">Player Stats</h1>
                        <ul>
                            <li>Number of games played: {user?.gamesCompleted}</li>
                            <li>Number of games won: {user?.gamesWon}</li>
                            <li>Success Rate: {user.gamesCompleted !== 0 ? ((user?.gamesWon / user?.gamesCompleted).toFixed(2) * 100) : 0}%</li>
                        </ul>
                    </div>
                    <div>
                        <div className="mt-2 p-8 border-b-[3px] border-gray-200 shadow-lg">
                            <h1 className="text-3xl font-semibold mb-10">Previous Games</h1>
                            <div className="relative grid grid-cols-2 gap-5">
                                {
                                    !loading && gameHistory?.map((obj, idx) => (
                                        <div key={idx} className="m-auto" onClick={() => handleClick(idx)}>
                                            <DisplayWordle wordleWords={obj.gameRecord} targetWord={obj.word} />
                                        </div>
                                    ))
                                }

                                {displayFullWindow && selectedWordleIndex !== null && (
                                    <div className="full-window">
                                        <FullWordleDisplay val={gameHistory[selectedWordleIndex].gameRecord} targetWord={gameHistory[selectedWordleIndex].word} setDisplayFullWindow={setDisplayFullWindow} />
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