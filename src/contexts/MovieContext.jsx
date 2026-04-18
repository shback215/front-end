import { createContext, useState, useContext, useEffect } from "react";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    // 1. LOAD: Runs ONLY once when the app starts
    useEffect(() => {
        const storedFavs = localStorage.getItem("movie-favorites");
        if (storedFavs) {
            const parsed = JSON.parse(storedFavs);
            if (parsed.length > 0) setFavorites(parsed);
        }
    }, []); 

    // 2. SAVE: Only saves if there is actually a movie to save
    useEffect(() => {
        if (favorites.length > 0) {
            localStorage.setItem("movie-favorites", JSON.stringify(favorites));
        }
    }, [favorites]);

    const addToFavorites = (movie) => {
        setFavorites(prev => [...prev, movie]);
    };

    const removeFromFavorites = (movieId) => {
        setFavorites(prev => {
            const newList = prev.filter(movie => movie.id !== movieId);
            // If we remove the last item, manually clear storage so it doesn't stay stuck
            if (newList.length === 0) localStorage.removeItem("movie-favorites");
            return newList;
        });
    };

    const isFavorite = (movieId) => {
        return favorites.some(movie => movie.id === movieId);
    };

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    };

    return (
        <MovieContext.Provider value={value}>
            {children}
        </MovieContext.Provider>
    );
};