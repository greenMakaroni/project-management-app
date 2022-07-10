import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Project from './pages/Project';
import { AuthContext } from './context/authContext'
import { useContext } from 'react';

function App() {

  const { user } = useContext(AuthContext);

  return (
    <>
        <Router>
          <Header /> 
          { 
          user ?  
          <div className="container">
            <Routes>
                <Route path='/' element={ <Home /> } />
                <Route path='/project/:id' element={ <Project /> } />
                <Route path='*' element={ <NotFound /> } />
            </Routes>
          </div>
          :
          <div className="container">
            <Routes>
                <Route path='/' element={ <Login /> } />
                <Route path='*' element={ <NotFound /> } />
            </Routes>
          </div>
          }
        </Router>
    </>
  );
}

export default App;
