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