import { Request, Response } from "express";
const postcardModel = require("./postcard_model");
import { validationResult } from 'express-validator';
import { ObjectId } from "mongoose";
const MyResponse = require('../../helper/response');
const { getPostCardJwtToken, jwtverify } = require("../../helper/jwt");
import isValidObjectId from "../../helper/validateObjectId";
import { ParsedQs } from 'qs';
import Pagination from "../../helper/pagination";
import { triggerAsyncId } from "async_hooks";

// interface for postcard
interface PostcardInterface {
    recipient: string,
    street_1: string,
    street_2?: string,
    city: string,
    state: string,
    zipcode: number,
    message: string,
    created_by: ObjectId
}

// ============= create Postcard ================ 
let createPostcard = async (req: Request, res: Response) => {
    try {

        let authUser: any = req.headers.authUser; let body = req.body;
        // request body validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            return new MyResponse(406, errors.array()[0].msg, false, { errors: errors.array() }).errorResponse(res);

        } else {
            let card: PostcardInterface = {
                recipient: body.recipient,
                street_1: body.street_1,
                street_2: body.street_2,
                city: body.city,
                state: body.state,
                zipcode: body.zipcode,
                message: body.message,
                created_by: authUser._id
            }
            // create postcard
            await new postcardModel(card).save().then((doc: any) => {
                if (doc) {
                    return new MyResponse(201, "Post card created successfully", true, doc).successResponse(res)
                } else {
                    return new MyResponse(406, "Not created", false).errorResponse(res)
                }
            })

        }
    } catch (error) {
        return new MyResponse(500, "server error", false).errorResponse(res);
    }
}

// ============= Get Postcards ================ 
let getAllPostCards = async (req: Request, res: Response) => {
    try {
        const authUser: any = req.headers.authUser;
        const value: string | ParsedQs | string[] | ParsedQs[] = req.query.q || "";
        const filter: any[] = [];

        // Pagination calculation
        let { page, limit, skip }: any = Pagination(req.query);

        // Query null value check
        if (page === 0 || limit === 0) {
            return new MyResponse(422, "page and limit can't be 0.", false).errorResponse(res);
        }

        // Searching data by recipient name, state, city or zipcode
        !value ? filter.push({}) :
            filter.push({ recipient: { $regex: value, $options: 'xi' } })
        filter.push({ city: { $regex: value, $options: 'xi' } })
        filter.push({ state: { $regex: value, $options: 'xi' } });
        filter.push({ zipcode: { $regex: value, $options: 'xi' } });

        await postcardModel.aggregate([{
            $match: {
                created_by: authUser._id,
                $or: [...filter]
            }
        }]).sort({ created_at: -1 }).skip(skip).limit(limit)
            .then((doc: any) => {
                return new MyResponse(200, "Post card retrieved successfully", true, doc).successResponse(res)
            }).catch((error: any) => {
                return new MyResponse(422, error.message, false).errorResponse(res);
            })
    } catch (error) {
        return new MyResponse(500, "server error", false).errorResponse(res);
    }
}

// ============= Get Postcard by id ================ 
let getPostData = async (req: Request, res: Response) => {
    try {
        let decoded = await jwtverify(req.params.token);
        if (!decoded) {
            return new MyResponse(404, "Link has been expired", false).errorResponse(res)
        } else {
            let veryfiObjectId = isValidObjectId(decoded.id);
            if (veryfiObjectId) {
                await postcardModel.findOne({ _id: decoded.id })
                    .then((doc: any) => {
                        return new MyResponse(200, "Post card retrieved successfully", true, doc).successResponse(res)
                    }).catch((error: any) => {
                        return new MyResponse(422, error.message, false).errorResponse(res);
                    })
            } else {
                return new MyResponse(406, "Invalid ObjectId", false).errorResponse(res);
            }
        }
    } catch (error) {
        return new MyResponse(500, "server error", false).errorResponse(res);
    }

}


// ============= Get Postcard token ================ 
let getPostCardToken = async (req: Request, res: Response) => {
    try {
        let authUser: any = req.headers.authUser;
        let postId = req.params.id;
        let veryfiObjectId = isValidObjectId(postId);
        if (veryfiObjectId) {
            await postcardModel.findOne({ _id: postId, created_by: authUser._id })
                .then(async (doc: any) => {
                    let token = await getPostCardJwtToken(doc._id.toString())
                    let link  = `http://localhost:3000/postcard/preview/${token}`;
                    return new MyResponse(200, "Token generated.", true, { link: link }).successResponse(res)
                }).catch((error: any) => {
                    return new MyResponse(422, error.message, false).errorResponse(res);
                })
        }
    } catch (error) {
        return new MyResponse(500, "server error", false).errorResponse(res);
    }
}
module.exports = {
    createPostcard,
    getAllPostCards,
    getPostData,
    getPostCardToken
}