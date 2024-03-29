# Behavioural Recruitment Web API

a RESTful API with CRUD functionality that helps build a simple behavioural recruitment interview template for interviewers or interviewees

The API is designed to be RESTful and is aspirational - that is, I know that it isn't fully REST compliant yet, but it's well on it's way and I intend to learn a lot about REST while doing so.

Accessible here: https://behavioural-recruitment-api.azurewebsites.net/

![image](https://user-images.githubusercontent.com/85075266/200978222-b12e5a75-7696-4599-9832-20bdf9919570.png)

# How It's Made:

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

The API was built first as a node.js/express app that serves content from a backend. I fleshed it out quite a bit to include a client with documentation and a few tools to allow fast/easy testing and demo of some of the API's functions.

## Hosting

Initially the API was hosted on heroku, but had to be migrated to repl.it after the service terms and conditions changed. I'm not currently 100% happy with replit's service as the API goes dormant if not in use and needs to be "woken up" which causes delays. I believed Microsoft Azure may make a better home for it overall and begun migration.

Migration to Azure posed a number of problems, the build and deploy process from github actions to azure web api was fairly complex and making sure that all the jest tests passed before deployment was a key obstacle that needed to be overcome.

Optimizations

I made a number of changes to the API over time, especially in getting it REST compliant. Using https://restfulapi.net/ as a guide.

## 1. Uniform Interface

Initially the interface and query/parameters were a little disjointed and inconsistent. I changed them to be more consistent and to follow a more logical path. Ideally after using the API a few times you should be able to intuit how it will generally behave.

## 2. Client/Server

The backend is fully functional and serves content to any requests not just from the provided client. Ultimately I will convert this to be just a backend API with no client functionality beyond detailed documentation explaining how it works so it can fully comply with the client/server model.

## 3. Stateless

The API is already stateless, doesn't require a handshake of any kind and serves content in one step on request. One optimisation here is that I plan to add API keys for "unsafe" changes (e.g. POST, PUT or DELETE requests) currently it's not needed though.

## 4. Cachable

Not currently implemented, but definitely on my wishlist of features to add.

## 5. Layered System

Not currently implemented, but would be good to get this done with some refactoring. Currently the app structure is a little basic and operates only from the server.js file. that said, changing the structure should be quite easy once I decide on an optimal way to do it.

## 6. Code on Demand (optional)

Not really needed for this API since we are only serving text based output.

# Lessons Learned:

The first thing I learned was how easy it is to get a simple API up and running, but how difficult it is to have a _high quality_ API.

Setting up the routes was quite easy but then in retrospect and after reviewing the consistency of the routes - I wasn't thinking 100% about how good the user experience would be when I first built it - I was just trying to make it work.

My attention to detail improved a lot after taking a "user-eye view" of the API and documentation, adding in UI optimisations and bug checking every single route possible - after that I added a level of consistency, so after using one part of the API - you could logically figure out how the rest of the API might behave.

The Unit and Integration tests I added to the api forced me to dramatically improve the quality of the code in order to be suitable for deployment to Azure web api. I had to add in a handling system to the server to be able to deal with multiple connections and the JEST tests needed to be more strictly configured to gracefully disconnect mongoose and close down the server in a more elegant way.

One of the routes caused significant problems on deployment (it was pulling _every_ record from the database each time it was called) which led to it being removed since it wasn't long term scaleable.

In the future I want to add more features, security considerations like API keys and to potentially publish it on rapidAPI.
With a little structure and consideration the API could be useful in a recruitment context for both interviewers and interviewees.

## Other Examples:

Take a look at these couple examples that I have in my own portfolio:

1. https://github.com/TheWoodenMan/twm-cpd-log CPDEasy - The work I did on the behavioural recruitment API gave me more confidence in the back-end to build a more complex and ambitious app that handles leadership journal entries.

2. https://github.com/TheWoodenMan/NASA-photo-of-the-day NASA Photo of the Day - Before I built my own API I learned to query the APIs built by others, this simple web app takes a user selected date and returns a range of data and images for you.

## Setting Up

make a .env file with the following environment variables:

PORT
MONGO_URI

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
