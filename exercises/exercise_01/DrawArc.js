function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('canvas');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // Get the rendering context for 2DCG 
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "rgba(0, 0, 255, 1.0";
    ctx.arc(100, 75, 50, 0, 2*Math.PI);
    ctx.fill();
}