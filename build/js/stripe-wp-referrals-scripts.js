
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
        controller: ['$scope', 'Stripe', function($scope, Stripe){
            $scope.referral_code = '';
            $scope.authorized = false;

            var data = {
                more_settings: ['stripe_wp_referrer_amount', 'stripe_wp_referral_amount', 'stripe_wp_referral_code_prefix']
            };

            Stripe.get_settings( data ).then(function(res){
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

            }

        }]
    }
});