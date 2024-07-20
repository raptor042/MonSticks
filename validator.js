import crypto from "crypto";
import { botToken } from "./constants.js";

export const validateInitData =  (  telegramInitData )  => {
    const initData = new URLSearchParams( telegramInitData );

    initData.sort();

    const hash = initData.get("hash" );
    initData.delete( "hash" );

    const dataToCheck = [...initData.entries()].map( ( [key, value] ) => key + "=" + value ).join( "\n" );

    const secretKey = crypto.createHmac( "sha256", "WebAppData" ).update( botToken ).digest();

    const _hash = crypto.createHmac( "sha256", secretKey ).update( dataToCheck ).digest( "hex" );

    return hash === _hash;
}

export const getUserIdFromInitData = (telegramInitData) => {
    const initData = new URLSearchParams(telegramInitData)
    return JSON.parse(initData.get("user")).id
}
