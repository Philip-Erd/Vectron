#include "vectron.h"

void drawCube();

void init(){
};

void update(){

    clear(BLACK);
    drawCube();
    rotate(0.05);


}

void drawCube(){
    setPosition(0,0);
    drawLineTo(0, 0.5);
    drawLineTo(0.5, 0.5);
    drawLineTo(0.5, 0);
    drawLineTo(0, 0);
}