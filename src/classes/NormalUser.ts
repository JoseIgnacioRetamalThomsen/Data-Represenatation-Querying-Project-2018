import {User} from './user';

export class NormalUser implements User{
    email : string;
    name : string;
    password : string;
}