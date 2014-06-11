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