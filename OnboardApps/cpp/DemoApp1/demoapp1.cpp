#include <core_script_bridge/navigation_bridge.h>
#include <iostream>

Navigation nav;
int main(int argc, char *argv[])
{
    nav.take_off(3.0);						//Taking Off
    nav.position_set(5,0,-3);				//Sending Position Setpoints
    nav.position_set(5,5,-3);
    nav.position_set(0,5,-3);
    nav.position_set(0,0,-3);
    nav.land(false);									//Landing
}
