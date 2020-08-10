# Ripple

## Overview
* [Description](#description)
* [Motivation](#motivation)
* [Techonologies](#technologies)
* [Demos](#demos)
  * [Discover small businesses in your area](#discover-small-businesses-in-your-area)
  * [Search for local businesses](#search-for-local-businesses)
  * [See business details, including health safety information](#see-business-details-including-health-safety-information)
  * Make an account
  * Manage your account
  * Manage your local business
  * Post a story on a public feed
* [License](#license)
* [Contributors](#contributors)
* [Disclaimer](#disclaimer)

## Description
Ripple is a web app that serves as a platform for:
* Community members to easily discover local businesses, discover real-time updates on safety measures being taken in response to COVID-19, and learn about the faces behind each business
* Local businesses to share personal stories and relevant information about their work in the community while growing their customer base virtually.

To get started, users can view all of the features without logging in. This including searching for and viewing local businesses as well as viewing posts from business owners. A user can sign up as a community member to add reviews to a business or as a business owner to add their business in our database, share posts on a public feed, and add business updates in our Manage Business page at anytime. 

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

### Make an account
#### Sign up flow
Key features:
* Choose an account type (community member or business owner
* Authenticate using Google sign-in
* Verify your email
* Be prevented from invalid authentication methods

New user signs up

Existing user attempts sign up

Unverified user attempts log in

Summary of user types
1. Anonymous user
2. Community member
3. Business owner

### Manage your account
Key features:
* Customize your avatar image
* See your profile details

This page is only available to community members and business owners.  
### Manage your business
Key features:
* Add images to a gallery of photos to be displayed on your business' details page
* Select tags such as "Thai" that best describe your restaurant to increase restaurant search visibiity

This page is only available to business owners.  

### Post a story on a public feed
Key features

## License
Ripple is licensed under the Apache 2.0 License.

## Contributors
Ripple was developed by Sarah ([@saraholiviawu](https://github.com/saraholiviawu)) and Smruthi ([@smruthibalajee](https://github.com/smruthibalajee)) with the support of Google hosts Sumant ([@sabadas](https://github.com/sabadas)) and Peter ([@peter14f](https://github.com/peter14f)) as part of the Google STEP Internship (Student Training in Engineering Program) in 2020.

## Disclaimer
This is not an officially supported Google product.
