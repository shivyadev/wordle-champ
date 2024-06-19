import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Icons from "../components/Icons";
import { storage } from "../firebase";
import { getDownloadURL, ref, listAll } from "firebase/storage";


export default function HomePage() {
    const [toLogin, setToLogin] = useState(false);
    const [scroll, setScroll] = useState(false);
    const [wordleImages, setWordleImages] = useState([]);
    const [images, setImages] = useState([]);
    const [idx, setIdx] = useState(0);
    const [imageIdx, setImageIdx] = useState(0);

    const scrollHeader = () => {
        if (window.scrollY >= 5) {
            setScroll(true);
        } else {
            setScroll(false);
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', scrollHeader);
        return () => {
            window.addEventListener('scroll', scrollHeader);
        }
    }, [])

    useEffect(() => {
        const imageRef = ref(storage, 'home-page-images/');
        const getImages = async () => {
            const imageRefList = await listAll(imageRef);
            imageRefList.items.map(async (item) => {
                const url = await getDownloadURL(item);
                if (url.includes('profile') || url.includes('friendlist')) {
                    setImages(prev => [...prev, url]);
                }
                else {
                    setWordleImages(prev => [...prev, url]);
                }
            })
        }

        getImages();
    }, [])

    useEffect(() => {
        const newIdx = idx + 1 > 2 ? 0 : idx + 1;
        const newImageIdx = idx + 1 > 1 ? 0 : idx + 1;
        const timer = setTimeout(() => {
            setIdx(newIdx);
            setImageIdx(newImageIdx);
        }, 5000);

        return () => clearTimeout(timer);

    }, [idx]);

    if (toLogin) {
        return <Navigate to={"/login"} />
    }

    return (
        <div>
            <div className={scroll ? "navbar fixed w-full bg-black" : "bg-black"}>
                <section>
                    <div className="flex justify-between items-center ml-10 p-2 pt-2 font-semibold text-xl text-white">
                        <Icons iconName={'logo'} />
                        {scroll && (
                            <div className="mr-7 my-2 p-2 px-8 rounded-2xl text-slate-100 text-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-800 hover:to-green-600">
                                <button onClick={() => setToLogin(true)}>Play</button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
            <div className="flex justify-center bg-black text-white">
                <div className="flex flex-col w-full h-screen items-center">
                    <div className="mt-20 mb-10">
                        <h1 className="text-6xl font-semibold">Wordle Champs</h1>
                    </div>
                    <div>
                        <p className="text-xl text-gray-500 text-center">The top platform to play Wordle <br /> & <br /> compete with your friends</p>
                    </div>
                    <div>
                        <button className="mt-16 p-5 px-12 rounded-2xl text-gray-200 font-semibold text-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-800 hover:to-green-600" onClick={() => setToLogin(true)}>Play</button>
                    </div>
                </div>
            </div>
            <div className="bg-white">
                <div className="flex justify-center">
                    <h1 className="m-4 text-3xl font-semibold border-b-2 p-4 px-36">Features</h1>
                </div>
                <div className="grid grid-row-2 mx-16 mt-10">
                    <section className="bg-slate-100 rounded-xl p-10 mb-4">
                        <div className="grid grid-cols-3">
                            <div className="m-auto border-2 border-black w-60 h-60 col-span-1 rounded-2xl overflow-hidden">
                                <div className="slider-container w-full h-full" style={{ display: 'flex', transition: 'transform 1s ease', transform: `translateX(${-idx * 100}%)` }}>
                                    {wordleImages.map((image, index) => (
                                        <img key={index} src={image} alt={`image-${index}`} className="w-60 h-60 object-cover" />
                                    ))}
                                </div>
                            </div>
                            <div className="col-span-2">
                                <h1 className="font-semibold text-2xl text-center mb-5">Play Wordle</h1>
                                <p className="font-semibold text-justify text-gray-600 tracking-wider">Wordle is a classic game of guessing a word. The player is given five chances to guess the correct word by guessing different words. If the letters of the guessed words are part of the correct word then they are highlighted in different colours.</p>
                            </div>
                        </div>
                    </section>
                    <section className="bg-slate-100 rounded-xl p-10 mt-4 mb-10">
                        <div className="grid grid-cols-3">
                            <div className="col-span-2">
                                <h1 className="font-semibold text-2xl text-center mb-5">Connect With Friends</h1>
                                <p className="font-semibold text-justify text-gray-600 tracking-wider">
                                    {"Visit other people's profiles on the platform to explore their Wordle scores, view their ongoing Wordle games, and discover their progress and achievements in the popular word puzzle game."}
                                </p>
                            </div>
                            <div className="m-auto border-2 border-black w-60 h-60 col-span-1 rounded-2xl overflow-hidden">
                                <div className="slider-container w-full h-full" style={{ display: 'flex', transition: 'transform 1s ease', transform: `translateX(${-imageIdx * 100}%)` }}>
                                    {images.map((image, index) => (
                                        <img key={index} src={image} alt={`image-${index}`} className="w-60 h-60 object-center" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>

    );
}