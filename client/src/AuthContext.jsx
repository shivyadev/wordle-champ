import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {

    const [token, setToken] = useState(undefined);

    const refreshToken = async () => {
        try {
            const response = await axios.get('/refresh-token');
            if (response.data) {
                setToken(response.data);
            } else {
                console.error('Access Forbidden, No refresh token');
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
        }
    }

    const axiosGET = async (url) => {
        const response = axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return response;
    }

    const axiosPUSH = async (url, payload) => {
        const response = axios.push(url, payload, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return response;
    }

    const axiosPUT = async (url, payload) => {
        const response = axios.put(url, payload, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return response;
    }

    useEffect(() => {
        refreshToken();
    }, [])

    return (
        <AuthContext.Provider value={{ token, setToken, axiosGET, axiosPUSH, axiosPUT }}>
            {children}
        </AuthContext.Provider>
    );
}