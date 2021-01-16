"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDuplicatedElements = exports.isAwsIotPattern = void 0;
const isAwsIotPattern = (value) => {
    const awsIotPattern = /^[a-zA-Z\d-_:]+$/;
    if (!awsIotPattern.test(value)) {
        return false;
    }
    return true;
};
exports.isAwsIotPattern = isAwsIotPattern;
const isDuplicatedElements = (array) => {
    const firsDuplicatedElement = array.find((e, index) => {
        const rightRest = array.slice(index + 1);
        if (rightRest.length > 0) {
            return rightRest.includes(e);
        }
    });
    if (firsDuplicatedElement)
        return true;
    return false;
};
exports.isDuplicatedElements = isDuplicatedElements;
