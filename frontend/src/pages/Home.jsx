import MovieCard from "../components/MovieCard"
import { useState, useEffect } from "react";
import "../css/Home.css"
import { searchMovies, fetchPopularMovies, fetchGenres } from "../services/api";


function Home(){
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [filterYear, setFilterYear] = useState("");
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");

    useEffect(() => {
        const id = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 400);
        return () => clearTimeout(id);
    }, [searchQuery]);

    useEffect(() => {
        let active = true;
        const load = async () => {
            setError(null);
            setLoading(true);
            try{
                if (!debouncedQuery) {
                    const { results, page: p, total_pages } = await fetchPopularMovies(1);
                    if (!active) return;
                    setMovies(results);
                    setPage(p);
                    setTotalPages(total_pages);
                    // ensure genres are populated as a fallback in case the mount fetch failed
                    if (!genres || genres.length === 0) {
                        try {
                            const g = await fetchGenres();
                            if (active && g && g.length) setGenres(g);
                        } catch (e) {
                            // ignore - we already show movies
                        }
                    }
                } else {
                    const { results, page: p, total_pages } = await searchMovies(debouncedQuery, 1);
                    if (!active) return;
                    setMovies(results);
                    setPage(p);
                    setTotalPages(total_pages);
                    // ensure genres are populated as a fallback in case the mount fetch failed
                    if (!genres || genres.length === 0) {
                        try {
                            const g = await fetchGenres();
                            if (active && g && g.length) setGenres(g);
                        } catch (e) {
                            // ignore
                        }
                    }
                }
            } catch (error) {
                // if movies fail to load, still attempt to load genres for the filter
                fetchGenres().then((g) => { if (g && g.length) setGenres(g); }).catch(() => {});
                console.log(error);
                setError(error?.message || "Failed to fetch movies. Please try again later.");
            } finally {
                if (active) setLoading(false);
            }
        }
        load();
        return () => { active = false };
    }, [debouncedQuery]);

    // load genres on mount so the Genre select is populated
    useEffect(() => {
        let active = true;
        fetchGenres()
            .then((g) => { if (active && g && g.length) setGenres(g); })
            .catch((err) => { console.warn('Failed to fetch genres', err); });
        return () => { active = false };
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        // debounced input handles calling the API, so nothing else here
    };

    const loadMore = async () => {
        if (page >= totalPages) return;
        setLoadingMore(true);
        const nextPage = page + 1;
        try {
            let res;
            if (!debouncedQuery) {
                res = await fetchPopularMovies(nextPage);
            } else {
                res = await searchMovies(debouncedQuery, nextPage);
            }
            setMovies((prev) => [...prev, ...res.results]);
            setPage(res.page);
            setTotalPages(res.total_pages);
        } catch (err) {
            console.error(err);
            setError(err?.message || "Failed to load more.");
        } finally {
            setLoadingMore(false);
        }
    };

    return( 
         <div className="Home">
            <form onSubmit={handleSearch} className="search-form">
                <input 
                    type="text" 
                    placeholder="Search for any movie"
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">Search</button>
            </form>

            <div className="controls">
                <label className="control-item">
                    Year:
                    <input value={filterYear} onChange={(e) => setFilterYear(e.target.value)} placeholder="e.g. 2021" />
                </label>
                <label className="control-item">
                    Genre:
                    <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                        <option value="">All</option>
                        {genres.map((g) => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                </label>
            </div>

            {error && <div className="error-message">{error}</div>}
            {loading ? (
                <div className="movies-grid">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div className="skeleton-card" key={i} aria-hidden>
                            <div className="skeleton-poster" />
                            <div className="skeleton-line short" />
                            <div className="skeleton-line" />
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="movies-grid">
                    {movies
                        .filter((m) => (filterYear ? m.release_date?.startsWith(filterYear) : true))
                        .filter((m) => (selectedGenre ? m.genre_ids?.includes(Number(selectedGenre)) : true))
                        .map((movie) => (
                            <MovieCard movie={movie} key={movie.id} />
                    ))}
                </div>

                {page < totalPages && (
                    <div className="load-more-wrap">
                        <button className="load-more" onClick={loadMore} disabled={loadingMore}>
                            {loadingMore ? "Loading..." : "Load more"}
                        </button>
                    </div>
                )}
                </>
            )}
            
        </div>
    );
}
export default Home