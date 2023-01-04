import { EMPLOYEES } from './MOCK_DATA.js';
import {
    handleAvt,
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
    console.log(keyword);

    api.forEach((value) => {
        const fullName = String(value.name).replace(/\s+/g, '').toLowerCase();
        const email = String(value.email).replace(/\s+/g, '').toLowerCase();
        const job = String(value.job).replace(/\s+/g, '').toLowerCase();

        if (fullName.indexOf(keyword) > -1) {
            resultSearch.push(value);
        } else if (email.indexOf(keyword) > -1) {
            resultSearch.push(value);
        } else if (job.indexOf(keyword) > -1) {
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

inputSearch.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        count = 1;

        event.preventDefault();
        let valueInput = inputSearch.value.replace(/\s+/g, '').toLowerCase(); // LẤY DỮ LIỆU Ô INPUT NHẬP VÀO

        if (valueInput !== '') {
            let resultSearch = handlerFind(dataAfterChange, valueInput); // MẢNG CHỨA LIỆU PHÙ HỢP

            // CẬP NHẬT LẠI SỐ TRANG THEO MẢNG MỚI
            pageDOM.innerHTML = `${count * y} - ${count * y - y + 1}/${
                resultSearch.length
            }`;

            updateDOM(resultSearch);

            nameMember.value = '';
            jobPosition.value = '';
        }
    }
});

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
    if (
        valueName.replace(/\s+/g, '') === '' ||
        valueJob.replace(/\s+/g, '') === ''
    ) {
        message.innerHTML =
            'Giá trị nhập không hợp lệ hoặc điền thiếu thông tin!';
    } else {
        message.innerHTML = '';
        count = 1;
        const listData = dataAfterChange;

        listData.unshift(
            handleDataAdd(listData, handlerID(listData), valueName, valueJob),
        );

        // resultDataAdd: MẢNG SAU KHI ADD THÀNH CÔNG VÀ THÊM DỮ LIỆU VÀO MẢNG GỐC
        let resultDataAdd = [...listData];

        try {
            updateDOM(resultDataAdd);
            // CẬP NHẬT LẠI SỐ TRANG THEO MẢNG MỚI
            pageDOM.innerHTML = `${count * y} - ${count * y - y + 1}/${
                resultDataAdd.length
            }`;

            nameMember.value = '';
            jobPosition.value = '';
            inputSearch.value = '';
        } catch (err) {
            console.error('>>>>> Error add data');
        }
    }
};

btnAdd.onclick = handleClickAdd;
