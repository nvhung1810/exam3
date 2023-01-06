// RENDER RA TRÌNH DUYỆT
export const render = (listData) => {
    const renderResult = listData
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
// LẤY CHỮ CÁI ĐẦU LÀM AVT
export const handleAvt = (fullName) => {
    const lastName = fullName.trim().split(' ').slice(-1).join(' ');
    const avt = lastName.charAt(0);

    return avt;
};
// CẬP NHẬT LẠI DỮ LIỆU CÓ CẢ AVT
export const handleChangeData = (data) => {
    let newTotal = [];

    data.forEach((item) => {
        let avt = handleAvt(item.name);

        if (Number(avt)) {
            const avtCut = item.name.split(' ').slice(2).join(' ');
            let newAvt = avtCut.split(' ').slice(0, -1).join(' ');
            avt = handleAvt(newAvt);
        } else {
            avt = handleAvt(item.name);
        }
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
// LẤY ID CAO NHẤT
export const handlerID = (value) => {
    return Math.max(...value.map((element) => element.id));
};
// CHUYỂN TIẾNG VIỆT THÀNH TIẾNG ANH
export const changeEnglish = (a) => {
    a = a
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
    if (a.includes('Đ') || a.includes('đ')) {
        a = a.replace(/đ/g, 'd');
    }
    return a;
};
// CHUẨN HÓA: nguyễn văn hưng => Nguyễn Văn Hưng
export const Standardized = (value) => {
    value = value.replace(/\s+/g, ' ');
    value = value.trim().toLowerCase();
    let separated = value.split(' '); // mảng chứa tên, họ, tên đệm
    let result = '';
    separated.forEach((element) => {
        result +=
            element.slice(0, 1).toUpperCase() + element.substring(1) + ' ';
    });
    return result;
};
// CHUYỂN TÊN THÀNH EMAIL: Nguyễn Văn Hưng => hung.nguyen
export const handleChangeNameToEmail = (fullName) => {
    fullName = fullName.trim();
    let firstName = fullName.split(' ').slice(0, 1).join(' ');
    let lastName = fullName.split(' ').slice(-1).join(' ');

    firstName = changeEnglish(firstName);
    lastName = changeEnglish(lastName);
    let email;

    if (
        firstName.includes('Đ') ||
        firstName.includes('đ') ||
        lastName.includes('Đ') ||
        lastName.includes('đ')
    ) {
        firstName = firstName.toLowerCase().replace(/đ/g, 'd');
        lastName = lastName.toLowerCase().replace(/đ/g, 'd');

        if (firstName === lastName) {
            email = `${lastName}`;
        } else {
            email = `${lastName}.${firstName}`;
        }
    } else {
        if (firstName === lastName) {
            email = `${lastName}`;
        } else {
            email = `${lastName}.${firstName}`;
        }
    }
    return email;
};
// SORT AZ
export const handleSortAZ = (data) => {
    const newData = data;
    newData.sort((a, b) => {
        return a['avt'].toString().localeCompare(b['avt']);
    });
    return newData;
};

// SORT ZA
export const handleSortZA = (data) => {
    const newData = data;
    newData.sort((a, b) => {
        return a['avt'].toString().localeCompare(b['avt']);
    });
    return newData.reverse();
};

const removeWhitespace = (value) => {
    return value.replace(/\s+/g, ' ').toLowerCase();
};

const getNumberInText = (value) => {
    return Number(value.replace(/[^0-9]/g, ''));
};

// NẾU NHƯ TÊN ĐÃ CÓ TRONG API -> [0,1....] NẾU KHÔNG CÓ -> []
const getMaxNumberInName = (list, keyCheck) => {
    const listNumber = [];

    list.forEach((item) => {
        const fullNameData = removeWhitespace(item.name);

        if (String(fullNameData).includes(keyCheck)) {
            if (keyCheck.includes(' ')) {
                const numberOfName = getNumberInText(fullNameData); // lấy số trong tên: nguyễn văn hưng 1 --> 1
                listNumber.push(numberOfName);
            } else {
                const fullNameCut = fullNameData
                    .replace(fullNameData.replace(/[^0-9]/g, ''), '')
                    .trim();
                if (fullNameCut === keyCheck) {
                    const numberOfName = getNumberInText(fullNameData);
                    listNumber.push(numberOfName);
                }
            }
        }
    });
    return listNumber;
};

const handleNumericValueName = (listNumber, fullName) => {
    let newName;
    if (listNumber.length === 0) {
        newName = Standardized(fullName);
    } else {
        newName = `${Standardized(fullName)}${Math.max(...listNumber) + 1}`;
    }

    return newName;
};

const getMaxNumberInEmail = (list, keyCheck) => {
    let numberList = [];
    list.forEach((item) => {
        const nameEmail = String(item.email).split('@')[0];

        if (nameEmail.includes(keyCheck)) {
            if (keyCheck.includes('.')) {
                numberList.push(getNumberInText(nameEmail.split('@')[0]));
            } else {
                if (String(nameEmail).includes('.') === false) {
                    numberList.push(getNumberInText(nameEmail.split('@')[0]));
                }
            }
        }
    });
    return numberList;
};

const handleNumericValueEmail = (listNumber, email) => {
    let newEmail;
    if (listNumber.length === 0) {
        newEmail = `${email}@ntq-solution.com.vn`;
    } else {
        newEmail = `${email}${Math.max(...listNumber) + 1}@ntq-solution.com.vn`;
    }
    return newEmail;
};

// XỬ LÝ THÊM DỮ LIỆU
export const handleDataAdd = (listData, id, fullName, job) => {
    const email = handleChangeNameToEmail(fullName); // LẤY RA EMAIL
    const fullNameCheck = removeWhitespace(fullName); // nguyễnvănhưng

    const maxNumberName = getMaxNumberInName(listData, fullNameCheck);
    const maxNumberEmail = getMaxNumberInEmail(listData, email);

    const newFullName = handleNumericValueName(maxNumberName, fullName);
    const newEmail = handleNumericValueEmail(maxNumberEmail, email);

    return {
        id: id + 1,
        name: newFullName,
        email: newEmail,
        job: Standardized(job).trim(),
        avt: handleAvt(newFullName.trim()).toUpperCase(),
    };
};

const containsSpecialChars = (str) => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
};

// THÊM DỮ LIỆU
export const changeDataAdd = (listData, fullName, job, messageDOM) => {
    let newData;
    if (fullName.replace(/\s+/g, '') === '' || job.replace(/\s+/g, '') === '') {
        messageDOM.innerHTML =
            'Giá trị nhập không hợp lệ hoặc điền thiếu thông tin!';
    } else if (Number(fullName.replace(/[^0-9]/g, '')) !== 0) {
        messageDOM.innerHTML = 'Tên không được nhập kiểu số!';
    } else if (containsSpecialChars(fullName)) {
        messageDOM.innerHTML = 'Tên không được chứa kí tự đặc biệt';
    } else {
        messageDOM.innerHTML = '';
        listData.unshift(
            handleDataAdd(listData, handlerID(listData), fullName, job),
        );
        newData = [...listData];
    }
    return newData;
};
