import { IDrawTool } from '../IDrawTool';

export class MeasureTool implements IDrawTool {

    IconPath: string = './app/components/tools/measureTool/images/measure.svg';
    ToolTip: string = 'Measure Distance';
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
