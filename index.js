import { EMPLOYEES } from './MOCK_DATA.js';
const total = EMPLOYEES;
// B1:
const card = document.querySelector('.card');
const inputSearch = document.querySelector('.search__input');
const btnNext = document.querySelector('.next');
const btnPreview = document.querySelector('.preview');
const page = document.querySelector('.nav__page--text');
const select = document.querySelector('.select');
const sort = document.querySelector('.sort');
const btnSortAZ = document.querySelector('.atoZ');
const btnSortZA = document.querySelector('.ztoA');
const name__member = document.querySelector('.name__member');
const job__position = document.querySelector('.job__position');
const add__btn = document.querySelector('.add__btn');
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

let newTotal = [];
const handleAvt = (data) => {
    data.forEach((item) => {
        const fullName = item.name;
        const lastName = fullName.split(' ').slice(-1).join(' ');
        const avt = lastName.charAt(0);
        newTotal.push({
            id: item.id,
            name: item.name,
            job: item.job,
            email: item.email,
            avt: avt,
        });
    });
    return newTotal;
};

const newData = handleAvt(total);
console.log(newData);

const cutPage = (value, x, y) => {
    // count: x, y: value
    const valueSlice = value.slice((x - 1) * y + 1, (x - 1) * y + y + 1);
    return valueSlice;
};

const cutAndRender = (data) => {
    let resultRender = [...cutPage(data, count, y)];
    card.innerHTML = render(resultRender);
    return resultRender;
};

cutAndRender(newTotal);

page.innerHTML = `${y} - ${count}`;

// NEXT AND PREVIEW PAGE

const handlerNext = (array) => {
    if (count < Math.ceil(array.length / y)) {
        count++;
        cutAndRender(array);
        page.innerHTML = `${count * y} - ${count * y - y + 1}`;
    } else {
        count = Math.ceil(array.length / y);
    }
};

const handlerPreview = (array) => {
    if (count > 1) {
        count--;
        cutAndRender(array);
        page.innerHTML = `${count * y} - ${count * y - y + 1}`;
    } else {
        count = 1;
    }
};

// Nếu có hàm đã được thực thi rồi
// Khi gán biến nào đó bằng 1 hàm thì không được thêm dấu () sau tên hàm

// SEARCH
const handlerFind = (api, keyword) => {
    let resultSearch = [];

    api.forEach((value) => {
        if (value.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
            resultSearch.push(value);
        } else if (String(value.email).toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
            resultSearch.push(value);
        } else if (String(value.job).toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
            resultSearch.push(value);
        }
    });
    return resultSearch;
};

// ----------------------TRẠNG THÁI BAN ĐẦU KHI CHƯA TÌM KIẾM -------------

btnNext.onclick = function () {
    handlerNext(newTotal);
};
btnPreview.onclick = function () {
    handlerPreview(newTotal);
};

// ---------------------TRẠNG THÁI KHI ĐÃ TÌM KIẾM ĐƯỢC DỮ LIỆU -------------

inputSearch.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        count = 1;

        event.preventDefault();
        let valueInput = inputSearch.value; // LẤY DỮ LIỆU Ô INPUT NHẬP VÀO

        if (valueInput !== '') {
            let resultSearch = handlerFind(newTotal, valueInput); // LẤY DỮ LIỆU PHÙ HỢP
            cutAndRender(resultSearch);
            btnNext.onclick = function () {
                handlerNext(resultSearch);
            };

            btnPreview.onclick = function () {
                handlerPreview(resultSearch);
            };
        }
    }
});

// SAP XEP

select.addEventListener('click', handlerToggle);

function handlerToggle() {
    sort.classList.toggle('active');
}

// SORT A-Z, Z-A

// const handlerSortName = (array) => {
//     if (btnSortAZ) {
//         btnSortAZ.addEventListener('click', handlerClick);
//         function handlerClick() {
//             array.sort(function (a, b) {
//                 var lastNameA = a.name.split(' ').slice(-1).join(' ').toUpperCase();
//                 var lastNameB = b.name.split(' ').slice(-1).join(' ').toUpperCase();

//                 if (lastNameA < lastNameB) {
//                     return -1;
//                 }
//                 if (lastNameA > lastNameB) {
//                     return 1;
//                 }
//                 return 0;
//             });
//             card.innerHTML = render(array);
//         }
//     }
//     if (btnSortZA) {
//         btnSortZA.addEventListener('click', handlerClick);
//         function handlerClick() {
//             array.sort(function (a, b) {
//                 var lastNameA = a.name.split(' ').slice(-1).join(' ').toUpperCase();
//                 var lastNameB = b.name.split(' ').slice(-1).join(' ').toUpperCase();

//                 if (lastNameA < lastNameB) {
//                     return 1;
//                 }
//                 if (lastNameA > lastNameB) {
//                     return -1;
//                 }
//                 return 0;
//             });
//             card.innerHTML = render(array);
//         }
//     }
// };

// handlerSortName(resultRender);

// Thêm mới nhân viên: sau khi nhập tên sẽ tự sinh ra email
// (có dạng: Tên.Họ + @ntq-solution.com.vn),
// nếu tên hoặc email đã tồn tại trong danh sách sẽ tự động thêm trị số(1, 2 ,3).
// Thêm mới sẽ lên đầu danh sách.

function Standardized(value) {
    value = value.replace(/\s/g, ' ');
    value = value.trim().toLowerCase();
    let separated = value.split(' '); // mảng chứa tên, họ, tên đệm
    let result = '';
    separated.forEach((element) => {
        result += element.slice(0, 1).toUpperCase() + element.substring(1) + ' ';
    });
    return result;
}

const handlerID = (value) => {
    let listID = [];
    value.forEach((element) => {
        listID.push(element.id);
    });
    let id = Math.max(...listID);
    return id;
};

const changeEnglish = (a) => {
    a = a
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
    return a;
};

let test = 1;

add__btn.addEventListener('click', () => {
    const handlerAdd = (array, id) => {
        let dataAdd = {};
        if (String(name__member.value) === '' || String(job__position.value) === '') {
            message.innerHTML = 'Vui lòng nhập đầy đủ thông tin!';
        } else {
            id = id + 1;
            message.innerHTML = '';

            let fullName = name__member.value;
            let firstName = fullName.split(' ').slice(0, 1).join(' ');
            let lastName = fullName.split(' ').slice(-1).join(' ');

            firstName = changeEnglish(firstName);
            lastName = changeEnglish(lastName);

            let email = `${lastName}.${firstName}`; // hung.nguyen

            let firstEmail = [];
            let check = false;

            array.forEach((item) => {
                if (String(item.email).includes(email)) {
                    firstEmail.push(item.email.split('@')[0]);
                    check = true;
                    console.log(check);
                }
            });

            if (check) {
                firstEmail.sort();
                let number = String(firstEmail[firstEmail.length - 1]).match(/\d/g);

                if (number === null) {
                    email = `${email}1@ntq-solution.com.vn`;
                } else {
                    number =
                        Number(
                            String(firstEmail[firstEmail.length - 1])
                                .match(/\d/g)
                                .join(''),
                        ) + 1;
                    email = `${email.concat(number)}@ntq-solution.com.vn`;
                }

                dataAdd = {
                    id: id,
                    name: Standardized(name__member.value).trim(),
                    job: job__position.value,
                    email: email,
                };
            } else {
                email = `${email}@ntq-solution.com.vn`;
                dataAdd = {
                    id: id,
                    name: Standardized(name__member.value).trim(),
                    job: job__position.value,
                    email: email,
                };
            }
        }
    };
    handlerAdd(newTotal, handlerID(newTotal));
});
