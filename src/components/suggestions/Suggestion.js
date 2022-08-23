import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import suggestionStyles from './suggestionStyles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faArrowLeftLong  } from "@fortawesome/free-solid-svg-icons";
import logo from '../logo.png';

const Suggestion = () => {

    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {//getting all users for suggestion section
        
        const options = {
            method: 'GET',
            url: 'http://5.22.217.225:5000/users/',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
          };
          
          axios.request(options).then(response => {
            console.log(response.data);
            setSuggestions(response.data);
          })
    }, [])

  return (
      <section className={suggestionStyles.container}>
          <header className={suggestionStyles.header}>
            <Link to='/Profile' className={suggestionStyles.back}>
                <FontAwesomeIcon icon={faArrowLeftLong} />Back</Link>
            <h3>Suggestions</h3>
            <div className={suggestionStyles.logo}>
            <img src={logo} className='logoApp' alt='logo brand'/>
            <h1>KupKan</h1>
            </div>
          </header>
          <main className={suggestionStyles.main}>
                {
                    suggestions.map(item => {
                        return <div className={suggestionStyles.userToFollow}>
                            <div>{item.username}</div>
                            <div className={suggestionStyles.followButtons}>
                            <button onClick={() => {
                                        const options = {
                                            method: 'POST',
                                            url: 'http://5.22.217.225:5000/users/follow',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                Authorization: `Bearer ${sessionStorage.getItem('token')}`
                                            },
                                            data: {
                                              userIDToBeFollowed: item['_id'],
                                              userID: JSON.parse(atob(sessionStorage.getItem('token').split('.')[1])).userId
                                            }
                                          };
                                          
                                          axios.request(options).then(response => {
                                            console.log(response.data);
                                          });
                                    }
                            }>follow</button>
                            <button onClick={() => {
                                        const options = {
                                            method: 'POST',
                                            url: 'http://5.22.217.225:5000/users/unfollow',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                Authorization: `Bearer ${sessionStorage.getItem('token')}`
                                            },
                                            data: {
                                                userIDToBeUnfollowed: item['_id'],
                                                userID: JSON.parse(atob(sessionStorage.getItem('token').split('.')[1])).userId
                                            }
                                          };
                                          
                                          axios.request(options).then(response => {
                                            console.log(response.data);
                                          });
                                    }
                            }>unfollow</button>
                            </div>
                        </div>
                    })
                }
          </main>
      </section>
  )
}

export default Suggestion;