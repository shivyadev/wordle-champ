import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
import Icons from "./Icons";

export default function FriendsList({ profile }) {

    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [friendsInfo, setFriendsInfo] = useState([]);

    useEffect(() => {
        axios.get(`friendslist/${profile?._id}`).then(response => {
            const { data } = response;
            setFriendsInfo(data);
        })
    }, [profile])

    function handleClick() {
        navigate(`/friends/${profile._id}`);
    }

    async function removeFriend(obj) {
        const { data } = await axios.post('/removefriend', {
            userId: user._id,
            friendId: obj._id
        })
        setFriendsInfo(data);
    }

    return (
        <div>
            <div className="grid grid-cols-3 gap-2 mx-2 mt-2 cursor-default">
                {
                    friendsInfo?.map((obj, idx) => (
                        (user._id !== obj._id &&
                            <div className="relative">
                                <Link to={`/profile/${obj._id}`} key={idx} className="relative m-auto w-20 h-20 rounded-full overflow-hidden block">
                                    {obj?.imageUrl?.length > 0 && <img src={obj.imageUrl} className="w-full h-full object-cover" />}
                                    {obj?.imageUrl?.length <= 0 && <Icons iconName={"profile"} styles="w-full h-full bg-gray-200" />}
                                </Link>
                                <button onClick={() => removeFriend(obj)} className="absolute bottom-0 right-2 bg-gray-200 p-1 rounded-full">
                                    <Icons iconName={"bin"} styles="w-5 h-5" />
                                </button>
                            </div>
                        )
                    ))
                }
            </div>
            <div className="my-2 text-gray-400 text-center">
                <button onClick={handleClick} className="py-1 px-2 rounded-2xl hover:bg-gray-200 duration-500">Show More</button>
            </div>
        </div>
    );
}