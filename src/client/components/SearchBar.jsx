import { useState } from "react";
import Icons from "./Icons";
import { Navigate, useNavigate } from "react-router-dom";

export default function SearchBar() {

    const [searchValue, setSearchValue] = useState('');

    const navigate = useNavigate()

    function handleSubmit(ev) {
        ev.preventDefault();
        navigate(`/search?query=${encodeURIComponent(searchValue)}`);

    }

    return (
        <form className="w-[30%] m-auto mt-4" onSubmit={handleSubmit} >
            <div className="flex justify-center items-center bg-gray-100 rounded-2xl">
                <div>
                    <Icons iconName={'search'} styles="w-6 h-6 ml-2 cursor-pointer" />
                </div>
                <input type="text" id="searchInput" className="bg-gray-100 rounded-2xl" value={searchValue} placeholder="Search Profile" onChange={(ev) => setSearchValue(ev.target.value)} />
            </div>
        </form>
    );

}