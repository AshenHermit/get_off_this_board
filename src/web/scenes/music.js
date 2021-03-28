scenes["music"] = {
    start: (special_options)=>{

        var bg_tags = special_options["bg_tags"] || "abstract"
        bg_tags = bg_tags.split(",")
        var pages_count = parseInt(special_options["pages_count"]) || 1
        var video_change_factor = (1/30)
        if(special_options["video_change_factor"]){
            video_change_factor = eval(special_options["video_change_factor"])
        }

        var audio_url = special_options["track_url"]
        var artist = special_options["artist"]
        var title = special_options["title"]

        StartVideoBgScene(
            special_options,
            audio_url,
            bg_tags,
            true,
            pages_count,
            video_change_factor,
            `
            <div class="crt-text" id="track_title" style="filter: blur(128px); height: 1.3em; font-size: 8.5em; color: rgb(255 255 255);">${title}</div>
            <div class="crt-text" id="track_artist" style="filter: blur(128px); font-size: 2.5em; color: rgb(255 255 255);">by ${artist}</div>
            `,
            function (){
                
            },
            function (time){
                document.getElementById("track_title").style.filter  = `blur(${(10/(time/20))**2}px)`
                document.getElementById("track_artist").style.filter = `blur(${(10/(time/10))**2}px)`

                document.getElementById("track_title").style.opacity  = `${(Math.cos(time/3+0.2)/8)+0.5}`
                document.getElementById("track_artist").style.opacity  = `${(Math.sin(time/1.5)/8)+0.3}`
            }
        )
    }
}