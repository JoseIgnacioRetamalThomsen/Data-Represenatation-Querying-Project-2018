export class Place{
    constructor
    (
    public id : string,
    public name : string,
    public description: string,
    public photoAddress:string,
    public likes? : number
    )
    {
       this.likes =0;
    }
}