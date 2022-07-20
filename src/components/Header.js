import React from 'react'
import {NavLink} from 'react-router-dom'

export const Header = () => {
  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand">RSS Tennis Feed</NavLink>
        <div className="collapse navbar-collapse" id="navbarRSSFeed">
          <div className="navbar-nav">
            <NavLink to="/news-feed" className={({isActive}) => ('nav-link ' + (isActive ? "active" : ''))}>News</NavLink>
            <NavLink to="/photos-feed" className={({isActive}) => ('nav-link ' + (isActive ? "active" : ''))}>Photos</NavLink>
            <NavLink to="/results-feed" className={({isActive}) => ('nav-link ' + (isActive ? "active" : ''))}>Results</NavLink>
            <NavLink to="/configuration" className={({isActive}) => ('nav-link ' + (isActive ? "active" : ''))}>Config <i className='fa-solid fa-gear' /></NavLink>
          </div>
        </div>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarRSSFeed" aria-controls="navbarRSSFeed" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
  )
}
