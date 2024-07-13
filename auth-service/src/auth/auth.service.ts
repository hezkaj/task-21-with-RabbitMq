import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from '../Dto/auth.dto';
import { CreateDto } from 'src/Dto/create.dto';
import { Token } from 'src/Dto/token';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async login(authDto:AuthDto):Promise<Token>{
    const user = await this.usersService.getUserByMail(authDto.email)
    if(!user)throw new NotFoundException({message:'Пользователь не найден'})
    const passwordEquals = await bcrypt.compare(authDto.password, user.password)
    if(!passwordEquals){
      throw new UnauthorizedException({message:'Неверный пароль'})
    }
    const date=new Date()
    const payload={id:user.id}
    const access_token= await this.jwtService.sign(payload,{expiresIn:'1m'})
    const refresh_token= await this.jwtService.sign(payload,{expiresIn:'7d'})
    await this.usersService.updateRefresh(user.id,refresh_token, date)
    return{
      access_token,
      refresh_token
    }
  }
  async registration(userDto:CreateDto):Promise<Token>{
    const candidate=await this.usersService.getUserByMail(userDto.email)
    if(candidate){
      throw new HttpException('Пользователь уже существует', HttpStatus.BAD_REQUEST)
    }
    const date=new Date()
    const pass = await bcrypt.hash(userDto.password, 10);
    const user = await this.usersService.createUser({
      email:userDto.email, password:pass, name:userDto.name
    })
    const payload={id:user.id}
    const access_token= await this.jwtService.sign(payload,{expiresIn:'1m'})
    const refresh_token= await this.jwtService.sign(payload,{expiresIn:'7d'})
    await this.usersService.updateRefresh(user.id,refresh_token, date)
    return{
      access_token,
      refresh_token
    }
  }
  async refreshToken(old_refresh:string):Promise<Token>{
    const date=new Date()
    if(old_refresh===null){throw new BadRequestException({mesasge:'Войдите в свой аккаунт'}) }
    const {id, ...other} = this.jwtService.decode(old_refresh);
    const {updated_date, ...other2}=await this.usersService.getUserById(id)
    if(updated_date.getFullYear()<date.getFullYear()||
      updated_date.getMonth()<date.getMonth()||
      date.getDay()-updated_date.getDay()>7){
        await this.usersService.updateRefresh(id,null,date)
    }
    const payload= await this.usersService.getUserByToken(old_refresh)
    const access_token= await this.jwtService.sign(payload,{expiresIn:'1m'})
    const refresh_token= await this.jwtService.sign(payload,{expiresIn:'7d'})
    await this.usersService.updateRefresh(id,refresh_token, date)
    return{
      access_token,
      refresh_token
    }
  }
}