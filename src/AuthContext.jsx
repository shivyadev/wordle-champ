import axios from "axios";
import { createContext, useEffect, useState, useRef } from "react";

export const AuthContext = createContext({});

export function AuthContextProvider({ children }) {
    const [token, setToken] = useState(undefined);

    const checkResponse = async (error) => {
        if (error.response) {
            const { status } = error.response;

            if (status === 401 || status === 403) {
                console.log('Token expired or unauthorized. Refreshing token...');
                await refreshToken();
                return axiosGET(error.response.config.url);
            } else {
                console.error('Error:', error);
                return 'Access forbidden';
            }
        } else {
            console.error('Network error:', error.message);
            return 'Network error';
        }
    }

    const axiosGET = async (url) => {
        try {
            const response = await axios.get(url, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error(`Request failed with status ${response.status}`);
            }

        } catch (err) {
            return checkResponse(err);
        }
    }

    const axiosPOST = async (url, payload) => {
        const response = await axios.post(url, payload, {
            headers: {
                'authorization': `Bearer ${token}`
            }
        });

        return checkResponse(response);
    }

    const axiosPUT = async (url, payload) => {
        const response = await axios.put(url, payload, {
            headers: {
                'authorization': `Bearer ${token}`
            }
        });

        return checkResponse(response);
    }

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
        }
    };

    useEffect(() => {
        refreshToken();
    }, [])

    return (
        <AuthContext.Provider value={{ token, setToken, refreshToken, axiosGET, axiosPOST, axiosPUT }}>
            {children}
        </AuthContext.Provider>
    );
}
