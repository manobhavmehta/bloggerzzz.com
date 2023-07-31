import {Link} from "react-router-dom";
import React,{useEffect,useState,useContext} from "react";
import { UserContext } from "./UserContext";
export default function Header()
{
    const {setUserInfo,userInfo} = useContext(UserContext);
    useEffect(() => {
    fetch('http://localhost:4000/profile',{
      credentials: 'include',
    }).then(response  => {
      response.json().then(userInfo =>{
        setUserInfo(userInfo);
      })
    })
  },[]);

    function logout(){
      fetch('http://localhost:4000/logout' ,{
        credentials: 'include',
        method: 'POST'
      })
      setUserInfo({}); 
    }

    const username = userInfo?.username;

    return(
    <header>
      <Link to="/" className = "logo">Bloggerzz</Link>
      <nav>
        {username && (
          <>
            <Link to = "/create">Create new post</Link>
            <a onClick={logout}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login" className="login">Login</Link>
            <Link to="/register" className = "register">Register </Link>
          </>
        )}
      </nav>
    </header>
    );
}