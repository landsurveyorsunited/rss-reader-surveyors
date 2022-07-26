import React, { useContext } from 'react'
import { FeedRSSContext } from './context/FeedRSSContext';

export const Configuration = () => {

    const {vars, setVars} = useContext (FeedRSSContext);

    const toggleFeed = (id) => {

        const newFeeds = vars.feeds.map ( feed => {
            if ( feed.id === id) {
                return {
                    ...feed,
                    loaded: (! feed.active) ? false : true,
                    active: ! feed.active
                }
            }
            return feed;
        });

        setVars ({
            ...vars,
            feeds: newFeeds
        });
    }

    const toggleDarkMode = () => {

        setVars ({
            ...vars,
            dark_mode: !vars.dark_mode
        })
    }

        
    return (
        <div className='configuration mt-5'>
            <div className='container'>
                <div className="row">
                    <div className='col-md-6 offset-md-3'>
                        <h3 className='text-center'>RSS Feed List</h3>
                    </div>
                </div>
            </div>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-6 offset-md-3'>
                        <div className='rss-sources'>
                            {
                                vars.feeds?.map (feed => (
                                    <div key={feed.id} className='item p-3 d-flex justify-content-between align-items-center'>

                                        { feed.active ? (
                                            <>
                                                <a href={feed.url} className={'text mr-3 fw-bold ' + (vars.dark_mode ? '' : 'text-primary')} target="_blank" rel="noreferrer" title="See XML Feed">{feed.name}</a>
                                                <button className={'btn btn-sm ' + (vars.dark_mode ? 'btn-outline-light' : 'btn-outline-danger')} onClick={() => toggleFeed (feed.id)}>Turn OFF</button> 
                                            </>
                                        ) : (
                                            <>
                                                <a href={feed.url} className={'text mr-3 ' + (vars.dark_mode ? '' : 'text-primary')} target="_blank" rel="noreferrer" title="See XML Feed">{feed.name}</a>
                                                <button className={'btn btn-sm ' + (vars.dark_mode ? 'btn-outline-light' : 'btn-outline-success')} onClick={() => toggleFeed (feed.id)} >Turn ON</button>
                                            </>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className='col-md-6 offset-md-3'>
                        <h3 className='text-center'>Toggle Dark Mode</h3>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className='col-md-4 text-center offset-md-4'>
                        {
                            vars.dark_mode ? (
                                <button className='btn btn-outline-light btn-lg' onClick={ () => toggleDarkMode ()}>Turn ON Light Mode</button>
                            ) : (
                                <button className='btn btn-outline-dark btn-lg' onClick={ () => toggleDarkMode ()}>Turn ON Dark Mode</button>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
