# Welcome to RSS Tennis Feed, a Tennis RSS feed reader

**[https://tennis-rss-reader-mouredev-challenge.vercel.app](https://tennis-rss-reader-mouredev-challenge.vercel.app)** 
Here you will be able to find the last news & photos about tennis.


## About the project

This APP have been developed by [@rafasanabria1](https://github.com/rafasanabria1) using ReactJS & Bootstrap to carry out the [@mourdev](https://www.twitch.tv/mouredev) monthly challenge.

You can find this APP Code in this [GitHub](https://github.com/rafasanabria1/tennis-rss-reader-mouredev-challenge) and more information about [@mouredev](https://www.twitch.tv/mouredev)'s monthly challenges in his [GitHub](https://github.com/mouredev/Monthly-App-Challenge-2022) and in his partner [@rviewer](https://go.rviewer.io/dev-lector-rss-es/?utm_source=mouredev&utm_medium=github_repo&utm_campaign=rss_reader_mouredev).

Special thanks to [@messier31](https://github.com/messier31) for letting me use his proxy [cors-anywhere](https://fast-dawn-89938.herokuapp.com/https://ftw.usatoday.com/category/tennis/feed).


## How To Deploy

```
git clone git@github.com:rafasanabria1/tennis-rss-reader-mouredev-challenge.git
cd tennis-rss-reader-mouredev-challenge
npm install
```

In this project, we can use this two environments vars to define the proxy we will use to prevent CORS errors. 
```
REACT_APP_CORS_PROXY = '' // default: 'http://localhost'
REACT_APP_CORS_PORT = '' // default: 8080
```
**Note: For local use, I recommend to use with [cors-anywhere](https://github.com/Rob--W/cors-anywhere).**

After setting this two environments vars, we can finally start our project with:

```
npm start
```


## APP Live

You can see the APP deployed in Vercel in [https://tennis-rss-reader-mouredev-challenge.vercel.app](https://tennis-rss-reader-mouredev-challenge.vercel.app)
