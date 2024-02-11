export const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,32}$/;
export const NAME_REGEX = /^[a-zA-Z ]{2,128}$/;
// eslint-disable-next-line no-useless-escape
export const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PHONE_REGEX = /^\d{10}$/;

export const ONE_UPPERCASE = /.*[A-Z].*/
export const ONE_LOWERCASE = /.*[a-z].*/
export const ONE_DIGIT = /.*[0-9].*/
export const ONE_SPECIAL = /.*[#?!@$ %^&*-].*/
export const AT_LEAST_8_32 = /^.{8,32}$/