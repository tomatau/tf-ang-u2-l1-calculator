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