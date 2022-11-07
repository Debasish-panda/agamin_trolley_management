export class Addbuilding {
    id: number = 0;
    name: string = '';
    buildingCode: string = '';
    locationId: number = 0;
    buildingCoordinates: Array<any> = [
        {
            "id": 0,
            "latitude": 0,
            "longitude": 0,
            "buildingId": 0
        }
    ]
}

export class Buildingcord {
    coord:Array<any> = [
        { }
    ];
}