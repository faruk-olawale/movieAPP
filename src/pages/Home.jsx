import MovieCard from "../component/MovieCard"
import { useState, useEffect } from "react"
import { searchMovies, getPopularMovies } from "../services/api";
import "../css/Home.css"

function Home() {

    const [searchQuery, setSearchQueary] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadPopularMovies = async () => {
            try{
                const popularMovies = await getPopularMovies()
                setMovies(popularMovies)   
            } catch(err){
                console.log(err);
                setError ("Failed to load movies...")
            }
                finally {
                    setLoading(false)
                }
        }
        loadPopularMovies()
    }, [])

    const handleSearch =async (e) => {
        e.preventDefault()
         if (!searchQuery.trim())  return
         if (loading) return
        setLoading(true) 

        try{
            const searchResults = await searchMovies(searchQuery)
            setMovies(searchResults)
            setError(null)
        }catch(err){
          console.log(err);
            
          setError("Failed to search movies...")
        }finally{
          setLoading(false)
        }

        searchQuery("");
            
         
            
    }
    return <div className="home">
        <form onSubmit={handleSearch} className="search-form">
            <input type="text" 
            placeholder="Search for movies"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQueary(e.target.value)}
            />
            <button type="submit" className="search-button">Searchs</button> 
        </form>

        {loading ? (<div className="loading">loading... </div>
        ):( 
        <div className="movies-grid">
            {movies.map(movie => 
            // movie.title.toLowerCase().startsWith(searchQuery) && (<MovieCard movie ={movie} key={movie.id} />
             (<MovieCard movie ={movie} key={movie.id} />
            ))}
        </div>
        ) }
    </div>
    
}

export default Home