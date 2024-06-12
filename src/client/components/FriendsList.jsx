import { useContext, useEffect, useState } from "react";
import axios from "axios";
import img from "../../images/image1.jpg";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

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

    return (
        <div>
            <div className="grid grid-cols-3 gap-2 mx-2 mt-2 cursor-default">
                {
                    friendsInfo?.map((obj, idx) => (
                        (user._id !== obj._id &&
                            <Link to={`/profile/${obj._id}`} key={idx} className="m-auto w-20 h-20 overflow-hidden rounded-full">
                                <img src={img} className="w-full h-full object-cover" />
                            </Link>
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