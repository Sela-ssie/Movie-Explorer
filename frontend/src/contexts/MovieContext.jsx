import { createContext, useState, useEffect, useContext } from "react";

const MovieContext = createContext();

const useMovieContext = () => useContext(MovieContext);

const MovieProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        try {
            const raw = localStorage.getItem("favorites");
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("favorites", JSON.stringify(favorites));
        } catch (e) {
            console.error("Failed to persist favorites", e);
        }
    }, [favorites]);

    const addFavorite = (movie) => {
        setFavorites((prev) => {
            if (prev.some((m) => m.id === movie.id)) return prev;
            return [...prev, movie];
        });
    };

    const removeFavorite = (movieId) => {
        setFavorites((prevFavs) => prevFavs.filter((fav) => fav.id !== movieId));
    };

    const isFavorite = (movieId) => favorites.some((fav) => fav.id === movieId);

    const value = { favorites, addFavorite, removeFavorite, isFavorite };

    return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}
    
export { MovieProvider, useMovieContext };