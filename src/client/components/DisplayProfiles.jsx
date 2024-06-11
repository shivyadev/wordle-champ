import { useContext, useEffect, useState } from 'react';
import img from '../../images/image1.jpg';
import { UserContext } from '../../UserContext';
import { Navigate } from 'react-router-dom';
export default function DisplayProfiles({ profilesList }) {

    const { user } = useContext(UserContext);
    const [redirect, setRedirect] = useState("");

    if (redirect !== '') return <Navigate to={redirect} />

    return (
        <div className='my-16 mx-40'>
            <h1 className="font-semibold text-3xl ml-1">Search Result</h1>
            {profilesList.length > 0 &&
                (<div className="grid grid-cols-4 mt-10 gap-2">
                    {
                        profilesList.map((obj, idx) => (
                            user.name !== obj.name && (
                                <div className="flex flex-col items-center bg-gray-100 p-5 rounded-2xl hover:bg-gray-300 duration-500 cursor-pointer">
                                    <div className="w-40 h-40 mb-4 rounded-full overflow-hidden">
                                        <img src={img} className="object-cover w-full h-full" />
                                    </div>
                                    <div className="font-semibold first-letter:uppercase">
                                        {obj.name}
                                    </div>
                                    <button className="mt-2 px-8 py-2 rounded-2xl border-2 border-black hover:bg-white duration-500">Add Friend</button>
                                </div>
                            )
                        ))
                    }
                </div>)}
            {profilesList.length <= 0 && (
                <div className="flex justify-center items-center h-72">
                    <div className="text-2xl font-semibold text-gray-300">
                        No users found
                    </div>
                </div>
            )}
        </div>
    );
}