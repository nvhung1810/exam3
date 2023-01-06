import { EMPLOYEES } from './MOCK_DATA.js';
import {
    render,
    changeDataAdd,
    handleChangeData,
    handleSortAZ,
    handleSortZA,
} from './util.js';

import { handlerFind, debounce } from './search.js';

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

// XỬ LÝ PREVIEW
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
        renderHTML(cutPage(handleSortAZ(listData), page, perPage).records);
    };
    // SORT ZA
    btnSortZA.onclick = (e) => {
        e.preventDefault();
        renderHTML(cutPage(handleSortZA(listData), page, perPage).records);
    };
};

// MẶC ĐỊNH KHI CHẠY LÊN
const App = () => {
    const dataAfterChange = handleChangeData(total);
    let perPage = 20;

    // -------------------------------------------
    updateDOM(dataAfterChange, perPage);
    // -------------------------------------------
    const onClickSearch = (perPage) => {
        inputSearch.addEventListener('keyup', (e) => {
            updateDebounceSearch(e.target.value, perPage);
        });
    };
    const updateDebounceSearch = debounce((enteredData, perPage) => {
        page = 1;
        const valueInput = enteredData.replace(/\s+/g, '').toLowerCase(); // LẤY DỮ LIỆU Ô INPUT NHẬP VÀO
        if (valueInput !== '') {
            console.log(perPage);
            const resultSearch = handlerFind(dataAfterChange, valueInput); // MẢNG CHỨA LIỆU PHÙ HỢP
            // -------------------------------------------
            updateDOM(resultSearch, perPage);
            // -------------------------------------------
            nameMember.value = '';
            jobPosition.value = '';
        }
    });

    onClickSearch(perPage);
    // -------------------------------------------
    const onClickAdd = (perPage) => {
        btnAdd.onclick = (e) => {
            e.preventDefault();
            console.log(perPage);
            const valueName = nameMember.value;
            const valueJob = jobPosition.value;
            // -------------------------------------------
            updateDOM(
                changeDataAdd(dataAfterChange, valueName, valueJob, message),
                perPage,
            );
            // -------------------------------------------
        };
    };

    onClickAdd(perPage);

    recordSelect.onchange = () => {
        const perPageChange = Number(recordSelect.value);

        updateDOM(dataAfterChange, perPageChange);
        onClickSearch(perPageChange);
        onClickAdd(perPageChange);
    };
};

App();
