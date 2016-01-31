<?php

class stripe_wp_referral_shortcodes {
	function new_customer_referral_shortcode( $atts ) {
		$a = shortcode_atts( array(
			'plan_id' => false
		), $atts );

		return $this->customer_signup( $a );

	}
	function customer_signup( $a ) {
		if( !$a['plan_id'] ) {
			return '<div>You need a plan ID for the referral</div>';
		}
		$app = '<div ng-app="stripe-wp">';
			$app .= '<stripe-customer-referral plan-id="' . $a['plan_id'] . '"></stripe-customer-referral>';
		$app .= '</div>';

		return $app;
	}
}

?>