#include "vectron.h"

void drawCube(void);

void update(){

    drawCube();
    scale(0.8, 0.8);


}

void drawCube(){
    setPosition(0,0);
    drawLineTo(0, 0.5);
    drawLineTo(0.5, 0.5);
    drawLineTo(0.5, 0);
    drawLineTo(0, 0);
}