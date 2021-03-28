scenes["lifetime"] = {
    start: (special_options)=>{
        
        function fixed_zeros_num(num, length){
            num = num.toString()
            var text = ""
            for(var i=0; i<(length-num.length); i++){
                text += "0"
            }
            text+=num
            return text
        }
        function get_text_time_from_now_to(to_date){
            const now = new Date();
            var diffTime = Math.abs((to_date - now)*5000);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            diffTime -= diffDays * (1000 * 60 * 60 * 24)
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            diffTime -= diffHours * (1000 * 60 * 60)
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            diffTime -= diffMinutes * (1000 * 60)
            const diffSeconds = Math.floor(diffTime / (1000));

            return `${diffDays}d ${fixed_zeros_num(diffHours, 2)}h ${fixed_zeros_num(diffMinutes, 2)}m ${fixed_zeros_num(diffSeconds, 2)}s`
        }
        
        var today = new Date()
        var death_date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours()+1)
        
        function get_lifetime_text(){
            var life_time = get_text_time_from_now_to(death_date)
            return life_time
        }

        var strings = [
            "You are All Disgusting.", 
            "You don't even want to think", 
            "That You are Making Predators for Yourself,", 
            "And That You are All Perfect Victims.", 
            "Your Decisions Has No Meaning Anymore.", 
            "Get the Fuck Off This Board.", 
            "Or Pray That Your Last Thoughts...", 
            "Will Not Be Full of Taste of Your Liver.", 
        ]
        var current_string = 0
        var print_timer = 10
        var text_is_deleting = false
        var wait_timeout = null

        StartVideoBgScene(
            special_options["track_url"],
            ["abandoned -dancing", "meat", "rain", "macro -lightbulb"],
            true,
            1,
            1/30,
            `
            <div class="crt-text" style="height: 1.3em; font-size: 8em; color: rgb(255 255 255); opacity: 0.5;" id="printing_text_1"></div>
            <div class="crt-text" style="font-size: 2.4em; color: rgb(255 255 255); opacity: 0.2;">your remaining lifetime is:</div>
            <div class="crt-text" style="filter:blur(100px); font-size: 7em; color: rgb(255 255 255); opacity: 0.3;" id="lifetime_text">${get_lifetime_text()}</div>
            `,
            function (){
                
            },
            function (time){
                document.getElementById("lifetime_text").innerHTML = get_lifetime_text()
                if(print_timer<=0){
                    var text_el = document.getElementById("printing_text_1")
                    var target_text = strings[current_string]
                    if(!text_is_deleting){
                        if(text_el.innerHTML.length < target_text.length){
                            if(Math.random()<1){
                                var char = target_text.charAt(text_el.innerHTML.length)
                                text_el.innerHTML += char
                                if(char == " ") text_el.innerHTML += target_text.charAt(text_el.innerHTML.length)
                            }
                        }else{
                            if(wait_timeout==null) wait_timeout = setTimeout(()=>{
                                text_is_deleting = true
                                wait_timeout = null
                            }, 1000)
                        }
                        print_timer = 4
                    }else{
                        if(text_el.innerHTML.length > 0){
                            if(Math.random()<1){
                                r = Math.floor(Math.random()*text_el.innerHTML.length)
                                text_el.innerHTML = text_el.innerHTML.substring(0, r)+text_el.innerHTML.substring(r+1)
                            }
                        }else{
                            if(wait_timeout==null) wait_timeout = setTimeout(()=>{
                                text_is_deleting = false
                                current_string = (current_string+1)%strings.length
                                wait_timeout = null
                            }, 1000)
                        }
                        print_timer = 15
                    }
                }
                print_timer -= 1
                document.getElementById("lifetime_text").style.filter = `blur(${(10/(time/20))**2+(Math.sin(time/4)+1)}px)`
            }
        )
    }
}