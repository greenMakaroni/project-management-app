import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { useMutation } from '@apollo/client'
import { LOGIN_USER } from '../mutations/userMutations'
export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const context = useContext(AuthContext);

    const [loginUser] = useMutation(LOGIN_USER, {
        variables: {email: email, password: password},
        update(proxy, { data: {loginUser: userData}}) {
            context.login(userData);
            console.log(userData);
        },
        onError({ graphQLErrors }) {
            setErrors(graphQLErrors);
        }
    })

    const onSubmit = (e) => {
        e.preventDefault();
        if(email === '' || !email.includes('@') || password === '') {
            return alert('Please fill in the form');
        } else {
            loginUser(email, password);
            setEmail('');
            setPassword('');
            setErrors([]);
        }
    }

  return (
    <form onSubmit={onSubmit}>
        <div className="mb-3">
            <label className="form-label">Email address</label>
            <input 
                type="email" 
                className="form-control" 
                id="email" 
                aria-describedby="emailHelp"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
            />
        </div>
        <div className="mb-3">
            <label className="form-label">Password</label>
            <input 
                type="password" 
                className="form-control" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  )
}
