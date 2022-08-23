import React from 'react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import loginStyles from './login.module.scss';
import logo from '../logo.png';

const Login = () => {

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [navigateToFeed, setNavigateToFeed] = useState(false);
    const [navigateToRegister, setNavigateToRegister] = useState(false);

    const submit = async e => {
        e.preventDefault();

        await axios.post('http://5.22.217.225:5000/auth/', {
           username: name, password: password
        }).then(response => {
            setNavigateToFeed(true);
            sessionStorage.setItem('token', response.data.accessToken);
            axios.defaults.headers.common[ 'Authorization' ] = `Bearer ${sessionStorage.getItem('token')}`;
        });

    }

    if (navigateToFeed) {
        return <Navigate to='/Feed' />
    } else if (navigateToRegister) {
        return <Navigate to='/Register' />
    }

    const redirect = () => {
        setNavigateToRegister(true)
    }

    return (
        <>
            <main className={loginStyles.login}>
                    <div className={loginStyles.loginPresentation}>
                    <div className={loginStyles.logo}>
                        <img src={logo} className='logoApp' alt='logo brand'/>
                        <h1>KupKan</h1>
                        </div>
                        <p>With KupKan, share and stay in touch with your friends.</p>
                    </div>
                    <div className={loginStyles.formBlock}>
                        <form onSubmit={submit} className={loginStyles.form}>
                            <input 
                             type='text'
                             placeholder='username' 
                             onChange={e => setName(e.target.value)}
                             />
                            <input 
                             type='Password' 
                             placeholder='password'
                             autoComplete='off'
                             onChange={e => setPassword(e.target.value)
                             }/>
                            <button type='submit'>Sign in</button>
                            <div className={loginStyles.line}></div>
                            <button onClick={redirect}>Create new account</button>
                        </form>
                        <span>Create a Page for a celebrity, a brand or a company.</span>
                    </div>
            <footer className={loginStyles.footer}>
                <ul>
                <li><a href='#'>About</a></li>
                    <li><a href='#'>Content policy</a></li>
                    <li><a href='#'>Privacy Policy</a></li>
                    <li><a href='#'>Conditions</a></li>
                    <li>copyright 2022 © KupKan</li>
                </ul>
            </footer>
            </main>
        </>
    )
}

export default Login;