# IkTube
IkTube is a simple chrome extension and API that allows users to easily download videos, audio and thumbnails from YouTube videos. No need to worry about the API being taken down or containing viruses, since you have to **host the API yourself.** 

## Installation
For both of these steps you´d have to download the repository on both your server or/and your client. You can do this by downloading the zip from GitHub or by using the command:

``git clone https://github.com/ikno-the-box-guy/IkTube``
### API
The idea is that you -- yes you -- host the API yourself. The following steps are meant to be executed on the device where you will host the API.

The API is written in JavaScript as a Node JS application, so you need to have Node JS (18.x >) installed.

Once you have node installed you can navigate over to the "api" directory and run the ``npm i`` command to install all the dependencies. After you've done this you can start the server with ``npm run start``.

The API uses port 3000 by default, but you can change this by updating the ``.env`` file. 

And you're done! Set it up as a system service, turn it into a docker image, do whatever you like with it. It's yours to use. 

### Extension
If the extension were to be uploaded to the chrome store it would get taken down. So it has to be download and loaded into chrome manually. This means no auto updates sadly :( 

Go to the ``chrome://extensions`` page and enable developer mode. Now you should be able to load it as an unpacked extension (just select the extension directory). 

Once installed you should be able to click on the icon from the extensions list. Before you can use the extension you need to go to the options page and set the API url. Set this to the IP/url of the server on which you installed the API.

The extension should now be ready for use. Just click the icon whenever you're on a youtube video and you should be able to download the audio, video and thumbnail.