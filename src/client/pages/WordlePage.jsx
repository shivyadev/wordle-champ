import BoxTable from "../components/BoxTable";

export default function WordlePage() {

    return (
        <div className="flex flex-col justify-center items-center w-screen h-screen bg-black">
            <h1 className="text-6xl text-white mb-6">Wordle</h1>
            <BoxTable />
        </div>
    );
}