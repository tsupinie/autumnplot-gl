#version 300 es

uniform lowp vec4 u_color;
uniform lowp float u_opacity;

out lowp vec4 fragColor;

void main() {
    lowp vec4 color = u_color;
    color.a *= u_opacity;
    fragColor = color;
}
