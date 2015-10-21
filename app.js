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
                .post('/user.json', credentials)
                .then(function(res) {
                console.log(res);
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
        .run(function($rootScope, AUTH_EVENTS, AuthService) {
        $rootScope.$on('$stateChangeStart', function(event, next) {
            if (next.signin == 'signin') {
                return;
            }
            if (!AuthService.isAuthenticated()) {
                //event.preventDefault();
                // user is not logged in
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }
        });
    });

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .otherwise('/signin');

        $stateProvider
            .state('signin', {
            url: '/signin',
            templateUrl: 'signin.html',
            data: {
                title: '登录'
            },
            controller: "SigninCtrl"
        });
    }

    angular.module('app').controller('AppCtrl', AppCtrl);
    angular.module('app').controller('SigninCtrl', SigninCtrl);

    function AppCtrl($scope, AuthService) {
        $scope.currentUser = null;
        $scope.isAuthorized = AuthService.isAuthorized;

        $scope.setCurrentUser = function(user) {
            $scope.currentUser = user;
        };
        //alert('aa');
    }

    function SigninCtrl($rootScope, $scope, AuthService, AUTH_EVENTS) {
        $scope.credentials = {
            username: '',
            password: ''
        };
        $scope.login = function(credentials) {
            AuthService.login(credentials).then(function(user) {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                $scope.setCurrentUser(user);
            }, function() {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            });
        }
    }
}();