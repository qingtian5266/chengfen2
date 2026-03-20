import { Repository } from 'typeorm';
import { Additive } from './additive.entity';
import { CreateAdditiveDto, UpdateAdditiveDto } from './dto/additive.dto';
export declare class AdditiveService {
    private additiveRepository;
    constructor(additiveRepository: Repository<Additive>);
    list(): Promise<Additive[]>;
    create(dto: CreateAdditiveDto): Promise<Additive>;
    update(dto: UpdateAdditiveDto): Promise<Additive>;
    delete(id: number): Promise<{
        success: boolean;
    }>;
}
