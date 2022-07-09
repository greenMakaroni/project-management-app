import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Project from './pages/Project';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient'
import { AuthProvider } from './context/authContext'

function App() {
  return (
    <>
    <AuthProvider>
      <ApolloProvider client={ client }>
        <Router>
          <Header /> 
          <div className="container">
            <Routes>
              <Route path='/' element={ <Home /> } />
              <Route path='/project/:id' element={ <Project /> } />
              <Route path='*' element={ <NotFound /> } />
            </Routes>
          </div>
        </Router>
      </ApolloProvider>
    </AuthProvider>
    </>

  );
}

export default App;
