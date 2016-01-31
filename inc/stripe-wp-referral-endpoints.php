<?php
	class stripe_wp_referral_enddpoints {
		function register_referral_endpoints() {
			register_rest_route( 'stripe-wp', '/code-check/(?P<code>.+)', array(
				array(
					'methods'         => 'GET',
					'callback'        => array( $this, 'code_check' ),
				),
			));
		}
		function code_check( WP_REST_Request $request ) {
			$data = $request->get_params();

			if( !$data['code'] ) {
				return new WP_Error( 'no code', __( 'you need to pass a code to check' ), array( 'status' => 401 ) );
			}

			$users = new WP_User_Query( array(
				'meta_query' => array(
					array(
						'key' => '__stripe-wp-referral-code',
						'value' => $data['code']
					)
				)
			));

			if( !empty( $users->results ) ) {
				$user_id = $users->results[0]->ID;
				$return = array( 'code_valid' => true, 'user' => $user_id, 'cus_id' => get_user_meta( $user_id, '__stripe_cus_id', true ) );
			} else {
				$return = array('code_valid' => false);
			}

			return new WP_REST_Response( $return, 200 );
		}
	}
?>