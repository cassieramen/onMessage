from wsgiref.simple_server import make_server
from pyramid.config import Configurator
from pyramid.response import Response
from bs4 import BeautifulSoup
import urllib2

def hello(request):
    return Response('Hello World!' % request.matchdict)

def scrape(request):
	response = urllib2.urlopen("http://www.presidentialrhetoric.com/speeches/01.21.13.html")
	html_doc = response.read()
	soup = BeautifulSoup(html_doc)
	return Response(soup.get_text())

if __name__ == '__main__':
    config = Configurator()
    #adding hello route
    config.add_route('hello', '/hello')
    config.add_view(hello, route_name='hello')
    #adding scrape route
    config.add_route('scrape', '/scrape')
    config.add_view(scrape, route_name='scrape')
    app = config.make_wsgi_app()
    server = make_server('localhost', 8080, app)
    server.serve_forever()
   
