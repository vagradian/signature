var dpt = window.devicePixelRatio;
var widthM = window.screen.width;

if (widthM*dpt < 768) {
    document.write('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">');
}