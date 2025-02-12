"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

const cheer=require('cheerio')
const utils_1 = require("./utils");

const axios=require('axios')

const popular_url="https://hianime.to/most-popular"
const baseUrl="https://hianime.to"

const headers={

    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
    // "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
}

// async getServer() {
    
//     const {data}=await axios.get(url,{"headers":headers})
//     const html=cheer.load(data)
//     // console.log(data)
    
    
// }

const SubOrSub={}
SubOrSub["SUB"] = "sub";
SubOrSub["DUB"] = "dub";
SubOrSub["BOTH"] = "both";


const StreamingServers={}
StreamingServers["AsianLoad"] = "asianload";
StreamingServers["GogoCDN"] = "gogocdn";
StreamingServers["StreamSB"] = "streamsb";
StreamingServers["MixDrop"] = "mixdrop";
StreamingServers["Mp4Upload"] = "mp4upload";
StreamingServers["UpCloud"] = "upcloud";
StreamingServers["VidCloud"] = "vidcloud";
StreamingServers["StreamTape"] = "streamtape";
StreamingServers["VizCloud"] = "vizcloud";
// same as vizcloud
StreamingServers["MyCloud"] = "mycloud";
StreamingServers["Filemoon"] = "filemoon";
StreamingServers["VidStreaming"] = "vidstreaming";
StreamingServers["SmashyStream"] = "smashystream";
StreamingServers["StreamHub"] = "streamhub";
StreamingServers["StreamWish"] = "streamwish";
StreamingServers["VidMoly"] = "vidmoly";
StreamingServers["Voe"] = "voe";







class HIANIME{


    constructor(){}


    async scrapeCardPage(url) {
    var _a, _b, _c;
    try {
        const res = {
            currentPage: 0,
            hasNextPage: false,
            totalPages: 0,
            results: [],
        };
        const { data } = await axios.get(url);
        const $ = (0, cheer.load)(data);
        const pagination = $('ul.pagination');
        res.currentPage = parseInt((_a = pagination.find('.page-item.active')) === null || _a === void 0 ? void 0 : _a.text());
        const nextPage = (_b = pagination.find('a[title=Next]')) === null || _b === void 0 ? void 0 : _b.attr('href');
        if (nextPage != undefined && nextPage != '') {
            res.hasNextPage = true;
        }
        const totalPages = (_c = pagination.find('a[title=Last]').attr('href')) === null || _c === void 0 ? void 0 : _c.split('=').pop();
        if (totalPages === undefined || totalPages === '') {
            res.totalPages = res.currentPage;
        }
        else {
            res.totalPages = parseInt(totalPages);
        }
        res.results = await this.scrapeCard($);
        if (res.results.length === 0) {
            res.currentPage = 0;
            res.hasNextPage = false;
            res.totalPages = 0;
        }
        return res;
    }
    catch (err) {
        console.log(err)
        // throw new Error('Something went wrong. Please try again later.',err);
    }
    
}

    async scrapeCard(html) {
        
        // const {data}=await axios.get(popular_url,{"headers":headers})
        // const html=cheer.load(data)
        // console.log(data)
        
        try {
            const results = [];
            html('.flw-item').each((i, ele) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                const card = html(ele);
                const atag = card.find('.film-name a');
                const id = (_a = atag.attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[1].split('?')[0];
                const type = (_c = (_b = card
                    .find('.fdi-item')) === null || _b === void 0 ? void 0 : _b.first()) === null || _c === void 0 ? void 0 : _c.text().replace(' (? eps)', '').replace(/\s\(\d+ eps\)/g, '');
                results.push({
                    id: id,
                    title: atag.text(),
                    // url: `${baseUrl}${atag.attr('href')}`,
                    image: (_d = card.find('img')) === null || _d === void 0 ? void 0 : _d.attr('data-src'),
                    duration: (_e = card.find('.fdi-duration')) === null || _e === void 0 ? void 0 : _e.text(),
                    japaneseTitle: atag.attr('data-jname'),
                    type: type,
                    nsfw: ((_f = card.find('.tick-rate')) === null || _f === void 0 ? void 0 : _f.text()) === '18+' ? true : false,
                    sub: parseInt((_g = card.find('.tick-item.tick-sub')) === null || _g === void 0 ? void 0 : _g.text()) || 0,
                    dub: parseInt((_h = card.find('.tick-item.tick-dub')) === null || _h === void 0 ? void 0 : _h.text()) || 0,
                    episodes: parseInt((_j = card.find('.tick-item.tick-eps')) === null || _j === void 0 ? void 0 : _j.text()) || 0,
                });
            });
            // console.log(results)
            return results;
        }
        catch (err) {
            console.log('Something went wrong. Please try again later.',err);
        }
    }

    retrieveServerId = ($, index, subOrDub) => {
            return $(`.ps_-block.ps_-block-sub.servers-${subOrDub} > .ps__-list .server-item`)
                .map((i, el) => ($(el).attr('data-server-id') == `${index}` ? $(el) : null))
                .get()[0]
                .attr('data-id');
        };



    async fetchAnimeInfo(id) {

        const info = {
            id: id,
            title: '',
        };

        try {
            const { data } = await axios.get(`${baseUrl}/watch/${id}`);
            const $ = (0, cheer.load)(data);
            const { mal_id, anilist_id } = JSON.parse($('#syncData').text());
            info.malID = Number(mal_id);
            info.alID = Number(anilist_id);
            info.title = $('h2.film-name > a.text-white').text();
            info.japaneseTitle = $('div.anisc-info div:nth-child(2) span.name').text();
            info.image = $('img.film-poster-img').attr('src');
            info.description = $('div.film-description').text().trim();
            // Movie, TV, OVA, ONA, Special, Music
            info.type = $('span.item').last().prev().prev().text().toUpperCase();
            info.url = `${baseUrl}/${id}`;
            info.recommendations = await scrapeCard($);
            info.relatedAnime = [];
            $('#main-sidebar section:nth-child(1) div.anif-block-ul li').each((i, ele) => {
                var _a, _b, _c, _d, _e, _f, _g;
                const card = $(ele);
                const aTag = card.find('.film-name a');
                const id = (_a = aTag.attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[1].split('?')[0];
                info.relatedAnime.push({
                    id: id,
                    title: aTag.text(),
                    url: `${baseUrl}${aTag.attr('href')}`,
                    image: (_b = card.find('img')) === null || _b === void 0 ? void 0 : _b.attr('data-src'),
                    japaneseTitle: aTag.attr('data-jname'),
                    type: (_d = (_c = card.find('.tick').contents().last()) === null || _c === void 0 ? void 0 : _c.text()) === null || _d === void 0 ? void 0 : _d.trim(),
                    sub: parseInt((_e = card.find('.tick-item.tick-sub')) === null || _e === void 0 ? void 0 : _e.text()) || 0,
                    dub: parseInt((_f = card.find('.tick-item.tick-dub')) === null || _f === void 0 ? void 0 : _f.text()) || 0,
                    episodes: parseInt((_g = card.find('.tick-item.tick-eps')) === null || _g === void 0 ? void 0 : _g.text()) || 0,
                });
            });
            const hasSub = $('div.film-stats div.tick div.tick-item.tick-sub').length > 0;
            const hasDub = $('div.film-stats div.tick div.tick-item.tick-dub').length > 0;
            if (hasSub) {
                info.subOrDub = SubOrSub.SUB;
                info.hasSub = hasSub;
            }
            if (hasDub) {
                info.subOrDub =SubOrSub.DUB;
                info.hasDub = hasDub;
            }
            if (hasSub && hasDub) {
                info.subOrDub = SubOrSub.BOTH;
            }
            const episodesAjax = await axios.get(`${baseUrl}/ajax/v2/episode/list/${id.split('-').pop()}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    Referer: `${baseUrl}/watch/${id}`,
                },
            });
            const $$ = (0, cheer.load)(episodesAjax.data.html);
            info.totalEpisodes = $$('div.detail-infor-content > div > a').length;
            info.episodes = [];
            $$('div.detail-infor-content > div > a').each((i, el) => {
                var _a, _b, _c, _d;
                const episodeId = (_c = (_b = (_a = $$(el).attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[2]) === null || _b === void 0 ? void 0 : _b.replace('?ep=', '$episode$')) === null || _c === void 0 ? void 0 : _c.concat(`$${info.subOrDub}`);
                const number = parseInt($$(el).attr('data-number'));
                const title = $$(el).attr('title');
                const url = baseUrl + $$(el).attr('href');
                const isFiller = $$(el).hasClass('ssl-item-filler');
                (_d = info.episodes) === null || _d === void 0 ? void 0 : _d.push({
                    id: episodeId,
                    number: number,
                    title: title,
                    isFiller: isFiller,
                    url: url,
                });
            });
            return info;
        }
        catch (err) {
        console.log(err);
        }
        
    }

    async fetchServers(episodeId) {
        const res = {
        sub: [],
        dub: [],
        raw: [],
        episodeId,
        episodeNo: 0
        };
        episodeId = `${baseUrl}/watch/${episodeId
        .replace('$episode$', '?ep=')
        .replace(/\$auto|\$sub|\$both|\$dub/gi, '')}`
        try {
            // console.log(episodeId)
        if (episodeId.trim() === "" || episodeId.indexOf("?ep=") === -1) {
            console.log(
            "invalid anime episode id",
            );
            return
        }
        const epId = episodeId.split("?ep=")[1];
        //   console.log(epId)
        const { data } = await axios.get(
            `${baseUrl}/ajax/v2/episode/servers?episodeId=${epId}`,
            {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                Referer: new URL(`/watch/${episodeId}`, baseUrl).href,
                "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",


            }
            }
        );
        //   console.log(data)
        const $ = cheer.load(data.html);
        const epNoSelector = ".server-notice strong";
        res.episodeNo = Number($(epNoSelector).text().split(" ").pop()) || 0;
        $(`.ps_-block.ps_-block-sub.servers-sub .ps__-list .server-item`).each(
            (_, el) => {
            res.sub.push({
                serverName: $(el).find("a").text().toLowerCase().trim(),
                serverId: Number($(el)?.attr("data-server-id")?.trim()) || null
            });
            }
        );
        $(`.ps_-block.ps_-block-sub.servers-dub .ps__-list .server-item`).each(
            (_, el) => {
            res.dub.push({
                serverName: $(el).find("a").text().toLowerCase().trim(),
                serverId: Number($(el)?.attr("data-server-id")?.trim()) || null
            });
            }
        );
        $(`.ps_-block.ps_-block-sub.servers-raw .ps__-list .server-item`).each(
            (_, el) => {
            res.raw.push({
                serverName: $(el).find("a").text().toLowerCase().trim(),
                serverId: Number($(el)?.attr("data-server-id")?.trim()) || null
            });
            }
        );
        return res;
        } catch (err) {
        console.log(err)
        }
    }
    



    async fetchSources(episodeId,server = StreamingServers.VidCloud,category) {
        var _a;
                // console.log(episodeId)
                if (episodeId.startsWith('http')) {
                    const serverUrl = new URL(episodeId);
                    switch (server) {
                        case StreamingServers.VidStreaming:
                        case StreamingServers.VidCloud:
                        case "hd-1":
                        case "hd-2":    
                            return {
                                ...(await new utils_1.MegaCloud().extract(serverUrl)),
                            };
                        case StreamingServers.StreamSB:
                            return {
                                headers: {
                                    Referer: serverUrl.href,
                                    watchsb: 'streamsb',
                                    'User-Agent': utils_2.USER_AGENT,
                                },
                                sources: await new utils_1.StreamSB(proxyConfig,adapter).extract(serverUrl, true),
                            };
                        case StreamingServers.StreamTape:
                            return {
                                headers: { Referer: serverUrl.href, 'User-Agent': utils_2.USER_AGENT },
                                sources: await new utils_1.StreamTape(proxyConfig,adapter).extract(serverUrl),
                            };
                        default:
                            return {
                                headers: { Referer: serverUrl.href },
                                ...(await new utils_1.MegaCloud().extract(serverUrl)),
                            };
                    }
                }
                if (!episodeId.includes('$episode$')){
                    console.log('Invalid episode id');
                    return
                }
                // Fallback to using sub if no info found in case of compatibility
                // TODO: add both options later
                // const subOrDub = ((_a = episodeId.split('$')) === null || _a === void 0 ? void 0 : _a.pop()) === 'dub' ? 'dub' : 'sub';
                const subOrDub=category
                episodeId = `${baseUrl}/watch/${episodeId
                    .replace('$episode$', '?ep=')
                    .replace(/\$auto|\$sub|\$both|\$dub/gi, '')}`;
                // console.log(episodeId.split('?ep=')[1])
                const epId=episodeId.split('?ep=')[1];
                try {
                    const { data } = await axios.get(
                        `${baseUrl}/ajax/v2/episode/servers?episodeId=${epId}`,
                        {
                        headers: {
                            "X-Requested-With": "XMLHttpRequest",
                            Referer: new URL(`/watch/${episodeId}`, baseUrl).href,
                            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
                
                
                        }
                        }
                    );
                    // console.log(typeof(data.html),"here")
                    const $ = cheer.load(data?.html);
                    /**
                     * vidtreaming -> 4
                     * rapidcloud  -> 1
                     * streamsb -> 5
                     * streamtape -> 3
                     */
                    let serverId = '';
                    try {
                        switch (server) {
                            case StreamingServers.VidCloud:
                            case "hd-2":
                                serverId =this.retrieveServerId($, 1, subOrDub);
                                // zoro's vidcloud server is rapidcloud
                                if (!serverId)
                                    throw new Error('RapidCloud not found');
                                break;
                            case StreamingServers.VidStreaming:
                            case "hd-1":
                                console.log("hd-1 case")
                                serverId =this.retrieveServerId($, 4, subOrDub);
                                // zoro's vidcloud server is rapidcloud
                                if (!serverId)
                                    throw new Error('vidtreaming not found');
                                break;
                            case StreamingServers.StreamSB:
                                serverId =this.retrieveServerId($, 5, subOrDub);
                                if (!serverId)
                                    throw new Error('StreamSB not found');
                                break;
                            case StreamingServers.StreamTape:
                                serverId =this.retrieveServerId($, 3, subOrDub);
                                if (!serverId)
                                    throw new Error('StreamTape not found');
                                break;
                        }
                    }
                    catch (err) {
                        console.log(err,console.trace())
                    }
                    const { data: { link }, } = await axios.get(`${baseUrl}/ajax/v2/episode/sources?id=${serverId}`);
                    // console.log(link,serverId)
                    return await this.fetchSources(link, server);
                }
                catch (err) {
                    throw err;
                }
        
    }



    async fetchSpotlight() {
        try {
            const res = { results: [] };
            const { data } = await axios.get(`${baseUrl}/home`);
            const $ = (0, cheerio_1.load)(data);
            $('#slider div.swiper-wrapper div.swiper-slide').each((i, el) => {
                var _a, _b, _c;
                const card = $(el);
                const titleElement = card.find('div.desi-head-title');
                const id = ((_b = (_a = card
                    .find('div.desi-buttons .btn-secondary')
                    .attr('href')) === null || _a === void 0 ? void 0 : _a.match(/\/([^/]+)$/)) === null || _b === void 0 ? void 0 : _b[1]) || null;
                const img = card.find('img.film-poster-img');
                res.results.push({
                    id: id,
                    title: titleElement.text(),
                    japaneseTitle: titleElement.attr('data-jname'),
                    banner: img.attr('data-src') || img.attr('src') || null,
                    rank: parseInt((_c = card.find('.desi-sub-text').text().match(/(\d+)/g)) === null || _c === void 0 ? void 0 : _c[0]),
                    url: `${baseUrl}/${id}`,
                    type: card.find('div.sc-detail .scd-item:nth-child(1)').text().trim(),
                    duration: card.find('div.sc-detail > div:nth-child(2)').text().trim(),
                    releaseDate: card.find('div.sc-detail > div:nth-child(3)').text().trim(),
                    quality: card.find('div.sc-detail > div:nth-child(4)').text().trim(),
                    sub: parseInt(card.find('div.sc-detail div.tick-sub').text().trim()) || 0,
                    dub: parseInt(card.find('div.sc-detail div.tick-dub').text().trim()) || 0,
                    episodes: parseInt(card.find('div.sc-detail div.tick-eps').text()) || 0,
                    description: card.find('div.desi-description').text().trim(),
                });
            });
            return res;
        }
        catch (error) {
            throw new Error('Something went wrong. Please try again later.');
        }
    }



    /**
     * @param query Search query
     * @param page Page number (optional)
     */
    search(query, page = 1) {
        if (0 >= page) {
            page = 1;
        }
        return this.scrapeCardPage(`${baseUrl}/search?keyword=${decodeURIComponent(query)}&page=${page}`);
    }
    /**
     * @param page number
     */
    fetchTopAiring(page = 1) {
        if (0 >= page) {
            page = 1;
        }
        return this.scrapeCardPage(`${baseUrl}/top-airing?page=${page}`);
    }
    /**
     * @param page number
     */
    fetchMostPopular(page = 1) {
        if (0 >= page) {
            page = 1;
        }
        return this.scrapeCardPage(`${baseUrl}/most-popular?page=${page}`);
    }
    /**
     * @param page number
     */
    fetchMostFavorite(page = 1) {
        if (0 >= page) {
            page = 1;
        }
        return this.scrapeCardPage(`${baseUrl}/most-favorite?page=${page}`);
    }
    /**
     * @param page number
     */
    fetchLatestCompleted(page = 1) {
        if (0 >= page) {
            page = 1;
        }
        return this.scrapeCardPage(`${baseUrl}/completed?page=${page}`);
    }
    /**
     * @param page number
     */
    fetchRecentlyUpdated(page = 1) {
        if (0 >= page) {
            page = 1;
        }
        return this.scrapeCardPage(`${baseUrl}/recently-updated?page=${page}`);
    }
    /**
     * @param page number
     */
    fetchRecentlyAdded(page = 1) {
        if (0 >= page) {
            page = 1;
        }
        return this.scrapeCardPage(`${baseUrl}/recently-added?page=${page}`);
    }
    /**
     * @param page number
     */
    fetchTopUpcoming(page = 1) {
        if (0 >= page) {
            page = 1;
        }
        return this.scrapeCardPage(`${baseUrl}/top-upcoming?page=${page}`);
    }
    /**
     * @param studio Studio id, e.g. "toei-animation"
     * @param page page number (optional) `default 1`
     */
    fetchStudio(studio, page = 1) {
        if (0 >= page) {
            page = 1;
        }
        return this.scrapeCardPage(`${baseUrl}/producer/${studio}?page=${page}`);
    }
    /**
     * @param page number
     */
    fetchSubbedAnime(page = 1) {
        if (0 >= page) {
            page = 1;
        }
        return this.scrapeCardPage(`${baseUrl}/subbed-anime?page=${page}`);
    }
    /**
     * @param page number
     */
    fetchDubbedAnime(page = 1) {
        if (0 >= page) {
            page = 1;
        }
        return this.scrapeCardPage(`${baseUrl}/dubbed-anime?page=${page}`);
    }
    /**
     * @param page number
     */
    fetchMovie(page = 1) {
        if (0 >= page) {
            page = 1;
        }
        return this.scrapeCardPage(`${baseUrl}/movie?page=${page}`);
    }
    /**
     * @param page number
     */
    fetchTV(page = 1) {
        if (0 >= page) {
            page = 1;
        }
        return this.scrapeCardPage(`${baseUrl}/tv?page=${page}`);
    }
    /**
     * @param page number
     */
    fetchOVA(page = 1) {
        if (0 >= page) {
            page = 1;
        }
        return this.scrapeCardPage(`${baseUrl}/ova?page=${page}`);
    }
    /**
     * @param page number
     */
    fetchONA(page = 1) {
        if (0 >= page) {
            page = 1;
        }
        return this.scrapeCardPage(`${baseUrl}/ona?page=${page}`);
    }
    /**
     * @param page number
     */
    fetchSpecial(page = 1) {
        if (0 >= page) {
            page = 1;
        }
        return this.scrapeCardPage(`${baseUrl}/special?page=${page}`);
    }


}



// (async () => {
//   const hianime = new HIANIME();
// //   const anime = await zoro.search('classroom of the elite');
// //   const popular=await scrapeCard()

//   const popular={
//     id: 'demon-slayer-kimetsu-no-yaiba-swordsmith-village-arc-18056',
//     title: 'Demon Slayer: Kimetsu no Yaiba Swordsmith Village Arc',
//     image: 'https://cdn.noitatnemucod.net/thumbnail/300x400/100/db2f3ce7b9cab7fdc160b005bffb899a.png',
//     duration: '24m',
//     japaneseTitle: 'Kimetsu no Yaiba: Katanakaji no Sato-hen',
//     type: 'TV',
//     nsfw: true,
//     sub: 11,
//     dub: 11,
//     episodes: 11
//   }
// //   console.log(popular[5])
// //   const info=await fetchAnimeInfo(popular.id)
// //   console.log(info.episodes[0].id)

//   const id="demon-slayer-kimetsu-no-yaiba-swordsmith-village-arc-18056$episode$100090$both"
//   const id2="solo-leveling-season-2-arise-from-the-shadow-19413$episode$131394$both"
// //   const servers=await fetchServers(id2)
//   const servers={
//     sub: [
//       { serverName: 'hd-1', serverId: 4 },
//       { serverName: 'hd-2', serverId: 1 }
//     ],
//     dub: [
//       { serverName: 'hd-1', serverId: 4 },
//       { serverName: 'hd-2', serverId: 1 }
//     ],
//     raw: [],
//     episodeId: 'solo-leveling-season-2-arise-from-the-shadow-19413$episode$131394$both',
//     episodeNo: 1
//   }
// //   console.log(servers)
// //   const sources=await hianime.fetchSources(id2,servers.dub[0].serverName,"dub")
// //   console.log(sources)

//     console.log(await hianime.fetchMostPopular())


 
// })();




// exports.default = getServer;
module.exports=HIANIME
