import axios from "axios";
import { useContext, useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import DisplayProfiles from "../components/DisplayProfiles";
import { UserContext } from "../UserContext";
import { useParams } from "react-router-dom";

export default function FriendsPage() {

    const { id } = useParams();
    const [result, setResult] = useState([]);

    useEffect(() => {
        axios.get(`friendslist/${id}`).then(response => {
            const { data } = response;
            console.log(data);
            setResult(data);
        })
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