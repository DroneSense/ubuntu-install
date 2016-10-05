export interface IDrawTool {
    IconPath: string;
    ToolTip: string;
    Selected: boolean;

    StartEdit(): void;
    StopEdit(): void;
}
