import flightPlanViewer from '../app/components/flightPlanViewer/flightPlanViewer';
import login from '../app/components/login/login';
import flightControl from '../app/components/flightControlViewer/flightControlViewer';
import test from '../app/components/test/test';

import manage from '../app/components/manageViewer/manageViewer';
import sessions from '../app/components/sessionViewer/sessionViewer';
import flightPlans from '../app/components/flightPlansViewer/flightPlansViewer';
import hardware from '../app/components/hardwareViewer/hardwareViewer';
import pilot from '../app/components/pilotViewer/pilotViewer';
import checklist from '../app/components/checklistViewer/checklistViewer';
import documents from '../app/components/documentViewer/documentViewer';
import models from '../app/components/modelViewer/modelViewer';
import schedules from '../app/components/scheduleViewer/scheduleViewer';
import account from '../app/components/accountViewer/accountViewer';
import profile from '../app/components/profileViewer/profileViewer';
import video from '../app/components/video/video';

import { Translations } from './translations';

//import '../app/styles/application.css!';

class ConfigRoutes {

    static $inject: Array<string> = [
        '$stateProvider',
        '$urlRouterProvider'
    ];
    constructor($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) {

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
            data : { requireLogin : true }
        })
        .state('control', {
            url: '/fly?id',
            template: '<ds-flight-control-viewer></ds-flight-control-viewer>',
            data : { requireLogin : true }
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: '<ds-dashboard></ds-dashboard>',
            data : { requireLogin : true }
        })
        .state('video', {
            url: '/video?ip&name',
            template: '<ds-video></ds-video>'
        });
    }
}

class ConfigTranslate {

    static $inject: Array<string> = [
        '$translateProvider'
    ];

    constructor($translateProvider: any) {

        $translateProvider
            .translations('en', Translations.en)
            .translations('de', Translations.de)
            .preferredLanguage('en');

        $translateProvider.useSanitizeValueStrategy('sanitize');
    }
}

class Run {

    static $inject: Array<string> = [
        '$state',
        '$rootScope',
        'db'
    ];
    constructor($stateService: angular.ui.IStateService,
                $rootScope: ng.IRootScopeService,
                db: any) {

        FastClick.attach(document.body);

        $rootScope.$on('$stateChangeStart', (event: any, toState: any, toParams: any,
                                             fromState: any, fromParams: any, error: any): void => {

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

        $rootScope.$on('$stateNotFound', (event: any, unfoundState: any, fromState: any,
                                                fromParams: any): void => {

            console.log('404 error');

        });
    }
}

let dsApp: any = angular.module('DroneSense.Web', [
    'ui.router',
    'ngMaterial',
    'pascalprecht.translate',
    'ngSanitize',
    login.name,
    flightPlanViewer.name,
    flightControl.name,
    test.name,
    manage.name,
    sessions.name,
    flightPlans.name,
    hardware.name,
    pilot.name,
    checklist.name,
    documents.name,
    models.name,
    schedules.name,
    account.name,
    profile.name,
    video.name
])

    .config(ConfigRoutes)

    .config(ConfigTranslate)

    //.config(ConfigTheme)

    .run(Run)

    .constant('FirebaseURL', 'https://dronesense.firebaseio.com/')

    .factory('db', ['FirebaseURL', function(FirebaseURL: string): any {

        return DSDB({
            firebaseApiKey: 'AIzaSyCLO2o8A7tyGe8jDdQsYj1w4_rUdIw4VzI',
            firebaseId: 'dronesense',
            serviceUrl: 'http://104.197.78.171',
            auth0Domain: 'dronesense',
            auth0ClientId: 'Gscl3kLeFLtxLsj6y1GaaGu6Qs1k2fuz'
        });
    }]);

export default dsApp;
