import React, { useContext } from 'react'
import { FeedRSSContext } from '../context/FeedRSSContext'

export const Loading = () => {

  const {vars} = useContext (FeedRSSContext);
  return (
    <div className={"loading fw-bold " + (vars.dark_mode ? '' : 'text-primary')}>
        <span>Loading RSS Feeds <i className="fa-solid fa-spinner fa-spin"></i></span>
    </div>
  )
}
