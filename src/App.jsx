import './css/App.css';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import MovieDetails from './pages/MovieDetails'; 
import { Routes, Route } from "react-router-dom";
import { MovieProvider } from './contexts/MovieContext';
import NavBar from './component/NavBar';

function App() {
  return (
    <MovieProvider>
      <NavBar/>
      <main className='main-content'>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/favorites" element={<Favorites/>}/>
          <Route path="/movie/:id" element={<MovieDetails />}/>
        </Routes>
      </main>
    </MovieProvider>
  );
}

export default App;