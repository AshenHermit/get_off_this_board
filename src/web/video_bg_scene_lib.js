function StartVideoBgScene(special_options, audio_url, video_search_tags, is_video, pages_count, video_change_factor, content_inner_html, creation_callback, update_callback){

    document.title = "?"

    var time = -50
    var videos = []
    if(is_video){
        for(var i=0; i<video_search_tags.length; i++){
            for(var p=0; p<pages_count; p++){
                fetch(
                    `https://api.pexels.com/videos/search?query=${video_search_tags[i]}&page=${(p+1)}`
                    , {
                    headers: {Authorization: "563492ad6f9170000100000170960fe8a10846e09dec6e61436679f3"}
                    }
                ).then(resp=>{
                    return resp.json()
                }).then(data=>{
                    data = data.videos.map(x=>x.video_files.sort((a, b)=>{
                        if(a.width>b.width){
                            return -1;
                        }
                        if(a.width<b.width){
                            return 1;
                        }}))
                    videos = videos.concat(data.map(x=>x.filter(v=>v.width<=2660)[0].link))
                    videos = shuffle(videos);
                })
            }
        }
    }else{
        videos = shuffle(video_search_tags)
    }
    
    var last_video = 0

    var music = new Audio(audio_url)
    music.loop = true
    music.play()

    createStyle(`
        .crt-text { 
            text-shadow: 0.06rem 0 0.06rem #ff3870, -0.125rem 0 0.06rem #62ffff;
            animation-duration: 0.007s;
            animation-name: textflicker;
            animation-iteration-count: infinite;
            animation-direction: alternate;
        }
        @keyframes textflicker {
            from {
              text-shadow: 3px -0.8px 0 #ff3870, -5px 0.8px 0 #62ffff;
            }
            to {
              text-shadow: 5px 0.8px 2px #ff3870, -3px -0.8px 2px #62ffff;
            }
          }
    `)

    var main_content_setup = false

    special_options["no_bg"] = (special_options["no_bg"]=="1")

    var animation_interval = ()=>{
        if(time<24){
            document.body.style.filter = `grayscale(${time/10}) contrast(${1+time/10}) blur(${time/2}px)`
        }else
        if(time>24 && !main_content_setup){
            if(special_options["no_bg"]){
                document.getElementById("bg_element").style.filter = 'brightness(0.4)'
            }else{
                document.getElementById("bg_element").style.display = 'none'
            }
            document.body.style.overflowY = "hidden"
            document.body.style.filter = ``
            document.body.style.background = "#000"
            document.getElementById("root_content").innerHTML = `
            ${ !special_options["no_bg"] ? (
                    is_video ? 
                    `<video id="bg_video" style="user-select: none; z-index: -1; position: absolute; width:100%; filter: grayscale(0.9) brightness(0.4) contrast(1.5);" autoplay muted loop id="myVideo">
                        <source id="bg_video_source" src="${videos[0]}" type="video/mp4">
                    </video>`
                    :
                    `<img id="bg_video_source" style="user-select: none; z-index: -1; position: absolute; width:100%; filter: grayscale(0.9) brightness(0.4) contrast(1.5);">
                        
                    </img>`
                ) : ""
            }
            <div style="user-select: none; display: flex; position: absolute; width: 100%; height: 100%; align-items: center; justify-content: center;">
                <div style="user-select: none; display: block; text-align: center;">
                    ${content_inner_html}
                </div>
            </div>
            `
            creation_callback()
            main_content_setup = true
        }else if(time>24){
            try{
                update_callback(time-24)
            }catch(e){
                console.error(e)
            }
            
            var current_video = Math.floor((time-24)*video_change_factor) % videos.length
            if(last_video != current_video && !special_options["no_bg"]){
                last_video = current_video
                var video_el = document.getElementById("bg_video")
                //video_el.pause()
                document.getElementById("bg_video_source").src = videos[current_video]

                try{
                    video_el.load()
                    video_el.play()
                }catch(e){}
            }
        }
        time += 0.1
        window.requestAnimationFrame(animation_interval)
    }
    animation_interval()
}