- Nếu có màn hình nào mới nên dựa theo màn hình Bank (/pages/bank) để làm theo cho dễ. (bỏ rồi nha :))) )

- Nếu có sử dụng 1 hình ảnh từ trên mạng download nên để nó vào file /public để tối ưu việc sử dụng hình ảnh hơn, còn những bộ library, json (fontawesome, jquery, ...) thì nên lưu vào file /assets.

- Nếu có viết file css cho file nào nên tạo file css đó ở file /assets/css rồi import nó vào main.scss.

- Khi có trường hợp sử dụng CRUD thì nên sử dụng những component như là FormInput, FormInputNumber, FormCheckbox, ... trong file /components để sử dụng cho tiện, vì đã set up sẵn hết trong đấy (Lưu ý: khi dùng những này thì nên kết hợp cùng với React Hook Form + React Query dùng cho dễ hơn).

- Khi có trường hợp 1 trang có bộ lọc filter thì nên sử dụng những bộ component như là FilterInput, FilterInputNumber, ... trong file /components.

- Về việc file api có thể sử dụng globalCRUD đã set up sẵn hoặc nếu không quen dùng cái đó thì viết kiểu bình thường cũng được (dựa vào 1 file bất kỳ để dễ hiểu và hình dung hơn).

- Modal hiện tại đang sài chung với nhau, ưu tiên nên dùng chung 1 Modal đấy.

- \*\*WARNING: Không nên chỉnh sửa hoặc thêm gì vào file [...nextauth].ts và AuthLayoutProtector.tsx vì cái này có thể xảy ra lỗi + khó chỉnh sửa, hiện đang chạy mượt nên để yên vậy.
# nhaphangTQ-static
