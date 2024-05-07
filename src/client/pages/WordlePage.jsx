import { useEffect, useState } from "react";
import BoxTable from "../components/BoxTable";

export default function WordlePage() {

    const [guess, setGuess] = useState("");
    const [guessedWords, setGuessedWords] = useState(new Array(5).fill(new Array(5).fill(" ")));
    const [currGuessIdx, setCurrGuessIdx] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [targetWord, setTargetWord] = useState("");
    const WordleWords = [
        "apple", "chair", "house", "table", "grape", "train", "pizza", "beach", "ocean", "panda",
        "lemon", "mouse", "candy", "eagle", "tiger", "snake", "queen", "music", "bread", "peach",
        "socks", "horse", "spoon", "clock", "dress", "plant", "smile", "water", "chair", "phone"
    ];

    useEffect(() => {
        const randIdx = Math.floor(Math.random() * WordleWords.length - 1) + 1
        setTargetWord(WordleWords[randIdx]);
    }, [])

    function submitGuess(ev) {
        ev.preventDefault();
        var newGuessedWords = [...guessedWords];
        newGuessedWords[currGuessIdx] = guess.split('');
        setGuessedWords(newGuessedWords);
        setCurrGuessIdx(currGuessIdx + 1);
        if (currGuessIdx >= 4) {
            setGameOver(true);
        }

        if (guess === targetWord) {
            setGameWon(true);
        }

        setGuess('');
    }

    return (
        <div className="flex flex-col justify-center items-center w-screen h-screen bg-black">
            <h1 className="text-6xl text-white mb-6">
                {gameWon && "You Won!!!"}
                {!gameWon && gameOver && "You Lost"}
                {!gameOver && !gameWon && "Wordle"}
            </h1>
            <div className="grid grid-row-5 gap-1">
                {guessedWords.map((_, i) => (
                    <BoxTable key={i} word={guessedWords[i]} guess={guess} setGuess={setGuess} targetWord={targetWord} setGameWon={setGameWon} />
                ))}
            </div>
            <form className="mt-5 bg-white" onSubmit={submitGuess}>
                {(currGuessIdx <= 4 && !gameWon) && <input maxLength={5} minLength={5} className="p-3 bg-black border-b-2 border-white focus:outline-none text-center uppercase text-xl text-gray-400" placeholder="Type your guess here" onChange={(ev) => setGuess(ev.target.value)} value={guess} />}
            </form>
        </div>
    );
}