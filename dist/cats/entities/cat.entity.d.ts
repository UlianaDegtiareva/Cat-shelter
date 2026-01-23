import { UserEntity } from 'src/users/entities/user.entity';
export declare class CatEntity {
    id: number;
    name: string;
    age: number;
    breed: string;
    isAdopted: boolean;
    history: string;
    description: string;
    adoptionDate: Date;
    owner: UserEntity;
}
