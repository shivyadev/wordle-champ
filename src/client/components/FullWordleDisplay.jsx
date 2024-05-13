import BoxTable from "./BoxTable";

export default function FullWordleDisplay({ val, targetWord, setDisplayFullWindow }) {

    function handleCloseFullWindow() {
        setDisplayFullWindow(false);
    }

    return (
        <div className="fixed top-0 left-0 bg-black">
            <button className="fixed top-5 left-5 bg-red-400 p-1 rounded-full" onClick={handleCloseFullWindow}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
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