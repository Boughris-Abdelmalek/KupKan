import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faInfoCircle, faArrowLeftLong  } from "@fortawesome/free-solid-svg-icons";
import updateStyles from './updateStyles.module.scss';
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import logo from '../logo.png'

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;// user regex to validate user input
const PWD_REGEX = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/; //password regex to validate correct password pattern
const REGISTER_URL = 'http://5.22.217.225:5000/users/';

const Update = () => {

    //checking the validation of the user input for registration
    const userRef = useRef();
    const errorRef = useRef();

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bio, setBio] = useState('');

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);
    
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [navigateToLogin, setNavigateToLogin] = useState(false);
    
    //state  for possible error message and success message
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])//set focus on username input when loading

    useEffect(() => {
        const result = USER_REGEX.test(user);
        console.log(result);
        console.log(user);
        setValidName(result);
    }, [user])//to validate the username

    useEffect(() => {
        const result = PWD_REGEX.test(password);
        console.log(result);
        console.log(password);
        setValidPassword(result);
    }, [password])//validate the password

    useEffect(() => {
        setErrorMessage('');
    }, [user, password])// display errror message for each invalid input

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(password);
        if (!v1 || !v2) {
            setErrorMessage("Invalid Entry");
            return;
        }
        try {
            const response = await axios.patch(REGISTER_URL + JSON.parse(atob(sessionStorage.getItem('token').split('.')[1])).userId, {
                firstname: firstName,
                lastname: lastName,
                bio: bio,
                username: user, 
                email: email, 
                password: password
        }
            );
            console.log(response?.data);
            console.log(JSON.stringify(response))
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setUser('');
            setPassword('');
        } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 409) {
                setErrorMessage('Username Taken');
            } else {
                setErrorMessage('Registration Failed')
            }
            errorRef.current.focus();
        }

        setNavigateToLogin(true);
    }

    if (navigateToLogin) {
        return <Navigate to='/' />
    }
    
    return (
        <>
            <p ref={errorRef} className={errorMessage ? "errmsg" : "offscreen"} aria-live="assertive">{errorMessage}</p>

            <main className={updateStyles.login}>
            <div className={updateStyles.logo}>
            <img src={logo} className='logoApp' alt='logo brand'/>
                <h1 className={updateStyles.appName}>KupKan</h1>
            </div>
                        <h1 className={updateStyles.title}>Update your data</h1>
                        <p className={updateStyles.instructions}>you can change it at any time !</p>
                        <Link to='/Profile' className={updateStyles.back}>
                            <FontAwesomeIcon icon={faArrowLeftLong} />
                            Back
                        </Link>
                        <form onSubmit={handleSubmit} className={updateStyles.form}>
                        <input 
                             type="text"
                             onChange={(e) => setFirstName(e.target.value)}
                             value={firstName}
                             placeholder='new firstName'
                             />
                             <input 
                             type="text"
                             onChange={(e) => setLastName(e.target.value)}
                             value={lastName}
                             placeholder='new lastName'
                             />
                             <input 
                             type="text"
                             onChange={(e) => setBio(e.target.value)}
                             value={bio}
                             placeholder='new bio'
                             />
                            <input 
                             type="text"
                             id="username"
                             ref={userRef}
                             autoComplete="off"
                             onChange={(e) => setUser(e.target.value)}
                             value={user}
                             required
                             aria-invalid={validName ? "false" : "true"}
                             aria-describedby="uidnote"
                             placeholder="new username"
                             onFocus={() => setUserFocus(true)}
                             onBlur={() => setUserFocus(false)} 
                             />
                             <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>
                        <input 
                             type="email"
                             onChange={(e) => setEmail(e.target.value)}
                             value={email}
                             placeholder='new email'

                             />
                            <input 
                             type="password"
                             onChange={(e) => setPassword(e.target.value)}
                             value={password}
                             required
                             aria-invalid={validPassword ? "false" : "true"}
                             aria-describedby="pwdnote"
                             placeholder="new password"
                             onFocus={() => setPasswordFocus(true)}
                             onBlur={() => setPasswordFocus(false)}
                             />
                             <p id="pwdnote" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>


                        <button disabled={!validName || !validPassword ? true : false} type='submit'>Sign Up</button>


                        </form>
            <footer className={updateStyles.footer}>
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

export default Update;