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
export const nameMember = document.querySelector('.name__member');
export const jobPosition = document.querySelector('.job__position');
const btnAdd = document.querySelector('.add__btn');
const message = document.querySelector('.message');
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
    page++;
    if (page < Math.ceil(listData.length / perPage)) {
        if (page * perPage > listData.length) {
            pageDOM.innerHTML = `${listData.length} - ${
                page * perPage - perPage + 1
            }/${listData.length}`;
        } else {
            pageDOM.innerHTML = `${page * perPage} - ${
                page * perPage - perPage + 1
            }/${listData.length}`;
        }
        btnPreview.disabled = false;
    } else {
        page = Math.ceil(listData.length / perPage);
        btnNext.disabled = true;
    }
    return cutPage(listData, page, perPage);
};

// XỬ LÝ PREVIEW
const handlePreview = (listData, perPage) => {
    page--;

    if (page > 1) {
        pageDOM.innerHTML = `${page * perPage} - ${
            page * perPage - perPage + 1
        }/${(listData, listData.length)}`;
        btnNext.disabled = false;
    } else {
        page = 1;
        btnPreview.disabled = true;
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
    // ---------------------SEARCH----------------------
    const updateDebounceSearch = debounce((enteredData, perPage) => {
        page = 1;
        const valueInput = enteredData.replace(/\s+/g, '').toLowerCase(); // LẤY DỮ LIỆU Ô INPUT NHẬP VÀO
        if (valueInput !== '') {
            const resultSearch = handlerFind(dataAfterChange, valueInput);
            console.log(resultSearch.length);
            if (resultSearch.length !== 0) {
                updateDOM(resultSearch, perPage);
                pageDOM.innerHTML = `${perPage} - ${page}/${resultSearch.length}`;
            } else {
                alert('Input data is empty!');
            }
        }
        nameMember.value = '';
        jobPosition.value = '';
    });
    const onClickSearch = (perPage) => {
        inputSearch.addEventListener('keyup', (e) => {
            updateDebounceSearch(e.target.value, perPage);
        });
    };
    // ---------------------ADD--------------------------
    const onClickAdd = (perPage) => {
        btnAdd.onclick = (e) => {
            page = 1;
            e.preventDefault();
            console.log(perPage);
            const valueName = nameMember.value;
            const valueJob = jobPosition.value;
            // -------------------------------------------
            updateDOM(
                changeDataAdd(dataAfterChange, valueName, valueJob, message),
                perPage,
            );
            pageDOM.innerHTML = `${perPage} - ${page}/${resultSearch.length}`;
            // -------------------------------------------
        };
    };
    // ---------------------RECORD--------------------------
    recordSelect.onchange = () => {
        const perPageChange = Number(recordSelect.value);

        updateDOM(dataAfterChange, perPageChange);
        onClickSearch(perPageChange);
        onClickAdd(perPageChange);
    };
    // ---------------------DEFAULT----------------------
    const onLoadDefault = (listData, perPage) => {
        updateDOM(listData, perPage);
        onClickSearch(perPage);
        onClickAdd(perPage);
        pageDOM.innerHTML = `${perPage} - ${page}/${dataAfterChange.length}`;
    };
    onLoadDefault(dataAfterChange, perPage);
    //---------------------------------------------------
};

App();
