import React, { useContext } from 'react'
import { FeedRSSContext } from '../context/FeedRSSContext'

export const NoItems = () => {

  const {vars} = useContext (FeedRSSContext);
  return (
    <div className={"no-items fw-bold " + (vars.dark_mode ? '' : 'text-primary')}>
        <span>No items to show.</span>
    </div>
  )
}
