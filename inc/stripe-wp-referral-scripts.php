<?php

class stripe_wp_referral_scripts {

	function admin_scripts() {
		wp_enqueue_script( 'wp-stripe-referral-main', WP_STRIPE_REFERRAL_URL . '/build/js/stripe-wp-referrals-scripts.js', array( 'jquery' ), WP_STRIPE_REFERRAL_VERSION, false );

		$local_object = array(
			'template_directory' => WP_STRIPE_REFERRAL_URL . 'templates/',
		);
		wp_localize_script( 'wp-stripe-referral-main', 'stripe_wp_referral_local', $local_object );
	}

	function fed_scripts() {
		wp_enqueue_script( 'wp-stripe-referral-fed', WP_STRIPE_REFERRAL_URL . '/build/js/stripe-wp-referrals-scripts.js', array( 'jquery' ), WP_STRIPE_REFERRAL_VERSION, false );

		$local_object = array(
			'template_directory' => WP_STRIPE_REFERRAL_URL . 'templates/',
		);
		wp_localize_script( 'wp-stripe-referral-fed', 'stripe_wp_referral_local', $local_object );
	}
}

?>