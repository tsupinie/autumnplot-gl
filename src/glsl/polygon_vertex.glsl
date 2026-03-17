#version 300 es

uniform int u_offset;

in vec2 a_pos;

void main() {
    // Draw multiple world copies to avoid seams at the dateline.
    float globe_width = 1.0;
    vec2 globe_offset = vec2(globe_width * float(u_offset), 0.0);

    gl_Position = projectTile(a_pos + globe_offset);
}
