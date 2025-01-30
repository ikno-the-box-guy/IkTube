# IkTube
IkTube is a simple chrome extension and API that allows users to easily download videos, audio and thumbnails from YouTube videos. No need to worry about the API being taken down or containing viruses, since you have to **host the API yourself.** 

## Installation
### API
The idea is that you -- yes you -- host the API yourself. The following steps are meant to be executed on the device where you will host the API.

The API is written in JavaScript as a Node JS application, so you need to have Node JS (18.x >) installed. Once you have Node installed you´d want to clone the repo like so: 

``git clone https://github.com/ikno-the-box-guy/IkTube``

Finished downloading? Go ahead and navigate over to the "api" directory and run the ``npm i`` command to install all the dependencies. After you've done this you can start the server with ``npm run start``. 

Set it up as a system service, turn it into a docker image, do whatever you like with it. It's yours to use! 

### Extension
TODO