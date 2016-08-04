from flask import Blueprint, render_template

flytgimbal = Blueprint('flytgimbal', __name__,static_folder='static')

@flytgimbal.route('/')
def timeline():
	# return "flytgimbal"
	return flytgimbal.send_static_file('index.html')


@flytgimbal.route('/<path:path>')
def remfiles(path):
    return flytgimbal.send_static_file( path)
# @flytgimbal.route('/<path:path>')
# def remfiles(path):
#     return flytgimbal.send_static_file( path)
