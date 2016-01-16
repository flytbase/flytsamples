
cmake_minimum_required(VERSION 2.8.3)
project(demoapp2)


add_definitions(-std=c++11)
find_package(catkin REQUIRED COMPONENTS core_script_bridge )
find_package(Boost REQUIRED COMPONENTS system python)
find_package(PythonLibs 2.7 REQUIRED)
include_directories(${catkin_INCLUDE_DIRS} ${PYTHON_INCLUDE_DIRS})

add_executable(demoapp2 demoapp2.cpp)
target_link_libraries(demoapp2 ${catkin_LIBRARIES} ${Boost_LIBRARIES} ${PYTHON_LIBRARIES}) 

install(TARGETS demoapp2
  DESTINATION /Flyt/FlytApps/Onboard/install COMPONENT Runtime
)
