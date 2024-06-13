import Icons from "./Icons";

export default function ImagePopUp({ showPopUp, setShowPopUp, setFile }) {

    function handleChange(ev) {
        setFile(ev.target.files[0]);
        setShowPopUp(false);
    }

    if (showPopUp) {
        return (
            <div id="popup" className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-30 bg-gray-100">
                <div className="relative bg-white px-10 py-12 rounded-2xl shadow-2xl overflow-auto">
                    <input type="file" onChange={handleChange} className="font-semibold" />
                    <button onClick={() => setShowPopUp(false)} className="absolute right-0 top-0 p-2">
                        <Icons iconName={'cross'} styles="w-6 h-6" />
                    </button>
                </div>
            </div >

        );
    } else {
        return '';
    }
}