# behavioural-recruitment

a CRUD based RESTful API that builds a simple behavioural recruitment interview template for interviewers or interviewees

The API is designed to be RESTful and is aspirational - that is, I know that it isn't fully REST compliant yet, but it's well on it's way and I intend to learn a lot about REST while doing so.

Accessible here: https://behavioural-recruitment.thewoodenman.repl.co/

![image](https://user-images.githubusercontent.com/85075266/200978222-b12e5a75-7696-4599-9832-20bdf9919570.png)


How It's Made:
Tech used: HTML, CSS, JavaScript, picoCSS, node.js, express, mongoDB,

The API was built first as a node.js/express app that serves content from a backend. I fleshed it out quite a bit to include a client with documentation and a few tools to allow fast/easy testing and demo of some of the API's functions.

##Hosting

Initially the API was hosted on heroku, but had to be migrated to repl.it after the service terms and conditions changed. I'm not currently 100% happy with replit's service as the API goes dormant if not in use and needs to be "woken up" which causes delays. I believe Microsoft Azure may be a better home for it and I will migrate it over as a job to do shortly.

Optimizations

I made a number of changes to the API over time, especially in getting it REST compliant. Using https://restfulapi.net/ as a guide.

##1. Uniform Interface
Initially the interface and query/parameters were a little disjointed and inconsistent.  I changed them to be more consistent and to follow a more logical path.  Ideally after using the API a few times you should be able to intuit how it will generally behave.

##2. Client/Server
The backend is fully functional and serves content to any requests not just from the provided client. Ultimately I will convert this to be just a backend API with no client functionality beyond detailed documentation explaining how it works so it can fully comply with the client/server model.

##3. Stateless
The API is already stateless, doesn't require a handshake of any kind and serves content in one step on request. One optimisation here is that I plan to add API keys for "unsafe" changes (e.g. POST, PUT or DELETE requests) currently it's not needed though.

##4. Cachable 
Not currently implemented, but definitely on my wishlist of features to add.

##5. Layered System
Not currently implemented, but would be good to get this done with some refactoring. Currently the app structure is a little basic and operates only from the server.js file.  that said, changing the structure should be quite easy once I decide on an optimal way to do it.

##6.  Code on Demand (optional)
Not really needed for this API since we are only serving text bsaed output.

Lessons Learned:
The first thing I learned was how easy it is to get a simple API up and running, but how difficult it is to have a *high quality* API.  Setting up the routes was quite easily but then in retrospect I wasn't thinking 100% about how good the user experience would be at that point - just to make it work. 

My attention to detail improved a lot after taking a "user-eye view" of the API and documentation, adding in UI optimisations and bug checking every single route possible

In the future I want to add more features, security considerations and to potentially publish it.  With a little structure and consideration the API could be useful in a recruitment context for both interviewers and interviewees.

Examples:
Take a look at these couple examples that I have in my own portfolio:

Palettable: https://github.com/alecortega/palettable

Twitter Battle: https://github.com/alecortega/twitter-battle

Patch Panel: https://github.com/alecortega/patch-panel

## Feature wishlist

1.  Randomise a single question ✅
2.  Pull out a particular question by Id Number ✅
3.  Add new Questions ✅
4.  Delete Questions ✅
5.  Bulk add questions ✅
6.  Update the leadership values of a specific question
7.  show all questions with a given leadership value ✅
8.  Show a selection (10x) questions randomly ✅
9.  Show a selection (10x) questions randomly based on a leadership value ✅
10. Make it look good ✅
