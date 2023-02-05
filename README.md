# Web Streams Project

## This project shows how to stream a large amount of data (big files with GB) from a node.js server and rendering inside a browser without crashing.

**There are several ways to fetch data with large amount of GBs from a server.**

1- Pagination: spliting the data into multiple pages and fetch each page separately in the browser.

2- Lazy Loading: after getting in the end of the scrolling page, the browser makes new request to the server to get more data.

3- Streaming: the server can send chunks of data on-demand as the browser requests more as needed.

This solution refers to the 3rd option above: Streaming data in chunks from the node.js backend server to the browser frontend client.

**Features:**

1- Allows user to start/re-start the streaming.

2- Allows user to stop the streaming.

**How to run the project?**

1- Inside each project folder (server/client) run the following command to install the npm dependencies to generate the node_modules folder:

`$ npm install`

2- After the node_modules folder is generated, run each project using the following command:

`$ npm run dev`

3- Open bellow URL in the browser to open the browser (client):

`http://localhost:3000`

4- Click on the buttons to start or stop the streaming.



Please refer to the documentation for more details:
[Project explanation link](https://ultimate.codes/blog/web-streams-for-rendering-large-ammount-of-data-on-the-browser-without-crashing)
