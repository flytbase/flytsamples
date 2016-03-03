#include <core_script_bridge/navigation_bridge.h>
#include <iostream>
#include "lpos_gpos_convertor.h"

Navigation nav;
struct waypoints{
    float lat;
    float lon;
    float x;
    float y;
};

int current_wp_index = 0;
std::vector<waypoints> wp;

void posSetResultCb(void *_pos_set_result)
{
    navigation_util::NavigationPosActionResult pos_set_result = *(navigation_util::NavigationPosActionResult*)(_pos_set_result);
    if(pos_set_result.status.status == pos_set_result.status.SUCCEEDED){
        if(current_wp_index == wp.size()){
            std::cout<<"Last setpoint reached...mission completed";
            return;
        }
        else
            std::cout<<"Last setpoint reached...sending next waypoint";
        nav.position_set(wp[current_wp_index].x,wp[current_wp_index].y,-15,0,0.5,false,true,false,false);
        current_wp_index++;
    }
    else {
        std::cout<<"Last setpoint not reached...aborting mission";
    }
}

int main(int argc, char *argv[])
{
    if(argc < 3){
        std::cout<<"\nThis app expects atleast one waypoint(lat,lon)\n";
        exit(0);
    }
    lposgpos_convertor_init(&_ref_pos, 18.594208, 73.911018);
    for(int i = 1; i<argc; i = i+2){
        struct waypoints wps;
        wps.lat = std::stod(argv[i]);
        wps.lon = std::stod(argv[i+1]);
        gpos_to_lpos(&_ref_pos,wps.lat,wps.lon,&wps.x,&wps.y);
        wp.push_back(wps);
    }
    std::cout<<"waypoints\n";
    for(int i = 0; i<wp.size(); i++){
        std::cout<<"\n"<<wp[i].lat;
        std::cout<<"\t"<<wp[i].lon;
        std::cout<<"\t"<<wp[i].x;
        std::cout<<"\t"<<wp[i].y;
    }
    nav.take_off(10.0);
    std::cout<"\nreached takeoff height\n";
    fflush(stdout);
    nav.position_set(wp[0].x,wp[0].y,-15,0,0.5,false,true,false,false);
    current_wp_index++;
    nav.sysSubscribe(Navigation::position_set_result,posSetResultCb);

//    for(int i = 0; i<wp.size(); i++){
//        nav.position_set(wp[i].x,wp[i].y,-10,0,0.5,false,false,false,false);
//    }
    while(1){
        if(!ros::ok())
           exit(0);
    }

}

