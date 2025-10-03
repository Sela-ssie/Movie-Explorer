import "../css/MovieCard.css"
import { useMovieContext } from "../contexts/MovieContext"
import { Link } from "react-router-dom"

function MovieCard({movie}){
    const { isFavorite, addFavorite, removeFavorite } = useMovieContext();
    const favorited = isFavorite(movie.id);
    
    function FavClick(e){
        e.preventDefault();
        if (favorited) {
            removeFavorite(movie.id);
        } else {
            addFavorite(movie);
        }

    }
    const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder.png";
    return <div className="movie-card">
        <Link to={`/movie/${movie.id}`} className="movie-poster-link">
            <div className="movie-poster">
                <img src={poster} alt={movie.title} loading="lazy"/>
                <div className="movie-overlay">
                    <button className={`favorite-btn ${favorited? "active": ""}`} onClick={FavClick} aria-pressed={favorited} aria-label={favorited? "Remove favorite" : "Add favorite"}>♥</button>
                </div>
            </div>
        </Link>
        <div className="movie-info">
            <h3>{movie.title}</h3>
            <p>{movie.release_date?.split("-")[0]}</p>
        </div>
    </div>
}

export default MovieCard 