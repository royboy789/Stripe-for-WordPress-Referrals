<?php
	class stripe_wp_referral_enddpoints {
		function register_referral_endpoints() {
			register_rest_route( 'stripe-wp', '/code-check/(?P<code>.+)', array(
				array(
					'methods'         => 'GET',
					'callback'        => array( $this, 'code_check' ),
				),
			) );
		}
		function code_check( WP_REST_Request $request ) {
			$data = $request->get_params();

			return new WP_REST_Response( $data, 200 );
		}
	}
?>