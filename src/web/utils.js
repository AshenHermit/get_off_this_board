function createImage(url){
    var img = new Image()
    img.src = url
    return img
}

function createStyle(css){
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

    head.appendChild(style);

    style.type = 'text/css';
    if (style.styleSheet){
    // This is required for IE8 and below.
    style.styleSheet.cssText = css;
    } else {
    style.appendChild(document.createTextNode(css));
    }
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function parse_options(string){
    var dict = {}
    string
    .replaceAll(": ", ":")
    .replaceAll("; ", ";")
    .split(";")
    .filter(x=>x!="")
    .map(x=>{
        let index = x.indexOf(":")
        return [x.substring(0, index), x.substring(index+1)]
    })
    .forEach(x=>dict[x[0]]=x[1])

    return dict
}