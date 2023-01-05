import { EMPLOYEES } from './MOCK_DATA.js';
import {
    cutPage,
    handlerID,
    handleDataAdd,
    handleChangeData,
    handleSortAZ,
    handleSortZA,
} from './util.js';

const total = EMPLOYEES;
// B1:
const card = document.querySelector('.card');
const inputSearch = document.querySelector('.search__input');
const btnNext = document.querySelector('.next');
const btnPreview = document.querySelector('.preview');
const pageDOM = document.querySelector('.nav__page--text');
const select = document.querySelector('.select');
const sort = document.querySelector('.sort');
const btnSortAZ = document.querySelector('.atoZ');
const btnSortZA = document.querySelector('.ztoA');
const nameMember = document.querySelector('.name__member');
const jobPosition = document.querySelector('.job__position');
const btnAdd = document.querySelector('.add__btn');
const message = document.querySelector('.message');

let count = 1;
let y = 21;

const render = (api) => {
    const renderResult = api
        .map((element) => {
            return `
            <li class="wrap">
                <div class="contact">
                    <div class="avt">${element.avt}</div>
                </div>
                <div class="infomation">
                    <div class="infomation__name">${element.name}</div>
                    <div class="infomation__job">${element.job}</div>
                    <div class="email">
                        <i class="fa-solid fa-envelope icon--small"></i>
                        <i class="email__text">${element.email}</i>
                    </div>
                </div>
                <button class="btn">Follow</button>
            </li>
            `;
        })
        .join('');
    return renderResult;
};

const dataAfterChange = handleChangeData(total);

const cutAndRender = (data) => {
    let resultRender = [...cutPage(data, count, y)];
    card.innerHTML = render(resultRender);
    return resultRender;
};

// NEXT AND PREVIEW PAGE
const handlerNext = (array) => {
    if (count < Math.ceil(array.length / y)) {
        count++;
        cutAndRender(array);
        if (count * y > array.length) {
            pageDOM.innerHTML = `${array.length} - ${count * y - y + 1}/${
                array.length
            }`;
        } else {
            pageDOM.innerHTML = `${count * y} - ${count * y - y + 1}/${
                array.length
            }`;
        }
    } else {
        count = Math.ceil(array.length / y);
    }
};

const handlerPreview = (array) => {
    if (count > 1) {
        count--;
        cutAndRender(array);
        pageDOM.innerHTML = `${count * y} - ${count * y - y + 1}/${
            array.length
        }`;
    } else {
        count = 1;
    }
};

const updateDOM = (data) => {
    cutAndRender(data);

    btnNext.onclick = function () {
        handlerNext(data);
    };

    // PREVIEW MẢNG MỚI
    btnPreview.onclick = function () {
        handlerPreview(data);
    };

    // SORT THEO MẢNG MỚI
    btnSortAZ.onclick = function () {
        cutAndRender(handleSortAZ(data));
    };

    btnSortZA.onclick = function () {
        cutAndRender(handleSortZA(data));
    };
};

// SEARCH
const handlerFind = (api, keyword) => {
    let resultSearch = [];

    api.forEach((value) => {
        if (value.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
            resultSearch.push(value);
        } else if (
            String(value.email).toLowerCase().indexOf(keyword.toLowerCase()) >
            -1
        ) {
            resultSearch.push(value);
        } else if (
            String(value.job).toLowerCase().indexOf(keyword.toLowerCase()) > -1
        ) {
            resultSearch.push(value);
        }
    });
    return resultSearch;
};

// ----------------------TRẠNG THÁI BAN ĐẦU KHI CHƯA TÌM KIẾM -------------

window.onload = (event) => {
    updateDOM(dataAfterChange);

    pageDOM.innerHTML = `${y} - ${count}/${dataAfterChange.length}`;
};

// ---------------------TRẠNG THÁI KHI ĐÃ TÌM KIẾM ĐƯỢC DỮ LIỆU -------------
// function debounce(func, timeout = 1000) {
//     let timer;
//     return (...args) => {
//         clearTimeout(timer);
//         timer = setTimeout(() => {
//             func.apply(this, args);
//         }, timeout);
//     };
// }
function saveInput() {
    // const inputDOM = document.querySelector('.inputClass');
    // const x = inputDOM.value;
    // console.log(x);
    console.log(123);
}

inputSearch.addEventListener('keyup', processChange);
const processChange = () => {
    console.log(123);
};

// inputSearch.addEventListener('keydown', function (event) {
//     if (event.key === 'Enter') {
//         count = 1;

//         event.preventDefault();
//         let valueInput = inputSearch.value.trim(); // LẤY DỮ LIỆU Ô INPUT NHẬP VÀO

//         if (valueInput !== '') {
//             let resultSearch = handlerFind(dataAfterChange, valueInput); // MẢNG CHỨA LIỆU PHÙ HỢP

//             // RENDER LẠI THEO MẢNG MỚI

//             // CẬP NHẬT LẠI SỐ TRANG THEO MẢNG MỚI
//             pageDOM.innerHTML = `${count * y} - ${count * y - y + 1}/${
//                 resultSearch.length
//             }`;

//             updateDOM(resultSearch);

//             nameMember.value = '';
//             jobPosition.value = '';
//         }
//     }
// });

// SAP XEP
select.addEventListener('click', handlerToggle);

function handlerToggle() {
    sort.classList.toggle('active');
}

// SORT A-Z, Z-A

// ----------------------THÊM NHÂN VIÊN MỚI ----------------------

const handleClickAdd = () => {
    let valueName = nameMember.value;
    let valueJob = jobPosition.value;

    if (String(valueName) === '' || String(valueJob) === '') {
        message.innerHTML = 'Vui lòng nhập đầy đủ thông tin!';
    } else {
        count = 1;
        const newData = dataAfterChange;
        newData.unshift(
            handleDataAdd(newData, handlerID(newData), valueName, valueJob),
        );

        // resultDataAdd: MẢNG SAU KHI ADD THÀNH CÔNG VÀ THÊM DỮ LIỆU VÀO MẢNG GỐC
        let resultDataAdd = [...newData];

        // CẬP NHẬT LẠI SỐ TRANG THEO MẢNG MỚI
        pageDOM.innerHTML = `${count * y} - ${count * y - y + 1}/${
            resultDataAdd.length
        }`;

        updateDOM(resultDataAdd);

        inputSearch.value = '';
    }
};

btnAdd.onclick = handleClickAdd;
