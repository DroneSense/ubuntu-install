import { IDrawTool } from '../IDrawTool';

export class OrbitTool implements IDrawTool {

    IconPath: string = './app/components/tools/orbitTool/images/orbit.svg';
    ToolTip: string = 'Add Orbit Point';
    Selected: boolean;

    // Editing handler reference
    editingHandler: Cesium.ScreenSpaceEventHandler;

    constructor(public map: Cesium.Viewer, public callback: Function) {

    }

    StartEdit(): void {

    }

    StopEdit(): void {


        this.Selected = false;
    }
}
