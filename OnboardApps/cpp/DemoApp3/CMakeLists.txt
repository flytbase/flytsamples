
cmake_minimum_required(VERSION 2.8.3)
project(demoapp3)


add_definitions(-std=c++11)
find_package(catkin REQUIRED COMPONENTS core_script_bridge )
find_package(Boost REQUIRED COMPONENTS system python)
find_package(PythonLibs 2.7 REQUIRED)
include_directories(${catkin_INCLUDE_DIRS} ${PYTHON_INCLUDE_DIRS})

add_executable(demoapp3 demoapp3.cpp)
target_link_libraries(demoapp3 ${catkin_LIBRARIES} ${Boost_LIBRARIES} ${PYTHON_LIBRARIES}) 

install(TARGETS demoapp3
  DESTINATION /flyt/flytapps/onboard/install COMPONENT Runtime
)
