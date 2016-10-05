import { Weather } from '../../services/weatherService';
import { IWeatherService } from '../../services/weatherService';
import WeatherService from '../../services/weatherService';

import { GeocodeResult } from '../../services/geocodeService';
import { IGeocodeService } from '../../services/geocodeService';
import GeocodeService from '../../services/geocodeService';

export interface IWeatherViewer extends ng.IScope {

}

class WeatherViewer {

    weatherLoading: boolean = false;

    weatherData: Weather;

    lastWeatherLoad: Date;

    showIcon: boolean = false;

    geocodeData: GeocodeResult;

    map: Cesium.Viewer;

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        'weatherService',
        'geocodeService'
    ];
    constructor(public bindings: IWeatherViewer,
                public weatherService: IWeatherService,
                public geocodeService: IGeocodeService) {

    }

    $onInit(): void {
        this.getWeather();
    }

    getWeather(): void {

        // TODO - This can only be used if we can detect that the map has moved
        //// If weather has been check within the last 10 minutes just return
        //if (this.lastWeatherLoad !== undefined && Math.floor((new Date().getTime() - this.lastWeatherLoad.getTime()) / 60000) < 10 ) {
        //    return;
        //}

        // Start Spinner
        this.weatherLoading = true;

        var cartoPosition: Cesium.Cartographic = this.map.camera.positionCartographic;

        this.weatherService.getWeather(Cesium.Math.toDegrees(cartoPosition.latitude), Cesium.Math.toDegrees(cartoPosition.longitude)).then((weather: Weather): void => {
            //console.log(weather);
            // Load Data
            this.weatherData = weather;

            this.lastWeatherLoad = new Date();

            // Stop Spinner
            this.showIcon = true;

            this.weatherLoading = false;
        });

        this.geocodeService.getGeocodeForLatLng(Cesium.Math.toDegrees(cartoPosition.latitude), Cesium.Math.toDegrees(cartoPosition.longitude)).then((geocodeResult: GeocodeResult): void => {
            this.geocodeData = geocodeResult;
        });
    }

}

export default angular.module('DroneSense.Web.WeatherViewer', [
    WeatherService.name,
    GeocodeService.name
]).component('dsWeatherViewer', {
    bindings: {
        map: '<'
    },
    controller: WeatherViewer,
    templateUrl: './app/components/weatherViewer/weatherViewer.html'
});

