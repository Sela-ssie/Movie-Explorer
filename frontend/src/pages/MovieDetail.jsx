import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails } from "../services/api";
import "../css/MovieDetail.css";

function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        const load = async () => {
            try {
                const data = await getMovieDetails(id);
                if (!active) return;
                setMovie(data);
            } catch (err) {
                console.error(err);
                setError(err?.message || "Failed to load movie details.");
            } finally {
                if (active) setLoading(false);
            }
        };
        load();
        return () => { active = false; };
    }, [id]);

    if (loading) return <div className="loading">Loading movie...</div>;
    if (error) return <div className="error" role="alert">{error}</div>;
    if (!movie) return null;

    const trailer = movie.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube");
    const backdrop = movie.backdrop_path ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}` : null;

    return (
        <div className="movie-detail">
            {backdrop && <div className="backdrop" style={{ backgroundImage: `url(${backdrop})` }} aria-hidden />}
            <div className="detail-content">
                <h1>{movie.title}</h1>
                <p className="tagline">{movie.tagline}</p>
                <p className="overview">{movie.overview}</p>

                <div className="meta">
                    <span>Release: {movie.release_date}</span>
                    <span>Runtime: {movie.runtime} min</span>
                    <span>Rating: {movie.vote_average}</span>
                </div>

                {movie.credits?.cast?.length > 0 && (
                    <div className="cast">
                        <h3>Top cast</h3>
                        <ul>
                            {movie.credits.cast.slice(0, 8).map((c) => (
                                <li key={c.cast_id || c.credit_id}>{c.name} as {c.character}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {trailer && (
                    <div className="trailer">
                        <h3>Trailer</h3>
                        <iframe
                            title="trailer"
                            width="560"
                            height="315"
                            src={`https://www.youtube.com/embed/${trailer.key}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default MovieDetail;

