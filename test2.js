const axios=require('axios')




const headers={

    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
    // "Referer":"https://streamwithdev.rf.gd/",
    // "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
}


async function get() {
    

const {data}=await axios.get("https://fds.jonextugundu.net/_v7/aa7b11cccfc0ca27eac8a307a87b5611ebb845f141ca1019149941588b1ade9e2316adf4931dbdb35e08a81d41a50eccd7d8a3908112d6ac6b045cc135f3c37fe922f4b659f75e81c73ff8ba410157479623f8cb695679a684f81317cb23f9a761fdd72715742e93a14348cc22e4030368862db88619c7c728545553d270ea5f/master.m3u8",{"headers":headers})
console.log(data)

}

// (async()=>{
//     get()
// }


// )();


const string=`#EXTM3U
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=1752109,RESOLUTION=1920x1080,FRAME-RATE=25.000,CODECS="avc1.640032,mp4a.40.2"
index-f1-v1-a1.m3u8
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=956953,RESOLUTION=1280x720,FRAME-RATE=25.000,CODECS="avc1.64001f,mp4a.40.2"
index-f2-v1-a1.m3u8
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=426187,RESOLUTION=640x360,FRAME-RATE=25.000,CODECS="avc1.64001e,mp4a.40.2"
index-f3-v1-a1.m3u8

#EXT-X-I-FRAME-STREAM-INF:BANDWIDTH=171864,RESOLUTION=1920x1080,CODECS="avc1.640032",URI="iframes-f1-v1-a1.m3u8"
#EXT-X-I-FRAME-STREAM-INF:BANDWIDTH=100659,RESOLUTION=1280x720,CODECS="avc1.64001f",URI="iframes-f2-v1-a1.m3u8"
#EXT-X-I-FRAME-STREAM-INF:BANDWIDTH=41416,RESOLUTION=640x360,CODECS="avc1.64001e",URI="iframes-f3-v1-a1.m3u8"`

// console.log(string.split('\n'))

const split=string.split('\n')

for (line of split){

    const pattern = /RESOLUTION=(\d+x\d+).*?URI="([^"]+)"/;

    const match = line.match(pattern);
    if (match) {
        const resolution = match[1];
        const uri = match[2];
        console.log(resolution.split("x")[1]);
        console.log(uri);
    }
}


// for(line of string){
//     console.log(line)
// }