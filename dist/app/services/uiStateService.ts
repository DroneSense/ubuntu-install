import { GeoPoint } from '@dronesense/model';

export interface IUIStateService {
    InitializeUIState(flightPlanId: string): void;

    FlightInfoVisible: boolean;
    FlightElevationVisible: boolean;
    FlightWeatherVisible: boolean;
    FlightSurveyVisible: boolean;
    FlightSurveyImagesVisible: boolean;

    ActiveSurveyDataId: string;

    MapCenterLatLng: GeoPoint;
    MapZoomLevel: number;
    SelectedMap: string;
    SelectedOverlay: string;

    UserSettingsVisible: boolean;
    DroneCameraVisible: boolean;
    CommandsVisible: boolean;
}

class UIStateService {

    _flightInfoVisible: boolean = false;

    get FlightInfoVisible(): boolean {
        return this._flightInfoVisible;
    }

    set FlightInfoVisible(value: boolean) {
        var data: any = {
            flightInfoVisible: value,
            flightElevationVisible: false,
            flightWeatherVisible: false,
            flightSurveyVisible: false,
            flightSurveyImagesVisible: false
        };

        this.UIStateHandle.update(data);
    }

    _flightElevationVisible: boolean = false;

    get FlightElevationVisible(): boolean {
        return this._flightElevationVisible;
    }

    set FlightElevationVisible(value: boolean) {
        var data: any = {
            flightInfoVisible: false,
            flightElevationVisible: value,
            flightWeatherVisible: false,
            flightSurveyVisible: false,
            flightSurveyImagesVisible: false
        };

        this.UIStateHandle.update(data);
    }

    _flightWeatherVisible: boolean = false;

    get FlightWeatherVisible(): boolean {
        return this._flightWeatherVisible;
    }

    set FlightWeatherVisible(value: boolean) {
        var data: any = {
            flightInfoVisible: false,
            flightElevationVisible: false,
            flightWeatherVisible: value,
            flightSurveyVisible: false,
            flightSurveyImagesVisible: false
        };

        this.UIStateHandle.update(data);
    }

    _flightSurveyVisible: boolean = false;

    get FlightSurveyVisible(): boolean {
        return this._flightSurveyVisible;
    }

    set FlightSurveyVisible(value: boolean) {
        var data: any = {
            flightInfoVisible: false,
            flightElevationVisible: false,
            flightWeatherVisible: false,
            flightSurveyVisible: value,
            flightSurveyImagesVisible: false
        };

        this.UIStateHandle.update(data);
    }

    _flightSurveyImagesVisible: boolean = false;

    get FlightSurveyImagesVisible(): boolean {
        return this._flightSurveyImagesVisible;
    }

    set FlightSurveyImagesVisible(value: boolean) {
        var data: any = {
            flightInfoVisible: false,
            flightElevationVisible: false,
            flightWeatherVisible: false,
            flightSurveyVisible: false,
            flightSurveyImagesVisible: value
        };

        this.UIStateHandle.update(data);
    }

    _activeSurveyDataId: string;

    set ActiveSurveyDataId(id: string) {
        var data: any = {
            activeSurveyDataId: id,
        };

        this.UIStateHandle.update(data);
    }

    droneCameraVisible: boolean = false;

    get DroneCameraVisible(): boolean {
        return this.droneCameraVisible;
    }

    set DroneCameraVisible(value: boolean) {
        var data: any = {
            droneCameraVisible: value
        };

        this.UIStateHandle.update(data);
    }

    userSettingsVisible: boolean = false;

    get UserSettingsVisible(): boolean {
        return this.userSettingsVisible;
    }

    set UserSettingsVisible(value: boolean) {
        var data: any = {
            userSettingsVisible: value
        };

        this.UIStateHandle.update(data);
    }


    commandsVisible: boolean = false;

    get CommandsVisible(): boolean {
        return this.commandsVisible;
    }

    set CommandsVisible(value: boolean) {
        var data: any = {
            commandsVisible: value
        };

        this.UIStateHandle.update(data);
    }

    mapCenterLatLng: GeoPoint;

    get MapCenterLatLng(): GeoPoint {
        return this.mapCenterLatLng;
    }

    set MapCenterLatLng(value: GeoPoint) {
        var data: any = {
            mapCenterLatLng: value
        };

        this.UIStateHandle.update(data);
    }

    mapZoomLevel: number;

    get MapZoomLevel(): number {
        return this.mapZoomLevel;
    }

    set MapZoomLevel(value: number) {
        var data: any = {
            mapZoomLevel: value
        };

        this.UIStateHandle.update(data);
    }

    selectedMap: string;

    get SelectedMap(): string {
        return this.selectedMap;
    }

    set SelectedMap(name: string) {
        var data: any = {
            selectedMap: name
        };

        this.UIStateHandle.update(data);
    }

    selectedOverlay: string;

    get SelectedOverlay(): string {
        return this.selectedOverlay;
    }

    set SelectedOverlay(name: string) {
        var data: any = {
            selectedOverlay: name
        };

        this.UIStateHandle.update(data);
    }

    // Firebase DB Service
    db: any;

    $rootScope: ng.IRootScopeService;

    // UI State Handle
    UIStateHandle: any;

    private _data: any = {};

    static $inject: Array<string> = [
        'db',
        '$rootScope'
    ];
    constructor(db: any, $rootScope: ng.IRootScopeService) {

        this.db = db;
        this.$rootScope = $rootScope;

    }

    InitializeUIState(flightPlanId: string): void {

        if (this.UIStateHandle) {
            // First turn off previous handle updates
            this.UIStateHandle.off(this.UIStateHandle.EVENTS.DATA_CHANGED);
        }

        this._data = {};

        // Load new handle with new flight plan ID
        this.UIStateHandle = this.db.flightplans.ui.getStateForFlightPlanWithId(flightPlanId);

        var that: any = this;
        this.UIStateHandle.on(this.UIStateHandle.EVENTS.DATA_CHANGED, function(data: any): void {
            that.LoadValues(data);
        });
    }

    LoadValues(data: any): void {
        if (data) {

            if (this._data.flightInfoVisible !== data.flightInfoVisible) {
                this._flightInfoVisible = data.flightInfoVisible;
            }

            if (this._data.flightElevationVisible !== data.flightElevationVisible) {
                this._flightElevationVisible = data.flightElevationVisible;
            }

            if (this._data.flightWeatherVisible !== data.flightWeatherVisible) {
                this._flightWeatherVisible = data.flightWeatherVisible;
                if (this._flightWeatherVisible) {
                }
            }

            if (this._data.flightSurveyVisible !== data.flightSurveyVisible) {
                this._flightSurveyVisible = data.flightSurveyVisible;
            }

            if (this._data.flightSurveyImagesVisible !== data.flightSurveyImagesVisible) {
                this._flightSurveyImagesVisible = data.flightSurveyImagesVisible;
            }

            if (this._data.activeSurveyDataId !== data.activeSurveyDataId) {
                this._activeSurveyDataId = data.activeSurveyDataId;
            }

            if (this._data.mapCenterLatLng !== data.mapCenterLatLng) {
                this.mapCenterLatLng = data.mapCenterLatLng;
            }

            if (this._data.mapZoomLevel !== data.mapZoomLevel) {
                this.mapZoomLevel = data.mapZoomLevel;
            }

            if (this._data.selectedMap !== data.selectedMap) {
                this.selectedMap = data.selectedMap;
            }

            // TODO figure out how to make this work as a list
            //if (this._data.selectedOverlay !== data.selectedOverlay) {
            //    this.selectedOverlay = data.selectedOverlay;
            //
            //    this.$rootScope.$emit('uiStateService:mapOverlayChange', this.selectedOverlay);
            //}

            if (this._data.userSettingsVisible !== data.userSettingsVisible) {
                this.userSettingsVisible = data.userSettingsVisible;
            }

            if (this._data.droneCameraVisible !== data.droneCameraVisible) {
                this.droneCameraVisible = data.droneCameraVisible;
            }

            if (this._data.commandsVisible !== data.commandsVisible) {
                this.commandsVisible = data.commandsVisible;
            }

            this._data = data;

            this.$rootScope.$applyAsync();

        }
    }

}


export default angular.module('DroneSense.Web.UIStateService', [

]).service('uiStateService', UIStateService);

// Code to persist the camera view angles

// var StoredView = function()
// {
//         this.position = undefined;
//         this.direction = undefined;
//         this.up = undefined;
//         this.right = undefined;
//         this.transform = undefined;
//         this.frustum = undefined;
// };

// StoredView.prototype.save = function(camera)
// {
//         if(typeof camera === 'undefined')
//         {
//             throw new DeveloperError('camera is required');
//         }

//         this.position = camera.position.clone(this.position);
//         this.direction = camera.direction.clone(this.direction);
//         this.up = camera.up.clone(this.up);
//         this.right = camera.right.clone(this.right);
//         this.transform = camera.transform.clone(this.transform);
//         this.frustum = camera.frustum.clone(this.frustum);
// };

// StoredView.prototype.load = function(camera)
// {
//         if(typeof this.position === 'undefined')
//         {
//             throw new DeveloperError('no view has been stored');
//         }

//         this.position.clone(camera.position);
//         this.direction.clone(camera.direction);
//         this.up.clone(camera.up);
//         this.right.clone(camera.right);
//         this.transform.clone(camera.transform);
//         this.frustum.clone(camera.frustum);
// };
