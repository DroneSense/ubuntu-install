import { GeoPoint } from '@dronesense/model';

export interface IGeocodeService {
    getGeocodeForLatLng(lat: number, lng: number): ng.IPromise<GeocodeResult>;
}

class GeocodeService {

    $q: ng.IQService;
    $http: ng.IHttpService;

    static $inject: Array<string> = ['$q', '$http'];

    constructor($q: ng.IQService, $http: ng.IHttpService) {
        this.$q = $q;
        this.$http = $http;
    }

    getGeocodeForLatLng(lat: number, lng: number): ng.IPromise<GeocodeResult> {
        var deferred: ng.IDeferred<GeocodeResult> = this.$q.defer<GeocodeResult>();

        var geocodeService: any = new google.maps.Geocoder();

        geocodeService.geocode( { 'location': new google.maps.LatLng(lat, lng) },
            (results: Array<google.maps.GeocoderResult>, status: google.maps.GeocoderStatus): any => {
            if (status === google.maps.GeocoderStatus.OK && results.length > 0) {

                var geocodeResult: GeocodeResult = new GeocodeResult(results);

                deferred.resolve(geocodeResult);

            } else {
                deferred.reject('There was an error geocoding the location.');
            }
        });

        return deferred.promise;
    }

    getGeocodeForAddress(address: string): ng.IPromise<GeoPoint> {
        var deferred: ng.IDeferred<GeoPoint> = this.$q.defer<GeoPoint>();

        // TODO Implement

        return deferred.promise;
    }
}

export default angular.module('DroneSense.Web.GeocodeService', [

]).service('geocodeService', GeocodeService);

export class GeocodeResult {

    current: any;

    city: string;
    state: string;

    constructor(data: Array<google.maps.GeocoderResult>) {
        this.current = data;

        this.parseCityState(data[0]);
    }

    parseCityState(result: google.maps.GeocoderResult): void {
        var addressComponents: Array<any> = result.address_components;

        for (var i: number = 0; i < addressComponents.length; ++i ) {
            if (addressComponents[i].types[0] === 'administrative_area_level_1') {
                this.state = addressComponents[i].long_name;
            }
            if (addressComponents[i].types[0] === 'locality') {
                this.city = addressComponents[i].long_name;
            }
        }
    }
}
