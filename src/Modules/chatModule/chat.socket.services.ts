



export class chatSocketServices{
    constructor() {}
    sayHi=(message:string,callback:Function)=>{
            
            console.log(message);

            callback('Hello')
    }

}