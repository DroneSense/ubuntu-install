import { Drone, Camera } from '@dronesense/model';
import { FrameType } from '@dronesense/model/lib/common/Enums';
import { EnumEx } from '@dronesense/model/lib/common/Enums';
import { BatteryType } from '@dronesense/model/lib/common/Enums';

export interface IDroneCameraViewer extends ng.IScope {

}

class DroneCameraViewer {

    drone: Drone;

    camera: Camera;

    // flag to indicate that the drone is read only mode
    droneReadOnly: boolean = true;

    // flag to indicate that the camera is read only mode
    cameraReadOnly: boolean = true;

    // flag to indicate that the drone is in edit mode
    droneEditMode: boolean = false;

    // flag to indicate that the camera is in edit mode
    cameraEditMode: boolean = false;

    // flag to indicate that the form is in add drone mode
    addUserDroneMode: boolean = false;

    // flag to indicate that the form is in add camera mode
    addUserCameraMode: boolean = false;

    // Flag to indicate if selected drone is a catalog drone
    isCatalogDrone: boolean;

    // Flag to indicate if selected camera is from catalog
    isCatalogCamera: boolean;

    // List of loaded user drones
    UserDrones: Array<Drone> = [];

    // List of loaded catalog drones
    CatalogDrones: Array<Drone> = [];

    // List of loaded catalog cameras
    CatalogCameras: Array<Object> = [];

    // List of loaded user cameras
    UserCameras: Array<Camera> = [];

    onSaveCamera: any;

    onSaveDrone: any;

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$q',
        'db'
    ];
    constructor(public bindings: ng.IScope,
                public $q: ng.IQService,
                public db: any) {

    }

    $onInit(): void {

        this.bindings.$watch(() => { return this.camera; }, (newValue: any, oldValue: any): void => {

            this.isCatalogCamera = this.camera.Type.toLowerCase() === 'catalog';

            console.log(this.isCatalogCamera);

        });

        this.bindings.$watch(() => { return this.drone; }, (newValue: any, oldValue: any): void => {

            this.isCatalogDrone = this.drone.Type.toLowerCase() === 'catalog';

        });

        this.LoadUserAndCatalogDronesAndCameras();
    }

    LoadUserAndCatalogDronesAndCameras(): void {
        var catalogDrones: any = this.db.drones.getCatalogDrones();
        var userDrones: any = this.db.drones.getDronesForUser();

        var catalogCameras: any = this.db.cameras.getCatalogCameras();
        var userCameras: any = this.db.cameras.getCamerasForUser();

        catalogDrones.on(catalogDrones.EVENTS.LIST_CHANGED, (drones: any): void => {
            this.CatalogDrones = [];
            drones.forEach((droneHandle: any): void => {
                this.CatalogDrones.push(new Drone(droneHandle.id, droneHandle.handle));
            });
        });

        catalogCameras.on(catalogCameras.EVENTS.LIST_CHANGED, (cameras: any): void => {
            this.CatalogCameras = [];
            cameras.forEach((cameraHandle: any): void => {
                this.CatalogCameras.push(new Camera(cameraHandle.id, cameraHandle.handle, cameraHandle.type));
            });
        });

        userDrones.on(userDrones.EVENTS.LIST_CHANGED, (drones: any): void => {
            this.UserDrones.splice(0, this.UserDrones.length);
            drones.forEach((droneHandle: any): void => {
                this.UserDrones.push(new Drone(droneHandle.id, droneHandle.handle));
            });
            this.bindings.$applyAsync();
        });

        userCameras.on(userCameras.EVENTS.LIST_CHANGED, (cameras: any): void => {
            this.UserCameras.splice(0, this.UserCameras.length);
            cameras.forEach((cameraHandle: any): void => {
                this.UserCameras.push(new Camera(cameraHandle.id, cameraHandle.handle, cameraHandle.type));
            });

            this.bindings.$applyAsync();
        });


    }

    saveCamera(): void {
        this.onSaveCamera({
            camera: this.camera
        });
    }

    saveDrone(): void {
        this.onSaveDrone({
            drone: this.drone
        });
    }

    GetFrameTypes(): Array<string> {
        return EnumEx.getNames(FrameType);
    }

    GetFrameValue(frameType: any): any {
        return FrameType[frameType];
    }

    GetBatteryTypes(): Array<string> {
        return EnumEx.getNames(BatteryType);
    }

    GetBatteryValue(batteryType: any): any {
        return BatteryType[batteryType];
    }

    GetFlightControllerTypes(): Array<string> {
        return ['DJI', 'APM'];
    }

}

export default angular.module('DroneSense.Web.DroneCameraViewer', [

]).component('dsDroneCameraViewer', {
    bindings: {
        camera: '<',
        drone: '<',
        onSaveCamera: '&',
        onSaveDrone: '&'
    },
    controller: DroneCameraViewer,
    templateUrl: './app/components/droneCameraViewer/droneCameraViewer.html'
});
