import { changeEnglish } from './util.js';

// XỬ LÝ TÌM KIẾM
export const handlerFind = (listData, keyword) => {
    let resultSearch = [];
    listData.forEach((value) => {
        const fullName = String(value.name).replace(/\s+/g, '').toLowerCase();
        const fullNameWithoutAccents = changeEnglish(fullName);
        const email = String(value.email).replace(/\s+/g, '').toLowerCase();
        const job = String(value.job).replace(/\s+/g, '').toLowerCase();
        if (fullName.indexOf(keyword) > -1) {
            resultSearch.push(value);
        } else if (
            fullNameWithoutAccents.indexOf(changeEnglish(keyword)) > -1
        ) {
            resultSearch.push(value);
        } else if (email.indexOf(keyword) > -1) {
            resultSearch.push(value);
        } else if (job.indexOf(keyword) > -1) {
            resultSearch.push(value);
        }
    });
    return resultSearch;
};

export function debounce(callBack, delay = 700) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            callBack(...args);
        }, delay);
    };
}
