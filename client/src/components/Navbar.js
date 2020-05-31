import React, {useContext} from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import {AuthContext} from "../context/AuthContext";

export const Navbar = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);

    const logoutHandler = (event) =>  {
        event.preventDefault();
        auth.logout();
        history.push('/')
    };

    return (
        <nav>
            <div className="nav-wrapper blue darken-1">
                <a href="/" className="brand-logo">Shorten the link</a>
                <ul id="nav-mobile" className="right ">
                    <li><NavLink to="/create">Create</NavLink></li>
                    <li><NavLink to="/links">Links</NavLink></li>
                    <li><a href="/" onClick={logoutHandler}>Logout</a></li>
                </ul>
            </div>
        </nav>
    );
};//hide-on-med-and-down