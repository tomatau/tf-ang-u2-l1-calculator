angular.module('Calculator', ['ngRoute'])
    .constant('dev', false);
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
            };

        var e = {
            charges: {},
            earnings: {},
            inputs: {},
            earningsHistory: [],
            reset: reset,
            clear: clear,
            addEarnings: function(price, rate, percentage){
                setInputs(price, rate, percentage);
                calculateCharges(price, rate, percentage);
                calcEarnings();
                addToHistory();
            }
        }

        function reset(){
            e.charges = angular.extend({}, defaults.charges);
            e.earnings = angular.extend({}, defaults.earnings);
            e.inputs = angular.copy(defaults.inputs);
            e.earningsHistory = [];
        }

        function clear(){
            e.inputs = angular.extend({}, defaults.inputs);
        }

        function setInputs(price, rate, percentage) {
            e.inputs = {
                price: price,
                rate: rate,
                percentage: percentage
            }
        }

        function calculateCharges(price, rate, percentage){
            var tax = price * (rate / 100);
            e.charges.subtotal = price + tax;
            e.charges.tip = e.charges.subtotal * (percentage / 100);
            e.charges.total = e.charges.subtotal + e.charges.tip;
        }

        function calcEarnings(){
            e.earnings.tiptotal += e.charges.tip;
            ++e.earnings.count;
            e.earnings.average = e.earnings.tiptotal / e.earnings.count;
        }

        function addToHistory(){
            var row = angular.extend({}, e.charges, e.inputs);
            e.earningsHistory.push(row);
        }

        reset();
        return e;
    });

angular.module('Calculator')
    .controller('InputsCtrl', 
        ['$scope', 'Earnings', function ($scope, Earnings) {
            'use strict';
            
            $scope.inputs = Earnings.inputs;
            $scope.earnings = Earnings.earnings;
            $scope.charges = Earnings.charges;
            $scope.submitted = false;

            $scope.clear = function(){
                Earnings.clear();
                $scope.inputsForm.$setPristine(true); // holy fuck seriously..
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
                $scope.inputs = Earnings.inputs; // this is fucking shit
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
                $scope.earnings = Earnings.earnings;
                $scope.earningsHistory = Earnings.earningsHistory;
            };
            
            $scope.earnings = Earnings.earnings;
            $scope.earningsHistory = Earnings.earningsHistory;
        }
    ])
angular.module('Calculator')
    .config([ 'dev', '$provide', '$routeProvider', '$locationProvider',
        function(dev, $p, $rP, $lP){
            $p.value('prf', (dev) ? '#!/' : '/');
            if (!dev) $lP.html5Mode(true);
            else $lP.hashPrefix('!')

            $rP.when( '/new-meal', {
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
    .run(['$rootScope', 'prf', 'pages', '$location', '$route',
        function($rS, prf, pages, $l, $r){
            $rS.prf = prf;
            $rS.pages = pages;
            $rS.path = $l.$$path;
            $rS.$on('$routeChangeSuccess', function() {
                $rS.path = $l.$$path;
            });
        }
    ]);