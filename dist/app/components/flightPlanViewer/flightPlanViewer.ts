import { FlightPlan, User, Drone, Camera } from '@dronesense/model';

import AppBar from '../appbar/appBar';
import ToolBar from '../toolbar/toolbar';
import CommandViewer from '../commandViewer/commandViewer';
import MapTools from '../mapTools/mapTools';
import MapControls from '../mapControls/mapControls';
import FlightInfoViewer from '../flightInfoViewer/flightInfoViewer';

import uiStateService from '../../services/uiStateService';
import userService from '../../services/userService';

import { IUserService } from '../../services/userService';
import { IUIStateService } from '../../services/uiStateService';

import { IDataService } from '../../services/dataService';


// import ngDialog from 'ng-dialog';
// System.import('jspm_packages/npm/ng-dialog@0.5.9/css/ngDialog.css!');
// System.import('jspm_packages/npm/ng-dialog@0.5.9/css/ngDialog-theme-default.css!');

// // System.config({
// //     meta: {
// //     // meaning [baseURL]/vendor/angular.js when no other rules are present
// //     // path is normalized using map and paths configuration
// //     '../../../lib/Cesium.js': {
// //     format: 'global', // load this module as a global
// //     exports: 'Cesium' // the global property to take as the module value
// //     }
// // }
// // });

// System.config({
//     meta: {
//     // meaning [baseURL]/vendor/angular.js when no other rules are present
//     // path is normalized using map and paths configuration
//     '../../../lib/cesium-navigation.js': {
//     format: 'global', // load this module as a global
//     exports: '' // the global property to take as the module value
//     }
// }
// });
// System.import('../../../lib/cesium-navigation.js');
// System.import('../../../lib/cesium-navigation.css!');
// System.import('jspm_packages/npm/cesium@1.19.0/Build/CesiumUnminified/Widgets/widgets.css!');


export interface IFlightPlanViewer extends ng.IScope {
    map: Cesium.Viewer;
}

class FlightPlanViewer {

    // The flight plan model object
    flightPlan: FlightPlan;

    // Handle to current flight plan
    flightPlanHandle: any;

    flightPlanId: string;

    // Map reference passed to us from the map component
    map: Cesium.Viewer;

    // Current User
    user: User;

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        '$element',
        '$state',
        'db',
        'uiStateService',
        'ngDialog',
        '$q',
        'dataService'
    ];

    constructor(
        public bindings: IFlightPlanViewer,
        public $element: ng.IRootElementService,
        public stateService: angular.ui.IStateService,
        public db: any,
        public uiStateService: IUIStateService,
        public ngDialog: any,
        public $q: ng.IQService,
        public dataService: IDataService) {

        // Get current user
        this.loadCurrentUser();

        this.initializeMap();

        // Load flight plan
        this.loadFlightPlan();
    }

    // Get current user from user service
    loadCurrentUser(): void {
        //this.user = this.userService.CurrentUser;

        this.dataService.getUser().then((user: User) => {
            this.user = user;
        });
    }

    // Show/Hide user settings
    showUserSettings(show: boolean): void {
        console.log('show user settings' + show);
        this.uiStateService.UserSettingsVisible = show;
    }

    // Show/Hide drone and camera settings
    showDroneCamera(show: boolean): void {
        this.uiStateService.DroneCameraVisible = show;
    }

    loadFlightPlan(): void {

        // Get flight plan id from url
        this.flightPlanId = this.stateService.params['id'];

        // Check url to see if a flight plan id has been passed in for loading
        if (this.flightPlanId === '' || angular.isUndefined(this.flightPlanId)) {

            // Create a new flight plan id and load
            this.db.flightplans.createFlightPlanForUser('foo').then((flightplan: any) => {

                // TODO is there a better way to handle this?  Can we just set in url and recall self?
                this.stateService.go('flightplan', { id: flightplan.id });
            });

        } else {

            // Get flight plan handle
            this.flightPlanHandle = this.db.flightplans.getFlightPlanWithId(this.flightPlanId);

            // Create new flight plan with id and handle
            this.flightPlan = new FlightPlan(this.flightPlanHandle);

            // Initialize UI state service
            this.uiStateService.InitializeUIState(this.flightPlanId);

            // Listen for flight plan updates
            // this.flightPlan.ModelUpdated.on((eventName: string) => {

            //     console.log('flight plan updated');

            //     this.bindings.$applyAsync();
            // });
        }
    }

    initializeMap(): void {
        //'//assets.agi.com/stk-terrain/world'
        // https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html

        // By default Cesium uses the location of the Cesium.js file as the location where the rest of the files are stored. You can either set a global CESIUM_BASE_URL variable or just call Cesium.buildModuleUrl.setBaseUrl to point it at a different location.
        Cesium.BingMapsApi.defaultKey = 'AiGfGytmoPZ6lnYVDiRzKe08ZI_kzjHTjhVrcuj3pPrpC9BmxvFP_vfGT8fB9z-T';

        this.map = new Cesium.Viewer(document.getElementById('cesiumContainer'), {
            terrainProvider : new Cesium.CesiumTerrainProvider({
                url : 'https://www.cesiumcontent.com/api/terrain/world?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkMTM4ZDE2OS05NWYwLTQ0YmItOWY3YS0yNjEwOGE5Y2Y3NjYiLCJpZCI6NywiaWF0IjoxNDU1MjkyNzg5fQ.NDKlrwQZE_04ntDuL89hvatEmuycQo5llhtz3Mi6Wo0',
                requestWaterMask : false,
                requestVertexNormals : false
            }),
            // imageryProvider : new Cesium.ArcGisMapServerImageryProvider({
            //     url : "//services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
            // }),
            // terrainProvider : new Cesium.CesiumTerrainProvider({
            //     url : '//assets.agi.com/stk-terrain/world',
            //     requestWaterMask : true,
            //     requestVertexNormals : true
            // }),
            // imageryProvider: new Cesium.MapboxImageryProvider({
            //     mapId: 'digitalglobe.nmnghj3m',
            //     // sat with streets: digitalglobe.nmnghj3m
            //     // sat only: digitalglobe.nmmnloo2
            //     //Get your DigitalGlobe Maps API Access Token here: http://developer.digitalglobe.com/maps-api
            //     accessToken: 'pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNpZnB2bWUzNDZoczlzaWtxMmd2bDc3ZHQifQ.AHiF6mR5aXL0rdI4eLz2dA',
            //     credit: 'DigitalGlobe Maps API'
            // }),
            // imageryProvider: new Cesium.MapboxImageryProvider({
            //     mapId: 'chriseyhorn.3sjrlik9',
            //     // sat with streets: digitalglobe.nmnghj3m
            //     // sat only: digitalglobe.nmmnloo2
            //     //Get your DigitalGlobe Maps API Access Token here: http://developer.digitalglobe.com/maps-api
            //     accessToken: 'pk.eyJ1IjoiY2hyaXNleWhvcm4iLCJhIjoiaDFPdEM2ZyJ9.m41bT4PKxsjLH3MgC-pGCw'
            // }),
            baseLayerPicker: false,
            fullscreenButton: false,
            homeButton: false,
            sceneModePicker: true,
            selectionIndicator: false,
            timeline: false,
            animation: false,
            geocoder: false,
            navigationHelpButton: false,
            infobox: false,
            scene3DOnly: false
        });

        // this.map.scene.primitives.add(new Cesium.Cesium3DTileset({
        //     url: 'https://www.cesiumcontent.com/api/assets/3/data?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkZjgxNGRiYS0wMjc0LTQ2ZWMtYTJhNC1kMzRhYzkyNDE0YjgiLCJpZCI6NSwiYXNzZXRzIjpbM10sImlhdCI6MTQ1NzQ1ODEwOX0.-kwaVNM63oY4-rqLiZHqSedHRImPCZtkizCU50SuKwA'
        // }));

        // this.map.scene.primitives.add(new Cesium.Cesium3DTileset({
        //     url : '../newyork/'
        // }));

        // Decreases map performance but make rendering look better at distances
        this.map.scene.fog.enabled = true;

        // For debug development purposes
        this.map.scene.debugShowFramesPerSecond = false;

        // Necessary for 3D models to stay in place
        this.map.scene.globe.depthTestAgainstTerrain = true;

        // Change mapping to mouse buttons so that the right mouse button will tilt and rotate.
        this.map.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.RIGHT_DRAG, Cesium.CameraEventType.PINCH, {
            eventType : Cesium.CameraEventType.LEFT_DRAG,
            modifier : Cesium.KeyboardEventModifier.CTRL
        }, {
            eventType : Cesium.CameraEventType.RIGHT_DRAG,
            modifier : Cesium.KeyboardEventModifier.CTRL
        }];

        // Remove right mouse button from zooming on hold and move
        this.map.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];

        //navigationInitialization('cesiumContainer', this.map);

        //this.createDrawTools();

        //this.layers = this.cesiumViewer.imageryLayers;

        //Grand Island, Nebraska in radians
        // var startingLocation: any = {
        //     centerLong: (-98.343286 * Math.PI / 180),
        //     centerLat: (40.923664 * Math.PI / 180)
        // };

        //var dataSource = Cesium.CzmlDataSource.load(this.czml);
        //this.map.dataSources.add(dataSource);

        //-97.73870945, 30.2721422
        this.map.camera.flyTo({
            //destination: Cesium.Cartesian3.fromDegrees(-100.25752233, 32.454968103, 1500),
            destination: Cesium.Cartesian3.fromDegrees(-97.73870945, 30.2721422, 1500),
            duration: 1
            //complete: (): void => {
            //    this.cesiumViewer.camera.flyTo({
            //        destination: Cesium.Cartesian3.fromDegrees(-97.7427778, 30.2669444, 500),
            //        duration: 5,
            //        orientation : {
            //            heading: Cesium.Math.toRadians(180.0),
            //            pitch: Cesium.Math.toRadians(-25.0),
            //            roll: 0.0
            //        },
            //        complete: (): void => {
            //            console.log('complete');
            //        }
            //    });
            //}
        });

        //var imageryLayers = this.map.imageryLayers;
        //
        //angular.forEach(imageryLayers, (value: any, key: any) => {
        //    console.log(value);
        //    console.log(key);
        //});

        //this.cesiumViewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
        //    url : '//mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi?',
        //    layers : 'nexrad-n0r',
        //    parameters : {
        //        transparent : 'true',
        //        format : 'image/png'
        //    }
        //}));

        //this.cesiumViewer.entities.add({
        //    position: Cesium.Cartesian3.fromDegrees(startingLocation.centerLong * 180 / Math.PI, startingLocation.centerLat * 180 / Math.PI, 500),
        //    point: {
        //        pixelSize: 32
        //    }
        //});

        // this makes sure our parent app gets its cesiumInstance back
        //this.cesiumDirective.cesiumInstance = new cesiumService(this.cesiumViewer);
        //-100.25752233, 32.454968103
        //-100.257630019 32.455315432


        //console.log($ctrl.cesiumViewer.imageryLayers);

        //this.addSurfacePolygon('image area', Cesium.Cartesian3.fromDegreesArray([
        //    -97.73870945, 30.2721422,
        //    -97.73713231, 30.27620983,
        //    -97.74134874, 30.27721976,
        //    -97.74281859, 30.27326337
        //]), new Cesium.Color(Cesium.Color.byteToFloat(10), Cesium.Color.byteToFloat(146), Cesium.Color.byteToFloat(234), .1));
        //
        //this.addSurfacePolyline('foo', Cesium.Cartesian3.fromDegreesArray([
        //    -97.73870945, 30.2721422,
        //    -97.73713231, 30.27620983,
        //    -97.74134874, 30.27721976,
        //    -97.74281859, 30.27326337,
        //    -97.73870945, 30.2721422
        //]), new Cesium.Color(Cesium.Color.byteToFloat(10), Cesium.Color.byteToFloat(146), Cesium.Color.byteToFloat(234), 1));

        //this.getTerrainHeight(-100.257640661, 32.455307523);

        //this.addRectangularSensor();

        //this.addPoint(-97.73888916, 30.27218853, 167);

        var handler = new Cesium.ScreenSpaceEventHandler(this.map.canvas, false);
        handler.setInputAction((click: any) => {
               var ray = this.map.camera.getPickRay(click.position);
               var position = this.map.scene.globe.pick(ray, this.map.scene);
               console.log(position);
               if (Cesium.defined(position)) {
                   // Make the height of the position = 0 so it works with groundPrimitive
                   var positionCartographic = this.map.scene.globe.ellipsoid.cartesianToCartographic(position);
                   positionCartographic.height = 0;
                   position = this.map.scene.globe.ellipsoid.cartographicToCartesian(positionCartographic);

                   var cartographic = Cesium.Cartographic.fromCartesian(position);
                //    var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(9);
                //    var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(9);

                    this.map.camera.flyTo({
                        //destination: Cesium.Cartesian3.fromDegrees(-100.25752233, 32.454968103, 1500),
                        destination: Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)),
                        duration: 1
                        //complete: (): void => {
                        //    this.cesiumViewer.camera.flyTo({
                        //        destination: Cesium.Cartesian3.fromDegrees(-97.7427778, 30.2669444, 500),
                        //        duration: 5,
                        //        orientation : {
                        //            heading: Cesium.Math.toRadians(180.0),
                        //            pitch: Cesium.Math.toRadians(-25.0),
                        //            roll: 0.0
                        //        },
                        //        complete: (): void => {
                        //            console.log('complete');
                        //        }
                        //    });
                        //}
                    });

                //    console.log(longitudeString + ' ' + latitudeString);

                //    var terrainProvider = new Cesium.CesiumTerrainProvider({
                //        url : '//assets.agi.com/stk-terrain/world'
                //    });
                //    var positions: Array<Cesium.Cartographic> = [
                //        Cesium.Cartographic.fromDegrees(longitudeString, latitudeString)
                //    ];

                //    Cesium.sampleTerrain(terrainProvider, 11, positions).then((updatedPositions: any): void => {
                //         this.map.camera.flyTo({
                //             //destination: Cesium.Cartesian3.fromDegrees(-100.25752233, 32.454968103, 1500),
                //             destination: Cesium.Cartesian3.fromDegrees(-97.73870945, 30.2721422, 1500),
                //             duration: 1
                //             //complete: (): void => {
                //             //    this.cesiumViewer.camera.flyTo({
                //             //        destination: Cesium.Cartesian3.fromDegrees(-97.7427778, 30.2669444, 500),
                //             //        duration: 5,
                //             //        orientation : {
                //             //            heading: Cesium.Math.toRadians(180.0),
                //             //            pitch: Cesium.Math.toRadians(-25.0),
                //             //            roll: 0.0
                //             //        },
                //             //        complete: (): void => {
                //             //            console.log('complete');
                //             //        }
                //             //    });
                //             //}
                //         });
                //    });
               }
           },
           Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
        );

        //var entity = this.map.entities.add({
        //    label : {
        //        show : false
        //    }
        //});

        //// Mouse over the globe to see the cartographic position
        //var handler2 = new Cesium.ScreenSpaceEventHandler(this.cesiumViewer.scene.canvas);
        //handler2.setInputAction((movement) => {
        //    var cartesian = this.cesiumViewer.camera.pickEllipsoid(movement.endPosition, this.cesiumViewer.scene.globe.ellipsoid);
        //    console.log(cartesian);
        //    if (cartesian) {
        //        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        //        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(9);
        //        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(9);
        //
        //        entity.position = cartesian;
        //        entity.label.show = true;
        //        entity.label.text = '(' + longitudeString + ', ' + latitudeString + ')';
        //    } else {
        //        entity.label.show = false;
        //    }
        //}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

//         var handler2: Cesium.ScreenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(this.map.scene.canvas);
//         handler2.setInputAction((movement) => {
//             //Set bounds of our simulation time
//             var start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
//             var stop = Cesium.JulianDate.addSeconds(start, 855, new Cesium.JulianDate());

// //Make sure viewer is at the desired time.
//             this.map.clock.startTime = start.clone();
//             this.map.clock.stopTime = stop.clone();
//             this.map.clock.currentTime = start.clone();
//             this.map.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
//             this.map.clock.multiplier = 10;

//             var property = new Cesium.SampledPositionProperty();
//             var initialHeight = 730;
//             for (var i = 0; i <= 855; i += 15) {
//                 initialHeight += 2;
//                 var radians = Cesium.Math.toRadians(i);
//                 var time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
//                 var position = Cesium.Cartesian3.fromDegrees(-100.257642589 + (.0001 * Math.cos(radians)), 32.455307234 + (.0001 * Math.sin(radians)), initialHeight);
//                 property.addSample(time, position);

//                 //Also create a point for each sample we generate.
//                 this.map.entities.add({
//                     position : position,
//                     point : {
//                         pixelSize : 6,
//                         color : Cesium.Color.TRANSPARENT,
//                         outlineColor : Cesium.Color.fromBytes(242, 101, 34, 255),
//                         outlineWidth : 3
//                     }
//                 });
//             }

//             this.map.entities.add({

//                 //Set the entity availability to the same interval as the simulation time.
//                 availability : new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
//                     start : start,
//                     stop : stop
//                 })]),

//                 //Use our computed positions
//                 position : property,

//                 //Automatically compute orientation based on position movement.
//                 //orientation : new Cesium.VelocityOrientationProperty(position),

//                 //Load the Cesium plane model to represent the entity
//                 model : {
//                     uri : '/components/cesiumMap/models/inspire.glb',
//                     scale: .3
//                     //minimumPixelSize : 64
//                 },

//                 //Show the path as a pink line sampled in 1 second increments.
//                 path : {
//                     resolution : 1,
//                     material : new Cesium.PolylineGlowMaterialProperty({
//                         glowPower : 0.1,
//                         color : Cesium.Color.fromBytes(242, 101, 34, 255)
//                     }),
//                     width : 10
//                 }
//             });
//         }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        //var start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
        //var stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate());
        //
        ////Compute the entity position property.
        //var position = computeCirclularFlight(-112.110693, 36.0994841, 0.03);
    }

    getTerrainHeight(longitude: number, latitude: number): ng.IPromise<number> {
        var deferred: ng.IDeferred<any> = this.$q.defer();

        // Query the terrain height of two Cartographic positions
        var terrainProvider: any = new Cesium.CesiumTerrainProvider({
            url : '//assets.agi.com/stk-terrain/world'
        });
        var positions: Array<Cesium.Cartographic> = [
            Cesium.Cartographic.fromDegrees(longitude, latitude)
        ];

        Cesium.sampleTerrain(terrainProvider, 11, positions).then((updatedPositions: any): void => {

            deferred.resolve(updatedPositions[0].height);
        });

        return deferred.promise;
    }

    // Save flight plan
    saveFlightPlan(name: string): void {

        // Check if flight plan has a name and save
        if (name === '') {
            this.flightPlan.SaveProperty('Untitled Flight Plan', 'Name');
        } else {
            this.flightPlan.SaveProperty(name, 'Name');
        }

        // Set flag in flight plan that it has been saved, this keeps unsaved flight plans from being shown on dashboard
        this.flightPlan.SaveProperty(true, 'Saved');

        // TODO - take snapshot for dashboard
    }

    // Check for saved flight plan and go to dashboar
    exitFlightPlan(): void {

        if (this.flightPlan.Saved) {

            this.stateService.go('dashboard');

        } else {
            // open confirm model
            // var model: any = this.ngDialog.open({
            //     template: 'components/appbar/appbarExitModel.html',
            //     className: 'ngdialog-theme-ds',
            //     showClose: false
            // });

            // model.closePromise.then((data: any): void => {
            //     // delete flight plan
            //     if (data.value === 'save') {

            //         this.saveFlightPlan('');

            //     } else if (data.value === 'dsave') {

            //         this.stateService.go('dashboard');
            //     }
            // });
        }
    }

    // Handle command added from map tools component
    addCommand(command: any): void {

        // Need to apply high level duplication rules here
        // For example, you can't have two takeoff commands
        this.db.commands.createCommandForFlightPlanWithId(this.flightPlanId, command.Type.toUpperCase(), command).then((data: any) => {
            console.log(data);
        });
    }

    // Handle clear flight plan callback from toolbar
    clearFlightPlan(): void {

        // open confirm model
        var model: any = this.ngDialog.open({
            template: './app/components/flightPlanViewer/clearFPModal.html',
            className: 'ngdialog-theme-ds',
            showClose: false
        });

        model.closePromise.then((data: any): void => {

            // delete flight plan
            if (data.value === true) {
                this.db.commands.deleteCommandsFromFlightPlanWithId(this.flightPlanId);
            }
        });
    }

    mapFlyTo(lat: number, lng: number): void {

        this.getTerrainHeight(lng, lat).then((alt: number): void => {
            this.map.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(lng, lat, alt + 500.0)
            });
        });

        //this.map.camera.setView({
        //    destination : Cesium.Cartesian3.fromDegrees(lng, lat, 500.0)
        //});
    }

    saveCamera(camera: Camera): void {

        //this.flightPlan.SaveProperty(camera, 'Camera');

        this.flightPlan.SaveProperty({
            Type: camera.Type,
            Name: camera.Name,
            Id: camera.Id,
            SensorWidth: camera.SensorWidth,
            SensorHeight: camera.SensorHeight,
            FocalLength: camera.FocalLength,
            HorizontalResolution: camera.HorizontalResolution,
            VerticalResolution: camera.VerticalResolution
        }, 'Camera');

    }

    buildings: any;

    showSettings(): void {

        if (this.buildings && this.map.scene.primitives.contains(this.buildings)){
            this.map.scene.primitives.remove(this.buildings);
        } else {
            this.buildings = this.map.scene.primitives.add(new Cesium.Cesium3DTileset({
                url: 'https://www.cesiumcontent.com/api/assets/3/data/tileset.json?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkZjgxNGRiYS0wMjc0LTQ2ZWMtYTJhNC1kMzRhYzkyNDE0YjgiLCJpZCI6NSwiYXNzZXRzIjpbM10sImlhdCI6MTQ1NzQ1ODEwOX0.-kwaVNM63oY4-rqLiZHqSedHRImPCZtkizCU50SuKwA'
            }));

            var greenCylinder: any = this.map.entities.add({
                name : 'KAUS Airspace',
                position: Cesium.Cartesian3.fromDegrees(-97.6663058, 30.1974292, 150.0),
                cylinder : {
                    length : 1280.0,
                    topRadius : 9260.0,
                    bottomRadius : 9260.0,
                    material : Cesium.Color.MAGENTA.withAlpha(0.3),
                    outline : true,
                    outlineColor: Cesium.Color.WHITE
                }
            });
        }
    }

    saveDrone(drone: Drone): void {
        console.log(drone.Name);

        //this.flightPlan.SaveProperty(drone, 'Drone');

        this.flightPlan.SaveProperty({
            Type: drone.Type,
            Name: drone.Name,
            Id: drone.Id,
            Endurance: drone.Endurance,
            BatterySize: drone.BatterySize,
            BatteryType: drone.BatteryType,
            FrameType: drone.FrameType,
            AutopilotType: drone.AutopilotType
        }, 'Drone');
    }

}

export default angular.module('DroneSense.Web.FlightPlanViewer', [
    uiStateService.name,
    userService.name,
    AppBar.name,
    ToolBar.name,
    CommandViewer.name,
    MapTools.name,
    MapControls.name,
    FlightInfoViewer.name,
    'ngDialog'
]).component('dsFlightPlanViewer', {
    bindings: {

    },
    controller: FlightPlanViewer,
    templateUrl: './app/components/flightPlanViewer/flightPlanViewer.html'
}).filter('secondsToDateTime', [(): any => {
        return function(seconds: number): number {
            return new Date(1970, 0, 1).setSeconds(seconds);
        };
}]);
