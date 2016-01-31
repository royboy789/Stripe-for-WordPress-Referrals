<?php
/**
 * Plugin Name: Stripe For WordPress Referrals Add-On
 * Description: A way to add referrals
 * Author: Roy Sivan
 * Author URI: http://www.roysivan.com
 * Version: 0.1
 * Plugin URI: https://github.com/royboy789/Stripe-for-WordPress
 * License: GPL3+
 * Text Domain: wp-stripe-referrals
 */


define( 'WP_STRIPE_REFERRAL_DIR', plugin_dir_path( __FILE__ ) );
define( 'WP_STRIPE_REFERRAL_URL', plugin_dir_url( __FILE__ ) );
define( 'WP_STRIPE_REFERRAL_VERSION', '0.1' );

require 'inc/stripe-wp-referral-scripts.php';
require 'inc/stripe-wp-referral-shortcodes.php';
require 'inc/stripe-wp-referral-endpoints.php';

class stripe_wp_referrals {
	protected $scripts;
	function __construct() {
		$this->scripts = new stripe_wp_referral_scripts();
	}
	function admin_scripts() {
		$this->scripts->admin_scripts();
	}
	function fed_scripts() {
		$this->scripts->fed_scripts();
	}
	function referral_shortcode( $atts ) {
		$shortcodes = new stripe_wp_referral_shortcodes();
		return $shortcodes->new_customer_referral_shortcode( $atts );
	}
	function referral_endpoints() {
		$endpoints = new stripe_wp_referral_enddpoints();
		$endpoints->register_referral_endpoints();
	}
}

$referrals = new stripe_wp_referrals();

/*
 * Register Referral Scripts
 */
add_action( 'admin_enqueue_scripts', array( $referrals, 'admin_scripts' ) );
add_action( 'wp_enqueue_scripts', array( $referrals, 'fed_scripts' ) );

/*
 * New Customer Referral Shortcode
 */
add_shortcode( 'stripe-wp-referral', array( $referrals, 'referral_shortcode') );

/*
 * Add API endpoints
 */
add_action( 'rest_api_init', array( $referrals, 'referral_endpoints') );

?>