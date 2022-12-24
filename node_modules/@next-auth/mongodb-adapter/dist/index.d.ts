import { ObjectId } from "mongodb";
import type { Adapter } from "next-auth/adapters";
import type { MongoClient } from "mongodb";
export interface MongoDBAdapterOptions {
    collections?: {
        Users?: string;
        Accounts?: string;
        Sessions?: string;
        VerificationTokens?: string;
    };
    databaseName?: string;
}
export declare const defaultCollections: Required<Required<MongoDBAdapterOptions>["collections"]>;
export declare const format: {
    /** Takes a mongoDB object and returns a plain old JavaScript object */
    from<T = Record<string, unknown>>(object: Record<string, any>): T;
    /** Takes a plain old JavaScript object and turns it into a mongoDB object */
    to<T_1 = Record<string, unknown>>(object: Record<string, any>): T_1 & {
        _id: ObjectId;
    };
};
/** Converts from string to ObjectId */
export declare function _id(hex?: string): ObjectId;
export declare function MongoDBAdapter(client: Promise<MongoClient>, options?: MongoDBAdapterOptions): Adapter;
