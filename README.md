Combining Plivo telephony service with video.

v0.1.0

A user opens a web-page. This prompts the user to dial in to a phone number. On answering the call call, a video plays on the web-page and the user is prompted to make a choice on their keypad. When they choose a new video begins playing on the web page.

Notes:
- Set-up with all the business logic on the client application.

- Web client:
    - opens socket to node
    - gets a script from node (? just a file)
    - requests resources from the server, video, fonts, available phone number
    - creates event handlers based on the script
    - handles events from Plivo, UI & video

- Node:
    - creates a 'performance' object 
    - adds the socket connection
    - adds the script
    - brokers phone numbers and forwards events from Plivo to client
    - does error handling in case of broken connections


v0.0.1

- You enter a number into a webpage
- The app dials the number
- And plays some audio
- And plays a video on the webpage

- Credentials for Plivo are stored in config.json
