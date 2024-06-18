import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from './AuthContext';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const { token, axiosGET } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!token) return;

        const fetchUserData = async () => {
            const response = await axiosGET('/profile');
            if (response === "token refreshed") {
                console.log('refreshed');
                fetchUserData();
            } else {
                console.log(response.data)
                setUser(response.data);
                setReady(true);
            }
        }

        fetchUserData();

    }, [token]);

    return (
        <UserContext.Provider value={{ user, setUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}
