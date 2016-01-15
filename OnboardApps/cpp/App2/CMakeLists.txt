
cmake_minimum_required(VERSION 2.8.3)
project(app2)


add_definitions(-std=c++11)
find_package(catkin REQUIRED COMPONENTS core_script_bridge )
find_package(Boost REQUIRED COMPONENTS system python)
find_package(PythonLibs 2.7 REQUIRED)
include_directories(${catkin_INCLUDE_DIRS} ${PYTHON_INCLUDE_DIRS})

add_executable(app2 app2.cpp)
target_link_libraries(app2 ${catkin_LIBRARIES} ${Boost_LIBRARIES} ${PYTHON_LIBRARIES}) 

install(TARGETS app2
  DESTINATION /Flyt/FlytApps/Onboard/install COMPONENT Runtime
)
