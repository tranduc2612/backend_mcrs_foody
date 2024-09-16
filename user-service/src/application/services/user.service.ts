import { RpcBadRequestException } from './../../../../auth/src/exceptions/custom-rpc-exceptions';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO, UserDTO } from 'lib';
import { Users } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}

  async get(username: string): Promise<UserDTO> {
    const data = await this.userRepository.findOne({
      where: {
        username, 
      },
    });

    if(data){
      const dataMapper: UserDTO = {
        id: data.id,
        username: data.username,
        email: data.email,
      }
  
      return {
        ...dataMapper
      };
    }

    throw new RpcBadRequestException('The username is not exist !');
    
  }

  async create(dto: CreateUserDTO): Promise<UserDTO> {
    const newUser = await this.userRepository.create({
      id: uuidv4(),
      ...dto,
    });

    const data = await this.userRepository.save(newUser);

    if(data){
      const dataMapper: UserDTO = {
        id: data.id,
        username: data.username,
        email: data.email
      }

      return {
        ...dataMapper
      };
     
    }
    return null
    
  }
}
