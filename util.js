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
    value = value.replace(/\s/g, ' ');
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
    // Đỗ Minh Anh (Đỗ Minh Anh 0) ==> Lấy ra vị trí của cái thằng có con số nhỏ nhất thằng này
    // Đỗ Minh Anh 1. ==> Nếu tồn tại thằng này thì cho nó sau cái Đỗ Minh Anh
    // Đỗ Minh Anh 2. ==> Nếu tồn tại thằng này thì cho nó sau cái Đỗ Minh Anh 1

    // Điểm chung: --> Đỗ Minh Anh
    // Điểm khác: số đằng sau

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
    return value.replace(/\s+/g, '').toLowerCase();
};

const getNumberInText = (value) => {
    return value.replace(/[^0-9]/g, '');
};

const getMaxNumberInString = (value, keyCheck) => {
    const number = [];
    value.forEach((item) => {
        const fullNameData = removeWhitespace(item.name);
        if (fullNameData.includes(keyCheck)) {
            const numberOfName = getMaxNumberInString(fullNameData); // lấy số trong tên: nguyễn văn hưng 1 --> 1
            if (numberOfName === '') {
                numberOfName = 0;
            } else {
                numberOfName = numberOfName;
            }
            number.push(numberOfName);
        }
    });
    return number;
};

// XỬ LÝ THÊM DỮ LIỆU
export const handleDataAdd = (listData, id, fullName, job) => {
    let email = handleChangeNameToEmail(fullName); // LẤY RA EMAIL
    const fullNameCheck = removeWhitespace(fullName); // nguyễnvănhưng

    let number;
    let check = false;
    let dataAdd = {
        id: id + 1,
        name: '',
        job: Standardized(job).trim(),
        email: '',
        avt: handleAvt(fullName.trim()).toUpperCase(),
    };

    // CHECK TRÙNG TÊN THÌ THÊM TRỊ SỐ VÀO ĐẰNG SAU.
    if (email.includes('.') === false) {
        listData.forEach((item) => {
            if (String(item.email).includes(email)) {
                if (item.email.split('@')[0].includes('.') === false) {
                    number = Number(
                        item.email.split('@')[0].replace(/[^0-9]/g, ''),
                    );
                    checkEmail.push(number);
                    check = true;
                }
            }
        });
    } else {
        listData.forEach((item) => {
            if (String(item.email).includes(email)) {
                number = Number(
                    item.email.split('@')[0].replace(/[^0-9]/g, ''),
                );
                checkEmail.push(number);
                check = true;
            }
        });
    }

    let maxValueEmail = Math.max(...checkEmail);
    let maxValueName = Math.max(...checkFullName);

    if (check) {
        if (maxValueEmail === 0) {
            email = `${email}1@ntq-solution.com.vn`;
        } else {
            maxValueEmail = maxValueEmail + 1;
            email = `${email}${maxValueEmail}@ntq-solution.com.vn`;
        }

        if (maxValueName === 0) {
            // 0 => fullName: nguyễn văn hưng
            fullName = Standardized(`${fullName}`);
        } else {
            maxValueName = maxValueName + 1;
            fullName = Standardized(`${fullName} ${maxValueName}`);
        }

        dataAdd.name = fullName;
        dataAdd.email = email;
    } else {
        email = `${email}@ntq-solution.com.vn`;
        dataAdd.email = email;
    }
    return dataAdd;
};

// THÊM DỮ LIỆU
export const changeDataAdd = (listData, fullName, job, messageDOM) => {
    let newData;
    if (fullName.replace(/\s+/g, '') === '' || job.replace(/\s+/g, '') === '') {
        messageDOM.innerHTML =
            'Giá trị nhập không hợp lệ hoặc điền thiếu thông tin!';
    } else if (Number(fullName.replace(/[^0-9]/g, '')) !== 0) {
        messageDOM.innerHTML = 'Tên không được nhập kiểu số!';
    } else {
        messageDOM.innerHTML = '';
        listData.unshift(
            handleDataAdd(listData, handlerID(listData), fullName, job),
        );
        newData = [...listData];
    }
    return newData;
};
