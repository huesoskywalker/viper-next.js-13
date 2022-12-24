"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBAdapter = exports._id = exports.format = exports.defaultCollections = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const mongodb_1 = require("mongodb");
exports.defaultCollections = {
    Users: "users",
    Accounts: "accounts",
    Sessions: "sessions",
    VerificationTokens: "verification_tokens",
};
exports.format = {
    /** Takes a mongoDB object and returns a plain old JavaScript object */
    from(object) {
        const newObject = {};
        for (const key in object) {
            const value = object[key];
            if (key === "_id") {
                newObject.id = value.toHexString();
            }
            else if (key === "userId") {
                newObject[key] = value.toHexString();
            }
            else {
                newObject[key] = value;
            }
        }
        return newObject;
    },
    /** Takes a plain old JavaScript object and turns it into a mongoDB object */
    to(object) {
        const newObject = {
            _id: _id(object.id),
        };
        for (const key in object) {
            const value = object[key];
            if (key === "userId")
                newObject[key] = _id(value);
            else if (key === "id")
                continue;
            else
                newObject[key] = value;
        }
        return newObject;
    },
};
/** Converts from string to ObjectId */
function _id(hex) {
    if ((hex === null || hex === void 0 ? void 0 : hex.length) !== 24)
        return new mongodb_1.ObjectId();
    return new mongodb_1.ObjectId(hex);
}
exports._id = _id;
function MongoDBAdapter(client, options = {}) {
    const { collections } = options;
    const { from, to } = exports.format;
    const db = (async () => {
        const _db = (await client).db(options.databaseName);
        const c = { ...exports.defaultCollections, ...collections };
        return {
            U: _db.collection(c.Users),
            A: _db.collection(c.Accounts),
            S: _db.collection(c.Sessions),
            V: _db.collection(c === null || c === void 0 ? void 0 : c.VerificationTokens),
        };
    })();
    return {
        async createUser(data) {
            const user = to(data);
            await (await db).U.insertOne(user);
            return from(user);
        },
        async getUser(id) {
            const user = await (await db).U.findOne({ _id: _id(id) });
            if (!user)
                return null;
            return from(user);
        },
        async getUserByEmail(email) {
            const user = await (await db).U.findOne({ email });
            if (!user)
                return null;
            return from(user);
        },
        async getUserByAccount(provider_providerAccountId) {
            const account = await (await db).A.findOne(provider_providerAccountId);
            if (!account)
                return null;
            const user = await (await db).U.findOne({ _id: new mongodb_1.ObjectId(account.userId) });
            if (!user)
                return null;
            return from(user);
        },
        async updateUser(data) {
            const { _id, ...user } = to(data);
            const result = await (await db).U.findOneAndUpdate({ _id }, { $set: user }, { returnDocument: "after" });
            return from(result.value);
        },
        async deleteUser(id) {
            const userId = _id(id);
            const m = await db;
            await Promise.all([
                m.A.deleteMany({ userId }),
                m.S.deleteMany({ userId: userId }),
                m.U.deleteOne({ _id: userId }),
            ]);
        },
        linkAccount: async (data) => {
            const account = to(data);
            await (await db).A.insertOne(account);
            return account;
        },
        async unlinkAccount(provider_providerAccountId) {
            const { value: account } = await (await db).A.findOneAndDelete(provider_providerAccountId);
            return from(account);
        },
        async getSessionAndUser(sessionToken) {
            const session = await (await db).S.findOne({ sessionToken });
            if (!session)
                return null;
            const user = await (await db).U.findOne({ _id: new mongodb_1.ObjectId(session.userId) });
            if (!user)
                return null;
            return {
                user: from(user),
                session: from(session),
            };
        },
        async createSession(data) {
            const session = to(data);
            await (await db).S.insertOne(session);
            return from(session);
        },
        async updateSession(data) {
            const { _id, ...session } = to(data);
            const result = await (await db).S.findOneAndUpdate({ sessionToken: session.sessionToken }, { $set: session }, { returnDocument: "after" });
            return from(result.value);
        },
        async deleteSession(sessionToken) {
            const { value: session } = await (await db).S.findOneAndDelete({
                sessionToken,
            });
            return from(session);
        },
        async createVerificationToken(data) {
            await (await db).V.insertOne(to(data));
            return data;
        },
        async useVerificationToken(identifier_token) {
            const { value: verificationToken } = await (await db).V.findOneAndDelete(identifier_token);
            if (!verificationToken)
                return null;
            // @ts-expect-error
            delete verificationToken._id;
            return verificationToken;
        },
    };
}
exports.MongoDBAdapter = MongoDBAdapter;
