export interface Trolleymovement {
    data: [
        id:number,
        image:string,
        bleTagId:string,
        trolleyModel:string,
        typeOfParts:string,
        previousArea:string,
        currentArea:string,
        arrivalTime:string
    ],
    totalRecords:number
}


export interface TrolleyArea{
    name:string
}