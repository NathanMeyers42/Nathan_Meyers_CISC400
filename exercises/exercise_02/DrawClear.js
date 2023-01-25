function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('canvas');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log("Failed to get the rendering context for WebGL");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}