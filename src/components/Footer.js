import React, { useContext } from 'react'
import { FeedRSSContext } from './context/FeedRSSContext'

export const Footer = () => {

  const {vars} = useContext (FeedRSSContext);
  
  return (
    <footer className='footer border-top mt-5'>
      <div className='container-fluid container-md'>
        <div className='row my-4 align-items-center'>
          <div className={"col-12 col-md-8 text " + (vars.dark_mode ? '' : 'text-primary') } >
            Land Surveyors United Community RSS Reader V1
          </div>

          <div className="col-12 col-md-4 icons text-primary">
            <a className="" href="https://twitter.com/landsurveyorsU"  target="_blank" rel="noreferrer"><i className="fa-brands fa-twitter fa-2x"></i></a>
            <a className=" ms-3" href="https://landsurveyorsunited.com"  target="_blank" rel="noreferrer"><i className="fa-brands fa-github fa-2x"></i></a>
            <a className=" ms-3" href="https://www.linkedin.com/groups/3935739/" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin-in fa-2x"></i></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
