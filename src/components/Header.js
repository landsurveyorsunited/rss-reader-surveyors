import React from 'react'
import {NavLink} from 'react-router-dom'
import 'bootstrap/dist/js/bootstrap.bundle';

export const Header = () => {
  return (
    <header className='header'>
      <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <NavLink to="/" className="navbar-brand">Land Surveyor News</NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarRSSFeed" aria-controls="navbarRSSFeed" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-between align-items-center buttons-container" id="navbarRSSFeed">
            <div className="navbar-nav">
              <NavLink to="/news-feed" className={({isActive}) => ('nav-link ' + (isActive ? "active" : ''))}>Surveying News</NavLink>
              <NavLink to="/photos-feed" className={({isActive}) => ('nav-link ' + (isActive ? "active" : ''))}>Surveyor Photos</NavLink>
              <NavLink to="/about" className={({isActive}) => ('nav-link ' + (isActive ? "active" : ''))}>About</NavLink>
            </div>
            <div className='navbar-nav'>
              <NavLink to="/configuration" className={({isActive}) => ('nav-link ' + (isActive ? "active" : ''))}><span>Configuration </span><i className='fa fa-gear fa-2x' /></NavLink>
            </div>
          </div>

        </div>
      </nav>
    </header>
  )
}
