angular.module('Calculator', [
    'ngRoute', 
    'ngAnimate'
]).constant('env', 'prod');
angular.module('Calculator')
    .factory('Earnings', function(){
        var defaults = {
                charges: {
                    subtotal: 0,
                    tip: 0,
                    total: 0
                },
                earnings: {
                    tiptotal: 0,
                    count: 0,
                    average: 0
                },
                inputs: {
                    price: null,
                    rate: null,
                    percentage: null
                }
            },
            inputs = {},
            charges = {},
            earnings = {},
            earningsHistory = [];

        function reset(){
            charges = angular.extend({}, defaults.charges);
            earnings = angular.extend({}, defaults.earnings);
            inputs = angular.copy(defaults.inputs);
            earningsHistory = [];
        }

        function clear(){
            inputs = angular.extend({}, defaults.inputs);
        }

        function setInputs(price, rate, percentage) {
            inputs = {
                price: price,
                rate: rate,
                percentage: percentage
            }
        }

        function calculateCharges(price, rate, percentage){
            var tax = price * (rate / 100);
            charges.subtotal = price + tax;
            charges.tip = charges.subtotal * (percentage / 100);
            charges.total = charges.subtotal + charges.tip;
        }

        function calcEarnings(){
            earnings.tiptotal += charges.tip;
            ++earnings.count;
            earnings.average = earnings.tiptotal / earnings.count;
        }

        function addToHistory(){
            var row = angular.extend({}, charges, inputs);
            earningsHistory.push(row);
        }

        reset();
        
        return {
            getCharges: function(){ return charges; },
            getEarnings: function(){ return earnings; },
            getInputs: function(){ return inputs; },
            getEarningsHistory: function() { return earningsHistory; },
            reset: reset,
            clear: clear,
            addEarnings: function(price, rate, percentage){
                setInputs(price, rate, percentage);
                calculateCharges(price, rate, percentage);
                calcEarnings();
                addToHistory();
            }
        };
    });

angular.module('Calculator')
    .controller('InputsCtrl', 
        ['$scope', 'Earnings', function ($scope, Earnings) {
            'use strict';
            
            $scope.inputs = Earnings.getInputs();
            $scope.earnings = Earnings.getEarnings();
            $scope.charges = Earnings.getCharges();
            $scope.submitted = false;

            $scope.clear = function(){
                Earnings.clear();
                $scope.inputsForm.$setPristine(true); // holy &^*£ seriously..
            }

            $scope.addEarnings = function(){
                if ( $scope.inputsForm.$invalid )
                    return false;

                Earnings.addEarnings(
                    $scope.inputs.price, 
                    $scope.inputs.rate, 
                    $scope.inputs.percentage
                );

                Earnings.clear();
                $scope.inputs = Earnings.getInputs(); // this is *@%$ing @£$%
                $scope.submitted = false;
            }
        }
    ])
angular.module('Calculator')
    .controller('ResultCtrl', 
        ['$scope', 'Earnings', function($scope, Earnings) {
            'use strict';

            $scope.reset = function(){
                Earnings.reset();
                $scope.earnings = Earnings.getEarnings();
                $scope.earningsHistory = Earnings.getEarningsHistory();
            };
            
            $scope.earnings = Earnings.getEarnings();
            $scope.earningsHistory = Earnings.getEarningsHistory();
        }
    ])
angular.module('Calculator')
    .config([ 'env', '$routeProvider', '$locationProvider',
        function(env, $routeP, $locP /*, $provider */){
            // $p.value('prf', (env) ? '#!/' : '/');
            if (env == "prod") $locP.html5Mode(true);
            
            $locP.hashPrefix('!')

            $routeP.when( '/new-meal', {
                    controller: 'InputsCtrl',
                    templateUrl: 'tmpl/inputs.html'
                })
                .when( '/my-earnings', {
                    controller: 'ResultCtrl',
                    templateUrl: 'tmpl/result.html'
                })
                .when( '/', {
                    templateUrl: 'tmpl/intro.html'
                })
                .otherwise({
                    redirectTo: '/'
                })
        }
    ])
    .value('pages', [
        { url: '',              name: 'home'        }
        ,
        { url: 'new-meal',      name: 'new meal'    }
        ,
        { url: 'my-earnings',   name: 'my earnings' }
    ])
    .run(['$rootScope', 'pages', '$location', 'env',
        function($rS, pages, $locP, env){
            $rS.env = env;
            $rS.pages = pages;
            $rS.path = $locP.$$path;
            $rS.$on('$routeChangeSuccess', function() {
                $rS.path = $locP.$$path;
            });
        }
    ]);