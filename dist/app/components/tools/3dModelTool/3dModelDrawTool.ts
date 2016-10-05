import { IDrawTool } from '../IDrawTool';
import { Conversions } from '@dronesense/model/lib/common/Utility';

export class Model3DDrawTool implements IDrawTool {

    IconPath: string = './app/components/tools/3dModelTool/images/3dObject.svg';
    ToolTip: string = 'Add 3D Model';
    Selected: boolean;

    // Editing handler reference
    editingHandler: Cesium.ScreenSpaceEventHandler;

    constructor(public map: Cesium.Viewer, public callback: Function) {

    }

    StartEdit(): void {

        if (this.Selected) {
            this.StopEdit();
            return;
        }

        this.start2DEditMode();
    }

    start2DEditMode(): void {

        this.Selected = true;

        this.editingHandler = new Cesium.ScreenSpaceEventHandler(this.map.canvas);

        // Turn on editing and wire up event listening
        var dragging: any;

        // Initialize point array
        //this.imageAreaPolygon = [];

        //var sensor = this.map.scene.primitives.add(new Cesium.RectangularSensor({
        //    modelMatrix : Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(-100.25795736, 32.45836936)),
        //    radius : 1000000.0,
        //    xHalfAngle : Cesium.Math.toRadians(25.0),
        //    yHalfAngle : Cesium.Math.toRadians(40.0)
        //}));
        //
        //this.map.scene.primitives.add(new Cesium.RectangularSensor({
        //    modelMatrix : Cesium.Transforms.northEastDownToFixedFrame(Cesium.Cartesian3.fromDegrees(-100.25795736, 32.45836936, 900000.0)),
        //    radius : 1000000.0,
        //    xHalfAngle : Cesium.Math.toRadians(25.0),
        //    yHalfAngle : Cesium.Math.toRadians(40.0),
        //    lateralSurfaceMaterial : Cesium.Material.fromType(Cesium.Material.StripeType),
        //    intersectionColor :  Cesium.Color.YELLOW
        //}));

        //var rectangularPyramidSensor = new CesiumSensors.RectangularPyramidSensorVolume();
        //
        ////rectangularPyramidSensor.modelMatrix = Cesium.Transforms.northEastDownToFixedFrame(Cesium.Cartesian3.fromDegrees(-100.2573716, 32.45647648, 802.82));
        //
        //rectangularPyramidSensor.modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(Cesium.Cartesian3.fromDegrees(-100.2573716, 32.45647648, 802.82), 0.785398, -3.14159, 0);
        //
        //rectangularPyramidSensor.radius = 200.0;
        //rectangularPyramidSensor.xHalfAngle = Cesium.Math.toRadians(25.0);
        //rectangularPyramidSensor.yHalfAngle = Cesium.Math.toRadians(40.0);
        //
        //rectangularPyramidSensor.lateralSurfaceMaterial = Cesium.Material.fromType('Color');
        //rectangularPyramidSensor.lateralSurfaceMaterial.uniforms.color = new Cesium.Color(0.0, 1.0, 1.0, 0.5);
        //this.map.scene.primitives.add(rectangularPyramidSensor);

        //this.map.camera.lookAtTransform(Cesium.Transforms.headingPitchRollToFixedFrame(Cesium.Cartesian3.fromDegrees(-100.2573716, 32.45647648, 802.82), 0.785398, -3.14159, 0));

        // Change map to 2D


        this.map.entities.add({
            // name: 'ROI',
            // polyline: {
            //     // TODO - move to static property and manually trigger the redraw for trigger changes.
            //     positions: new Cesium.CallbackProperty( (): any => {

            //         return this.imageAreaPolygon;

            //     }, false),
            //     width: 3,
            //     material: Cesium.Color.fromCssColorString( '#0a92ea' )
            // },
            //polygon : {
            //    hierarchy : new Cesium.CallbackProperty( (): any => {
            //
            //        return this.imageAreaPolygon;
            //
            //    }, false) ,
            //    material : Cesium.Color.fromBytes(10, 146, 234, 100),
            //    perPositionHeight: true
            //}
        });


        // Wire up handler to listen for left mouse down event
        this.editingHandler.setInputAction((click: any): void => {

            // Get mouse click position from ray
            var ray: any = this.map.camera.getPickRay(click.position);
            var position: any = this.map.scene.globe.pick(ray, this.map.scene);

            // Make sure the position is defined
            if (Cesium.defined(position)) {

                // Make the height of the position = 0 so it works with groundPrimitive
                var positionCartographic: Cesium.Cartographic = this.map.scene.globe.ellipsoid.cartesianToCartographic(position);
                positionCartographic.height = 0;
                //position = this.map.scene.globe.ellipsoid.cartographicToCartesian(positionCartographic);

                //this.imageAreaPolygon.push(position);

                // Setup terrain provider
                var terrainProvider: any = new Cesium.CesiumTerrainProvider({
                    url: 'https://www.cesiumcontent.com/api/terrain/world?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkMTM4ZDE2OS05NWYwLTQ0YmItOWY3YS0yNjEwOGE5Y2Y3NjYiLCJpZCI6NywiaWF0IjoxNDU1MjkyNzg5fQ.NDKlrwQZE_04ntDuL89hvatEmuycQo5llhtz3Mi6Wo0'
                });

                // Create positions object for terrain query
                var positions: Array<Cesium.Cartographic> = [
                    positionCartographic
                ];

                var longitude: number = Conversions.formatCoordinate(Cesium.Math.toDegrees(positionCartographic.longitude), 8);
                var latitude: number = Conversions.formatCoordinate(Cesium.Math.toDegrees(positionCartographic.latitude), 8);

                // Call async sampleTerrain TODO - This will fail if we don't have the terrain tile either from the server or in cache
                // TODO - Move this to common function
                Cesium.sampleTerrain(terrainProvider, 15, positions).then((updatedPositions: any): void => {

                    position.z = updatedPositions[0].height + 20;

                    //this.imageAreaPolygon.push(this.map.scene.globe.ellipsoid.cartographicToCartesian(position));

                    this.create3DModel('../../../models/cell.glb', longitude, latitude, updatedPositions[0].height); //727.64);

                });

                //this.StopEdit();

            }


        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // Wire up handler for each mouse move while entity is being dragged
        this.editingHandler.setInputAction((movement: any): void => {

            // Return immediately if we are not dragging anything
            //if (!dragging) {
            //    return;
            //}

            // Use ray pick to get position and convert
            var ray: any = this.map.camera.getPickRay(movement.endPosition);
            var position: any = this.map.scene.globe.pick(ray, this.map.scene);
            var object: any = this.map.scene.pick(movement.endPosition);

            if (object && object.node) {
                console.log(object);
            }


            // Check to see if the position is defined
            if (!Cesium.defined(position) || !dragging) {
                return;
            }

            var positionCartographic: any = this.map.scene.globe.ellipsoid.cartesianToCartographic(position);
            positionCartographic.height = 0;
            position = this.map.scene.globe.ellipsoid.cartographicToCartesian(positionCartographic);



            //var cartographic: Cesium.Cartographic = Cesium.Cartographic.fromCartesian(position);
            //var longitude: number = Conversions.formatCoordinate(Cesium.Math.toDegrees(cartographic.longitude), 8);
            //var latitude: number = Conversions.formatCoordinate(Cesium.Math.toDegrees(cartographic.latitude), 8);

        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    StopEdit(): void {
        this.editingHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.editingHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        this.Selected = false;
    }

    create3DModel(url: string, lng: number, lat: number, height: number): void {
                //this.cesiumViewer.entities.removeAll();

        // var position: Cesium.Cartesian3 = Cesium.Cartesian3.fromDegrees(lng, lat, height);
        // var heading: number = Cesium.Math.toRadians(180);
        // var pitch: number = 0;
        // var roll: number = 0;
        // var orientation: number = Cesium.Transforms.headingPitchRollQuaternion(position, heading, pitch, roll);

        // var entity: any = this.map.entities.add({
        //             name: 'Wind Turbine',
        //             position: position,
        //             orientation: orientation,
        //             model: {
        //                 uri: url,
        //                 minimumPixelSize: 128,
        //                 maximumScale: 1,
        //                 debugWireframe: true
        //             }

        // });

        var origin: Cesium.Cartesian3 = Cesium.Cartesian3.fromDegrees(lng, lat, height);
        var modelMatrix: any = Cesium.Transforms.eastNorthUpToFixedFrame(origin);

        var model: Cesium.Model = this.map.scene.primitives.add(Cesium.Model.fromGltf({
            url : url,
            show : true,                     // default
            modelMatrix : modelMatrix,
            scale : 50.0,                     // double size
            minimumPixelSize : 128,          // never smaller than 128 pixels
            maximumScale: 2000,             // never larger than 20000 * model size (overrides minimumPixelSize)
            allowPicking : true,            // not pickable
            debugShowBoundingVolume : false, // default
            debugWireframe : false
        }));
                //this.cesiumViewer.trackedEntity = entity;
    }
}
