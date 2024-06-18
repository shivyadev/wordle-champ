import BoxTable from "./BoxTable";
import Icons from "./Icons";

export default function FullWordleDisplay({ val, targetWord, setDisplayFullWindow }) {

    function handleCloseFullWindow() {
        setDisplayFullWindow(false);
    }

    return (
        <div className="fixed top-0 left-0 bg-white">
            <button className="fixed top-5 left-5 bg-red-400 p-1 rounded-full" onClick={handleCloseFullWindow}>
                <Icons iconName={"cross"} />
            </button>
            <div className="flex w-screen h-screen justify-center items-center">
                <div className="grid grid-rows-5 gap-1">
                    {
                        val.map((_, i) => (
                            <BoxTable word={val[i]} targetWord={targetWord.split('')} />
                        ))
                    }
                </div>
            </div>

        </div>
    );

}