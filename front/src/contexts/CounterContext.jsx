import React,{createContext,useState} from "react";

export const CounterContext = React.createContext();

export const CounterProvider = ({children}) => {
    const [counter,setCounter] = useState(0);
    return(
        <CounterContext.Provider value={{counter,setCounter}}>
            {children}
        </CounterContext.Provider>
    );
};