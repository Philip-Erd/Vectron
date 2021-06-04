
#include "vectron.h"

static int col = 0;

void update(){
    
    int color;
    switch (col)
    {
    case 0:
        color = RED;
        break;
    case 1:
        color = GREEN;
        break;
    case 2:
        color = BLUE;
        break;
    case 3:
        color = YELLOW;
        break;
    
    default:
        color = GREY;
        break;
    }

    col++;
    col = col%4;

    clear(color);

    setPosition(0, 0);
    setColor(GREEN);
    drawLineTo(0.5, 0.5);
    setColor(BLUE);
    drawLineTo(0, 1);
}