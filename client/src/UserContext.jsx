import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from './AuthContext';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    const { token, axiosCall } = useContext(AuthContext);

    useEffect(() => {
        if (token === undefined) return;

        const getProfile = async () => {
            const { data } = await axiosCall('GET', '/profile');
            setUser(data);
            setReady(true);
        }

        getProfile();
    }, [token]);

    return (
        <UserContext.Provider value={{ user, setUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}
