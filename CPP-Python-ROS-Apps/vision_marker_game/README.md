watch this script running on a hex with ps3eye, https://youtu.be/ewLlHLaXUPs

You need flytOS to control a drone using this script.
get it from www.flytbase.com/flytos

Download the files. 
Make sure that your flyt installation directory is sourced.

to run 
python path/to/vision_game.py

detector.py consists of values specific to CV for two objects. 
You can change them to suit your combination of camera and object. 

Run the original code from http://www.instructables.com/files/orig/FEN/023A/I88LQIOJ/FEN023AI88LQIOJ.py
it opens sepearate windows for hue, saturation and value(shape). Tweak those values using sliderbar
to get best tracking of your object. Manually edit these values in detector.py for each object. 
Remember you will have to do this twice. 

If you face any problems use forums. http://forums.flytbase.com/c/developers/onboard-apps
Join our facebook group to get in touch with FlytOS application developers community. https://www.facebook.com/groups/flytos/
