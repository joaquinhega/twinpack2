import {createContext,useState, useContext} from "react";



export const PaginationContext = createContext();

export const PaginationProvider = ({children}) => {
    const [pagination,setPagination] = useState({
        numberPages: 1,
        selectedPage: 1
    });


    // I'm going to add different methods that will be definitely useful for interacting with the pagination :D

    // Voy a añadir diferentes métodos que definitivamente serán útiles para la interacción con la paginación ^-^


    const clearPagination = () => {
        setPagination({
            numberPages: 1,
            selectedPage: 1
        })
    }

    const showPaginationStatus = () => {
        console.log(pagination);
    }


    const setNumberPages = (numberPages) => {
        setPagination({
            ...pagination,
            numberPages
        })
    }

    const setSelectedPage = (selectedPage) => {
        console.log(pagination)
        setPagination({
            ...pagination,
            selectedPage
        })
    }

    const moveToNextPage = () => {
        console.log(pagination)
        if(Number(pagination.numberPages) >= (Number(pagination.selectedPage) + 1)){
            setSelectedPage((pagination.selectedPage + 1));
        }else{
            setSelectedPage(1);
        }
    }

    const moveToPreviousPage = () => {
        console.log(pagination)
        if(Number(pagination.selectedPage) > 1){
            setSelectedPage(Number(pagination.selectedPage) - 1);
        }else{
            setSelectedPage(1);
        }
    }



    return(
        <PaginationContext.Provider value={{pagination,setPagination,setSelectedPage,setNumberPages,clearPagination,moveToNextPage,moveToPreviousPage,showPaginationStatus}}>
            {children}
        </PaginationContext.Provider>
    );
};