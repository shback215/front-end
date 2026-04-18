import {createContext, useState, useContext, useEffect} from "react"

const MovieContext = createContext()

export const useMovieContext = () => useContext(MovieContext)

export const MovieProvider = ({children}) => {

    const [favorites, setFavorites] = useState([])

    // 1. LOAD: Runs once when the app starts to grab data from the browser
    useEffect(() => {
        const storedFavs = localStorage.getItem("movie-favorites");

        if (storedFavs) {
            setFavorites(JSON.parse(storedFavs));
        }
    }, []); // Empty brackets [] are CRITICAL to prevent an infinite loop

    // 2. SAVE: Runs every time the 'favorites' state changes
    useEffect(() => {
        localStorage.setItem("movie-favorites", JSON.stringify(favorites));
    }, [favorites]); // Only runs when the favorites array is updated

    const addToFavorites = (movie) => {
        setFavorites(prev => [...prev, movie])
    }

    const removeFromFavorites = (movieId) => {
        setFavorites(prev => prev.filter(movie => movie.id !== movieId))
    }

    const isFavorite = (movieId) => {
        return favorites.some(movie => movie.id === movieId)
    }

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    }

    return (
        <MovieContext.Provider value={value}>
            {children}
        </MovieContext.Provider>
    )
}