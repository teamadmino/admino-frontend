import { cloneDeep, isEqual } from 'lodash';
import { isObject } from './isobject';

export function deepCompare(target, newObj, excludedKeys: string[] = [], diff = {}) {
    // target = cloneDeep(target);
    if (isObject(newObj)) {
        // if (isObject(target)) {
        if (target === null || target === undefined) {
            target = {};
        }
        for (const key in newObj) {
            if (isObject(newObj[key]) && excludedKeys.indexOf(key) === -1) {
                const subDiff = deepCompare(target[key], newObj[key], excludedKeys);
                // console.log(key);
                // console.log(subDiff);
                if (Object.keys(subDiff).length > 0) {
                    diff[key] = subDiff;
                }
            } else if (Array.isArray(newObj[key])) {
                if (!isEqual(target[key], newObj[key])) {
                    diff[key] = { old: target[key], new: newObj[key] };
                }
            } else {
                if (!isEqual(target[key], newObj[key])) {
                    diff[key] = { old: target[key], new: newObj[key] };
                }
                // delete target[key];
            }
        }
        // }
        // } else {
        //     diff = { old: null, new: newObj };
        // }
    }

    return diff;
}
