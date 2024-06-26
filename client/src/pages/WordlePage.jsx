import { useContext, useEffect, useState } from "react";
import BoxTable from "../components/BoxTable";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { UserContext } from "../UserContext";
import axios from "axios";
import { AuthContext } from "../AuthContext";

export default function WordlePage() {

    const { axiosCall } = useContext(AuthContext);
    const [guess, setGuess] = useState("");
    const [guessedWords, setGuessedWords] = useState(new Array(6).fill(new Array(6).fill(" ")));
    const [currGuessIdx, setCurrGuessIdx] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [targetWord, setTargetWord] = useState("");
    const [replay, setReplay] = useState(false);
    const { user } = useContext(UserContext);

    if (user === null) return <Navigate to='/' />

    useEffect(() => {
        if (gameOver) return;
        axios.get('/getword').then(response => {
            const { data } = response;
            setTargetWord(data);
        })
    }, [gameOver])

    const storeGame = async (won) => {
        const response = await axiosCall('PUT','/storegame', {
            userId: user._id,
            guessedWords,
            won,
            targetWord,
        });
    }

    useEffect(() => {
        if (gameWon || currGuessIdx > 5) {
            setGameOver(true);
            storeGame(gameWon);
        }
    }, [gameWon, currGuessIdx]);

    function submitGuess(ev) {
        ev.preventDefault();

        const currentGuess = guess;

        var newGuessedWords = [...guessedWords];
        newGuessedWords[currGuessIdx] = guess.split('');
        setGuessedWords(newGuessedWords);
        setGuess('');

        setCurrGuessIdx(currGuessIdx + 1);

        if (currentGuess === targetWord) {
            setGameWon(true);
        }

    }

    function replayGame() {
        setGuessedWords(new Array(6).fill(new Array(6).fill(" ")));
        setGameOver(false);
        setGameWon(false);
        setCurrGuessIdx(0);
        setReplay(true);
    }

    return (
        <div className="flex flex-col justify-center items-center w-screen h-screen bg-white">
            <Navbar onPage={'wordle'} />
            <h1 className="text-6xl text-gray-700 mb-6">
                {gameWon && "You Won!!!"}
                {!gameWon && gameOver && 
                    <div className="text-center">
                        You Lose    
                        <p className="mt-4 text-xl text-gray-400">The correct word is : <span className="uppercase">{targetWord}</span></p>
                    </div>}
                {!gameOver && !gameWon && "Wordle"}
            </h1>
            <div className="grid grid-row-5 gap-1">
                {guessedWords.map((_, i) => (
                    <BoxTable key={i} word={guessedWords[i]} targetWord={targetWord?.split('')} replay={replay} setReplay={setReplay} />
                ))}
            </div>
            <form className="mt-5 bg-white" onSubmit={submitGuess}>
                {(currGuessIdx <= 5 && !gameWon) && <input maxLength={5} minLength={5} className="p-3 bg-black border-b-2 border-white focus:outline-none text-center uppercase text-xl text-gray-400" placeholder="Type your guess here" onChange={(ev) => setGuess(ev.target.value)} value={guess} />}
            </form>
            {(gameOver || gameWon) &&
                <button className="absolute flex gap-2 bottom-16 right-16 p-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition-all" onClick={replayGame}>
                    <span className="text-xl">Replay</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </button>
            }
        </div>
    );
}