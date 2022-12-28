import { EMPLOYEES } from './MOCK_DATA.js';
// B1:
const card = document.querySelector('.card');

const render = (datas) => {
    const renderResult = datas
        .map((element) => {
            return `
            <li class="wrap">
                <div class="contact">
                    <img src="https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645-t.jpg" alt="" class="contact__img">
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

let count = 1;
let y = 21;

const cutPage = (value, x, y) => {
    // count: x, y: value
    const valueSlice = value.slice((x - 1) * y + 1, (x - 1) * y + y + 1);
    return valueSlice;
};

let resultRender = [...cutPage(EMPLOYEES, count, y)];
const page = document.querySelector('.nav__page--text');

card.innerHTML = render(resultRender);
page.innerHTML = `${y} - ${count}`;

// NEXT AND PREVIEW PAGE

const btnNext = document.querySelector('.next');
const btnPreview = document.querySelector('.preview');

btnNext.addEventListener('click', handlerNext);
btnPreview.addEventListener('click', handlerPreview);

function handlerNext() {
    if (count < Math.floor(EMPLOYEES.length / y)) {
        count++;

        resultRender = [...cutPage(EMPLOYEES, count, y)];
        handlerSortName(resultRender);

        card.innerHTML = render(resultRender);
        page.innerHTML = `${count * y} - ${count * y - y + 1}`;
    } else {
        count = Math.floor(EMPLOYEES.length / y);
    }
}

function handlerPreview() {
    if (count > 1) {
        count--;
        resultRender = [...cutPage(EMPLOYEES, count, y)];

        card.innerHTML = render(resultRender);
        handlerSortName(resultRender);

        page.innerHTML = `${count * y} - ${count * y - y + 1}`;
    } else {
        count = 1;
    }
}

const inputSearch = document.querySelector('.search__input');

// Tìm kiếm theo tên, email, công việc
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
    console.log(resultSearch);
    return resultSearch;
};

inputSearch.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        let valueInput = inputSearch.value;
        let resultSearch = handlerFind(EMPLOYEES, valueInput);
        card.innerHTML = render(resultSearch);
    }
});

// SAP XEP

const select = document.querySelector('.select');
const sort = document.querySelector('.sort');
const btnSortAZ = document.querySelector('.atoZ');
const btnSortZA = document.querySelector('.ztoA');

select.addEventListener('click', handlerToggle);

function handlerToggle() {
    sort.classList.toggle('active');
}

// SORT A-Z, Z-A

const handlerSortName = (array) => {
    if (btnSortAZ) {
        btnSortAZ.addEventListener('click', handlerClick);
        function handlerClick() {
            array.sort(function (a, b) {
                var lastNameA = a.name
                    .split(' ')
                    .slice(-1)
                    .join(' ')
                    .toUpperCase();
                var lastNameB = b.name
                    .split(' ')
                    .slice(-1)
                    .join(' ')
                    .toUpperCase();

                if (lastNameA < lastNameB) {
                    return -1;
                }
                if (lastNameA > lastNameB) {
                    return 1;
                }
                return 0;
            });
            card.innerHTML = render(array);
        }
    }
    if (btnSortZA) {
        btnSortZA.addEventListener('click', handlerClick);
        function handlerClick() {
            array.sort(function (a, b) {
                var lastNameA = a.name
                    .split(' ')
                    .slice(-1)
                    .join(' ')
                    .toUpperCase();
                var lastNameB = b.name
                    .split(' ')
                    .slice(-1)
                    .join(' ')
                    .toUpperCase();

                if (lastNameA < lastNameB) {
                    return 1;
                }
                if (lastNameA > lastNameB) {
                    return -1;
                }
                return 0;
            });
            card.innerHTML = render(array);
        }
    }
};

handlerSortName(resultRender);

// Thêm mới nhân viên: sau khi nhập tên sẽ tự sinh ra email
// (có dạng: Tên.Họ + @ntq-solution.com.vn),
// nếu tên hoặc email đã tồn tại trong danh sách sẽ tự động thêm trị số(1, 2 ,3).
// Thêm mới sẽ lên đầu danh sách.

const name__member = document.querySelector('.name__member');
const job__position = document.querySelector('.job__position');
const add__btn = document.querySelector('.add__btn');
const message = document.querySelector('.message');

function Test() {
    console.log(123);
}

const handlerAdd = (array) => {
    let dataAdd = [];

    let listID = [];

    array.forEach((element) => {
        listID.push(element.id);
    });

    let id = Math.max(...listID) + 1;

    add__btn.addEventListener('click', () => {
        if (
            String(name__member.value) === '' ||
            String(job__position.value) === ''
        ) {
            message.innerHTML = 'Vui lòng nhập đầy đủ thông tin!';
        } else {
            id = id + 1;
            message.innerHTML = '';
            dataAdd = {
                name: name__member.value,
                job: job__position.value,
            };

            for (const key in dataAdd) {
                if (key === 'name') {
                    let fullName = dataAdd[key];
                    let firstName = fullName.split(' ').slice(0, 1).join(' ');
                    let lastName = fullName.split(' ').slice(-1).join(' ');

                    firstName = firstName
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .toLowerCase();

                    lastName = lastName
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .toLowerCase();

                    let email = `${lastName}.${firstName}`;

                    console.log(email);

                    let firstEmail = [];
                    let check = false;

                    array.forEach((item) => {
                        if (String(item.email).includes(email)) {
                            firstEmail.push(item.email.split('@')[0]);
                            check = true;
                        }
                    });

                    console.log(firstEmail);

                    if (check) {
                        // nếu email đã tồn tại thì thêm trị số
                        firstEmail.sort();
                        const number =
                            Number(
                                String(firstEmail[firstEmail.length - 1])
                                    .match(/\d/g)
                                    .join(''),
                            ) + 1;
                        console.log(number);
                    } else {
                        // trả về email như trên đã trả dòng 240.
                    }

                    // gán lại mảng

                    console.log(firstEmail);
                }
            }
        }
    });
};

handlerAdd(EMPLOYEES);
