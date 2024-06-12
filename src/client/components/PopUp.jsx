export default function PopUp({ showPopUp, setShowPopUp, setAddFriend }) {
    if (showPopUp) {
        return (
            <div id="popup" className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-30 bg-gray-100">
                <div className="relative bg-white w-[20%] h-[30%] rounded-2xl shadow-2xl overflow-auto">
                    <p className="mt-8 my-4 font-semibold text-2xl text-center">Are you sure?</p>
                    <div className="flex justify-center">
                        <button onClick={() => setAddFriend(true)} className="px-4 py-2 mt-5 mx-4 font-semibold text-md rounded-2xl hover:bg-gray-200 duration-500">Yes</button>
                        <button onClick={() => setShowPopUp(false)} className="px-4 py-2 mt-5 mx-4 font-semibold text-md rounded-2xl hover:bg-gray-200 duration-500">No</button>
                    </div>
                </div>
            </div >
        );
    } else {
        return '';
    }
}