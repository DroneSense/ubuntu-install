import ISession from '@dronesense/core/lib/common/ISession';
import ServerConnection from './serverConnection';
import { IEventEmitter } from '@dronesense/core/lib/common/IEventEmitter';
import BackboneEvents from 'backbone-events-standalone';
import { MapMode } from './mapMode';
import { OwnerMapSession, MapSession } from './mapSession';
import { FlightControlViewerEventing } from './FlightControlViewer';

export interface ISessionControllerEvents extends IEventEmitter {
    on(eventName: string, callback?: Function, context?: any): any;
    on(eventName: 'locating-drone', callback?: (username: string) => void, context?: any): any;
    on(eventName: 'drone-located', callback?: (username: string) => void, context?: any): any;
}

export class SessionController implements ISessionControllerEvents {

    // Backbone events    
    on: (eventName: string, callback?: Function, context?: any) => any;
    once: (events: string, callback: Function, context?: any) => any;
    off: (eventName?: string, callback?: Function, context?: any) => any;
    protected trigger: (eventName: string, ...args: any[]) => any;

    // Map reference passed to us from the map component
    map: Cesium.Viewer;

    // The owner session bound to the UI
    ownerSession: OwnerMapSession;

    // Guest sessions Array
    guestSession: Array<MapSession> = [];

    eventing: FlightControlViewerEventing;

    // Currently active session for all UI to wire up
    activeSession: MapSession;

    constructor(eventing: FlightControlViewerEventing) {
        this.eventing = eventing;
    }
   
    addOwnerSession(session: ISession, serverConnection: ServerConnection, mapMode: MapMode, allowAllGuestsWithoutPrompt: boolean, startRecording: boolean): void {

        this.initializeMap(mapMode);

        this.ownerSession = new OwnerMapSession();

        this.map.dataSources.add(this.ownerSession.mapEntityCollection);

        // TODO: make static call
        this.ownerSession.initializeOwnerSession(this.eventing, session, serverConnection, this.map, mapMode, allowAllGuestsWithoutPrompt, startRecording).then((ownerSession: OwnerMapSession) => {
            
            // Set returned owner session
            this.ownerSession = ownerSession;

            // Set as tracked entity
            this.map.trackedEntity = ownerSession.mapDrone.droneEntity;

            // Fly to
            ownerSession.mapDrone.flyToDroneOn3DMap();

            this.activeSession = ownerSession;

            // Start video stream if drone is connected and this is an owner session
            /* !cordova-start */
            try {
                dronesense.bridgeManager.startVideoStream('192.168.0.115', 8554, this.ownerSession.name);
            } catch (error) {
                alert(error);
            }
            /* !cordova-stop */

            this.eventing.trigger('session-added', this.ownerSession);
        });

    }

    addGuestSession(session: ISession, serverConnection: ServerConnection, mapMode: MapMode): void {

        // check if map is loaded
         this.initializeMap(mapMode);

         let mapSessionInstance: MapSession = new MapSession();

         this.map.dataSources.add(mapSessionInstance.mapEntityCollection);

         // TODO: Make static call on mapsession
         mapSessionInstance.initializeSession(this.eventing, session, serverConnection, this.map, mapMode).then((mapSession: MapSession) => {
             this.guestSession.push(mapSession);

             // If we don't have an owner session then fly to the drone
             if (!this.ownerSession) {

                    // Set as the tracked entity
                    this.map.trackedEntity = mapSession.mapDrone.droneEntity;

                    // Only do fly to animation if it's the first guest session
                    if (this.guestSession.length === 0) {
                        mapSession.mapDrone.flyToDroneOn3DMap();
                    }

                    this.activeSession = mapSession;

                    this.eventing.trigger('session-added', mapSession);
             }

            // Start video stream if drone is connected and this is an owner session
            /* !cordova-start */
            try {
                dronesense.bridgeManager.subscribeVideoStream('192.168.0.115', 8554, this.activeSession.name);
            } catch (error) {
                alert(error);
            }
            /* !cordova-stop */
         });

    }

    changeActiveSession(session: MapSession): void {
        if (this.activeSession === session) {
            return;
        }
        
        this.activeSession = session;

        this.map.trackedEntity = session.mapDrone.droneEntity;

        // Start video stream if drone is connected and this is an owner session
        /* !cordova-start */
        try {
            dronesense.bridgeManager.subscribeVideoStream('192.168.0.115', 8554, this.activeSession.name);
        } catch (error) {
            alert(error);
        }
        /* !cordova-stop */

        this.eventing.trigger('session-changed', session);
    }

    removeGuestSession(session: MapSession): void {
        
        // first change to another session
    //    if (this.guestSession.length > 1) {
            
    //     }

        // There are two paths for removing guests
        if (this.ownerSession) {

        } else {
            this.activeSession = null;

            this.map.trackedEntity = null;

            this.eventing.trigger('session-removed', session);
        }

        // suspend this collections events
        session.mapEntityCollection.entities.suspendEvents();

        // remove and destroy
        this.map.dataSources.remove(session.mapEntityCollection, true);

        // resumt map events
        session.mapEntityCollection.entities.resumeEvents();

        session.session.leaveSession();

        this.guestSession.splice(this.guestSession.indexOf(session), 1);
    };

    // Creates map object with selected mode
    initializeMap(mapMode: MapMode): void {
        //'//assets.agi.com/stk-terrain/world'
        // https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html

        // Only initialize map if it doesn't exist.
        if (this.map) {
            return;
        }

        // By default Cesium uses the location of the Cesium.js file as the location where the rest of the files are stored. You can either set a global CESIUM_BASE_URL variable or just call Cesium.buildModuleUrl.setBaseUrl to point it at a different location.
        Cesium.BingMapsApi.defaultKey = 'AiGfGytmoPZ6lnYVDiRzKe08ZI_kzjHTjhVrcuj3pPrpC9BmxvFP_vfGT8fB9z-T';

        let sceneMode: any = mapMode === MapMode.ThreeDimensional ? Cesium.SceneMode.SCENE3D : Cesium.SceneMode.SCENE2D;

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
            sceneModePicker: false,
            selectionIndicator: false,
            timeline: false,
            animation: false,
            geocoder: false,
            navigationHelpButton: false,
            infobox: false,
            scene3DOnly: false,
            sceneMode: sceneMode//,
            //dataSources: this.mapDataSourceCollection
            // shadows : true,
            // terrainShadows : Cesium.ShadowMode.ENABLED
        });

        var options: any = {};

        options.enableCompass = false;
        options.enableZoomControls = true;
        options.enableDistanceLegend = false;
        this.map.extend(Cesium.viewerCesiumNavigationMixin, options);

        // this.map.scene.primitives.add(new Cesium.Cesium3DTileset({
        //     url: 'https://www.cesiumcontent.com/api/assets/3/data?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkZjgxNGRiYS0wMjc0LTQ2ZWMtYTJhNC1kMzRhYzkyNDE0YjgiLCJpZCI6NSwiYXNzZXRzIjpbM10sImlhdCI6MTQ1NzQ1ODEwOX0.-kwaVNM63oY4-rqLiZHqSedHRImPCZtkizCU50SuKwA'
        // }));

        // this.map.scene.primitives.add(new Cesium.Cesium3DTileset({
        //     url : '../newyork/'
        // }));

        // Decreases map performance but make rendering look better at distances
        //this.map.scene.fog.enabled = true;

        // This sets night/day in the scene
        //this.map.scene.globe.enableLighting = true;

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

        // this.map.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
        //        url : '//mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi?',
        //        layers : 'nexrad-n0r',
        //        parameters : {
        //            transparent : 'true',
        //            format : 'image/png'
        //        }
        // }));

        this.eventing.trigger('map-loaded');
    }

    endSession(): void {
        this.ownerSession.session.endSession();

        /* !cordova-start */
        try {
            dronesense.bridgeManager.stopVideoStream();
        } catch (error) {
                alert(error);
        }
        /* !cordova-stop */
        
    }

}

BackboneEvents.mixin(SessionController.prototype);
