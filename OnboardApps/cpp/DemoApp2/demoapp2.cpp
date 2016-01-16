#include <core_script_bridge/navigation_bridge.h>
#include <iostream>

Navigation nav;
int main(int argc, char *argv[])
{
	if(argc < 2){
		std::cout<<"\nThis app expects arguments\n";
		exit(0);
	}
	
    float side_length = std::stof(argv[1]);             //Convert Argument from string to float
    nav.takeoff(3.0);                                   //Taking Off
    nav.position_set(side_length,0,-3);                 //Sending Position Setpoints with side length accepted from script
    nav.position_set(side_length,side_length,-3);
    nav.position_set(0,side_length,-3);
    nav.position_set(0,0,-3);
    nav.land();                                         //Landing
}

