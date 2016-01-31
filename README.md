#Stripe for WordPress Referral Add-On
This is an add-on plugin for my [Stripe for WP](https://github.com/royboy789/Stripe-for-WordPress) plugin

##How it works
When a new user is created, a code is generated for that user, they can use it to refer friends.  
When the friend comes to the site they will be asked for the code, it will validate its authenticity, as well as that the referring customer is not __delinquent__ per Stripe  
  
You have the option to set a dollar amount to send to the referrer (original customer) and referral (new customer) upon completion of sign up

##Requires Stripe for WP plugin

##API
This plugin utilizes both the __WordPress REST API__ and __Stripe PHP Lib API__ to make sure your data is up to date.

##Angular
Plugin is built in AngularJS, it is a single page client side application that runs in the WordPress admin dashboard.

##REST API Endpoints
I have created a few endpoints if you want to extend. All under the `stripe-wp` namespace  
+ `stripe-wp/code-check` - check the code to make sure it is valid

#To Install
+ Clone Repo
+ Run `npm install`
+ Run `gulp`
+ Move `build`, `inc`, `templates`, and `stripe-wp-referrals.php` into a new directory within your `wp-content/plugins`
+ Login to your dashboard and activate the `Stripe for WordPress Referrals Add-On` plugin

##TO-DO
all to-do, issues, and feature requests are in [issues](https://github.com/royboy789/Stripe-for-WordPress-Referrals/issues)