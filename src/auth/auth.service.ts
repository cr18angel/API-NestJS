import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';


@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>) { }



  // create(createAuthDto: CreateUserDto) {
  //   return 'This action adds a new auth';
  // }

  async create(createUserDto: CreateUserDto): Promise<User> {

    try {
      // IMPORTANTISIMO PARA ENTENDERLO 
      // destructurando create User   ..useData => tiene el resto de propiedades restantes   
      const { password, ...userData } = createUserDto

      const newUser = new this.userModel({
        // trabajo con pass y el resto se represetea en userData
        // 1- encriptar la contraseña 
        password: bcryptjs.hashSync(password, 10),
        ...userData
      });

      // 2-Guardar el usuario 
      await newUser.save();
      // variable sin el pass para retornar
      const { password: _, ...user } = newUser.toJSON();
      return user;

      // return await newUser.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} aslready exists!`)
      }
      throw new InternalServerErrorException('Error in the API');
    }
  }


  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
