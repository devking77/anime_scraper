const express = require('express');

const app = express();
const PORT = 3000;
const axios=require('axios');
const HIANIME = require('./scraper/hianime');

const hianime=new HIANIME()





const headers={

    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
    // "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
}



app.get('/', async (req, res) => {
    res.json("Welcome , Check the API with different endpoints")

});



app.get('/source/:anime_id/:category/:server_name', async (req, res) => {
    const anime=req.params
    // console.log(anime)
    const data=await hianime.fetchSources(anime.anime_id,anime.server_name,anime.category)
    // const url=data?.sources?.[0]?.url
    // const sources=[]
    // // console.log(url)
    // const {data:qualities}=await axios.get(url,{"headers":headers})

    // const split=qualities.split('\n')

    // for (line of split){

    //     const pattern = /RESOLUTION=(\d+x\d+).*?URI="([^"]+)"/;

    //     const match = line.match(pattern);
    //     if (match) {
    //         const resolution = match[1];
    //         const uri = match[2];
    //         console.log(resolution.split("x")[1]);
    //         console.log(uri);
    //         sources.push({"quality":resolution.split("x")[1],"url":url.split("master.m3u8")[0].concat(uri)})

    //     }




    // }
    ls -a


    // data.sources=sources



    res.json(data)




});


app.get('/animeDetails/:anime_id', async (req, res) => {
    const anime_id=req.params.anime_id
    const data=await hianime.fetchAnimeInfo(anime_id)
    res.json(data)

});



app.get('/servers/:anime_id', async (req, res) => {
    const anime_id=req.params.anime_id
    const data=await hianime.fetchServers(anime_id)
    res.json(data)

});

app.get('/search/:query/:page?', async (req, res) => {
    const { query, page = 1 } = req.params; 

    const data=await hianime.search(query,page)
    res.json(data)

});

app.get('/topAiring/:page?', async (req, res) => {
    const {page = 1 } = req.params; 

    const data=await hianime.fetchTopAiring(page)
    res.json(data)

});

app.get('/mostPopular/:page?', async (req, res) => {
    const {page = 1 } = req.params; 

    const data=await hianime.fetchMostPopular(page)
    res.json(data)

});


app.get('/mostFavourite/:page?', async (req, res) => {
    const {page = 1 } = req.params; 

    const data=await hianime.fetchMostFavorite(page)
    res.json(data)

});



app.get('/latestCompleted/:page?', async (req, res) => {
    const {page = 1 } = req.params; 

    const data=await hianime.fetchLatestCompleted(page)
    res.json(data)

});



app.get('/recentlyAdded/:page?', async (req, res) => {
    const {page = 1 } = req.params; 

    const data=await hianime.fetchRecentlyAdded(page)
    res.json(data)

});



app.get('/topUpcoming/:page?', async (req, res) => {
    const {page = 1 } = req.params; 

    const data=await hianime.fetchTopUpcoming(page)
    res.json(data)

});



app.get('/special/:page?', async (req, res) => {
    const {page = 1 } = req.params; 

    const data=await hianime.fetchSpecial(page)
    res.json(data)

});


app.get('/spotlight', async (req, res) => {
    const {page = 1 } = req.params; 

    const data=await hianime.fetchSpotlight(page)
    res.json(data)

});




app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);



});
