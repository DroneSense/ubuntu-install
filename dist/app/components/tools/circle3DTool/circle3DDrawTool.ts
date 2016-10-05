import { IDrawTool } from '../IDrawTool';

export class Circle3DTool implements IDrawTool {

    IconPath: string = './app/components/tools/Circle3DTool/images/cylinderObject.svg';
    ToolTip: string = 'Create cylinder object';
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
