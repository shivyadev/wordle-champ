import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import DisplayProfiles from "../components/DisplayProfiles";

export default function SearchPage() {

    const [result, setResult] = useState([]);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchValue = searchParams.get('query');

    useEffect(() => {
        axios.get(`/search?name=${encodeURIComponent(searchValue)}`).then(response => {
            const { data } = response;
            setResult(data);
        })

    }, [searchValue]);

    return (
        <div>
            <Navbar onPage={"wordle"} />
            <SearchBar />
            <DisplayProfiles profilesList={result} />
        </div>
    );
}