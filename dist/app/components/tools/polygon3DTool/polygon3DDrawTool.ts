import { IDrawTool } from '../IDrawTool';

export class Polygon3DTool implements IDrawTool {

    IconPath: string = './app/components/tools/polygon3DTool/images/polyObject.svg';
    ToolTip: string = 'Create polygon object';
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
