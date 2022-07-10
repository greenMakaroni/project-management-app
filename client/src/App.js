import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Project from './pages/Project';

function App() {
  return (
    <>
        <Router>
          <Header /> 
          <div className="container">
            <Routes>
              <Route path='/' element={ <Login /> } />
              <Route path='/project/:id' element={ <Project /> } />
              <Route path='*' element={ <NotFound /> } />
            </Routes>
          </div>
        </Router>
    </>
  );
}

export default App;
