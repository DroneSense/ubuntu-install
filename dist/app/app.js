System.register(['../app/components/flightPlanViewer/flightPlanViewer', '../app/components/login/login', '../app/components/flightControlViewer/flightControlViewer', '../app/components/test/test', '../app/components/manageViewer/manageViewer', '../app/components/sessionViewer/sessionViewer', '../app/components/flightPlansViewer/flightPlansViewer', '../app/components/hardwareViewer/hardwareViewer', '../app/components/pilotViewer/pilotViewer', '../app/components/checklistViewer/checklistViewer', '../app/components/documentViewer/documentViewer', '../app/components/modelViewer/modelViewer', '../app/components/scheduleViewer/scheduleViewer', '../app/components/accountViewer/accountViewer', '../app/components/profileViewer/profileViewer', '../app/components/video/video', './translations'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var flightPlanViewer_1, login_1, flightControlViewer_1, test_1, manageViewer_1, sessionViewer_1, flightPlansViewer_1, hardwareViewer_1, pilotViewer_1, checklistViewer_1, documentViewer_1, modelViewer_1, scheduleViewer_1, accountViewer_1, profileViewer_1, video_1, translations_1;
    var ConfigRoutes, ConfigTranslate, ConfigLoggly, Loggly, Run, dsApp;
    return {
        setters:[
            function (flightPlanViewer_1_1) {
                flightPlanViewer_1 = flightPlanViewer_1_1;
            },
            function (login_1_1) {
                login_1 = login_1_1;
            },
            function (flightControlViewer_1_1) {
                flightControlViewer_1 = flightControlViewer_1_1;
            },
            function (test_1_1) {
                test_1 = test_1_1;
            },
            function (manageViewer_1_1) {
                manageViewer_1 = manageViewer_1_1;
            },
            function (sessionViewer_1_1) {
                sessionViewer_1 = sessionViewer_1_1;
            },
            function (flightPlansViewer_1_1) {
                flightPlansViewer_1 = flightPlansViewer_1_1;
            },
            function (hardwareViewer_1_1) {
                hardwareViewer_1 = hardwareViewer_1_1;
            },
            function (pilotViewer_1_1) {
                pilotViewer_1 = pilotViewer_1_1;
            },
            function (checklistViewer_1_1) {
                checklistViewer_1 = checklistViewer_1_1;
            },
            function (documentViewer_1_1) {
                documentViewer_1 = documentViewer_1_1;
            },
            function (modelViewer_1_1) {
                modelViewer_1 = modelViewer_1_1;
            },
            function (scheduleViewer_1_1) {
                scheduleViewer_1 = scheduleViewer_1_1;
            },
            function (accountViewer_1_1) {
                accountViewer_1 = accountViewer_1_1;
            },
            function (profileViewer_1_1) {
                profileViewer_1 = profileViewer_1_1;
            },
            function (video_1_1) {
                video_1 = video_1_1;
            },
            function (translations_1_1) {
                translations_1 = translations_1_1;
            }],
        execute: function() {
            //import '../app/styles/application.css!';
            ConfigRoutes = (function () {
                function ConfigRoutes($stateProvider, $urlRouterProvider) {
                    // https://github.com/angular-ui/ui-router/wiki/URL-Routing
                    // $urlRouterProvider.otherwise('/');
                    $stateProvider
                        .state('root', {
                        url: '',
                        template: '<ds-flight-control-viewer></ds-flight-control-viewer>'
                    })
                        .state('otherroot', {
                        url: '/'
                    })
                        .state('login', {
                        url: '/access_token=:access_token&id_token=:id_token&token_type=:token_type&state=:state'
                    })
                        .state('manage', {
                        url: '/manage',
                        template: '<ds-manage></ds-manage>'
                    })
                        .state('manage.sessions', {
                        url: '/sessions',
                        template: '<ds-session-viewer></ds-session-viewer>'
                    })
                        .state('manage.flightplans', {
                        url: '/flightplans?id',
                        template: '<ds-flight-plans-viewer></ds-flight-plans-viewer>'
                    })
                        .state('manage.hardware', {
                        url: '/hardware?id',
                        template: '<ds-hardware-viewer></ds-hardware-viewer>'
                    })
                        .state('manage.pilots', {
                        url: '/pilots?id',
                        template: '<ds-pilot-viewer></ds-pilot-viewer>'
                    })
                        .state('manage.checklists', {
                        url: '/checklists?id',
                        template: '<ds-checklist-viewer></ds-checklist-viewer>'
                    })
                        .state('manage.documents', {
                        url: '/documents?id',
                        template: '<ds-document-viewer></ds-document-viewer>'
                    })
                        .state('manage.models', {
                        url: '/models?id',
                        template: '<ds-model-viewer></ds-model-viewer>'
                    })
                        .state('manage.schedules', {
                        url: '/schedules?id',
                        template: '<ds-schedule-viewer></ds-schedule-viewer>'
                    })
                        .state('manage.account', {
                        url: '/account',
                        template: '<ds-account-viewer></ds-account-viewer>'
                    })
                        .state('manage.profile', {
                        url: '/profile',
                        template: '<ds-profile-viewer></ds-profile-viewer>'
                    })
                        .state('test', {
                        url: '/test',
                        template: '<ds-test></ds-test>'
                    })
                        .state('bar', {
                        url: '/bar',
                        template: '<ds-bar></ds-bar>'
                    })
                        .state('flightplan', {
                        url: '/plan/:id',
                        template: '<ds-flight-plan-viewer></ds-flight-plan-viewer>',
                        data: { requireLogin: true }
                    })
                        .state('control', {
                        url: '/fly?id',
                        template: '<ds-flight-control-viewer></ds-flight-control-viewer>',
                        data: { requireLogin: true }
                    })
                        .state('dashboard', {
                        url: '/dashboard',
                        templateUrl: '<ds-dashboard></ds-dashboard>',
                        data: { requireLogin: true }
                    })
                        .state('video', {
                        url: '/video?ip&name&buffer&port',
                        template: '<ds-video></ds-video>'
                    });
                }
                ConfigRoutes.$inject = [
                    '$stateProvider',
                    '$urlRouterProvider'
                ];
                return ConfigRoutes;
            }());
            ConfigTranslate = (function () {
                function ConfigTranslate($translateProvider) {
                    $translateProvider
                        .translations('en', translations_1.Translations.en)
                        .translations('de', translations_1.Translations.de)
                        .preferredLanguage('en');
                    $translateProvider.useSanitizeValueStrategy('sanitize');
                }
                ConfigTranslate.$inject = [
                    '$translateProvider'
                ];
                return ConfigTranslate;
            }());
            ConfigLoggly = (function () {
                function ConfigLoggly(LogglyLoggerProvider) {
                    var sessionId = ConfigLoggly.guid();
                    LogglyLoggerProvider
                        .inputToken('7fbbb20a-d36b-465f-97ff-093e142505ce')
                        .level('DEBUG')
                        .sendConsoleErrors(true)
                        .includeUrl(true)
                        .includeUserAgent(true)
                        .includeTimestamp(true)
                        .inputTag('DSAngularApp');
                    LogglyLoggerProvider.fields({ appVersion: '1.0', sessionId: sessionId });
                }
                // Generate session id guid
                ConfigLoggly.guid = function () {
                    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
                        this.s4() + '-' + this.s4() + this.s4() + this.s4();
                };
                ConfigLoggly.s4 = function () {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                };
                ConfigLoggly.$inject = [
                    'LogglyLoggerProvider'
                ];
                return ConfigLoggly;
            }());
            Loggly = (function () {
                function Loggly($log) {
                    $log.log('DS App Started');
                }
                Loggly.$inject = [
                    '$log'
                ];
                return Loggly;
            }());
            Run = (function () {
                function Run($stateService, $rootScope, db) {
                    FastClick.attach(document.body);
                    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, error) {
                        // if (!db.uid) {
                        //     event.preventDefault();
                        //     db.login()
                        //         .then(() => {
                        //           if (toState && !['login', 'otherroot', 'root'].includes(toState.name)) {
                        //             $stateService.go(toState.name);
                        //           } else {
                        //             $stateService.go('manage');
                        //           }
                        //         });
                        //     }
                    });
                    $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
                        console.log('404 error');
                    });
                }
                Run.$inject = [
                    '$state',
                    '$rootScope',
                    'db'
                ];
                return Run;
            }());
            dsApp = angular.module('DroneSense.Web', [
                'ui.router',
                'ngMaterial',
                'pascalprecht.translate',
                'ngSanitize',
                login_1.default.name,
                flightPlanViewer_1.default.name,
                flightControlViewer_1.default.name,
                test_1.default.name,
                manageViewer_1.default.name,
                sessionViewer_1.default.name,
                flightPlansViewer_1.default.name,
                hardwareViewer_1.default.name,
                pilotViewer_1.default.name,
                checklistViewer_1.default.name,
                documentViewer_1.default.name,
                modelViewer_1.default.name,
                scheduleViewer_1.default.name,
                accountViewer_1.default.name,
                profileViewer_1.default.name,
                video_1.default.name,
                'logglyLogger'
            ])
                .config(ConfigRoutes)
                .config(ConfigTranslate)
                .config(ConfigLoggly)
                .run(Loggly)
                .run(Run)
                .constant('FirebaseURL', 'https://dronesense.firebaseio.com/')
                .factory('db', ['FirebaseURL', function (FirebaseURL) {
                    return DSDB({
                        firebaseApiKey: 'AIzaSyCLO2o8A7tyGe8jDdQsYj1w4_rUdIw4VzI',
                        firebaseId: 'dronesense',
                        serviceUrl: 'http://104.197.78.171',
                        auth0Domain: 'dronesense',
                        auth0ClientId: 'Gscl3kLeFLtxLsj6y1GaaGu6Qs1k2fuz'
                    });
                }]);
            exports_1("default",dsApp);
        }
    }
});

//# sourceMappingURL=app.js.map
