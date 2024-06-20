import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import DisplayProfiles from "../components/DisplayProfiles";
import { AuthContext } from "../AuthContext";
import { UserContext } from "../UserContext";

export default function SearchPage() {

    const { axiosCall } = useContext(AuthContext);
    const { user } = useContext(UserContext);
    const [result, setResult] = useState([]);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchValue = searchParams.get('query');

    if (user === null) return <Navigate to='/' />

    useEffect(() => {
        const getSearchResult = async () => {
            const { data } = await axiosCall('GET', `/search?name=${encodeURIComponent(searchValue)}`);
            setResult(data);
        }
        getSearchResult();
    }, [searchValue]);

    return (
        <div>
            <Navbar onPage={"wordle"} />
            <SearchBar />
            <h1 className="font-semibold text-3xl mx-40 my-16">Search Result</h1>
            <DisplayProfiles profilesList={result} />
        </div>
    );
}