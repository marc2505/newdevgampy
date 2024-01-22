import React, { createContext, useContext, useState } from "react"

export const ContextSearch = createContext({
    recherche: null,
    dateDebut: null,
    dateFin: null,
    filtre: null,
    setRecherche: () => {},
    setDateDebut: () => {},
    setDateFin: () => {},
    setFiltre: () => {},
})

// import {ContextSearch} from './ContextSearch'

export const SearchProvider = ({children}) => {
    const [recherche, setRecherche] = useState(null)
    const [dateDebut, setDateDebut] = useState(null)
    const [dateFin, setDateFin] = useState(null)
    const [filtre, setFiltre] = useState(null)
    // const [searchProps, setSearchProps] = useState({})
    return (
        <ContextSearch.Provider value={{ 
            recherche, 
            dateDebut,
            dateFin,
            filtre,
            setRecherche,
            setDateDebut,
            setDateFin,
            setFiltre
        }}>
            {children}
        </ContextSearch.Provider>
    )
}

export const useSearchContext = () => useContext(ContextSearch)