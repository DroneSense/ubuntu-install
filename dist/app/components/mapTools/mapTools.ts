import { IDrawTool } from '../tools/IDrawTool';
import { FlightPlan } from '@dronesense/model';

import { WaypointCommandDrawTool } from '../tools/waypointTool/waypointCommandDrawTool';
import { GeofenceTool } from '../tools/geofenceTool/geofenceDrawTool';
import { RallyPointTool } from '../tools/rallyPointTool/rallyPointDrawTool';
import { TakeoffCommandDrawTool } from '../tools/takeoffTool/takeoffCommandDrawTool';
import { SurveyCommandDrawTool } from '../tools/surveyTool/surveyCommandDrawTool';
import { Model3DDrawTool } from '../tools/3dModelTool/3dModelDrawTool';
import { OrbitTool } from '../tools/orbitTool/orbitDrawTool';
import { MeasureTool } from '../tools/measureTool/measureDrawTool';
import { ElevationTool } from '../tools/elevationTool/elevationDrawTool';
import { VolumeMeasureTool } from '../tools/volumeMeasureTool/volumeMeasureDrawTool';
import { Polygon3DTool } from '../tools/polygon3DTool/polygon3DDrawTool';
import { Circle3DTool } from '../tools/circle3DTool/circle3DDrawTool';
import { NoteTool } from '../tools/noteTool/noteDrawTool';
import { WarningTool } from '../tools/warningTool/warningDrawTool';
import { SensorCaptureTool } from '../tools/sensorCaptureTool/sensorCaptureDrawTool';

export interface IMapTools extends ng.IScope {
    map: Cesium.Viewer;
    onDrawStart(): void;
    onDrawEnd(): void;
    onAddCommand(command: any): void;
}

// Map tools are the Draw Handlers for various commands that add UI to the map
class MapTools {

    // Collection of single instance tools
    singleInstanceTools: Array<IDrawTool>;

    // Multi instance tools
    multiInstanceTools: Array<IDrawTool>;

    // Measure tools
    measureTools: Array<IDrawTool>;

    // 3D creation tools
    threeDCreationTools: Array<IDrawTool>;

    // Annotation Tools
    annotationTools: Array<IDrawTool>;

    // Map reference
    map: Cesium.Viewer;

    // Flight Plan ID
    flightPlanId: string;

    // Call back from draw tool handlers
    drawEnd: any;

    // Bindings interface method
    onAddCommand: any;

    // Bindings interface method
    onDrawStart: any;

    // Binding interface method
    onDrawEnd: any;

    // Binding Property
    flightPlan: FlightPlan;

    // Constructor
    static $inject: Array<string> = [
        '$scope',
        'db'
    ];

    // Take a list of tools and load
    constructor(public bindings: IMapTools, public db: any) {

        var $ctrl: MapTools = this;

        // Initialize tool array
        this.singleInstanceTools = [];

        this.multiInstanceTools = [];

        this.measureTools = [];

        this.threeDCreationTools = [];

        this.annotationTools = [];

        this.drawEnd = (command: any) => {
            $ctrl.onAddCommand({command: command});
        };

    //    this.bindings.$watch(() => { return this.camera; }, (newValue: Camera, oldValue: Camera): void => {
    //         this.camera = newValue;
    //     });

        // add DS tools
        this.AddDSTools();
    }

    // Load all tools
    AddDSTools(): void {

        var geofence: GeofenceTool = new GeofenceTool(this.map, this.drawEnd);
        var rallyPoint: RallyPointTool = new RallyPointTool(this.map, this.drawEnd);
        var waypointTool: WaypointCommandDrawTool = new WaypointCommandDrawTool(this.map, this.drawEnd, this.flightPlan);
        var takeTool: TakeoffCommandDrawTool = new TakeoffCommandDrawTool(this.map, this.drawEnd);
        var surveyTool: SurveyCommandDrawTool = new SurveyCommandDrawTool(this.map, this.drawEnd);
        var model3DTool: Model3DDrawTool = new Model3DDrawTool(this.map, this.drawEnd);
        var orbitTool: OrbitTool = new OrbitTool(this.map, this.drawEnd);
        var measureTool: MeasureTool = new MeasureTool(this.map, this.drawEnd);
        var elevationTool: ElevationTool = new ElevationTool(this.map, this.drawEnd);
        var volumeTool: VolumeMeasureTool = new VolumeMeasureTool(this.map, this.drawEnd);
        var polygon3DTool: Polygon3DTool = new Polygon3DTool(this.map, this.drawEnd);
        var circle3DTool: Circle3DTool = new Circle3DTool(this.map, this.drawEnd);
        var noteTool: NoteTool = new NoteTool(this.map, this.drawEnd);
        var warningTool: WarningTool = new WarningTool(this.map, this.drawEnd);

        var sensorCapture: SensorCaptureTool = new SensorCaptureTool(this.map, this.drawEnd, this.flightPlan);

        this.singleInstanceTools.push(geofence);
        this.singleInstanceTools.push(rallyPoint);

        this.multiInstanceTools.push(takeTool);
        this.multiInstanceTools.push(waypointTool);
        this.multiInstanceTools.push(surveyTool);
        this.multiInstanceTools.push(orbitTool);
        this.multiInstanceTools.push(sensorCapture);

        this.measureTools.push(measureTool);
        this.measureTools.push(elevationTool);
        this.measureTools.push(volumeTool);

        this.threeDCreationTools.push(model3DTool);
        this.threeDCreationTools.push(polygon3DTool);
        this.threeDCreationTools.push(circle3DTool);

        this.annotationTools.push(noteTool);
        this.annotationTools.push(warningTool);

    }
}

export default angular.module('DroneSense.Web.MapTools', [

]).component('dsMapTools', {
    bindings: {
        map: '<',
        //onDrawStart: '&',
        //onDrawEnd: '&',
        onAddCommand: '&',
        flightPlan: '<'
    },
    controller: MapTools,
    templateUrl: './app/components/mapTools/mapTools.html'
});

