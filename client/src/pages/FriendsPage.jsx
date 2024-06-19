import { useContext, useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import DisplayProfiles from "../components/DisplayProfiles";
import { useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function FriendsPage() {
    const { axiosGET } = useContext(AuthContext);
    const { id } = useParams();
    const [result, setResult] = useState([]);

    useEffect(() => {
        const getFriends = async () => {
            const { data } = await axiosGET(`friendslist/${id}`);
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