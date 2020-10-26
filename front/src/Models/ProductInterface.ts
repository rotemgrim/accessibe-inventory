import UserRequestInterface from "./UserRequestInterface";


export default interface ProductInterface {
    _id: string;
    isbn: string;
    name: string;
    quantity: number;
    requests: UserRequestInterface[];

    stringScore?: number;
    activeRequested?: number;
}

