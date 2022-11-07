export interface Locationtype {
    lcode: string,
    location: string,
    description: string,
    address: string,
    apt: string,
    city: string,
    state: string,
    postal: number,
    country: string,
    action: any
}

export interface LocationType {
    locationCode: string,
    name: string,
    description: string,
    address: string,
    suite: string,
    city: string,
    state: string,
    pincode: number,
    country: string,
    longitude:number,
    latitude:number

}

export interface PostLocationType {
    id: number,
    name: string,
    description: string,
    address: string,
    suite: string,
    city: string,
    state: string,
    pincode: 0,
    country: string,
    locationCode: string,
    longitude: 0,
    latitude: 0
}

export interface LocationName{
    name:string
}

export interface BuildingType{
    buildingCode:string,
    name:string,
   
}

export interface FloorType{
    id:number,
    name:string,
}
export interface BuildingDropdown{
    id:number,
    name:string
}

export interface FloorDropdown{
    id:number,
    name:string
}
export interface FloorList{
    floorCode:string,
    name:string
}

export interface SectionList{
    sectionCode:string,
    name:string
}
