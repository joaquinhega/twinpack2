import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Inicializar el estado del usuario desde localStorage
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : { datos: {} }; // Estado inicial
    });

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    const setUserDato = (key, value) => {
        setUser({
            ...user,
            datos: {
                ...user.datos,
                [key]: value,
            },
        });
    };

    return (
        <UserContext.Provider value={{ user, setUser, setUserDato }}>
            {children}
        </UserContext.Provider>
    );
};
