import axios from "axios";
import { createContext, useEffect, useRef, useState } from "react";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {

    const [token, setToken] = useState(undefined);
    const tokenRef = useRef(token);

    const updateTokenRef = () => {
        tokenRef.current = token;
        return new Promise((resolve) => {
            resolve('Token Changed');
        })
    }

    const refreshToken = async () => {
        try {
            console.log('refresh token called');
            const response = await axios.get('/refresh-token');
            if (response.status === 200) {
                setToken(response.data);
                return true;
            } else {
                console.error('Access Forbidden, No refresh token');
                return false;
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
        }
    }

    const axiosCall = async (method, url, data = null) => {
        await updateTokenRef();
        try {
            const config = {
                method: method,
                url: url,
                data: data,
                headers: {
                    'Authorization': `Bearer ${tokenRef.current}`
                }
            }

            const response = await axios(config);
            if (response.status >= 200 && response.status < 300) {
                return response;
            } else {
                throw new Error(`Request failed with status ${response.status}`);
            }
        } catch (err) {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                console.log('Token Expired or Invalid');
                await refreshToken(); // Refresh token
                return await axiosCall(method, url, data); // Retry original request after token refresh
            } else {
                console.error('Error:', err);
                return 'Access Forbidden'; // Or handle as needed
            }
        }
    }

    useEffect(() => {
        refreshToken();
    }, [])

    return (
        <AuthContext.Provider value={{ token, setToken, axiosCall }}>
            {children}
        </AuthContext.Provider>
    );
}