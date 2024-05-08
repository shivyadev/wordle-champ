import BoxTable from "./BoxTable";

export default function DisplayWordle({ wordleWords, targetWord }) {

    return (
        <div className="m-auto bg-black p-1 opacity-75 hover:opacity-100 transition-all cursor-pointer">
            <div className="relative grid grid-rows-5 gap-1">
                {
                    wordleWords.map((val, i) => (
                        <BoxTable key={i}
                            word={wordleWords[i]}
                            targetWord={targetWord.split('')}
                            boxStyle={"flex justify-center items-center w-10 h-10 border-2 border-gray-400 text-white uppercase"}
                        />
                    ))
                }
                <div className="absolute inset-0 bg-gradient-to-t from-gray-100 via-[rgba(255,255,255,0.3)] to-transparent opacity-90 hover:opacity-60">

                </div>
            </div>
        </div>
    );

}