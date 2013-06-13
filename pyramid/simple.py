from wsgiref.simple_server import make_server
from pyramid.config import Configurator
from pyramid.response import Response
from bs4 import BeautifulSoup
import urllib2
import datetime
import re
from collections import Counter
import json

#GLOBAL VARIABLES
start_date = datetime.datetime(2012,06,07)
last_date = datetime.datetime(2012,11,07)
difference = (last_date - start_date).days
black_list = ["the", "to", "and", "of", "that", "a", "we", "you", "in", "i", "for", "will", "our", "this", "they", "is", "it", "not", "have", "because",
"going", "are", "on", "td", "tr", "what", "can", "has", "/p", "us", "applause", "just", "if", "got", "more", "make", "need", "here", "their", "who", "be",
"by", "with", "/tr", "do", "now", "up", "your", "or", "when", "from", "an", "very", "var", "we've", "we're", "that's", "was", "about", "that's", "my", 
"so", "but", "don't", "get", "he", "were", "all", "back", "p", "all", "new"]
#END GLOBALS

immigration_list = ["immigration", "immigrant", "immigrants", "dream", "deport", "deported", "deportation", "illegal", "citizen","citizenship"]
foreignAffairs_list = ["war", "veteran", "veterans", "military", "navy", "army", "foreign", "syria", "syrian", "syrians", "afghanistan", "afghan", "karzai", "troops", "iraq", "iran", "nuclear", "pentagon", "laden", "guantanamo", "abroad", "benghazi", "qaeda"]
education_list = ["education", "teacher", "teachers", "school", "schools", "student", "students", "classroom", "classrooms", "college", "colleges", "university", "universities", "tuition"]
economy_list = ["jobs", "deficit", "money", "tax", "taxes", "budget", "banks", "bank", "lenders", "enterprise", "prosperity", "economy", "economic", "debt", "financial", "recession", "surplus", "spending", "employment", "unemployment", "aid", "financial"]
energy_list = ["energy", "oil", "environment", "climate", "warming", "farmer", "farmers", "agriculture", "renewable", "solar", "turbine", "turbines", "manufacture","wind", "frack", "fracking", "windmills"]
healthCare_list = ["healthcare", "medicine", "medicare", "medication", "preexisting", "insurance", "hospital", "hospitals", "doctor", "doctors", "medicaid", "obamacare"]
gayRights_list = ["gay", "sexuality", "doma", "sexuality", "marriage", "homosexual", "homosexuality"]

def hello(request):
    return Response('Hello World!' % request.matchdict)

#Pulling the most common terms from an html doc
def pull_terms(html, topic):
	html = html.lower()
	html = html.translate(None, "!@#$,.()[]{}<>-:\/")
	text = html.split()
	count = []
	if topic == "immigration":
		count = count_words(text, immigration_list)
	elif topic == "foreignAffairs":
		count = count_words(text, foreignAffairs_list)
	elif topic == "education":
		count = count_words(text, education_list)
	elif topic == "economy":
		count = count_words(text, economy_list)
	elif topic == "energy":
		count = count_words(text, energy_list)
	elif topic == "healthCare":
		count = count_words(text, healthCare_list)
	elif topic == "gayRights":
		count = count_words(text, gayRights_list)
	return count, len(text)

def count_words(a_list, topic_list):
    words = {}
    for i in range(len(a_list)):
        item = a_list[i]
        if item in topic_list:
        	count = a_list.count(item)
        	words[item] = count
    return sorted(words.items(), key = lambda item: item[1], reverse=True)

#Scraping for http://www.presidentialrhetoric.com/speeches, will return all the text in an array
def pres_rhetoric_scrape(date, name, topic):
	date_term = []
	full_url = "http://www.presidentialrhetoric.com/campaign2012/" + name + "/" + date + ".html"
	try: 
		response = urllib2.urlopen(full_url)
		html_doc = response.read()
		terms, length = pull_terms(html_doc, topic)
		date_term.append({"date":date, "terms":terms, "full_url":full_url, "speech_length":length})
	except:
		pass
	response = Response(json.dumps(date_term))
	return response

def pres_rhetoric_scrape_obama(request):
	date = request.params.get("date")
	topic = request.params.get("topic")
	return pres_rhetoric_scrape(date, "obama", topic)

def pres_rhetoric_scrape_romney(request):
	date = request.params.get("date")
	topic = request.params.get("topic")
	return pres_rhetoric_scrape(date, "romney", topic)

if __name__ == '__main__':
    config = Configurator()
    #adding hello route
    config.add_route('hello', '/hello')
    config.add_view(hello, route_name='hello')
    #adding scrape routes
    
    config.add_route('pres_rhetoric_scrape_obama', '/pres_rhetoric_scrape_obama')
    config.add_view(pres_rhetoric_scrape_obama, route_name='pres_rhetoric_scrape_obama')

    config.add_route('pres_rhetoric_scrape_romney', '/pres_rhetoric_scrape_romney')
    config.add_view(pres_rhetoric_scrape_romney, route_name='pres_rhetoric_scrape_romney')
    
    app = config.make_wsgi_app()
    server = make_server('localhost', 8080, app)
    server.serve_forever()
   
