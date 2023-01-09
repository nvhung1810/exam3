# link deploy: https://nvhung1810.github.io/exam3/

# exercises-html-css-js

## Branch naming convention

`fresher/[your_prefix_ntq_email]`

**Ghi chú :**

-   Chỉ sử dụng html, css, js
-   Có thể bổ sung thêm một số tính năng như validate, ... (k bắt buộc)
-   UI có thể tự chỉnh sửa nhưng bảo đảm đủ yêu cầu về tính năng ^\_^

-   Hãy thiết kế một website như sau:

    -   link design: https://prnt.sc/8yMnMmcwEuC8
    -   link tham khảo: https://opms.ntq.solutions/web#view_type=kanban&model=hr.employee&action=111
    -   Với data lấy trong file MOCK_DATA.js

-   Trong đó có các tính năng:

*   Tìm kiếm theo tên, email, công việc
*   Phân trang: 40 items/ trang và có next/previous trang
*   Thêm mới nhân viên: sau khi nhập tên sẽ tự sinh ra email(có dạng: Tên.Họ + @ntq-solution.com.vn), nếu tên hoặc email đã tồn tại trong danh sách sẽ tự động thêm trị số(1, 2 ,3). Thêm mới sẽ lên đầu danh sách.

```js
VD: Dương Ngọc Quang -> quang.duong@ntq-solution.com.vn,
    Dương Quang -> quang.duong2@ntq-solution.com.vn,
    Dương Ngọc Quang -> Dương Ngọc Quang 2 -> quang.duong3@ntq-solution.com.vn,
    Quang -> quang@ntq-solution.com.vn,
```

-   Filter: Tên A-Z, Tên Z-A
