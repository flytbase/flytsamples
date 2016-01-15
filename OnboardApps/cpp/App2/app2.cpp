#include <core_script_bridge/navigation_bridge.h>
#include <iostream>

Navigation nav;
int main(int argc, char *argv[])
{
	if(argc < 2){
		std::cout<<"\nThis app expects arguments\n";
		exit(0);
	}
		float side_length = std::stod(argv[1]);
    nav.takeoff(3.0);
    nav.position_set(side_length,0,-3);
    nav.position_set(side_length,side_length,-3);
    nav.position_set(0,side_length,-3);
    nav.position_set(0,0,-3);
    nav.land();
}

