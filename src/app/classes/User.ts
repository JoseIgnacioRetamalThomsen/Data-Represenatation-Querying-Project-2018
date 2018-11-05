export class User{
    constructor
    (
    public email : string,
    public password : string,
    public name?:string,
    public isAdmin?:boolean
    )
    {
        this.isAdmin=false;
    }
}