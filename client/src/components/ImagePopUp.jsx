import { useState } from "react";
import Icons from "./Icons";

export default function ImagePopUp({ showPopUp, setShowPopUp, name, setName, setFile }) {

    const [inputFile, setInputFile] = useState([]);

    function handleChange(ev) {
        setInputFile(ev.target.files[0]);
    }

    function handleClick() {
        setFile(inputFile);
        setShowPopUp(false);
    }

    if (showPopUp) {
        return (
            <div id="popup" className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-30 bg-gray-100">
                <div className="relative bg-white w-[40%] h-[70%] px-6 py-9 rounded-2xl shadow-2xl overflow-auto">
                    <h1 className="mb-5 font-semibold text-4xl text-left">Edit Profile</h1>
                    <div>
                        <h2 className="mt-9 font-semibold text-xl text-left">Name</h2>
                        <input id="nameInput" type="text" value={name} spellCheck={false} onChange={(ev) => setName(ev.target.value)} />
                    </div>
                    <div>
                        <h2 className="mt-7 font-semibold text-xl text-left">Upload Image</h2>
                        <input type="file" onChange={handleChange} className="w-full mt-3 py-2 font-semibold border-b-2 " />
                    </div>
                    <button onClick={handleClick} className="mt-10 px-16 py-3 font-semibold text-lg bg-gray-200 rounded-2xl hover:bg-gray-300 duration-500">
                        Save
                    </button>
                    <button onClick={() => setShowPopUp(false)} className="absolute right-0 top-0 p-2">
                        <Icons iconName={'cross'} styles="w-6 h-6" />
                    </button>
                </div>
            </div >

        );
    } else {
        return '';
    }
}