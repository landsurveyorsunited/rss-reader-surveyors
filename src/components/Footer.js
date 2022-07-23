import React from 'react'

export const Footer = () => {
  return (
    <footer className='footer border-top mt-5'>
      <div className='container-fluid container-md'>
        <div className='row my-4 align-items-center'>
          <div className="text-primary col-12 col-md-8 text">
            RSS Tennis Feed - Developed by @rafasanabria1
          </div>

          <div className="col-12 col-md-4 icons">
            <a className="text-primary" href="https://twitter.com/rafasanabria1"  target="_blank" rel="noreferrer"><i className="fa-brands fa-twitter fa-2x"></i></a>
            <a className="text-primary ms-3" href="https://github.com/rafasanabria1"  target="_blank" rel="noreferrer"><i className="fa-brands fa-github fa-2x"></i></a>
            <a className="text-primary ms-3" href="https://www.linkedin.com/in/rafasanabria1/" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin-in fa-2x"></i></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
