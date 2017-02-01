from flask import Blueprint, render_template

flytsonar = Blueprint('flytsonar', __name__,static_folder='static')

@flytsonar.route('/')
def timeline():
	# return "flytsonar"
	return flytsonar.send_static_file('index.html')


@flytsonar.route('/<path:path>')
def remfiles(path):
    return flytsonar.send_static_file( path)
# @flytsonar.route('/<path:path>')
# def remfiles(path):
#     return flytsonar.send_static_file( path)
