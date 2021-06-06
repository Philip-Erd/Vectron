
#include "vectron.h"

static int step = 0;

void init(){

}

void update(){

    if(step == 0){
        playTone(261.625565300598634, 1000);        //should play a c4 for one second;
    }

    step++;
    step = step%120;
}