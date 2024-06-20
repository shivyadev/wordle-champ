import { useContext, useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import DisplayProfiles from "../components/DisplayProfiles";
import { Navigate, useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { UserContext } from "../UserContext";

export default function FriendsPage() {
    const { id } = useParams();
    const [result, setResult] = useState([]);
    const { axiosCall } = useContext(AuthContext);
    const { user } = useContext(UserContext);

    if (user === null) return <Navigate to="/" />;

    useEffect(() => {
        const getFriends = async () => {
            const { data } = await axiosCall('GET', `friendslist/${id}`);
            console.log(data);
            setResult(data);
        }
        getFriends();
    }, [])

    return (
        <div>
            <Navbar onPage={"wordle"} />
            <SearchBar />
            <h1 className="font-semibold text-3xl mx-40 my-16">Friends List</h1>
            <DisplayProfiles profilesList={result} />
        </div>
    );
}