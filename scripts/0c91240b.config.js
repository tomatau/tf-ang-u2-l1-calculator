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