
//import
extern void setPosition(float x, float y);
extern void drawLineTo(float x, float y);
extern void setColor(int color);
extern void clear(int color);
extern void translate(float x, float y);
extern void scale(float x, float y);
extern void rotate(float angle);
extern void setTransform(float m_00, float m_01, float m_10, float m_11, float m_20, float m_21);
extern void push();
extern void pop();
extern void setWrapMode(int mode);
extern int getInput();
extern void playTone(float frequncy, float duration);

#define RED 0xFF0000FF
#define GREEN 0x00FF00FF
#define BLUE 0x0000FFFF
#define BLACK 0x000000FF
#define WHITE 0xFFFFFFFF