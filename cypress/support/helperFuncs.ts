import _ from "lodash"
import { Alias } from "./helperTypes"

export function expectBodyKeyEqualObjectKey(body: any, object: any | string) {
    if (isAliasObject(object)) {
        cy.get(object).then((object) => {
            Object.keys(object).forEach((key: any) => {
                expect(body[key]).to.deep.equal(object[key])
            })
        })
    } else {
        Object.keys(object).forEach((key: any) => {
            expect(body[key]).to.deep.equal(object[key])
        })
    }
}

export function buildProps(
    body: any,
    object: any,
    properties: {
        propPath?: string | undefined
        propKeys?: {
            reqKey: string
            objKey: string
        }
    }
) {
    let { propPath } = properties
    const { propKeys } = properties
    propPath = isPathInTarget(object, propPath)
    if (propKeys) {
        handleKeys(body, object, propKeys, propPath)
    } else if (propPath) {
        handlePath(body, object, propPath)
    } else {
        handleObject(body, object)
    }
}

function handleKeys(
    body: any,
    object: any,
    keys: { reqKey: string; objKey: string },
    path: string | undefined
) {
    const { objKey, reqKey } = keys
    const propertyValue = {
        [objKey]: _.get(body, reqKey),
    }
    if (path) {
        handlePath(propertyValue, object, path)
    } else {
        handleObject(propertyValue, object)
    }
}
function handlePath(body: any, object: any, path: string) {
    _.set(object, path, _.concat(body))
    return object
}
function handleObject(body: any, object: any) {
    Object.assign(object, body)
    return object
}
export function isPathInTarget(object: object | string, path: string | undefined) {
    if (!path) return undefined
    const cleanPath = path.replace(/\.?[^\.\[]+$/, "")
    return _.has(object, cleanPath) ? cleanPath : undefined
}
export function isAliasObject(object: any): object is Alias<string> {
    return typeof object === "string" && object.startsWith("@")
}

export function buildObjectProperties(
    body: any,
    object: any,
    properties: {
        propPath?: string | undefined
        propKeys?: {
            reqKey: string
            objKey: string
        }
        // take the alias outta here
        // why?
        alias?: string
    }
) {
    const { propPath, propKeys, alias } = properties
    const objectProps = { propPath, propKeys }
    if (alias) {
        cy.wrap(object)
            .then((object) => {
                buildProps(body, object, objectProps)
            })
            .as(alias)
    } else if (isAliasObject(object)) {
        cy.get(object).then((object: any) => {
            buildProps(body, object, objectProps)
        })
    } else {
        buildProps(body, object, objectProps)
    }
}

export function expectInterceptionEqualRequestOptions(
    interceptionRequest: any,
    requestOptions: any
) {
    const {
        url: requestUrl,
        method: requestMethod,
        headers: requestHeaders,
        body: requestBody,
    } = interceptionRequest
    const { reqUrl, reqHeaders, reqMethod, reqBody } = requestOptions
    // Request
    // Keys in the request? what do you think?
    cy.get(`${reqBody}`).then((object: any) => {
        expect(requestUrl).to.include(reqUrl)
        expect(requestMethod).to.equal(reqMethod)
        expect(requestHeaders).to.include(reqHeaders)
        // we can pass keys here, check it out then
        expectBodyKeyEqualObjectKey(requestBody, object)
    })
}
