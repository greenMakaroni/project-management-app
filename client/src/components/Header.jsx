import logo from './assets/logo.png'
import { AuthContext } from '../context/authContext'
import { useContext } from 'react';

export default function Header() {

  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar bg-light mb-4 p-2">
        <div className="container">
            <a className="navbar-brand" href="">
                <div className="d-flex">
                    <img src={logo} alt='logo' className='mr-2' />
                    <div> Project management platform </div>
                </div>
            </a>
            { user && <button className="btn btn-danger" onClick={logout}> Logout </button> }
        </div>
    </nav>
  )
}
