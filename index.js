import { EMPLOYEES } from './MOCK_DATA.js';
import {
    render,
    changeDataAdd,
    handlerID,
    handleDataAdd,
    handleChangeData,
    handleSortAZ,
    handleSortZA,
    changeEnglish,
} from './util.js';

const total = EMPLOYEES;

const card = document.querySelector('.card');
const inputSearch = document.querySelector('.search__input');
const btnNext = document.querySelector('.next');
const btnPreview = document.querySelector('.preview');
const pageDOM = document.querySelector('.nav__page--text');
const btnSortAZ = document.querySelector('.atoZ');
const btnSortZA = document.querySelector('.ztoA');
const nameMember = document.querySelector('.name__member');
const jobPosition = document.querySelector('.job__position');
const btnAdd = document.querySelector('.add__btn');
const message = document.querySelector('.message');
const recordBtn = document.querySelector('.record__btn');
const recordSelect = document.querySelector('.record');

let page = 1;
let perPage = 20; // giá trị mặc định

// CẮT TRANG THEO YÊU CẦU
const cutPage = (listData, page, perPage) => {
    return {
        total: listData.length,
        currentPage: page,
        records: listData.slice(
            (page - 1) * perPage,
            (page - 1) * perPage + perPage,
        ),
    };
}; // => OK

// CUT TRANG VÀ RENDER LẠI
// const cutAndRender = (data) => {
//     let resultRender = [...cutPage(data, page, record)];
//     card.innerHTML = render(resultRender);
//     return resultRender;
// };

// XỬ LÝ NEXT: VỚI NEXT VÀ PREVIEW KHÔNG TRUYỀN BIẾN PAGE
const handleNext = (listData, perPage) => {
    if (page < Math.ceil(listData.length / perPage)) {
        page++;
        if (page * perPage > listData.length) {
            pageDOM.innerHTML = `${listData.length} - ${
                page * perPage - perPage + 1
            }/${listData.length}`;
        } else {
            pageDOM.innerHTML = `${page * perPage} - ${
                page * perPage - perPage + 1
            }/${listData.length}`;
        }
    } else {
        page = Math.ceil(listData.length / perPage);
    }
    return cutPage(listData, page, perPage);
};

// XỬ LÝ LÙI
const handlePreview = (listData, perPage) => {
    if (page > 1) {
        page--;
        pageDOM.innerHTML = `${page * perPage} - ${
            page * perPage - perPage + 1
        }/${(listData, listData.length)}`;
    } else {
        page = 1;
    }
    return cutPage(listData, page, perPage);
};

// XỬ LÝ RECORD
const handleRecord = () => {
    perPage = recordSelect.value;
    return perPage;
}; // Khi record thì perPage sẽ được cập nhật

// RENDER
const renderHTML = (listData) => {
    card.innerHTML = render(listData);
};

// CẬP NHẬT LẠI TRANG WEB
const updateDOM = (listData, perPage) => {
    // DEFAULT
    renderHTML(cutPage(listData, page, perPage).records);
    // NEXT
    btnNext.onclick = (e) => {
        e.preventDefault();
        const records = handleNext(listData, perPage).records;
        renderHTML(records);
    };
    // PREVIEW
    btnPreview.onclick = (e) => {
        e.preventDefault();
        const record = handlePreview(listData, perPage).records;
        renderHTML(record);
    };
    // SORT AZ
    btnSortAZ.onclick = (e) => {
        e.preventDefault();
        cutAndRender(handleSortAZ(listData));
    };
    // SORT ZA
    btnSortZA.onclick = (e) => {
        e.preventDefault();
        cutAndRender(handleSortZA(listData));
    };
};
// XỬ LÝ TÌM KIẾM
const handlerFind = (listData, keyword) => {
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

function debounce(callBack, delay = 700) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            callBack(...args);
        }, delay);
    };
}

// MẶC ĐỊNH KHI CHẠY LÊN
window.onload = () => {
    const dataAfterChange = handleChangeData(total);
    updateDOM(dataAfterChange, perPage);
    pageDOM.innerHTML = `${perPage} - ${page}/${dataAfterChange.length}`;

    // TÌM KIẾM TRẢ VỀ DỮ LIỆU
    const updateDebounceSearch = debounce((enteredData) => {
        const valueInput = enteredData.replace(/\s+/g, '').toLowerCase(); // LẤY DỮ LIỆU Ô INPUT NHẬP VÀO
        if (valueInput !== '') {
            const resultSearch = handlerFind(dataAfterChange, valueInput); // MẢNG CHỨA LIỆU PHÙ HỢP
            updateDOM(resultSearch, perPage);
            nameMember.value = '';
            jobPosition.value = '';
        }
    });

    inputSearch.addEventListener('keyup', (e) => {
        updateDebounceSearch(e.target.value);
    });

    btnAdd.onclick = (e) => {
        e.preventDefault();
        const valueName = nameMember.value;
        const valueJob = jobPosition.value;
        updateDOM(
            changeDataAdd(dataAfterChange, valueName, valueJob, message),
            perPage,
        );
    };
};
