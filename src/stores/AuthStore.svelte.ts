let authCode = $state("");
let backendToken = $state("");

export const AuthStore = {
    get authCode() {
        return authCode;
    },
    set authCode(value: string) {
        authCode = value;
    },
    get backendToken() {
        return backendToken;
    },
    set backendToken(value: string) {
        backendToken = value;
    }
};