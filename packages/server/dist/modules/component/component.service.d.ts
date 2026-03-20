import { Repository } from 'typeorm';
import { ComponentEntity } from './component.entity';
export declare class ComponentService {
    private readonly componentRepository;
    constructor(componentRepository: Repository<ComponentEntity>);
    detail(dto: {
        id?: number;
        name?: string;
    }): Promise<ComponentEntity>;
}
