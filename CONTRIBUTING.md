# Hướng dẫn Đóng góp

Chào mừng bạn đến với dự án! Chúng tôi rất hoan nghênh mọi đóng góp từ phía bạn. Để đảm bảo quản lý mã nguồn hiệu quả và duy trì chất lượng, chúng tôi sử dụng CommitLint để kiểm tra và duyệt các commit theo chuẩn [Conventional Commits](https://www.conventionalcommits.org/).

## Quy tắc Commit

Chúng tôi sử dụng các loại commit sau:

- `chore`: Công việc không ảnh hưởng đến mã nguồn, ví dụ: cập nhật tài liệu.
- `feat`: Thêm tính năng mới.
- `fix`: Sửa lỗi.
- `refactor`: Sửa đổi mã nguồn không thêm tính năng hoặc sửa lỗi.
- `test`: Thêm hoặc sửa đổi các bài kiểm thử.

Một commit chuẩn sẽ có định dạng như sau: "<loại>(phạm vi): mô tả"

Ví dụ: "chore(docs): cập nhật hướng dẫn sử dụng CommitLint"

## Quy tắc Tạo Branch

Khi bạn bắt đầu làm việc trên một chức năng mới, hãy tạo một branch từ `master` với tên thể hiện nội dung của chức năng đó:

```bash
git checkout master
git pull origin master
git checkout -b feature/ten-chuc-nang
```
- `feature`: Định dạng cho chức năng mới.
- `ten-chuc-nang`: Tên ngắn gọn và mô tả chức năng đang thực hiện.

Sau khi bạn hoàn thành chức năng và đã kiểm thử kỹ, hãy tạo Pull Request để đưa chức năng vào branch chính (main). Chúng tôi sẽ xem xét và tích hợp chức năng của bạn vào dự án.

Cảm ơn bạn đã đóng góp vào dự án!
