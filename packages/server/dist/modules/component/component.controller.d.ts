import { ComponentService } from './component.service';
export declare class ComponentController {
    private readonly componentService;
    constructor(componentService: ComponentService);
    detail(dto: {
        id?: number;
        name?: string;
    }): Promise<import("./component.entity").ComponentEntity>;
}
