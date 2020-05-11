import { cloneDeep, isEqual } from 'lodash';
import { isObject } from './isobject';

export function deepCompare(target, newObj, excludedKeys: string[] = [], arrayCompare = false, diff = {}) {
    // target = cloneDeep(target);

    if (isObject(newObj)) {
        // if (isObject(target)) {
        if (target === null || target === undefined) {
            target = {};
        }
        for (const key of Object.keys(newObj)) {
            if (isObject(newObj[key]) && excludedKeys.indexOf(key) === -1) {
                const subDiff = deepCompare(target[key], newObj[key], excludedKeys, arrayCompare);
                // console.log(key);
                // console.log(subDiff);
                if (Object.keys(subDiff).length > 0) {
                    diff[key] = subDiff;
                }
            } else if (Array.isArray(newObj[key])) {
                // if (compareArrays) {
                //     if ((newObj[key][0] && newObj[key][0].id !== undefined)) {
                //         diff[key] = compareArrays(target[key], newObj[key]);
                //     } else if (!isEqual(target[key], newObj[key])) {
                //         diff[key] = { old: target[key], new: newObj[key] };
                //     }
                // } else {
                if (!isEqual(target[key], newObj[key])) {
                    diff[key] = { old: target[key], new: newObj[key] };
                }
                // }
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


export function compareArrays(target: any[], source) {
    if (!target) {
        target = [];
    }
    for (const item of source) {
        if (item.id) {
            const foundTargetItem = target.find((titem) => {
                return titem.id === item.id;
            });
            if (foundTargetItem) {
                target.push(deepCompare(foundTargetItem, item));
            } else {
                target.push(item);
            }
        }
    }
    return target;
}

