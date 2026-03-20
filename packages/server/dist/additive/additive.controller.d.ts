import { AdditiveService } from './additive.service';
import { CreateAdditiveDto, UpdateAdditiveDto } from './dto/additive.dto';
export declare class AdditiveController {
    private additiveService;
    constructor(additiveService: AdditiveService);
    list(): Promise<import("./additive.entity").Additive[]>;
    create(dto: CreateAdditiveDto): Promise<import("./additive.entity").Additive>;
    update(dto: UpdateAdditiveDto): Promise<import("./additive.entity").Additive>;
    delete(dto: {
        id: number;
    }): Promise<{
        success: boolean;
    }>;
}
