import { useState } from "react";
import { Navigate } from "react-router-dom";
import Icons from "./Icons";

export default function Navbar({ onPage }) {

    const [redirect, setRedirect] = useState('');

    function handleClick(route) {
        setRedirect(route);
    }

    if (redirect !== '') {
        return <Navigate to={redirect} />
    }

    return (
        <div className="fixed grid grid-rows-3 w-12 h-full bg-black top-0 left-0">
            <div className="relative rows-span-1 mt-4 cursor-default text-center">
                <div className="text-2xl text-white">
                    WC
                </div>
                <span className="absolute top-4 left-1 text-[5px] bg-gray-700 opacity-85">
                    <p className="text-white">- Wordle Champs -</p>
                </span>
            </div>
            <div className="mt-10">
                <div className="mb-4 cursor-pointer text-white hover:text-green-500" onClick={() => handleClick('/')}>
                    <Icons iconName={'home'} styles={'m-auto w-6 h-6 duration-300'} />
                </div>
                {onPage === 'wordle' && (
                    <div className="my-5 cursor-pointer text-white hover:text-green-500" onClick={() => handleClick('/profile')}>
                        <Icons iconName={'profile'} styles={'m-auto w-6 h-6 duration-300'} />
                    </div>
                )}
                {onPage === 'profile' && (
                    <div className="my-5 cursor-pointer text-white hover:text-green-500" onClick={() => handleClick('/wordle')}>
                        <Icons iconName={'play'} styles={'m-auto w-6 h-6 duration-300'} />
                    </div>
                )}
            </div>
        </div>
    );
}