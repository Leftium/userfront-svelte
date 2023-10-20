// Reexport your entry components here
import Userfront from '@userfront/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { userfrontCookieToTokens, verifyToken } from './parse-userfront-cookies';

import SignupForm from './SignupForm.svelte'
import LoginForm from './LoginForm.svelte'
import PasswordResetForm from './PasswordResetForm.svelte'

export {
    Userfront,
    userfrontCookieToTokens,
    verifyToken,
    SignupForm,
    LoginForm,
    PasswordResetForm,
}