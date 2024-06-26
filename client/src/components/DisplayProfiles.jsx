import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import PopUp from './PopUp';
import Icons from './Icons';
import { AuthContext } from '../AuthContext';
export default function DisplayProfiles({ profilesList }) {

    const { axiosCall } = useContext(AuthContext);
    const { user, setUser } = useContext(UserContext);
    const [showPopUp, setShowPopUp] = useState(false);
    const [addFriend, setAddFriend] = useState(false);
    const [friendId, setFriendId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const addFriendFunc = async () => {
            const { data } = await axiosCall('PUT', '/addfriend', {
                userId: user._id,
                friendId
            });
            setUser(data);
            setShowPopUp(false);
            setAddFriend(false);
            setFriendId(null);
        }

        if (addFriend) {
            addFriendFunc();
        } else {
            setFriendId(null);
        }
    }, [addFriend])

    function handleClick(name) {
        navigate(`/profile/${name}`);
    }

    function buttonClick(id) {
        setFriendId(id);
        setShowPopUp(true);
    }

    return (
        <div className='my-16 mx-40'>
            {profilesList?.length > 0 &&
                (<div className="grid grid-cols-4 mt-10 gap-2">
                    {
                        profilesList.map((obj, idx) => (
                            user?.name !== obj?.name && (
                                <div key={idx} className="flex flex-col items-center bg-gray-100 p-5 rounded-2xl hover:bg-gray-300 duration-500 cursor-pointer">
                                    <div onClick={() => handleClick(obj.name)} className="w-40 h-40 mb-4 rounded-full overflow-hidden">
                                        {obj?.imageUrl?.length > 0 && <img src={obj.imageUrl} className="w-full h-full object-cover" />}
                                        {obj?.imageUrl?.length <= 0 && <Icons iconName={"profile"} styles="w-full h-full bg-gray-200" />}
                                    </div>
                                    <div className="font-semibold">
                                        {obj.name}
                                    </div>
                                    {
                                        user?.friendsList?.includes(obj._id) ? <div className="mt-2 px-8 py-2 text-md text-gray-500">Already Friends</div> :
                                            <button onClick={() => buttonClick(obj._id)} className="mt-2 px-8 py-2 rounded-2xl border-2 border-black hover:bg-white duration-500">Add Friend</button>
                                    }
                                    <PopUp showPopUp={showPopUp} setShowPopUp={setShowPopUp} setAddFriend={setAddFriend} />
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