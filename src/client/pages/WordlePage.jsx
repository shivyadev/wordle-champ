import { useContext, useEffect, useState } from "react";
import BoxTable from "../components/BoxTable";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { UserContext } from "../../UserContext";
import axios from "axios";

export default function WordlePage() {
    const [guess, setGuess] = useState("");
    const [guessedWords, setGuessedWords] = useState(new Array(5).fill(new Array(5).fill(" ")));
    const [currGuessIdx, setCurrGuessIdx] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [targetWord, setTargetWord] = useState("");
    const [replay, setReplay] = useState(false);
    const [route, setRoute] = useState(false);
    const { user } = useContext(UserContext);

    const WordleWords = [
        "apple", "chair", "house", "table", "grape", "train", "pizza", "beach", "ocean", "panda",
        "lemon", "mouse", "candy", "eagle", "tiger", "snake", "queen", "music", "bread", "peach",
        "socks", "horse", "spoon", "clock", "dress", "plant", "smile", "water", "chair", "phone"
    ];

    useEffect(() => {
        const randIdx = Math.floor(Math.random() * WordleWords.length - 1) + 1
        setTargetWord(WordleWords[randIdx]);
        console.log(targetWord);
    }, [])

    async function storeGame(won) {
        await axios.post('/storegame', {
            userId: user._id,
            guessedWords,
            won,
            targetWord,
        })
    }

    useEffect(() => {
        if (gameWon || currGuessIdx > 4) {
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
        console.log(guessedWords, currGuessIdx);

        if (currentGuess === targetWord) {
            setGameWon(true);
        }

    }

    function replayGame(ev) {
        ev.preventDefault();
        setGuessedWords(new Array(5).fill(new Array(5).fill(" ")));
        setGameOver(false);
        setGameWon(false);
        setCurrGuessIdx(0);
        setReplay(true);
    }

    if (route) {
        return <Navigate to="/profile" />
    }


    return (
        <div className="flex flex-col justify-center items-center w-screen h-screen bg-white">
            <Navbar onPage={'wordle'} />
            <h1 className="text-6xl text-gray-700 mb-6">
                {gameWon && "You Won!!!"}
                {!gameWon && gameOver && "You Lost"}
                {!gameOver && !gameWon && "Wordle"}
            </h1>
            <div className="grid grid-row-5 gap-1">
                {guessedWords.map((_, i) => (
                    <BoxTable key={i} word={guessedWords[i]} targetWord={targetWord.split('')} replay={replay} setReplay={setReplay} />
                ))}
            </div>
            <form className="mt-5 bg-white" onSubmit={submitGuess}>
                {(currGuessIdx <= 4 && !gameWon) && <input maxLength={5} minLength={5} className="p-3 bg-black border-b-2 border-white focus:outline-none text-center uppercase text-xl text-gray-400" placeholder="Type your guess here" onChange={(ev) => setGuess(ev.target.value)} value={guess} />}
            </form>
            {gameOver &&
                <button className="absolute flex gap-2 bottom-16 right-16 p-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition-all" onClick={replayGame}>
                    <span className="text-xl">REPLAY</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </button>
            }
        </div>
    );
}