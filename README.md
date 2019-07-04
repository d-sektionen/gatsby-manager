# gatsby-manager

Utility for rebuilding gatsby sites.

This is a separate node.js server which will build a gatsby site when a POST request is recieved.
If a GET request is recieved it will respond with the current status.

It is designed to be run locally for other servers on the same machine to interact with, but could be extended to handle requests from the internet.

## Environment variables
Add these to a file called .env

```
GATSBY_PATH="/path/to/your/gatsby/root" # Required
PORT=3000 # Port for the server to run at, optional
```
