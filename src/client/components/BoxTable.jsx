import { useEffect, useState } from "react";

export default function BoxTable({ word, targetWord, boxStyle = "", replay, setReplay }) {

    if (boxStyle === "") {
        boxStyle += "flex justify-center items-center w-16 h-16 bg-gray-200 rounded-xl text-black uppercase";
    }

    const [boxStyles, setBoxStyles] = useState({
        0: boxStyle,
        1: boxStyle,
        2: boxStyle,
        3: boxStyle,
        4: boxStyle,
    });

    if (replay) {

    }

    function checkForCopy(val, index) {

        const lastOccured = index === 0 ? -1 : word.lastIndexOf(val, index - 1);

        if (lastOccured !== -1) {
            if (word[lastOccured] === targetWord[lastOccured]) {
                return;
            } else if (val === targetWord[index]) {
                setBoxStyles(prev => (
                    {
                        ...prev,
                        [index]: prev[index].replace(" bg-gray-200", " bg-green-500"),
                        [lastOccured]: prev[lastOccured].replace(" bg-yellow-500", " bg-gray-200")
                    }
                ));
            }
        } else {
            if (val === targetWord[index]) {
                setBoxStyles(prev => (
                    { ...prev, [index]: prev[index].replace(" bg-gray-200", " bg-green-500") }
                ));
            } else if (targetWord.includes(val)) {
                setBoxStyles(prev => (
                    { ...prev, [index]: prev[index].replace(" bg-gray-200", " bg-yellow-500") }
                ));
            }
        }

    }

    function checkGuess(val, index) {

        const letterCount = {
            "guess": word.filter(element => element === val).length,
            "target": targetWord?.filter(element => element === val).length
        }

        if (letterCount.guess > letterCount.target && letterCount.guess > 1) {
            checkForCopy(val, index);
        } else {
            if (val === targetWord[index]) {
                setBoxStyles(prev => (
                    { ...prev, [index]: prev[index].replace(" bg-gray-200", " bg-green-500") }
                ));
            } else if (targetWord.includes(val)) {
                setBoxStyles(prev => (
                    { ...prev, [index]: prev[index].replace(" bg-gray-200", " bg-yellow-500") }
                ));
            }
        }
    }

    useEffect(() => {

        if (!word.includes(' ')) {
            word.map((i, index) => (
                checkGuess(i, index)
            ))
        }

        if (replay) {
            setBoxStyles({
                0: boxStyle,
                1: boxStyle,
                2: boxStyle,
                3: boxStyle,
                4: boxStyle,
            });
            setReplay(false);
        }

    }, [word, replay, boxStyle])

    return (
        < div className="grid grid-cols-5 gap-1" >
            {
                Object.entries(boxStyles).map(([idx, value]) => (
                    <div key={idx} className={value} >
                        {word[idx]}
                    </div>
                ))
            }
        </div >
    );
}