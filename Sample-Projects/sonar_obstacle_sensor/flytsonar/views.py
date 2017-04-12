from flask import Blueprint, render_template

flytsonar = Blueprint('flytsonar', __name__,static_folder='static')

@flytsonar.route('/')
def timeline():
	return flytsonar.send_static_file('index.html')
	#index.html is the page that is rendered when your custom webapp is fired.
@flytsonar.route('/<path:path>')
def remfiles(path):
    return flytsonar.send_static_file( path)

