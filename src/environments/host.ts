export const getHost = (env:string):string => {
    switch (env) {
        case 'LOCAL':
            return 'http://localhost:3000';
        case 'STAGING':
            return 'n/a';
        case 'PROD':
            return 'http://aip.upcode-api.co';
        default:
            return null;
    }
}