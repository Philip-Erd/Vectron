#include "vectron.h"

void drawCube();

int dpad;

void init(){
    dpad = UP | DOWN | LEFT | RIGHT;
};

void update(){

    clear(BLACK);

    int input = getInput();
    int color = BLACK;

    if(input & A){
        color = RED;
    }else if(input & B){
        color = GREEN;
    }else if(input & dpad){
        color = BLUE;
    }

    setColor(color);

    push();

    translate(0.25, 0.25);
    drawCube();

    pop();

}

void drawCube(){
    setPosition(0,0);
    drawLineTo(0, 0.5);
    drawLineTo(0.5, 0.5);
    drawLineTo(0.5, 0);
    drawLineTo(0, 0);
}