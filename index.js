import { EMPLOYEES } from './MOCK_DATA.js';
import {
    render,
    handleChangeData,
    // handleSortAZ,
    // handleSortZA,
    handleSort,
    handleAvt,
    changeDataAdd,
    handleChangeNameToEmail,
    getMaxNumberInEmail,
    handleNumericValueEmail,
} from './util.js';

import { handlerFind } from './search.js';
import { debounce } from './debounce.js';
import { sort } from './action.js';
import { clearInput } from './modal.js';

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
export const message = document.querySelector('.message');
const recordSelect = document.querySelector('.record');
export const emailMember = document.querySelector('.email__member');

let page = 1;
let perPage = 20;
let statusSort;
let resultSort;
let status;

// CẮT TRANG THEO YÊU CẦU
const cutPage = (listData, page, perPage) => {
    let newData;
    if (listData === undefined) {
        console.log('>>>> ERROR');
    } else {
        newData = {
            total: listData.length,
            currentPage: page,
            records: listData.slice(
                (page - 1) * perPage,
                (page - 1) * perPage + perPage,
            ),
        };
    }
    return newData;
};
const updatePerPageDOM = (listData, page, perPage, check) => {
    if (check === true) {
        // hiển thị page cho next
        pageDOM.innerHTML = `${page * perPage} - ${(page - 1) * perPage + 1}/${
            listData.length
        }`;
    } else {
        // hiển thị page cho preview
        pageDOM.innerHTML = `${listData.length} - ${(page - 1) * perPage + 1}/${
            listData.length
        }`;
    }
};
// XỬ LÝ NEXT: VỚI NEXT VÀ PREVIEW KHÔNG TRUYỀN BIẾN PAGE
const handleNext = (listData, perPage) => {
    page++;
    const maxPage = Math.ceil(listData.length / perPage);
    if (page === 1) {
        updatePerPageDOM(listData, page, perPage, true);
        btnPreview.disabled = true;
        btnNext.disabled = false;
    } else if (page > 1 && page < maxPage) {
        updatePerPageDOM(listData, page, perPage, false);
        btnNext.disabled = false;
        btnPreview.disabled = false;
    } else {
        updatePerPageDOM(listData, page, perPage, false);
        btnNext.disabled = true;
        btnPreview.disabled = false;
    }
    return cutPage(listData, page, perPage);
};
// XỬ LÝ PREVIEW
const handlePreview = (listData, perPage) => {
    page--;
    const maxPage = Math.ceil(listData.length / perPage);
    if (page === 1) {
        updatePerPageDOM(listData, page, perPage, true);
        btnPreview.disabled = true;
        btnNext.disabled = false;
    } else if (page > 1 && page < maxPage) {
        updatePerPageDOM(listData, page, perPage, false);
        btnNext.disabled = false;
        btnPreview.disabled = false;
    } else {
        updatePerPageDOM(listData, page, perPage, false);
        btnNext.disabled = true;
        btnPreview.disabled = false;
    }
    return cutPage(listData, page, perPage);
};
// RENDER
const renderHTML = (listData) => {
    card.innerHTML = render(listData);
};
const sortByName = (listDataSort, page, perPage) => {
    resultSort = listDataSort;
    renderHTML(cutPage(resultSort, page, perPage).records);
};
// CẬP NHẬT LẠI TRANG WEB
const updateDOM = (listData, perPage) => {
    // DEFAULT
    if (cutPage(listData, page, perPage) === undefined) {
        console.log('>>> ERROR');
    } else {
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
            sortByName(handleSort(listData), 1, perPage);
            updatePerPageDOM(listData, 1, perPage, true);
            statusSort = true;
        };
        // SORT ZA
        btnSortZA.onclick = (e) => {
            e.preventDefault();
            sortByName(handleSort(listData).reverse(), 1, perPage);
            updatePerPageDOM(listData, 1, perPage, true);
            statusSort = false;
        };
        // ------- HIỂN THỊ EMAIL Ở Ô EMAIL KHI NGƯỜI DÙNG NHẬP ----------
        const setEmailDebounce = () => {
            const email = handleChangeNameToEmail(nameMember.value);
            const maxNumberEmail = getMaxNumberInEmail(listData, email);
            const newEmail = handleNumericValueEmail(maxNumberEmail, email); // OK
            if (nameMember.value.trim() === '') {
                emailMember.value = '';
            } else {
                emailMember.value = newEmail;
            }
        };
        nameMember.onkeydown = debounce(setEmailDebounce, 400);
        nameMember.oninput = (e) => {
            if (e.target.value) {
                message.innerHTML = '';
            }
        };
        /// ---------------------------------------------------------------
    }
};
// MẶC ĐỊNH KHI CHẠY LÊN
const app = () => {
    let result;
    const dataAfterChange = handleChangeData(total);
    // ---------------------SEARCH----------------------
    const updatePageDomAndBtnNextWhenSearch = (list, perPage) => {
        if (list.length - perPage <= 0) {
            btnNext.disabled = true;
            updatePerPageDOM(result, page, perPage, false);
        } else {
            btnNext.disabled = false;
            updatePerPageDOM(result, page, perPage, true);
        }
    };
    const searchDebounce = () => {
        page = 1;
        let userValue = inputSearch.value.replace(/\s+/g, '').toLowerCase();
        let resultSearch;
        if (userValue !== '') {
            resultSearch = handlerFind(dataAfterChange, userValue);
            if (resultSearch.length !== 0) {
                result = resultSearch;
            } else {
                alert('Input data is empty!');
                result = dataAfterChange;
            }
        } else {
            result = dataAfterChange;
        }
        clearInput();
        updateDOM(result, perPage);
        updatePageDomAndBtnNextWhenSearch(result, perPage);
        status = true;
    };
    inputSearch.onkeyup = debounce(searchDebounce, 400);
    // ---------------------ADD--------------------------
    const resultDataAdd = (listData) => {
        const valueName = nameMember.value;
        const valueJob = jobPosition.value;
        return changeDataAdd(listData, valueName, valueJob, message);
    };
    btnAdd.onclick = (e) => {
        page = 1;
        e.preventDefault();
        // ------------------------------------------
        // THỰC HIỆN THÊM -> GỌI LẠI SORT Ở BƯỚC 2
        // NẾU NHƯ NEWDATA THỎA MÃN ĐIỀU KIỆN SORT -> HIỂN THỊ NEWDATA LÀ CÁI MỚI NHƯNG ĐÃ SORT
        // NẾU NHƯ NEWDATA KHÔNG THỎA MÃN ĐIỀU KIỆN SORT THÌ HIỂN THỊ NEWDATA KHÔNG SORT
        if (status === true) {
            result = resultDataAdd(dataAfterChange);
            updateDOM(result, perPage);
            updatePerPageDOM(result, page, perPage, true);
            if (page === 1) {
                btnPreview.disabled = true;
            }
        } else {
            if (statusSort === true) {
                result = resultDataAdd(resultSort);
                const newDataAddSortAZ = handleSort(result);
                updateDOM(newDataAddSortAZ, perPage);
                updatePerPageDOM(newDataAddSortAZ, 1, perPage, true);
            } else if (statusSort === false) {
                result = resultDataAdd(resultSort);
                const newDataAddSortZA = handleSort(result).reverse();
                updateDOM(newDataAddSortZA, perPage);
                updatePerPageDOM(newDataAddSortZA, 1, perPage, true);
            } else if (statusSort === undefined) {
                result = resultDataAdd(dataAfterChange);
                if (result === undefined) {
                    console.log('>>> Error');
                } else {
                    updateDOM(result, perPage);
                    updatePerPageDOM(result, 1, perPage, true);
                }
            } else {
                console.log(' >>> Error Add Data');
            }
        }

        clearInput();
        status = false;
        // -------------------------------------------
    };
    // ---------------------DEFAULT----------------------
    const onLoadDefault = (listData, perPage) => {
        if (page === 1) {
            btnPreview.disabled = true;
        }
        updateDOM(listData, perPage);
        updatePerPageDOM(listData, 1, perPage, true);
    };
    onLoadDefault(dataAfterChange, perPage);
    // ---------------------RECORD--------------------------
    recordSelect.onclick = () => {
        sort.classList.remove('active');
    };
    recordSelect.onchange = (e) => {
        inputSearch.value = '';
        const newPerPage = Number(e.target.value);
        perPage = newPerPage;
        if (status === true) {
            updatePageDomAndBtnNextWhenSearch(result, perPage);
            onLoadDefault(result, perPage);
        } else if (status === false) {
            onLoadDefault(result, perPage);
        } else if (status === undefined) {
            onLoadDefault(dataAfterChange, perPage);
        } else {
            console.log('>>> Error');
        }
    };
    //---------------------------------------------------
};

app();
