import React, { useReducer, createContext } from 'react'
import jwt_decode from 'jwt-decode'

const initialState = {
    user: null
}

const token = localStorage.getItem("token");

if(token) {
    const decodedToken = jwt_decode(token)

    if(decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
    } else {
        initialState.user = decodedToken;
    }
}

const AuthContext = createContext({
    user: null,
    login: ( userData ) => {},
    logout: () => {}
})

function authReducer(state, action) {
    switch(action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null
            }
        default:
            return state;
    }
}

function AuthProvider(props) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // this is what happens after getting successful login response from backend which will carry the token

    const login = (userData) => {
        localStorage.setItem("token", userData.token);
        dispatch({
            type: 'LOGIN',
            payload: userData
        })
    }

    function logout() {
        localStorage.removeItem("token");
        dispatch({ type: 'LOGOUT' })
    }

    return (
        <AuthContext.Provider
            value={{ user: state.user, login, logout}} 
            {...props}
        />
    )
}

export { AuthContext, AuthProvider };