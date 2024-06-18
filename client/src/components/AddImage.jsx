import { useEffect, useState } from "react";
import Icons from "./Icons";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import ImagePopUp from "./ImagePopUp";

export default function AddImage({ username }) {

    const [file, setFile] = useState(null);
    const [name, setName] = useState(username);
    const { user, setUser } = useContext(UserContext);
    const [showPopUp, setShowPopUp] = useState(false);

    useEffect(() => {
        if (file === null) return;

        const imageRef = ref(storage, `images/${user._id}`);
        uploadBytes(imageRef, file).then((response) => {
            getDownloadURL(response.ref).then(url => {
                axios.post(`/addimage/${user?._id}`, {
                    name,
                    imageUrl: (!Array.isArray(file)) ? url : "",
                }).then(response => {
                    const { data } = response;
                    setUser(data);
                })
            })
        })
        setFile(null);
    }, [file])


    return (
        <div className="absolute right-4 bottom-12 flex justify-center items-center bg-gray-200 border-2 border-white rounded-full p-2">
            <button onClick={() => setShowPopUp(true)}>
                <Icons iconName={'edit'} styles="w-7 h-7" />
            </button>
            <ImagePopUp showPopUp={showPopUp} setShowPopUp={setShowPopUp} name={name} setName={setName} setFile={setFile} />
        </div>
    );

}