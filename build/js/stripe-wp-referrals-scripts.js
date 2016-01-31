(function(wp_stripe){
    /** make sure wp-stripe is defined **/
    if( typeof wp_stripe.app == 'undefined' ) {
        return false;
    }

    wp_stripe.app.run( function( $rootScope, $state ) {
        console.log('loading referral system..');
        $rootScope.nav_items.push({
            title: 'Referrals',
            state: 'referrals'
        });
    });

    wp_stripe.app.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('referrals', {
                url: '/referrals',
                templateUrl: stripe_wp_referral_local.template_directory + 'stripe-wp-referrals.settings.html',
                controller: 'referrals',
            })
    });

    wp_stripe.app.controller( 'referrals', [ '$rootScope', '$scope', 'Stripe', 'Users', function( $rootScope, $scope, Stripe, Users ){
        $scope.referrals = {};

        var data = {
            more_settings: ['stripe_wp_referrer_amount', 'stripe_wp_referral_amount', 'stripe_wp_referral_code_prefix']
        };

        Stripe.get_settings( data ).then(function(res){
            if( res.data.stripe_wp_referrer_amount ) {
                $scope.referrals.referrer_amount = res.data.stripe_wp_referrer_amount;
            }
            if( res.data.stripe_wp_referral_amount ) {
                $scope.referrals.referral_amount = res.data.stripe_wp_referral_amount;
            }
            if( res.data.stripe_wp_referral_code_prefix ) {
                $scope.referrals.referral_code_prefix = res.data.stripe_wp_referral_code_prefix;
            }
        });

        $scope.updateSettings = function() {

            var data = {
                more_settings: {
                    stripe_wp_referrer_amount: $scope.referrals.referrer_amount,
                    stripe_wp_referral_amount: $scope.referrals.referral_amount,
                    stripe_wp_referral_code_prefix: $scope.referrals.referral_code_prefix,
                }
            };

            Stripe.save_settings( data).then(function(res){
                if( res.data.stripe_wp_referrer_amount ) {
                    $scope.referrals.referrer_amount = res.data.stripe_wp_referrer_amount;
                }
                if( res.data.stripe_wp_referral_amount ) {
                    $scope.referrals.referral_amount = res.data.stripe_wp_referral_amount;
                }
                swal({
                    title: 'Settings Saved',
                    text: 'Referral settings saved successfully',
                    type: 'success',
                })
            });
        }
    }]);

}(wp_stripe))

wp_stripe.app.directive('stripeCustomerReferral', function() {
    return {
        restrict: 'E',
        templateUrl: stripe_wp_referral_local.template_directory + '/directives/stripe-wp-referrals.directive.html',
        scope: {
            planId: '@planId'
        },
        controller: ['$scope', '$http', 'Stripe', function($scope, $http, Stripe){
            $scope.referral_code = '';
            $scope.authorized = false;
            $scope.referrer = false;

            var data = {
                more_settings: ['stripe_wp_referrer_amount', 'stripe_wp_referral_amount', 'stripe_wp_referral_code_prefix']
            };

            Stripe.get_settings( data ).then(function(res){
                $scope.referral_amount = res.data.stripe_wp_referral_amount;
                $scope.referrer_amount = res.data.stripe_wp_referrer_amount;
                if( res.data.stripe_wp_referral_code_prefix ) {
                    $scope.referral_code_prefix = res.data.stripe_wp_referral_code_prefix;
                }
            });

            $scope.codeCheck = function(){
                /** Check if prefix matches **/
                if( $scope.referral_code.indexOf( $scope.referral_code_prefix ) != 0 ) {
                    swal({
                        title: 'Incorrect Code',
                        text: 'The code you entered does not match any in our system',
                        type: 'error',
                    });
                    return false;
                }

                $http.get( stripe_wp_local.api_url + 'stripe-wp/code-check/' + $scope.referral_code).then(function(res){
                   if( res.data.code_valid ) {
                        Stripe.customer.get({id:res.data.cus_id}).then(function(res){
                            if( !res.data.delinquent ) {
                                $scope.referrer = res.data.id;
                                $scope.authorized = true;
                            } else {
                                swal({
                                    title: 'Customer Error',
                                    text: 'The code you entered does not match a customer in good standing',
                                    type: 'error',
                                });
                            }
                        });
                   } else {
                       swal({
                           title: 'Incorrect Code',
                           text: 'The code you entered does not match any customer in our system',
                           type: 'error',
                       });
                   };
                });

            }

            /* SIGN UP */
            $scope.group_step = 1;
            $scope.change_step = function( step, back ) {
                back = typeof back !== 'undefined' ? back : false;

                if( $scope.group_step > parseInt( step ) ) {
                    back = true;
                }

                if( back || $scope.stepValidate( $scope.group_step.toString() ) ) {
                    $scope.group_step = step;
                } else {
                    swal({
                        'title' : 'Required Fields',
                        'text' : 'All Fields Required',
                        'type' : 'error'
                    });
                }
            }
            $scope.user = {
                cc: {
                    exp: {}
                }
            };

            $scope.stepValidate = function( step ) {
                switch( step ) {
                    case '1':
                        if (
                            $scope.user.name &&
                            $scope.user.name.first &&
                            $scope.user.name.last &&
                            $scope.user.phone &&
                            $scope.user.address &&
                            $scope.user.address.line1 &&
                            $scope.user.address.city &&
                            $scope.user.address.postal_code &&
                            $scope.user.address.state.length
                        ) {
                            return true;
                        }
                        break;
                    case '2':
                        if(
                            $scope.user.email &&
                            $scope.user.username &&
                            $scope.user.pass &&
                            $scope.pass
                        ) {
                            if( $scope.pass != $scope.user.pass ) {
                                $scope.pass_mismatch = true;
                            } else {
                                $scope.pass_mismatch = false;
                                return true;
                            }
                        }
                        break;
                    case '3':
                        if(
                            $scope.user.cc.number &&
                            $scope.user.cc.exp.month &&
                            $scope.user.cc.exp.year &&
                            $scope.user.cc.cvc
                        ) {
                            return true;
                        }
                        break;
                    default:
                        return false;

                }
            }


            $scope.newUser = function() {
                if( !$scope.planId ) {
                    swal({
                        title: 'No Plan ID Set',
                        text: 'No Subscription Plan ID Set',
                        type: 'error',
                    });
                    return false;
                }
                $scope.user.plan_id = $scope.planId;

                Stripe.customer.new( $scope.user ).then(function(res){
                    $scope.user = {
                        cc: {}
                    };

                    /** Add Account Balances **/
                    // For the referrer
                    if( $scope.referrer_amount ) {
                        var referrer_data = {
                            id: $scope.referrer,
                            account_balance: $scope.referrer_amount
                        }
                        Stripe.customer.save( referrer_data );
                    };

                    // For the referral
                    if( $scope.referral_amount ) {
                        var referrer_data = {
                            id: res.data.id,
                            account_balance: $scope.referral_amount
                        }
                        Stripe.customer.save( referrer_data );
                    };

                    if( !stripe_wp_local.confirmation.type ) {
                        swal({
                            'title' : 'Success!',
                            'text' : 'We have successfully added you!',
                            'type' : 'success'
                        });
                    }

                    if( stripe_wp_local.confirmation.type == 'message' ) {
                        swal({
                            'title' : 'Success!',
                            'text' : stripe_wp_local.confirmation.message,
                            'type' : 'success'
                        });
                    }

                    if( stripe_wp_local.confirmation.type == 'page' ) {
                        window.location = stripe_wp_local.confirmation.page;
                    }

                }, function(res){
                    console.log( 'error', res );
                    swal({
                        'title' : 'Error',
                        'text' : 'An Error Occured: ' + res.data.message,
                        'type' : 'error'
                    });
                });
            }

        }]
    }
});