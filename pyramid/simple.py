from wsgiref.simple_server import make_server
from pyramid.config import Configurator
from pyramid.response import Response


def hello(request):
    return Response('Hello World!' % request.matchdict)

def scrape(request):
	response = Response('test')
	print response
	return response

if __name__ == '__main__':
    config = Configurator()
    #adding hello route
    config.add_route('hello', '/hello')
    config.add_view(hello, route_name='hello')
    #adding scrape route
    config.add_route('scrape', '/scrape')
    config.add_view(scrape, route_name='scrape')
    app = config.make_wsgi_app()
    server = make_server('192.168.1.123', 8080, app)
    server.serve_forever()
   
