
export interface IWeatherService {
    getWeather(lat: number, lng: number): ng.IPromise<Weather>;
}

class WeatherService {

    $q: ng.IQService;
    $http: ng.IHttpService;

    weatherAPIBaseURL: string = 'http://uavconditions.cloudapp.net/';

    static $inject: Array<string> = ['$q', '$http'];

    constructor($q: ng.IQService, $http: ng.IHttpService) {
        this.$q = $q;
        this.$http = $http;
    }

    getWeather(lat: number, lng: number): ng.IPromise<Weather> {
        var deferred: ng.IDeferred<Weather> = this.$q.defer<Weather>();

        this.$http.get(this.weatherAPIBaseURL + lat + '/' + lng)
            .success((data: any): void => {
                var weather: Weather = new Weather(data);

                console.log(data);

                deferred.resolve(weather);

            }).error(function (): void {
                deferred.reject('There was an error getting the weather.');
            });

        return deferred.promise;
    }
}

export default angular.module('DroneSense.Web.WeatherService', [
    
]).service('weatherService', WeatherService);

export class Weather {

    current: any;
    daily: any;
    hourly: any;
    kp: any;


    constructor(data: any) {
        this.current = data.weather.current;
        this.daily = data.weather.daily;
        this.hourly = data.weather.hourly;
        this.kp = data.kp;
    }
}
