import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ComicPage from './ComicPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={ComicPage} />
        <Route path="/:comicNumber?" Component={ComicPage} />
      </Routes>
    </Router>
  );
}

export default App;
