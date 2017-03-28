#include <core_script_bridge/navigation_bridge.h>
#include <core_script_bridge/param_bridge.h>
#include <iostream>
#include "lpos_gpos_convertor.h"
#include <string.h>

Navigation nav;
Param par;
sensor_msgs::NavSatFix gpos;
core_script_bridge::UserData rad_data;
int rad_data_pub;

float sigma = 0.0002;
float mean_x = 0;
float mean_y = 0;

int check_boundary(float boundary[][2])
{
    if(gpos.latitude > boundary[0][0] || gpos.latitude < boundary[1][0] || gpos.longitude < boundary[0][1] || gpos.longitude > boundary[1][1])
    {
        std::cout<<"Scanning Boundary reached";
        std::cout<<"\nlatitude\t"<<gpos.latitude;
        std::cout<<"\nlongitude\t"<<gpos.longitude;
        return 1;
    }
    else
        return 0;
}

void get_spiral_sp(float t,float *x, float *y,float zoomout_factor=1, float angular_speed=1)
{
    *x = zoomout_factor*t*cos(angular_speed*t);
    *y = zoomout_factor*t*sin(angular_speed*t);
}

void simulate_data(float lat, float lon, float &data)
{
		//data = (1/(2*3.14*sigma*sigma)) * exp(-((lat-mean_x)*(lat-mean_x) + (lon-mean_y)*(lon-mean_y))/(2*sigma*sigma));
        data = 10 * exp(-((lat-mean_x)*(lat-mean_x) + (lon-mean_y)*(lon-mean_y))/(2*sigma*sigma));
}
void gposCb(void *_gpos)
{
    gpos = * (sensor_msgs::NavSatFix*)(_gpos);
    float radiation_data;
    simulate_data(gpos.latitude,gpos.longitude,radiation_data);
    rad_data.data_double.clear();
    rad_data.data_double.push_back(gpos.latitude);
    rad_data.data_double.push_back(gpos.longitude);
    rad_data.data_double.push_back(radiation_data);
    nav.userPublish(rad_data_pub,rad_data);
}

int main(int argc, char *argv[])
{
    if(argc < 10){
        std::cout<<"\nThis app expects 9 arguments - HOME(x,y,z), angular_speed(in radian/sec), zoomout_factor, scan_boundary((Lat1,Lon1),(Lat2,Lon2)) \n";
        exit(0);
    }
    rad_data_pub = nav.userAdvertise("radiation_data");
    nav.sysSubscribe(Navigation::global_position,gposCb);
    par.param_create("demoapp3","start");
    std::string should_stop;
    float home_pos_lat = std::stof(argv[1]);
    float home_pos_lon = std::stof(argv[2]);
    float scan_alt = std::stof(argv[3]); 
    float angular_speed = std::stof(argv[4]); 
    float zoomout_factor = std::stof(argv[5]);
    float boundary[2][2] = {{std::stof(argv[6]),std::stof(argv[7])},{std::stof(argv[8]),std::stof(argv[9])}};

    mean_x = home_pos_lat;
    mean_y = home_pos_lon;
    lposgpos_convertor_init(&_ref_pos, 18.594208, 73.911018);
    float home_pos_x,home_pos_y;
    gpos_to_lpos(&_ref_pos,home_pos_lat,home_pos_lon,&home_pos_x,&home_pos_y);

    nav.take_off(5.0);                                  
    std::cout<"\nreached takeoff height\n";
    fflush(stdout);
    nav.position_set(home_pos_x,home_pos_y,-scan_alt);
    std::cout<"\nreached takeoff\n";
    fflush(stdout);
    float pos_sp_x, pos_sp_y;
    for(long long int t = 0;; t++){
        get_spiral_sp(t,&pos_sp_x,&pos_sp_y,zoomout_factor,angular_speed);
        nav.position_set(pos_sp_x+home_pos_x,pos_sp_y+home_pos_y,-scan_alt,0,1.0,false,false,false);
//        if(check_boundary(boundary))
//             break;
        par.param_get("demoapp3",should_stop);
        if(should_stop.compare("stop") == 0)
            break;
    }
    nav.land();                                         
}

