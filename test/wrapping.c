#include "vectron.h"

void drawCube();

int dpad;

void init(){
    dpad = UP | DOWN | LEFT | RIGHT;
};

void update(){

    clear(BLACK);

    int input = getInput();
    int wrapMode = WRAP_OFF;

    if(input & A){
        wrapMode = WRAP_HORIZONTAL;
    }else if(input & B){
        wrapMode = WRAP_VERTICAL;
    }else if(input & dpad){
        wrapMode = WRAP_HORIZONTAL_VERTICAL;
    }

    setWrapMode(wrapMode);

    push();

    translate(-0.25, -0.25);

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