import React from 'react'

export const Footer = () => {
  return (
    <div className='footer border-top mt-5'>
      <div className='container'>
        <footer className="d-flex flex-wrap justify-content-between align-items-center my-4 ">
          <div className="col-md-4 d-flex align-items-center text-primary">
            RSS Tennis Feed - Developed by @rafasanabria1
          </div>

          <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
            <li className="ms-3"><a className="text-primary" href="https://twitter.com/rafasanabria1"  target="_blank" rel="noreferrer"><i className="fa-brands fa-twitter fa-2x"></i></a></li>
            <li className="ms-3"><a className="text-primary" href="https://github.com/rafasanabria1"  target="_blank" rel="noreferrer"><i className="fa-brands fa-github fa-2x"></i></a></li>
            <li className="ms-3"><a className="text-primary" href="https://www.linkedin.com/in/rafasanabria1/" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin-in fa-2x"></i></a></li>
          </ul>
        </footer>
      </div>
    </div>
  )
}
