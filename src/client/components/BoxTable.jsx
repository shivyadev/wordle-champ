import Box from "./Box";

export default function BoxTable() {

    var arr = new Array(5).fill(" ");
    return (
        <div className="grid grid-cols-5 gap-1 text-white">
            {arr.map((_, i) => (
                <Box alpha={arr[i]} key={i} />
            ))}
        </div>
    );
}