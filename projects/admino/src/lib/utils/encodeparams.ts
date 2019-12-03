export function encodeParams(params) {
    const encoded = {};
    Object.keys(params).forEach((key) => {
        encoded[key] = encodeURIComponent(params[key]);
    })
    return encoded;
}


export function decodeParams(params) {
    const decoded = {};
    Object.keys(params).forEach((key) => {
        decoded[key] = decodeURIComponent(params[key]);
    })
    return decoded;
}