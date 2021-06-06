
#include "vectron.h"

void drawCube(){
    setPosition(0,0);
    drawLineTo(0, 0.5);
    drawLineTo(0.5, 0.5);
    drawLineTo(0.5, 0);
    drawLineTo(0, 0);
}


static float rotation = 0;

void init(){
    push();
    setColor(RED);
}

void update(){
    clear(BLACK);

    rotation += 0.01;
    push();
    rotate(rotation);
    translate(0.5, 0.5);
    drawCube();
    pop();

}