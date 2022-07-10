import React, { useState } from 'react'
import { authContext } from '../context/authContext'
import { useMutation } from '@apollo/client'
import { LOGIN_USER } from '../mutations/userMutations'
export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // const [loginUser] = useMutation(LOGIN_USER, {
    //     variables: {email: email, password: password},
    // })

    const onSubmit = (e) => {
        e.preventDefault();
        if(email === '' || !email.includes('@') || password === '' || password.length < 8) {
            return alert('Please fill in the form');
        } else {
            return alert('Login success');
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
