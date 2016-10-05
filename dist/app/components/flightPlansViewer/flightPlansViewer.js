System.register(['../flightPlanCard/flightPlanCard', '../flightPlanCardDetail/flightPlanCardDetail', '../viewerToolbar/viewerToolbar', '../../common/ngLazyShow', 'lodash', '../../services/dataService'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var flightPlanCard_1, flightPlanCardDetail_1, viewerToolbar_1, ngLazyShow_1, lodash_1, dataService_1;
    var FlightPlansViewer;
    return {
        setters:[
            function (flightPlanCard_1_1) {
                flightPlanCard_1 = flightPlanCard_1_1;
            },
            function (flightPlanCardDetail_1_1) {
                flightPlanCardDetail_1 = flightPlanCardDetail_1_1;
            },
            function (viewerToolbar_1_1) {
                viewerToolbar_1 = viewerToolbar_1_1;
            },
            function (ngLazyShow_1_1) {
                ngLazyShow_1 = ngLazyShow_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (dataService_1_1) {
                dataService_1 = dataService_1_1;
            }],
        execute: function() {
            FlightPlansViewer = (function () {
                function FlightPlansViewer(bindings, stateService, mdDialog, dataService, db) {
                    var _this = this;
                    this.bindings = bindings;
                    this.stateService = stateService;
                    this.mdDialog = mdDialog;
                    this.dataService = dataService;
                    this.db = db;
                    this.flightPlans = [];
                    this.masterTagList = [];
                    this.filter = {
                        tags: [],
                        option: ''
                    };
                    this.sort = {
                        options: [],
                        orderType: '',
                        orderDirection: false
                    };
                    if (stateService.params['id']) {
                        this.showFlightPlanCard(stateService.params['id']);
                    }
                    // Make grid the default view
                    this.gridVisible = true;
                    // Define sort options to give the viewer toolbar
                    this.sort.options.push('Name: A-Z');
                    this.sort.options.push('Name: Z-A');
                    this.sort.options.push('Location: A-Z');
                    this.sort.options.push('Location: Z-A');
                    this.sort.options.push('Created: Newest');
                    this.sort.options.push('Created: Oldest');
                    this.sort.options.push('Scheduled: Newest');
                    this.sort.options.push('Scheduled: Oldest');
                    // Set default view sort order
                    this.sort.orderType = 'Created';
                    this.sort.orderDirection = true;
                    // Load the flight plans from data service
                    this.dataService.getUserFlightPlans().then(function (flightPlans) {
                        _this.flightPlans = flightPlans;
                        _this.bindings.$watchCollection('this.flightPlans', function (newValue, oldValue) {
                            _this.bindings.$applyAsync();
                        });
                    });
                    this.dataService.getAccountFlightPlanTags().then(function (tags) {
                        _this.masterTagList = tags;
                    });
                }
                FlightPlansViewer.prototype.showFlightPlanCard = function (id) {
                    this.mdDialog.show({
                        template: '<ds-flight-plan-card-detail></ds-flight-plan-card-detail>',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        escapeToClose: true
                    });
                };
                FlightPlansViewer.prototype.showListView = function () {
                    this.gridVisible = false;
                };
                FlightPlansViewer.prototype.showGridView = function () {
                    this.gridVisible = true;
                };
                FlightPlansViewer.prototype.addFlightPlan = function () {
                    this.stateService.go('flightplan');
                };
                // Apply selected sort from viewer toolbar component
                FlightPlansViewer.prototype.sortSelected = function (sortItem) {
                    switch (sortItem) {
                        case 'Name: A-Z':
                            this.sort.orderType = 'Name';
                            this.sort.orderDirection = false;
                            break;
                        case 'Name: Z-A':
                            this.sort.orderType = 'Name';
                            this.sort.orderDirection = true;
                            break;
                        case 'Location: A-Z':
                            this.sort.orderType = 'Location';
                            this.sort.orderDirection = false;
                            break;
                        case 'Location: Z-A':
                            this.sort.orderType = 'Location';
                            this.sort.orderDirection = true;
                            break;
                        case 'Created: Newest':
                            this.sort.orderType = 'Created';
                            this.sort.orderDirection = true;
                            break;
                        case 'Created: Oldest':
                            this.sort.orderType = 'Created';
                            this.sort.orderDirection = false;
                            break;
                        case 'Scheduled: Newest':
                            this.sort.orderType = 'Scheduled';
                            this.sort.orderDirection = true;
                            break;
                        case 'Scheduled: Oldest':
                            this.sort.orderType = 'Scheduled';
                            this.sort.orderDirection = false;
                            break;
                        default:
                            this.sort.orderType = '';
                            break;
                    }
                };
                FlightPlansViewer.prototype.searchFlightPlans = function (search) {
                    this.searchText = search;
                };
                FlightPlansViewer.prototype.applyTagFilter = function (tags, option) {
                    this.filter.tags = tags;
                    this.filter.option = option;
                };
                // TODO - Review this with tag array changes
                FlightPlansViewer.prototype.tagMatches = function (fp) {
                    if (this.filter.tags.length === 0) {
                        return true;
                    }
                    else {
                        // This filter only looks for one tag match to include in results
                        if (this.filter.option === 'any') {
                            if (lodash_1.default.intersection(fp.Tags, this.filter.tags).length > 0) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            if (lodash_1.default.without.apply(this, [this.filter.tags].concat(fp.Tags)).length === 0) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    }
                };
                // Constructor
                FlightPlansViewer.$inject = [
                    '$scope',
                    '$state',
                    '$mdDialog',
                    'dataService',
                    'db'
                ];
                return FlightPlansViewer;
            }());
            exports_1("default",angular.module('DroneSense.Web.FlightPlansViewer', [
                flightPlanCard_1.default.name,
                flightPlanCardDetail_1.default.name,
                viewerToolbar_1.default.name,
                ngLazyShow_1.default.name,
                dataService_1.default.name
            ]).component('dsFlightPlansViewer', {
                bindings: {},
                controller: FlightPlansViewer,
                templateUrl: './app/components/flightPlansViewer/FlightPlansViewer.html'
            }));
        }
    }
});

//# sourceMappingURL=flightPlansViewer.js.map
