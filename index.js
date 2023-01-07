import { EMPLOYEES } from './MOCK_DATA.js';
import {
    render,
    handleChangeData,
    handleSortAZ,
    handleSortZA,
    changeDataAdd,
    handleChangeNameToEmail,
    getMaxNumberInEmail,
    handleNumericValueEmail,
} from './util.js';

import { handlerFind } from './search.js';
import { debounce } from './debounce.js';
import { sort } from './action.js';

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
export const emailMember = document.querySelector('.email__member');

let page = 1;
let perPage = 20;

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
};
const updatePerPageDOM = (listData, perPage, page, check) => {
    if (check === true) {
        pageDOM.innerHTML = `${page * perPage} - ${page}/${listData.length}`;
    } else {
        pageDOM.innerHTML = `${listData.length - page * perPage} - ${page}/${
            listData.length
        }`;
    }
};

// XỬ LÝ NEXT: VỚI NEXT VÀ PREVIEW KHÔNG TRUYỀN BIẾN PAGE
const handleNext = (listData, perPage) => {
    page++;
    const maxPage = Math.ceil(listData.length / perPage);
    if (page < maxPage) {
        updatePerPageDOM(listData, perPage, page, true);
        btnPreview.disabled = false;
    } else {
        const previewPage = page - 1;
        updatePerPageDOM(listData, perPage, previewPage, false);
        btnNext.disabled = true;
    }
    return cutPage(listData, page, perPage);
};
// XỬ LÝ PREVIEW
const handlePreview = (listData, perPage) => {
    const maxPage = Math.ceil(listData.length / perPage);
    page--;

    if (page > 1) {
        if (page < maxPage) {
            updatePerPageDOM(listData, perPage, page, true);
        } else {
            const previewPage = page - 1;
            updatePerPageDOM(listData, perPage, previewPage, false);
        }
        btnNext.disabled = false;
    } else {
        updatePerPageDOM(listData, perPage, page, true);
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
    // ------- HIỂN THỊ EMAIL Ở Ô EMAIL KHI NGƯỜI DÙNG NHẬP ----------

    const setEmailDebounce = () => {
        const email = handleChangeNameToEmail(nameMember.value);
        const maxNumberEmail = getMaxNumberInEmail(listData, email);
        const newEmail = handleNumericValueEmail(maxNumberEmail, email); // OK
        if (nameMember.value === '') {
            emailMember.value = '';
        } else {
            emailMember.value = newEmail;
        }
    };

    nameMember.addEventListener('keyup', debounce(setEmailDebounce, 400));
    /// ---------------------------------------------------------------
};
// MẶC ĐỊNH KHI CHẠY LÊN
const App = () => {
    const dataAfterChange = handleChangeData(total);
    let result;
    // ---------------------SEARCH----------------------
    const searchDebounce = () => {
        page = 1;
        let userValue = inputSearch.value.replace(/\s+/g, '').toLowerCase();
        let resultSearch;
        // const valueInput = enteredData.;
        if (userValue !== '') {
            resultSearch = handlerFind(dataAfterChange, userValue);
            if (resultSearch.length !== 0) {
                result = resultSearch;
            } else {
                alert('Input data is empty!');
            }
        }
        nameMember.value = '';
        jobPosition.value = '';
        updateDOM(result, perPage);
    };
    inputSearch.addEventListener('keydown', debounce(searchDebounce, 400));
    // ---------------------ADD--------------------------
    btnAdd.onclick = (e) => {
        page = 1;
        e.preventDefault();
        status = false;
        const valueName = nameMember.value;
        const valueJob = jobPosition.value;
        // ------------------------------------------
        const newData = changeDataAdd(
            dataAfterChange,
            valueName,
            valueJob,
            message,
        );
        updateDOM(newData, perPage);
        pageDOM.innerHTML = `${perPage} - ${page}/${newData.length}`;
        // -------------------------------------------
    };
    // ---------------------DEFAULT----------------------
    const onLoadDefault = (listData, perPage) => {
        updateDOM(listData, perPage);
        updatePerPageDOM(listData, perPage, 1, true);
    };
    onLoadDefault(dataAfterChange, perPage);
    // ---------------------RECORD--------------------------
    recordSelect.onclick = () => {
        sort.classList.remove('active');
    };

    recordSelect.onchange = (e) => {
        const newPerPage = Number(e.target.value);
        perPage = newPerPage;
        onLoadDefault(dataAfterChange, perPage);
    };

    //---------------------------------------------------
};

App();
