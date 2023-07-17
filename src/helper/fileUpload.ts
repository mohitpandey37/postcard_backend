import { Request, Response } from "express";
const multer = require("multer");
const MyResponse = require('./response');

const storage = multer.diskStorage({
    destination: function (req: Request, file: any, cb: any) {
        cb(null, 'uploads/')
    },
    filename: function (req: Request, file: any, cb: any) {
        let extNames = file.originalname.split(/\.(?=[^\.]+$)/);
        let filename = `${Date.now().toString()}.${extNames[1]}`;
        cb(null, file.fieldname + '_' + filename)
    }
})

// multer to upload multiple files with limit of 5
const upload = multer({
    limits: {
        fileSize: 10 * 1024 * 1024,
    }, 
    storage: storage
    }).array("file", 5)


let ImageUpload = async (req: Request, res: Response) => {
    const uploadedFile = req.files;
    // Process the uploaded file as needed
    // console.log(uploadedFile);
    return new MyResponse(200, "Image uploaded successfully.", true).successResponse(res);
}

module.exports = {
    ImageUpload,
    upload
}