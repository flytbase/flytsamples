
cmake_minimum_required(VERSION 2.8.3)
project(app1)

add_definitions(-std=c++11)

find_package(catkin REQUIRED COMPONENTS core_script_bridge )
find_package(Boost REQUIRED COMPONENTS system python)
find_package(PythonLibs 2.7 REQUIRED)
include_directories(${catkin_INCLUDE_DIRS} ${PYTHON_INCLUDE_DIRS})

add_executable(app1 app1.cpp)
target_link_libraries(app1 ${catkin_LIBRARIES} ${Boost_LIBRARIES} ${PYTHON_LIBRARIES}) 

install(TARGETS app1
  DESTINATION /Flyt/FlytApps/Onboard/install COMPONENT Runtime
)
