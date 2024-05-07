export default function BoxTable({ word, targetWord }) {

    function checkGuess(val, index) {

        let boxStyle = "flex justify-center items-center w-16 h-16 border-2 border-gray-400 text-white uppercase";

        if (targetWord[index] === val) {
            boxStyle += " bg-green-500";
        }

        else if (targetWord.includes(val)) {
            boxStyle += " bg-yellow-500";
        }

        return (
            <div key={index} className={boxStyle}>
                {val}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-5 gap-1">
            {word.map((i, index) => (
                checkGuess(i, index)
            ))}
        </div>
    );
}