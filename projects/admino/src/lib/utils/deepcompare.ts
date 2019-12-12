import { cloneDeep, isEqual } from 'lodash';
import { isObject } from './isobject';

export function deepCompare(target, source, diff = {}) {
    // target = cloneDeep(target);
    if (isObject(source)) {
        if (isObject(target)) {
            for (const key in source) {
                if (isObject(source[key])) {
                    const subDiff = deepCompare(target[key], source[key]);
                    // console.log(key);
                    // console.log(subDiff);
                    if (Object.keys(subDiff).length > 0) {
                        diff[key] = subDiff;
                    }
                } else if (Array.isArray(source[key])) {
                    if (!isEqual(target[key], source[key])) {
                        diff[key] = { old: target[key], new: source[key] };
                    }
                } else {
                    if (target[key] !== source[key]) {
                        diff[key] = { old: target[key], new: source[key] };
                    }
                    // delete target[key];
                }
            }
        } else {
            diff = { old: null, new: source };
        }
    }

    return diff;
}
