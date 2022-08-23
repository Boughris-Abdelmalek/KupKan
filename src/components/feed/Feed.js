import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import feedStyles from './feedStyles.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faHeart, faComment, faPaperPlane, faUser } from '@fortawesome/free-regular-svg-icons';
import coverPicture from '../profile/profileImages/rubyBanner.jpg';
import profilePicture from '../profile/profileImages/ruby.jpg';
import logo from '../logo.png';

const Feed = () => {

    const [userName, setUserName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bio, setBio] = useState('');
    const [following, setFollowing] = useState('');
    const [followers, setFollowers] = useState('');
    
    const [tweet, setTweet] = useState('');
    const [userTweet, setUserTweet] = useState([]);
    const [activateComments, setActivateComments] = useState(false);
    const [comments, setComments] = useState('');
    const [reply, setReply] = useState([]);

    const [suggestions, setSuggestions] = useState([]);

    const [notification, setNotification] = useState('');

    const [feedNews, setFeedNews] = useState([]);
    
    const navigate = useNavigate();

    const logout = () => {//logout function
        navigate('/');
        sessionStorage.setItem('token', '');
    }

    const userProfile = () => {
        navigate('/Profile');
    }

    const suggestion = () => {
        navigate('/Suggestion');
    }

    useEffect(() => {//getting tweets of a user
        
        const options = {
            method: 'GET',
            url: `http://5.22.217.225:5000/twt/${JSON.parse(atob(sessionStorage.getItem('token').split('.')[1])).userId}`,
            headers: {'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`}
          };
          
          axios.request(options)
            .then(response => {
            setUserTweet(response.data);
          })
    }, [])

    const activateComment = () => {
        if (!activateComments) setActivateComments(true);
        else setActivateComments(false);
    }

    useEffect(() => {//getting data from the loggedIn user
        
        (
            async () => {
                const {data} = await axios.get(`http://5.22.217.225:5000/users/${JSON.parse(atob(sessionStorage.getItem('token').split('.')[1])).userId}`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                })

                setUserName(data.username);
                setFirstName(data.firstname);
                setLastName(data.lastname);
                setBio(data.bio);
                setFollowing(data.following);
                setFollowers(data.followers);
            }
        )();
    }, [])

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
            setSuggestions(response.data);
          })
    }, [])

const share = e => {//posting a tweet
    e.preventDefault();

    const options = {
        method: 'POST',
        url: 'http://5.22.217.225:5000/twt/',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        },
        data: {
            text: tweet, 
            userId: JSON.parse(atob(sessionStorage.getItem('token').split('.')[1])).userId
        }
      };
      
      axios.request(options);
    
    setTweet('');

};

/* useEffect(() => {//getting the newsfeed
    const options = {
        method: 'GET',
        url: 'http://5.22.217.225:5000/newsfeed/',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      };
      
      axios.request(options)
        .then(response => {
            console.log(response.data);
            setFeedNews(response.data);
    });
}, []) */

useEffect(() => {// getting notifications
    const options = {
        method: 'GET',
        url: 'http://5.22.217.225:5000/notifications',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      };
      
      axios.request(options)
        .then(response => {
        console.log(response.data);
            setNotification(response.data.length);
    });
}, [])

  return (
      <section className={feedStyles.container}>
        <header className={feedStyles.header}>
            <div className={feedStyles.logo}>
            <img src={logo} className='logoApp' alt='logo brand'/>
            <h1>KupKan</h1>
            </div>
            <ul>
                <li>
                    {notification}<FontAwesomeIcon icon={faBell} />
                    </li>
                <li onClick={userProfile}>
                    <FontAwesomeIcon icon={faUser} />
                    </li>
                <li onClick={logout} >
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                    </li>
            </ul>
        </header>

        <div className={feedStyles.profileCard}>
        <div className={feedStyles.bannerContainer}>
                    <img src={coverPicture} alt='coverPictureOfRuby' className={feedStyles.coverPicture}/>
                </div>
                <div className={feedStyles.personalInfos}>
                    <img src={profilePicture} alt='profilePictureOfRuby' className={feedStyles.profilePicture}/>
                    <div className={feedStyles.textInfos}>
                        <h3>{firstName} {lastName}</h3>
                        <h5>{userName}</h5>
                        <div>
                            <span>following {following.length}</span>
                            <p>{bio}</p>
                            <span>followers {followers.length}</span>
                        </div>
                    </div>
                    <button onClick={userProfile}>My profile</button>
                </div>
        </div>

        <div className={feedStyles.suggestions}>
        <h5>Suggestions</h5>
                <ul>
                    {
                        suggestions.map(item => {
                            return <li key={item.id}>{item.username}</li>
                        })
                    }
                </ul>
                <button onClick={suggestion}>Show more</button>
        </div>

        <form onSubmit={share} className={feedStyles.tweet}>
                <img src={profilePicture} alt='profilePictureOfRuby' className={feedStyles.profilePicture}/>
                <input 
                type='text' 
                placeholder="tweeet here "
                maxLength={195}//max length tweet
                className={feedStyles.tweetInput}
                value={tweet}
                onChange={e => setTweet(e.target.value)}
                />
                <button type="submit">tweet</button>
            </form>

        <div className={feedStyles.allTweets}>
        <div className={feedStyles.publicationContainer}>
                {userTweet.map(item => {
                    return (<div>
                        <div className={feedStyles.tweetArea}>
                            {item.text}
                        </div>
                        <div className={feedStyles.interactions}>
                            <button onClick={() => {
                                if (item.hearts.length === 0) {//like a post
                                    const options = {
                                       method: 'POST',
                                       url: 'http://5.22.217.225:5000/twt/like/',
                                       headers: {
                                         'Content-Type': 'application/json',
                                         Authorization: `Bearer ${sessionStorage.getItem('token')}`
                                       },
                                       data: {twtID: `${item['_id']}`}
                                     };
                                     
                                     axios.request(options);
                                } else {
                                    const options = {//unlike a post
                                        method: 'POST',
                                        url: 'http://5.22.217.225:5000/twt/unlike',
                                        headers: {
                                          'Content-Type': 'application/json',
                                          Authorization: `Bearer ${sessionStorage.getItem('token')}`
                                        },
                                        data: {twtID: `${item['_id']}`}
                                      };
                                      
                                      axios.request(options);
                                }
                            }}><FontAwesomeIcon icon={faHeart}
                            className={feedStyles.likes}
                            />{item.hearts.length}</button>

                            { activateComments && 
                            <div className={feedStyles.commentSections}>
                            <input
                            className={feedStyles.comments}
                            type='text'
                            maxLength={100}//max 100 char comments
                            onChange={e => setComments(e.target.value)}
                            />
                            <button onClick={() => {
                                const options = {//post the commments
                                    method: 'POST',
                                    url: 'http://5.22.217.225:5000/twt/reply',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${sessionStorage.getItem('token')}`
                                    },
                                    data: {text: comments, twtID: `${item['_id']}`}
                                  };
                                  
                                  axios.request(options);

                            }}><FontAwesomeIcon icon={faPaperPlane} /></button>
                            </div>
                            }
                            <button onClick={() => {
                                activateComment();
                                if (!activateComments) {
                                    const options = {//get the comments
                                        method: 'GET',
                                        url: `http://5.22.217.225:5000/twt/replies/${item['_id']}`,
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: `Bearer ${sessionStorage.getItem('token')}`
                                        }
                                      };
                                      
                                      axios.request(options).then(response => {
                                        setReply(response.data);
                                        console.log(response.data);
                                      });
                                }
                            }}>{item.replies.length}<FontAwesomeIcon icon={faComment}/></button>
                            <div className={feedStyles.reply} >
                                {activateComments &&//display correspondant tweet replies
                                    reply.map(e => {
                                        if(e.repliedTo === item['_id']) {
                                            return <p>{e.text}</p>
                                        }
                                    })
                                }
                                </div>
                        </div>
                    </div>
                    )
                })}
            </div>
        </div>

        <footer className={feedStyles.footer}>
        <ul>
            <li><a href='#'>About</a></li>
            <li><a href='#'>Content policy</a></li>
            <li><a href='#'>Privacy Policy</a></li>
            <li><a href='#'>Conditions</a></li>
            <li>copyright 2022 © KupKan</li>
        </ul>
        </footer>
      </section>
  )
}

export default Feed;