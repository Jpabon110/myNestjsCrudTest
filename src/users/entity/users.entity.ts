export class User {
    constructor(
        public id: number,
        public name: string,
        public lastName: string,
        public rut: string,
        public address: string,
        public createdAt: Date
        )
    {}
}