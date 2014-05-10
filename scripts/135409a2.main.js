function CalculatorCtrl($scope) {
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
        }
    };

    $scope.resetVals = function(){
        $scope.charges = $.extend({}, defaults.charges);
        $scope.earnings = $.extend({}, defaults.earnings);
        $scope.inputs = {};
        $scope.submitted = false;
    }

    $scope.resetVals();

    function calcCharges(inputs){
        var tax = inputs.price * (inputs.rate / 100);
        $scope.charges.subtotal = inputs.price + tax;
        $scope.charges.tip = $scope.charges.subtotal * (inputs.percentage / 100);
        $scope.charges.total = $scope.charges.subtotal + $scope.charges.tip
    }

    function calcInfo(inputs){
        $scope.earnings.tiptotal += $scope.charges.tip;
        ++$scope.earnings.count;
        $scope.earnings.average = $scope.earnings.tiptotal / $scope.earnings.count;
    }

    function calculateAmounts(inputs){
        calcCharges(inputs);
        calcInfo(inputs);
    }

    $scope.submit = function() {
        if ($scope.inputsForm.$valid) {
            calculateAmounts($scope.inputs);
        }
    }
}

angular.module('Calculator', [])
    .controller('CalculatorCtrl', 
        ['$scope', CalculatorCtrl]
    )
    ;