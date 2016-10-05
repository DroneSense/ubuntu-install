import { Drone, Camera } from '@dronesense/model';

import LazyShow from '../../common/ngLazyShow';
import KeyEnter from '../dsEnterKey/dsEnterKey';

import DroneCameraViewer from '../droneCameraViewer/droneCameraViewer';

export interface IToolbar extends ng.IScope {

}

class Toolbar {

    // name of view to render
    view: string;

    // callback on clear flightplan
    onClearFlightPlan: any;

    onShowSettings: any;

    onLocationSearch: any;

    drone: Drone;

    camera: Camera;

    // Google servics
    gmapsService: any;
    geocoder: any;

    // Location Search
    searchText: string;
    selectedItem: any;
    searchQuery: string;

    // Flag to indicate if drone camera is showing
    showDroneCamera: boolean = false;

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$q',
    ];
    constructor(bindings: IToolbar,
                public $q: ng.IQService) {

        this.gmapsService = new google.maps.places.AutocompleteService();
        this.geocoder = new google.maps.Geocoder();


    }

    search(text: string): ng.IPromise<any> {
        var deferred: ng.IDeferred<any> = this.$q.defer();

        this.getResults(text).then(
            function (predictions: any): any {

                var results: any = [];
                if (predictions !== null) {

                    for (var i: number = 0, prediction: any; prediction = predictions[i]; i++) {
                        results.push(prediction.description);
                    }
                }
                deferred.resolve(results);
            }
        );

        return deferred.promise;
    }

    getResults(text: string): ng.IPromise<any> {
        var deferred: ng.IDeferred<any> = this.$q.defer();

        this.gmapsService.getQueryPredictions({input: text}, function (data: any): any {
            deferred.resolve(data);
        });

        return deferred.promise;
    }

    geoCode(text: string): void {

        var that: any  = this;

        this.geocoder.geocode( { 'address': text }, function(results: Array<google.maps.GeocoderResult>, status: google.maps.GeocoderStatus): any {
            if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
                var location: google.maps.LatLng = results[0].geometry.location;

                that.onLocationSearch({
                    lat: location.lat(),
                    lng: location.lng()
                });

            }
        });
    }

    goTo(location: string): void {
        // Geocode location text
        this.geoCode(location);
    }

}

export default angular.module('DroneSense.Web.Toolbar', [
    DroneCameraViewer.name,
    LazyShow.name,
    KeyEnter.name
]).component('dsToolbar', {
    bindings: {
        onClearFlightPlan: '&',
        onShowSettings: '&',
        onLocationSearch: '&',
        view: '@',
        camera: '<',
        drone: '<',
        onSaveCamera: '&',
        onSaveDrone: '&',
        showDroneCamera: '<',
        onShowDroneCamera: '&'
    },
    controller: Toolbar,
    templateUrl: './app/components/toolbar/toolbar.html'
});
