# Ripple

## Overview
* [Description](#description)
* [Motivation](#motivation)
* [Techonologies](#technologies)
* [Demos](#demos)
  * [Discover small businesses in your area](#discover-small-businesses-in-your-area)
  * [Search for local businesses](#search-for-local-businesses)
  * [See business details, including health safety information](#see-business-details-including-health-safety-information)
  * [Make an account](#make-an-account)
  * [Manage your account](#manage-your-account)
  * [Manage your business](#manage-your-business)
  * [Post a story on a public feed](#post-a-story-on-a-public-feed)
* [License](#license)
* [Contributors](#contributors)
* [Disclaimer](#disclaimer)

## Description
Ripple is a web app that serves as a platform for:
* Community members to easily discover local businesses, discover real-time updates on safety measures being taken in response to COVID-19, and learn about the faces behind each business
* Local businesses to share personal stories and relevant information about their work in the community while growing their customer base virtually.

To get started, users can view all features without logging in. This includes searching for small business and accessing their details as well as viewing posts shared by business owners in the area. A user can sign up as a community member to add reviews to a business or as a business owner to add their business in our database, share posts on a public feed, and add business updates in our Manage Business page at anytime. 

## Motivation
* Small businesses have experienced significant financial strain due to COVID-19.
* Many small businesses lack a strong online presence and struggle to maintain connections with customers
* Customers are unsure whether it is safe to order from a restaurant
* Traditional business-finding sites like Yelp are impersonal and too broad
* There is no centralized platform for discovering and interacting with local businesses, sharing business stories, and posting health safety updates

## Technologies

* **Frontend languages**: HTML, CSS, JavaScript

* **Backend languages**: JavaScript, Java

* **Libraries**: jQuery, Bootstrap 4.0, Google Material Design, Fontawesome

* **Storage**: Firebase NoSQL Firestore, GAE Blobstore API

* **APIs**: 
  * Blobstore API
  * Directions Service API
  * Distance Matrix Service API
  * Firebase Authentication API
  * Firebase Firestore API
  * Geocoding API
  * Maps JavaScript API
  * Places API

* **Testing**: Jest (JavaScript testing framework)

* **Build Automation**: Maven

* **Deployment**: Google App Engine (GAE)

## Demos
### Discover small businesses in your area
#### Landing page
Key features:
* Enter your address to pull up small businesses near you
* The address will autocomplete as you type
#### Main page
Key features
* View suggested businesses in your area
* Get the walking time & distance from your location to business
#### View all page
### Search for local businesses
Key features:
* Autocompletes by business tags such as "Chinese" or "Black-owned"
* Search string accepts incorrect captialization as well special and accented characters
* Redirects to a search results page

### See business details, including health safety information
Key features:
* View team member highlights
* Get real-time health safety information, such as whether a mask is required or outdoor dining is offered
* Receive walking directions, duration, and distance from your location to the business
* Add a star and price rating to the business (community members only)  

Business Details page
![Github_Business_Details](https://user-images.githubusercontent.com/39513112/89875220-d9cb7b00-db71-11ea-8012-b762bf300f01.gif)

Add a review


### Make an account
#### Sign up flow
Key features:
* Choose an account type (community member or business owner)
* Authenticate using Google sign-in
* Verify your email
* Be prevented from invalid authentication methods

New user signs up

Existing user attempts sign up
![Github_Existing_User_Attempts_Sign_Up](https://user-images.githubusercontent.com/39513112/89842670-3788a480-db2b-11ea-838d-63ccfdf5bb92.gif)

Unverified user attempts log in
![GitHub_Unverified_User_Demo](https://user-images.githubusercontent.com/39513112/89839777-6c90f900-db23-11ea-9641-de69d9d05877.gif)

Summary of user types
1. Anonymous user
2. Community member
3. Business owner

### Manage your account
Key features:
* Customize your avatar image
* See your profile details

This page is only available to community members and business owners.  

![Redesigned Acct Settings](https://user-images.githubusercontent.com/39513112/89838064-25086e00-db1f-11ea-8120-586399277c56.gif)

### Manage your business
Key features:
* Add images to a gallery of photos to be displayed on your business' details page
* Select tags such as "Thai" that best describe your restaurant to increase search visibiity

This page is only available to business owners.  

### Post a story on a public feed
Key features:
* Upload a photo and a caption to share on a public feed
* See all posts in your city
* Get the most recent posts first. 
This page is available to all users, but only business owners may share a post.

![Github_View_all_posts](https://user-images.githubusercontent.com/39513112/89842147-a49b3a80-db29-11ea-9c20-12fab313c71a.gif)

Business owner clicks 'Share your story' button
![Github_Add_a_post](https://user-images.githubusercontent.com/39513112/89841456-c8f61780-db27-11ea-9365-e41eb2935f6b.gif)

## License
Ripple is licensed under the Apache 2.0 License.

## Contributors
Ripple was developed by Sarah ([@saraholiviawu](https://github.com/saraholiviawu)) and Smruthi ([@smruthibalajee](https://github.com/smruthibalajee)) with the support of Google hosts Sumant ([@sabadas](https://github.com/sabadas)) and Peter ([@peter14f](https://github.com/peter14f)) as part of the Google STEP Internship (Student Training in Engineering Program) in 2020.

## Disclaimer
This is not an officially supported Google product.
