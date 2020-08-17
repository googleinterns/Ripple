# Ripple

## Overview
* [Description](#description)
* [Motivation](#motivation)
* [Technologies](#technologies)
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
See full video demos [here](https://drive.google.com/drive/folders/1-Qilnh3RiPGI6eb3BcdW-Q2v53roc72O?usp=sharing).
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
Key features
* View all businesses in the selected cluster from the Main page. 

Enter your address to see suggested businesses
![Github_Search_Address](https://user-images.githubusercontent.com/39513112/90344647-7194f300-dfd0-11ea-8978-1c621ac78373.gif)  
Click on "View All" to see all businesses in a carousel
![Github_View_All](https://user-images.githubusercontent.com/39513112/90344629-4b6f5300-dfd0-11ea-983a-f9e4082bd769.gif)

### Search for local businesses
Key features:
* Autocompletes by business tags such as "Chinese" or "Black-owned"
* Search string accepts incorrect captialization as well as special and accented characters
* Redirects to a search results page

The search query returns businesses in the database that match the user input for business name or tags, filtered by the user's city.  
![Github_Search_Results](https://user-images.githubusercontent.com/39513112/90345403-13b6da00-dfd5-11ea-8aa8-0661297f2567.gif)

### See business details, including health safety information
Key features:
* View team member highlights
* Get real-time health safety information, such as whether a mask is required or outdoor dining is offered
* Receive walking directions, duration, and distance from your location to the business
* Add a star and price rating to the business (community members only)  

Business Details page  
![Github_Business_Details](https://user-images.githubusercontent.com/39513112/89875220-d9cb7b00-db71-11ea-8012-b762bf300f01.gif)

Add a review: Anonymous user will need to sign in before posting
![Github_Business_Details_Add_a_Review](https://user-images.githubusercontent.com/39513112/89877874-9541de80-db75-11ea-8cc5-17b8b2825dde.gif)

### Make an account
Key features:
* Choose an account type (community member or business owner)
* Authenticate using Google sign-in
* Verify your email
* Includes checks against invalid authentication methods

New user sign up flow  
![Github_New_User_Signs_Up](https://user-images.githubusercontent.com/39513112/89880362-0040e480-db79-11ea-8c9c-00068cc52c42.gif)

Invalid authentication case 1: New user attempts to log in  
![Github_New_User_Attempts_Sign_In](https://user-images.githubusercontent.com/39513112/89880376-046d0200-db79-11ea-89cc-4d07c6aaf127.gif)

Invalid authentication case 2: Unverified user attempts to log in  
![GitHub_Unverified_User_Demo](https://user-images.githubusercontent.com/39513112/89839777-6c90f900-db23-11ea-9641-de69d9d05877.gif)

Invalid authentication case 3: Existing user attempts to sign up  
![Github_Existing_User_Attempts_Sign_Up](https://user-images.githubusercontent.com/39513112/89842670-3788a480-db2b-11ea-838d-63ccfdf5bb92.gif)

Summary of user types
1. Anonymous user
![Anonymous user nav bar](https://user-images.githubusercontent.com/39513112/89881445-61b58300-db7a-11ea-91a2-53ef3887014f.png)
2. Community member
![Community member nav bar](https://user-images.githubusercontent.com/39513112/89881436-5febbf80-db7a-11ea-9a53-0411ceb718db.png)
3. Business owner
![Business owner nav bar](https://user-images.githubusercontent.com/39513112/89881441-60845600-db7a-11ea-8a28-cccea606e473.png)

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

Part 1: Upload photos for business image gallery and add business details
![Github_Manage_Business_Part_1](https://user-images.githubusercontent.com/39513112/90346672-08b57700-dfe0-11ea-9663-8dde0ef0c819.gif)  
Part 2: Select tags and add business hours
![Github_Manage_Business_Part_2](https://user-images.githubusercontent.com/39513112/90346774-c2144c80-dfe0-11ea-903e-45916ce0cc7d.gif)

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
