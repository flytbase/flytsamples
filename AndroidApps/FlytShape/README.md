<!--
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
#  KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#
-->


# FlytShape App

## Introduction

FlytShape is a Cordova based application with Ionic framework.
This application allows you to create shapes such as square, rectangle
and polygon on Google map and gives command to your drone to trace the
shape created by you.


[Click here](http://docs.flytbase.com/docs/FlytApps/Web_MobileApps.html) to
know about the steps involved in creating a Cordova based mobile app with
Ionic framework using Intellij Idea.

## Testing

Testing can be done with FlytSim and with FlytOS. To test the application with
either of the two, please set the mode in [shape.js](https://github.com/flytbase/flytsamples/blob/master/AndroidApps/Shape%20Trace/www/js/shape.js)
file. Mode represents the testing environment.

### With FlytSim
For testing the application using FlytSim, please set the mode to 0. To install
DemoApp4 go to the link [here.](https://github.com/flytbase/flytsamples/tree/master/OnboardApps/cpp)

### With FlytOS
For testing the application using FlytOS, please set the mode to 1.

To know more about Onboard APIs [click here.](http://docs.flytbase.com/docs/FlytAPI/OnboardAPIs.html)

## Installation

To install this application onto your device download [FlytShape.apk]( https://s3-us-west-2.amazonaws.com/flytos/SampleAndroidApk/FlytShape.apk)
file.

