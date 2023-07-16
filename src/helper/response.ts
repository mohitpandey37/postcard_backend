// interface for response Object
interface ResponseInterFace {
    statusCode: number,
    message: string;
    status: boolean;
    data?: any,
}

//  class constructor for response
class MyResponse implements ResponseInterFace {
    statusCode: number;
    message: string;
    status: boolean;
    data?: any;
    totalCount?:number

    constructor(statusCode: number, message: string, status: boolean, data?: any) {
        this.statusCode = statusCode;
        this.message = message;
        this.status = status;
        this.data = data
    }

    //  On Success Reponse
    successResponse (res:any) {
        if (this.data) {this.totalCount = this.data.length;} 
        res.status(this.statusCode).json(this)
    }

    // On Error response
    errorResponse = (res:any) => {
        res.status(this.statusCode).json(this)
    }
}

module.exports =  MyResponse;