export default function Box({ alpha }) {
    return (
        <div className="flex justify-center items-center w-16 h-16 border-2 border-gray-400">
            {alpha}
        </div>
    );
}