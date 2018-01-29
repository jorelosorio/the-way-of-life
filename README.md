# The way of life

It is an experimental project that aims to find a starting point to think, relax. It does not have any meaning, is to appreciate the little details that make life, ¡The life!

~To my boy Yoyo~

# Live

https://the-way-of-life.herokuapp.com/

### Dependencies

- Install __NodeJs__ from https://nodejs.org/en/
- Go to https://gulpjs.com/ and follow the instructions to install __Gulp__
- Install __Ruby__ using https://rvm.io/ or from another way
- Install bundler http://bundler.io/

### Gulp instructions

There're a couple of tasks to build the website all those are into the default task

* run __gulp__ to build the website into the public folder
* run __gulp watch__ after __gulp__ to tack all the changes while develop

### Rackup instructions

We need to run the application in a Webserver to avoid some cross domain policies

* run __bundle install__ in the root directory, that will install some dependencies to run a local Webserver
* Execute __rackup config.ru__ that open 9292 port
* Open the website at browser with http://localhost:9292
