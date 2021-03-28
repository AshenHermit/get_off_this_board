scenes["math"] = {
    start: (special_options)=>{

        var canvas = null
        var ctx = null
        var textures = {
            'polunium': {frames_count: 80, sheet_size: 9, frame_size: 256, source: createImage("https://dl.dropboxusercontent.com/s/xbht5kvjdkl4nju/polunium.png")},
        }

        var sprites = []

        var pointers = []
        for (let i = 0; i < 5; i++) {
            pointers.push({
                position: {x:0, y:0},
                offset: {x:0, y:0},
            })
        }
        var next_sprite_id = 0

        function Sprite(tex){
            this.id = next_sprite_id
            next_sprite_id+=1

            this.is_dragging = false
            this.revert_animation = false
            if(Math.random()<0.5) this.revert_animation = true
            this.texture = tex
            this.scale = 1.5+(Math.random()-0.5)
            this.frame = 0
            this.position = {x:0, y:0}
            this.velocity = {x:0, y:0}
            this.animation_timer = 0
            this.animation_speed = 1
            this.can_spawn = false

            if(Math.random()<0.05){
                this.animation_speed = 2
                this.scale = 5.0
            }

            this.origin = this.texture.frame_size*this.scale/2

            this.draw_self = function(){
                let frame_x = (this.frame%this.texture.sheet_size)*this.texture.frame_size
                let frame_y = Math.floor(this.frame/this.texture.sheet_size)*this.texture.frame_size
                ctx.drawImage(
                    this.texture.source, 
                    frame_x, frame_y, this.texture.frame_size, this.texture.frame_size,
                    this.position.x-this.origin,
                    this.position.y-this.origin,
                    this.texture.frame_size*this.scale, this.texture.frame_size*this.scale)
            }

            this.update_animation = function(){
                if(this.animation_timer<=0){
                    this.frame = (this.frame+(this.revert_animation ? -this.animation_speed : this.animation_speed))%this.texture.frames_count
                    if(this.frame<0) this.frame = this.texture.frames_count-this.animation_speed

                    this.animation_timer = 1
                }
                this.animation_timer-=1
            }

            this.update_physics = function(){
                this.velocity.y += 0.2

                this.position.x += this.velocity.x
                this.position.y += this.velocity.y

                if(this.position.x-this.origin < 0){
                    this.velocity.x += (((0+this.origin)-this.position.x)/4 - this.velocity.x)/20
                }else 
                if(this.position.x+this.origin > canvas.width){
                    this.velocity.x += (((canvas.width-this.origin)-this.position.x)/4 - this.velocity.x)/20
                }

                if(this.position.y+this.origin > canvas.height){
                    this.velocity.y += (((canvas.height-this.origin)-this.position.y)/4 - this.velocity.y)/20
                }else{
                    if(!this.is_dragging)
                        this.velocity.y += 0.2
                }

                if(this.position.y < -512){
                    if(this.can_spawn){
                        sprites.push(new Sprite(this.texture))
                        sprites[sprites.length-1].position.x = this.position.x
                        sprites[sprites.length-1].position.y = this.position.y
                        this.can_spawn = false
                    }
                }else if(this.position.y>0){
                    this.can_spawn = true
                }
                this.velocity.x /= 1.01

                for (let i = 0; i < sprites.length; i++) {
                    const other = sprites[i];
                    if(other!=this){
                        let dx = (other.position.x - this.position.x)
                        let dy = (other.position.y - this.position.y)
                        let dist =  (dx**2
                                    +dy**2)**0.5
                        
                        if(dist < this.origin){
                            this.velocity.x += (-dx/4 - this.velocity.x)/20
                            this.velocity.y += (-dy/4 - this.velocity.y)/20
                        }
                    }
                }
            }

            this.update = function(){
                this.update_physics()
                this.update_animation()
                this.draw_self()
            }
        }

        function resize_canvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function get_sprite_under_cursor(x, y){
            var finded = null
            for (let i = 0; i < sprites.length; i++) {
                const sprite = sprites[i];
                let dist = ((x-sprite.position.x)**2
                            +(y-sprite.position.y)**2)**0.5
                if(dist < sprite.origin*1){
                    finded = sprite
                }
            }
            return finded
        }

        // event handlers
        function handle_touch_start(e, touch_id){
            var sprite = get_sprite_under_cursor(e.pageX, e.pageY)
            pointers[touch_id].position = {x: e.pageX, y: e.pageY}
            if(sprite){
                sprite.is_dragging = true
                pointers[touch_id].sprite = sprite
                pointers[touch_id].offset.x = pointers[touch_id].position.x-pointers[touch_id].sprite.position.x
                pointers[touch_id].offset.y = pointers[touch_id].position.y-pointers[touch_id].sprite.position.y
            }
        }
        function handle_touch_end(e, touch_id){
            if(pointers[touch_id].sprite){
                pointers[touch_id].sprite.is_dragging = false
            }
            pointers[touch_id].sprite = null
        }
        function handle_touch_move(e, touch_id){
            pointers[touch_id].position.x = e.pageX
            pointers[touch_id].position.y = e.pageY
        }
        //

        function iterate_touches(touches, handler){
            for (var i = 0; i < Math.min(touches.length, pointers.length); i++) {
                handler(touches[i], i)
            }
        }
        function on_canvas_touch_start(e){
            iterate_touches(e.changedTouches, handle_touch_start)
        }
        function on_canvas_touch_end(e){
            iterate_touches(e.changedTouches, handle_touch_end)
        }
        function on_canvas_touch_move(e){
            iterate_touches(e.changedTouches, handle_touch_move)
        }

        function update_pointers(){
            for (let i = 0; i < pointers.length; i++) {
                const pointer = pointers[i];
                if(pointer.sprite){
                    pointer.sprite.velocity.x += ((pointer.position.x - pointer.offset.x - pointer.sprite.position.x)/5 - pointer.sprite.velocity.x)/5
                    pointer.sprite.velocity.y += ((pointer.position.y - pointer.offset.y - pointer.sprite.position.y)/5 - pointer.sprite.velocity.y)/5
                }
            }
        }

        function init(){
            sprites.push(new Sprite(textures['polunium']))
            sprites[sprites.length-1].position.x = 64
            sprites[sprites.length-1].position.y = 32
            sprites.push(new Sprite(textures['polunium']))
            sprites[sprites.length-1].position.x = canvas.width-64
            sprites[sprites.length-1].position.y = 32
        }
        function update(time){
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            update_pointers()

            for (let i = 0; i < sprites.length; i++) {
                sprites[i].update()
            }
        }

        StartVideoBgScene(
            special_options,
            special_options["track_url"],
            [
                "https://sun9-73.userapi.com/impg/NhVnJ1tkJt2YMeGj61N2YeWpbgh5VbZGEJp3VQ/DEyuW0olFIs.jpg?size=1024x825&quality=96&sign=8b533f9e0a96889ec1bc19bed8f438de&type=album",
                "https://sun9-20.userapi.com/impg/r88UH1Yggq8koATkb6_T03AIkyqSd6AdMJg1sw/cqmJm0dqUBw.jpg?size=1024x724&quality=96&sign=e2abb92c5e0bfe2fdad8624b0e1c1408&type=album",
                "https://sun9-60.userapi.com/impg/3jnukwp4A3etMGZzLgp6O3iYRI8FJmGO5IMwyw/BI9z2V_ffUY.jpg?size=1024x724&quality=96&sign=e0070bc819ec885c2b97223b80c6b587&type=album",
                "https://sun9-74.userapi.com/impg/LT9ZWLuF42i5ltKf73zFAEBURTLS6q0kmblu2A/z1tw8kTtG2s.jpg?size=672x484&quality=96&sign=bf73af4628cfaf503f31f29f0b7a5230&type=album",
                "https://sun9-61.userapi.com/impg/WfpcMFl149rs9QrUZOwVTQ0e-3rXqVgEjz33vg/veF4E6gAijE.jpg?size=555x498&quality=96&sign=b53dc87a02f9d5ab940e92007b312101&type=album",
                "https://sun9-25.userapi.com/impg/5c3vsO1WcJG2mnOiTOywXqmEXk8H94WdDDjavQ/1UJ4UTh_j4Q.jpg?size=686x511&quality=96&sign=859266d782e06b80dcfc8efbab6a743a&type=album",
                "https://sun9-71.userapi.com/impg/P0rhMlzBBw1MoizfodSxDFrMIQm7yMwJ0YrLKQ/rfR0Tp5rkhM.jpg?size=683x960&quality=96&sign=cc33154d185c0425053a2052ebf557f4&type=album",
                "https://sun9-37.userapi.com/impg/jSpNOORWQPK_lJCaZyZPfiWLxEHFZVGRvGS9lQ/ubjtrr3arMc.jpg?size=780x1024&quality=96&sign=137407cb4c27d72878ace8d4e0e3467c&type=album",
                "https://sun9-22.userapi.com/impg/8YL7201xjiQuyXkwqjJlUkorY4cCqFY4pjfqOQ/H3OpwQ960qE.jpg?size=730x1024&quality=96&sign=4d094bc97628d11ee71daf3efad46b9a&type=album",
                "https://sun9-62.userapi.com/impg/A8Df-qmltkVFQ2z6m16gI45lGzqYTO9fQZHPlA/Kz1hgTB2gvs.jpg?size=520x492&quality=96&sign=5b447cd1338a2bb0cc6462452ff7d377&type=album",
                "https://sun9-73.userapi.com/impg/b283kZ3bQxZfkD-S3uu-3ZTFCmkTdXac1di3NQ/mzGHiEv5lhY.jpg?size=1024x720&quality=96&sign=cf2da75343eed65b1982cfdb75ece4b1&type=album",
                "https://sun9-17.userapi.com/impg/l2gbxElmSLsnUMR2p0r5jTZ2o6qLJnKTMUdyVg/Q_IUwpi-hfY.jpg?size=685x500&quality=96&sign=e45099d3740f354b58ace0bebd45b7b4&type=album",
                "https://sun9-31.userapi.com/impg/sQWyDDIkhH1E3kOuRdOJOzRchdVZYzDtfJDOTg/QJGvI8Tew4Q.jpg?size=429x604&quality=96&sign=cbf7b13021d40dad743f7f4ed3b1dc72&type=album",
                "https://sun9-13.userapi.com/impg/zazfhO4MpMEVOc0-T9pvBYNs6TqzygeSo3GoZQ/C_CN8Llie78.jpg?size=338x954&quality=96&sign=b394587d79021f33e8a6f29cf09cc62a&type=album",
                "https://sun9-34.userapi.com/impg/5VMlwbah9Px-agXS35-oibcPorh3jYLStjXbFg/tu-DqnKmIH4.jpg?size=570x817&quality=96&sign=ba440128af98a2224ca1bcc80e3d8eb9&type=album",
                "https://sun9-10.userapi.com/impg/cJ-5x_neHPXpl46mK6zKlQJBsbflaCsxoCCT_A/JarHGTW-E_Q.jpg?size=327x594&quality=96&sign=6fe32fa61b02ed5388d0f759ab612ab6&type=album",
                "https://sun9-34.userapi.com/impg/e1bS9_8_MbTruG0XTF4DZlexsfav5qmjA_nrZg/lTyfwJiGq3c.jpg?size=600x490&quality=96&sign=4e762192231086035f29fe4d8ea17bb2&type=album",
                "https://sun9-52.userapi.com/impg/UDuet6bPjxO_klmy1e-oEBU5dEDqo7KC_9aWwg/4LVzI2Jjrxs.jpg?size=478x604&quality=96&sign=2cf4ef00cc172f76c0d7d5a9594f5258&type=album",
                "https://sun9-14.userapi.com/impg/V-osRTVhOjVBtoJrqVc1pavEfzIMC3rL9SaTIQ/2PJRPg7cxY4.jpg?size=1024x472&quality=96&sign=788747ffe26b6ee7536a22b8045b6910&type=album"
            ],
            false,
            10,
            1/16,
            `
            <div class="crt-text" style="font-size: 5.5em; color: rgb(255 255 255); opacity: 0.8;">Pathetic, Get Some Math Brains Instead.</div>
            <div class="crt-text" style="font-size: 1.6em; color: rgb(255 255 255); opacity: 0.6;">math is one of the biggest logical abstractions human made, they also includes wishes, hopes, good/evil.</div>
            <div class="crt-text" style="font-size: 1.2em; color: rgb(255 255 255); opacity: 0.5;">btw understanding of math indicates the ability to think complex, even if you dont know how to calculate integrals.</div>
            `,
            function (){
                document.getElementById("root_content").innerHTML += `
                <canvas id="overlay_canvas" style="position: absolute; width: 100%; height: 100%;"></canvas>
                `
                canvas = document.getElementById("overlay_canvas")
                window.addEventListener('resize', resize_canvas, false);

                canvas.addEventListener("mousedown", (e)=>{handle_touch_start(e, 0)}, false);
                canvas.addEventListener("mouseup", (e)=>{handle_touch_end(e, 0)}, false);
                canvas.addEventListener("mousemove", (e)=>{handle_touch_move(e, 0)}, false);
                canvas.addEventListener("touchstart", on_canvas_touch_start, false);
                canvas.addEventListener("touchend", on_canvas_touch_end, false);
                canvas.addEventListener("touchcancel", on_canvas_touch_end, false);
                canvas.addEventListener("touchmove", on_canvas_touch_move, false);

                resize_canvas()
                ctx = canvas.getContext("2d")

                init()
            },
            function (time){
                update(time)
            }
        )
    }
}