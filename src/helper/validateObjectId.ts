const ObjectId = require('mongoose').Types.ObjectId;

export default function isValidObjectId(id: any){

    if(ObjectId.isValid(id)){
        if((String)(new ObjectId(id)) === id)
            return true;
        return false;
    }
    return false;
}