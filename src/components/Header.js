import React from 'react'
import {NavLink} from 'react-router-dom'

export const Header = () => {
  return (
    <div className='header'>
      <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand">RSS Tennis Feed</NavLink>
          <div className="collapse navbar-collapse" id="navbarRSSFeed">
            <div className="navbar-nav">
              <NavLink to="/news-feed" className={({isActive}) => ('nav-link ' + (isActive ? "active" : ''))}>News</NavLink>
              <NavLink to="/photos-feed" className={({isActive}) => ('nav-link ' + (isActive ? "active" : ''))}>Photos</NavLink>
            </div>
            <div className="navbar-nav ">
              <NavLink to="/configuration" className={({isActive}) => ('nav-link ' + (isActive ? "active" : ''))}>Config</NavLink>
            </div>
          </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarRSSFeed" aria-controls="navbarRSSFeed" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>
    </div>
  )
}
