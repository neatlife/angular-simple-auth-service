+ function() {
    angular.module('app', ['ui.router'])
        .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated'
    })
        .config(config)
        .factory('AuthService', function($http, Session) {
        var authService = {};

        authService.login = function(credentials) {
            return $http
                .post('/login', credentials)
                .then(function(res) {
                Session.create(res.data.id, res.data.user.id);
                return res.data.user;
            });
        };

        authService.isAuthenticated = function() {
            return !!Session.userId;
        };

        return authService;
    })
        .service('Session', function() {
        this.create = function(sessionId, userId) {
            this.id = sessionId;
            this.userId = userId;
        };
        this.destroy = function() {
            this.id = null;
            this.userId = null;
        };
    })
    .run(function() {
        console.log('hallo');
    });
    
    config.$inject =  ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider,   $urlRouterProvider) {
        $urlRouterProvider
            .otherwise('/signin');

        $stateProvider
            .state('signin', {
              url: '/signin',
              templateUrl: 'signin.html',
              data : { title: '登录' },
              controller: "SigninCtrl"
            });
    }

    angular.module('app').controller('AppCtrl', AppCtrl);
    angular.module('app').controller('SigninCtrl', SigninCtrl);

    function AppCtrl() {
        //alert('aa');
    }

    function SigninCtrl($scope, AuthService) {
        console.log(AuthService);
        $scope.login = function() {
            alert('signin');
            
        }
    }
}();