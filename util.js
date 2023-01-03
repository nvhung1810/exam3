export const handleAvt = (fullName) => {
    const lastName = fullName.trim().split(' ').slice(-1).join(' ');
    const avt = lastName.charAt(0);

    return avt;
};

// ------------------------------------------------------

export const cutPage = (value, count, y) => {
    const valueSlice = value.slice((count - 1) * y, (count - 1) * y + y);
    return valueSlice;
};

export const handlerID = (value) => {
    let listID = [];
    value.forEach((element) => {
        listID.push(element.id);
    });
    let id = Math.max(...listID);
    return id;
};

export const changeEnglish = (a) => {
    a = a
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
    return a;
};

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

export const handleDataAdd = (data, id, fullName, job) => {
    let email = handleChangeNameToEmail(fullName); // LẤY RA EMAIL

    let checkEmail = []; // LƯU CÁC EMAIL TRÙNG VỚI DL NHẬP VÀO MÀ ĐÃ TỒN TẠI
    let check = false;

    let dataAdd = {
        id: id + 1,
        name: Standardized(fullName).trim(),
        job: job,
        email: '',
        avt: handleAvt(fullName.trim()).toUpperCase(),
    };

    let number;

    if (email.includes('.') === false) {
        // Lấy trước @
        // if trước @ có . thì bỏ nếu ko có thì lấy
        data.forEach((item) => {
            if (String(item.email).includes(email)) {
                if (item.email.split('@')[0].includes('.') === false) {
                    console.log(123);
                } else {
                    console.log(321);
                }
            }
        });
        // hung1@ntq-solution.com
        // hung@ntq-solution.com
    } else {
        data.forEach((item) => {
            if (String(item.email).includes(email)) {
                number = Number(
                    item.email.split('@')[0].replace(/[^0-9]/g, ''),
                );
                checkEmail.push(number);
                check = true;
            }
        });
    }

    let maxValue = Math.max(...checkEmail);

    if (check) {
        if (maxValue === 0) {
            email = `${email}1@ntq-solution.com.vn`;
        } else {
            maxValue = maxValue + 1;
            email = `${email}${maxValue}@ntq-solution.com.vn`;
        }
        dataAdd.email = email;
    } else {
        email = `${email}@ntq-solution.com.vn`;
        dataAdd.email = email;
    }
    return dataAdd;
};

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

export const handleSortAZ = (data) => {
    const newData = data;
    newData.sort((a, b) => {
        return a['avt'].toString().localeCompare(b['avt']);
    });
    return newData;
};

export const handleSortZA = (data) => {
    const newData = data;
    newData.sort((a, b) => {
        return a['avt'].toString().localeCompare(b['avt']);
    });
    return newData.reverse();
};
