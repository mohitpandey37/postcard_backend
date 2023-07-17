import { ParsedQs } from 'qs';

export default function Pagnation(params: any) {
    const pageParam: string | ParsedQs | string[] | ParsedQs[] = params.page || "1";
    const limitParam: string | ParsedQs | string[] | ParsedQs[] = params.limit || "10";

    // Convert string type into integer
    let page = typeof pageParam === 'string' ? parseInt(pageParam, 10) : undefined;
    let limit = typeof limitParam === 'string' ? parseInt(limitParam, 10) : undefined;
    let skip: number = (page && page > 1) ? (page - 1) * (limit || 0) : 0;

    return { page: page, limit: limit, skip: skip }
}