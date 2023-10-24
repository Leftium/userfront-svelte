// Reexport your entry components here
// Import the Userfront singleton from the @userfront/toolkit library
// rather than @userfront/core - this ensures CoreJS and the toolkit
// can talk to each other.
import Userfront from '@userfront/toolkit';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { userfrontCookieToTokens, verifyToken } from './parse-userfront-cookies';

export {
    Userfront,
    userfrontCookieToTokens,
    verifyToken,
}