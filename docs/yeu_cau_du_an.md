ĐẠI HỌC ĐÀ NẴNG
TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT
KHOA CÔNG NGHỆ SỐ

ĐỒ ÁN TỐT NGHIỆP
ĐẠI HỌC
NGÀNH: CÔNG NGHỆ THÔNG TIN
CHUYÊN NGÀNH: CÔNG NGHỆ THÔNG TIN

ĐỀ TÀI:

Xây dựng nền tảng kết nối và quản lý chu trình kiểm thử UVTester cho Freelancer, tích hợp tối ưu hóa việc gán dự án thông minh với AI và báo cáo lỗi Realtime

    Sinh viên thực hiện	: Lê Trung Sơn
    Mã sinh viên	: 21115053120241
    Lớp	: 21T2
    Người hướng dẫn	: TS. Nguyễn Tấn Thuận

Đà Nẵng, tháng 01/2026
ĐẠI HỌC ĐÀ NẴNG
TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT
KHOA CÔNG NGHỆ SỐ

ĐỒ ÁN TỐT NGHIỆP
ĐẠI HỌC
NGÀNH: CÔNG NGHỆ THÔNG TIN
CHUYÊN NGÀNH: CÔNG NGHỆ THÔNG TIN

ĐỀ TÀI:

Xây dựng nền tảng kết nối và quản lý chu trình kiểm thử UVTester cho Freelancer, tích hợp tối ưu hóa việc gán dự án thông minh với AI và báo cáo lỗi Realtime

    	Giảng viên hướng dẫn duyệt: TS. Nguyễn Tấn Thuận

Đà Nẵng, tháng 01/2026
NHẬN XÉT CỦA GIÁO VIÊN HƯỚNG DẪN

NHẬN XÉT CỦA GIÁO VIÊN PHẢN BIỆN

TÓM TẮT
Tên đề tài: …………….
Sinh viên thực hiện: …………..
Mã SV: …………………….. Lớp: ………….
Nội dung tóm tắt

NHIỆM VỤ ĐỒ ÁN
Lấy nội dung Nhiệm vụ đồ án chèn vào đây
ĐỀ CƯƠNG ĐỒ ÁN
Lấy nội dung Đề cương đồ án chèn vào đây
LỜI NÓI ĐẦU

Ngày nay, công nghệ thông tin đang đóng vai trò ngày càng quan trọng trong mọi lĩnh vực của đời sống xã hội, đặc biệt là trong giáo dục và đào tạo. ….
……...
………….

CAM ĐOAN
Em xin cam đoan rằng đồ án tốt nghiệp với đề tài “…..” là kết quả của …….
Em hoàn toàn chịu trách nhiệm về tính trung thực và nguyên bản của đồ án này. Nếu có bất kỳ vi phạm nào liên quan đến vấn đề bản quyền hay đạo văn, em xin cam kết sẽ chịu mọi hình thức xử lý theo quy định của nhà trường.
Sinh viên thực hiện

    Họ tên sinh viên

MỤC LỤC

NHẬN XÉT CỦA GIÁO VIÊN HƯỚNG DẪN i
NHẬN XÉT CỦA GIÁO VIÊN PHẢN BIỆN ii
TÓM TẮT iii
NHIỆM VỤ ĐỒ ÁN iv
ĐỀ CƯƠNG ĐỒ ÁN v
LỜI NÓI ĐẦU vi
CAM ĐOAN vii
MỤC LỤC viii
DANH MỤC BẢNG BIỂU xi
DANH MỤC HÌNH VẼ xii
DANH MỤC CHỮ VIẾT TẮT TIẾNG VIỆT xiii
DANH MỤC CHỮ VIẾT TẮT TIẾNG ANH xiv
MỞ ĐẦU 1

1. Mục tiêu đề tài 1
2. Đối tượng nghiên cứu và phạm vi nghiên cứu 1
   a. Đối tượng nghiên cứu 1
   b. Phạm vi nghiên cứu 2
3. Phương pháp nghiên cứu 2
4. Cấu trúc đồ án 3
   Chương 1 Phân tích yêu cầu bài toán 4
   1.1. Giới thiệu 4
   1.1.1. Mục tiêu của ứng dụng 4
   1.1.2. Vấn đề cần giải quyết 4
   1.1.3. Yêu cầu chức năng 5
   1.1.4. Yêu cầu phi chức năng 6
   1.2. Thu thập yêu cầu 7
   1.2.1. Phương pháp thu thập thông tin 7
   1.2.2. Phân tích thông tin thu thập được 7
   1.2.3. Lý do xây dựng ứng dụng 8
   1.2.4. Những điểm nổi bật của ứng dụng 8
   1.2.5. Giá trị mang lại 9
   1.3. Đánh giá sản phẩm 9
   1.4. User story 10
   1.4.1. Tài khoản (Người dùng chung) 10
   1.4.1.1. Đăng nhập 10
   1.4.1.2. Đăng ký 10
   1.4.2. Quản lý dự án (Vai trò Client) 11
   1.4.2.1. Đăng tải dự án 11
   1.4.2.2. Duyệt ứng viên 12
   1.4.3. Quản lý lỗi (Vai trò Tester) 12
   1.4.3.1. Nộp báo cáo lỗi (Bug report) 12
   1.4.3.2. Theo dõi trạng thái dự án (Realtime) 13
   1.4.4. Quản lý hệ thống (Vai trò Admin) 13
   1.4.4.1. Kiểm duyệt dự án 13
   1.4.4.2. Quản lý tài khoản người dùng 14
   1.4.4.3. Quản lý danh mục kỹ năng 14
   Chương 2 PHÂN TÍCH THIẾT KẾ HỆ THỐNG 15
   2.1. Khảo sát yêu cầu 15
   2.1.1. Hoạt động nghiệp vụ 15
   2.1.2. Diễn giải quy trình nghiệp vụ 16
   2.1.3. Liệt kê người dùng và yêu cầu 18
   2.1.3.1. Tester (Freelancer) 18
   2.1.3.2. Client (Nhà Phát triển) 18
   2.1.3.3. Quản trị viên (Admin) 18
   2.1.3.4. Hệ thống (System) 19
   2.2. Phân tích thiết kế hệ thống 19
   2.2.1. Liệt kê Actor và Usecase 19
   2.2.2. Sơ đồ usecase 19
   2.2.3. Kịch bản và sơ đồ hoạt động 19
   2.2.4. Sơ đồ Robustness 19
   2.2.5. Phác thảo giao diện 19
   2.2.6. Thiết kế ERD 19
   2.2.7. Sơ đồ Class mức 1 19
   2.2.8. Sơ đồ tuần tự 19
   2.2.9. Sơ đồ Class mức 2 (đã bổ sung Method từ các Message của sơ đồ tuần tự) 19
   Chương 3 XÂY DỰNG CHƯƠNG TRÌNH 21
   3.1. Công cụ xây dựng chương trình 21
   3.2. Giao diện chương trình 21
   3.2.1. Giao diện trang chủ 21
   3.2.2. Giao diện …. 21
   KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN 22
5. Kết luận 22
6. Hướng phát triển 22
   TÀI LIỆU THAM KHẢO 23

DANH MỤC BẢNG BIỂU
Bảng 1.1: ….(chú thích tên bảng dữ liệu) 2
Bảng 1.2: …(chú thích tên bảng dữ liệu) 2

DANH MỤC HÌNH VẼ
Hình 1.1: ……. (chú thích tên hình) 2
Hình 2.1: Quy trình nghiệp vụ …. 3

DANH MỤC CHỮ VIẾT TẮT TIẾNG VIỆT
Stt Chữ viết tắt Giải nghĩa
CNTT Công nghệ thông tin

DANH MỤC CHỮ VIẾT TẮT TIẾNG ANH
Stt Chữ viết tắt Giải nghĩa Nghĩa tiếng Việt
1 HTML Hyper Text Markup Language Ngôn ngữ đánh dấu siêu văn bản
2
3

MỞ ĐẦU
1.Mục tiêu đề tài
Mục tiêu chính của đề tài là xây dựng một nền tảng web hoạt động thực tế, giải quyết nhu cầu cấp thiết về kiểm thử phần mềm tại Việt Nam, đồng thời chứng minh khả năng làm chủ các công nghệ hiện đại.
Về mặt Chức năng và Giá trị:
-Xây dựng một thị trường kết nối hiệu quả giữa các đội ngũ phát triển (Client) và Tester/Freelancer chuyên nghiệp, tập trung vào các loại hình kiểm thử linh hoạt như Exploratory Testing và Test Case Cycles.
-Cung cấp một quy trình quản lý lỗi (Bug Tracking) và quản lý dự án minh bạch, rõ ràng, giúp Client dễ dàng theo dõi tiến độ và chất lượng công việc của Tester.
-Tích hợp các công nghệ Realtime (từ Supabase) để đảm bảo thông báo, báo cáo lỗi và giao tiếp giữa hai bên diễn ra tức thời, tối ưu hóa thời gian xử lý lỗi.
Về mặt Kỹ thuật và Công nghệ:
-Áp dụng kiến trúc Full-stack hiện đại với Next.js và JavaScript cho giao diện người dùng, tận dụng tối đa lợi thế của Server Components và Server Actions.
-Làm chủ nền tảng Backend-as-a-Service (BaaS) là Supabase, đặc biệt là các tính năng cốt lõi như Auth (Quản lý đa vai trò), Realtime (Cập nhật tức thời) và Row-Level Security (RLS) (Bảo mật dữ liệu).

2.Đối tượng nghiên cứu và phạm vi nghiên cứu
a. Đối tượng nghiên cứu
Đối tượng nghiên cứu của đề tài bao gồm hai nhóm chính:
Đối tượng nghiệp vụ:
-Quy trình nghiệp vụ của các nền tảng Crowdsourcing Testing tiêu biểu trên thế giới (như uTest, Test.io) để đúc kết mô hình áp dụng phù hợp với thị trường Việt Nam.
-Nhu cầu và quy trình làm việc của Tester tự do (Freelancer) và Đội ngũ phát triển phần mềm tại Việt Nam.
Đối tượng công nghệ:
-Nền tảng phát triển Next.js (Phiên bản mới nhất) và ngôn ngữ TypeScript.
-Nền tảng Backend Supabase, tập trung vào các mô-đun Auth, Database, Realtime và Storage.
b. Phạm vi nghiên cứu
Đề tài tập trung vào việc phát triển Module cốt lõi (MVP - Minimum Viable Product) của nền tảng UVTester:
Phạm vi Chức năng:
-Xây dựng hệ thống Quản lý người dùng đa vai trò (Tester và Client).
-Triển khai Quy trình ứng tuyển và Phê duyệt dự án cơ bản.
-Phát triển Module Báo cáo lỗi (Bug Reporting) và Theo dõi lỗi Realtime theo mô hình Exploratory và Test Case Cycles.
-Mô phỏng Thanh toán và Đánh giá cơ bản.
Phạm vi Công nghệ:
-Sử dụng React/Next.js cho toàn bộ Frontend và Backend (Sử dụng Server Actions và API Routes).
-Sử dụng Supabase làm cơ sở dữ liệu và cung cấp các dịch vụ Backend (Authentication, Realtime, Database).
Phạm vi Giới hạn: Đề tài không bao gồm việc tích hợp các cổng thanh toán thực tế (chỉ mô phỏng quy trình) và không đi sâu vào các tính năng nâng cao như AI/Machine Learning (ví dụ: gán lỗi tự động).

3.Phương pháp nghiên cứu
Đề tài sử dụng kết hợp các phương pháp nghiên cứu sau để đảm bảo tính thực tiễn và chất lượng kỹ thuật:
Phương pháp Khảo sát và Phân tích nghiệp vụ:
-Thu thập, phân tích tài liệu và nghiên cứu các mô hình Crowdsourcing Testing thành công trên thế giới.
-Phân tích yêu cầu và quy trình làm việc thực tế của cộng đồng Tester và Client tại Việt Nam.
Phương pháp Phân tích và Thiết kế hệ thống (UML/Diagrams):
-Sử dụng các biểu đồ (ví dụ: Use Case Diagram, Sequence Diagram) để mô hình hóa các luồng nghiệp vụ cốt lõi của nền tảng (ví dụ: luồng Báo cáo lỗi, luồng Ứng tuyển dự án).
-Thiết kế cấu trúc database, tập trung vào việc xây dựng Row-Level Security (RLS) hiệu quả trên Supabase.
Phương pháp Kiểm thử và Đánh giá hiệu suất:
-Tiến hành kiểm thử đơn vị (Unit Testing) và kiểm thử tích hợp (Integration Testing) để đảm bảo tính ổn định của các chức năng chính.
-Đánh giá hiệu suất của ứng dụng, đặc biệt là tốc độ phản hồi của các chức năng Realtime.

4.Cấu trúc đồ án
Cấu trúc đồ án gồm các phần sau:
Mở đầu
Chương 1: Cơ sở lý thuyết
Chương 2: Phân tích thiết kế hệ thống
Chương 3: Xây dựng chương trình
Kết luận và hướng phát triển của đề tài

Chương 1
Phân tích yêu cầu bài toán
1.1. Giới thiệu
1.1.1. Mục tiêu của ứng dụng
Ứng dụng UVTester được phát triển nhằm thực hiện các mục tiêu chính sau:
-Tạo ra kênh kết nối chính thức: Cho phép các đội ngũ phát triển/Client dễ dàng đăng tải dự án kiểm thử và tìm kiếm các Tester/Freelancer có kỹ năng phù hợp một cách nhanh chóng, minh bạch.
-Hỗ trợ đa dạng chu trình kiểm thử: Cung cấp nền tảng để thực hiện và quản lý hiệu quả các loại hình kiểm thử linh hoạt như Exploratory Testing và các Test Case Cycles cụ thể.
-Tối ưu hóa quy trình báo cáo lỗi (Bug Reporting Tracker): Cung cấp giao diện trực quan để Tester nộp báo cáo lỗi chi tiết (kèm hình ảnh, mô tả, bước tái hiện), và cho phép Client theo dõi, cập nhật trạng thái lỗi theo thời gian thực (Realtime).
-Đảm bảo sự minh bạch về chất lượng và tài chính: Xây dựng hệ thống đánh giá/xếp hạng Tester và mô phỏng quy trình thanh toán tự động dựa trên kết quả công việc, khuyến khích sự chuyên nghiệp của cả hai bên.
-Chứng minh năng lực công nghệ: Áp dụng thành công kiến trúc Next.js và dịch vụ Backend-as-a-Service (BaaS) của Supabase (Auth, RLS, Realtime) để xây dựng một ứng dụng đa vai trò, an toàn và hiệu suất cao.
1.1.2. Vấn đề cần giải quyết
Đề tài UVTester được xây dựng để giải quyết các vấn đề tồn đọng và khó khăn hiện tại trong ngành công nghiệp kiểm thử phần mềm tại Việt Nam:
-Khó khăn trong tìm kiếm nguồn lực kiểm thử linh hoạt: Các đội phát triển nhỏ hoặc Startups thường thiếu ngân sách để thuê QA toàn thời gian hoặc gặp khó khăn khi tìm kiếm Tester chuyên nghiệp cho các dự án ngắn hạn hoặc đột xuất.
-Thiếu một nền tảng Crowdtesting tập trung và chuyên biệt trong nước: Các đội ngũ Việt Nam thường phải làm việc với các nền tảng nước ngoài (có rào cản ngôn ngữ, thanh toán quốc tế) hoặc sử dụng các kênh tuyển dụng chung (không chuyên biệt về QA).
-Quy trình báo cáo và theo dõi lỗi kém hiệu quả: Việc trao đổi lỗi qua email, tin nhắn hoặc các công cụ không chuyên dụng làm chậm trễ quá trình sửa lỗi, gây mất mát thông tin và khó theo dõi trạng thái lỗi một cách tập trung, tức thời.
-Thiếu cơ chế đánh giá và xây dựng uy tín cho Tester tự do: Tester làm freelance thường không có nơi chính thức để xây dựng và chứng minh hồ sơ kinh nghiệm, dẫn đến việc thiếu niềm tin từ phía Client.
-Thách thức về bảo mật dữ liệu dự án (Scope/Security): Nhu cầu đảm bảo rằng chỉ các Tester được chấp thuận mới có thể xem thông tin dự án nhạy cảm là một thách thức lớn cần được giải quyết bằng các cơ chế bảo mật cấp độ hàng (như RLS của Supabase).
1.1.3. Yêu cầu chức năng
Quản lý người dùng và phân quyền:
-Xác thực tài khoản: Hỗ trợ đăng ký, đăng nhập và đăng xuất cho hai vai trò chính là Tester/Freelancer và Nhà phát triển/Client.
-Quản lý hồ sơ: Cho phép Tester cập nhật kỹ năng, thiết bị, và lịch sử công việc; cho phép Client cập nhật thông tin công ty và liên hệ.
-Phân luồng giao diện: Hệ thống phải tự động chuyển hướng người dùng đến Dashboard phù hợp với vai trò của họ sau khi đăng nhập.
Quản lý dự án và tuyển chọn:
-Đăng tải dự án: Client phải có khả năng đăng tải dự án kiểm thử mới, chỉ định loại hình kiểm thử (Exploratory hoặc Test Case Cycle), ngân sách và thời hạn.
-Tìm kiếm & ứng tuyển: Tester phải có khả năng tìm kiếm dự án và nộp đơn ứng tuyển (bao gồm cả việc nhận thông báo mời dự án qua email).
-Quản lý ứng viên: Client phải có giao diện để xem hồ sơ của Tester đã ứng tuyển và phê duyệt/từ chối họ vào dự án.
Quản lý và báo cáo lỗi (Core Feature):
-Giao diện làm việc: Sau khi được phê duyệt, Tester phải có giao diện để xem yêu cầu chi tiết và bắt đầu công việc.
-Nộp báo cáo lỗi: Tester phải có khả năng nộp báo cáo lỗi chi tiết, bao gồm tiêu đề, mô tả, bước tái hiện, mức độ nghiêm trọng và đính kèm hình ảnh/video.
-Theo dõi trạng thái Realtime: Client phải thấy được báo cáo lỗi ngay lập tức, và Tester/Client có thể xem trạng thái lỗi (Mới, Đang xử lý, Đã sửa, Đã đóng) được cập nhật tức thời (sử dụng Supabase Realtime).
-Giao tiếp theo dự án: Hỗ trợ tính năng chat/bình luận riêng biệt cho từng dự án để Client và Tester trao đổi về lỗi và yêu cầu.
Thanh toán và đánh giá:
-Theo dõi tài chính: Tester phải xem được số tiền dự kiến kiếm được và lịch sử thanh toán.
-Đánh giá: Client phải có khả năng đánh giá và xếp hạng Tester sau khi dự án hoàn tất.
1.1.4. Yêu cầu phi chức năng
Hiệu suất (Performance):
-Tốc độ phản hồi: Hệ thống phải vận hành mượt mà, đảm bảo tốc độ xử lý nhanh, đặc biệt là các thao tác đăng nhập và nộp báo cáo.
-Tải trang nhanh: Tận dụng kiến trúc Next.js để tối ưu tốc độ tải các trang công khai (Landing Page) và các Dashboard.
-Cập nhật Realtime: Các thông báo và thay đổi trạng thái lỗi phải được đồng bộ hóa tức thời (dưới 1 giây) nhờ Supabase Realtime.
Bảo mật (Security):
-Bảo vệ dữ liệu: Bảo vệ thông tin cá nhân của người dùng và dữ liệu dự án mật.
-Phân quyền cấp độ hàng: Triển khai Row-Level Security (RLS) của Supabase để đảm bảo người dùng chỉ truy cập được dữ liệu thuộc về vai trò của họ.
Khả năng sử dụng (Usability):
-Giao diện Trực quan: Giao diện người dùng phải thân thiện, dễ sử dụng, đặc biệt là quy trình nộp và theo dõi lỗi.
-Tương thích Đa nền tảng: Ứng dụng phải hiển thị và hoạt động ổn định trên các trình duyệt và thiết bị phổ biến (Responsive Design).
Khả năng mở rộng (Scalability):
-Kiến trúc Serverless: Sử dụng Next.js và Supabase để dễ dàng mở rộng khả năng xử lý người dùng và dự án trong tương lai mà không cần cấu hình server phức tạp.
1.2. Thu thập yêu cầu
1.2.1. Phương pháp thu thập thông tin
-Phỏng vấn trực tiếp các Tester và Client tiềm năng để nắm bắt nhu cầu nghiệp vụ;
-Khảo sát trực tuyến qua các công cụ Form để thu thập dữ liệu định lượng về thói quen làm việc và yêu cầu tính năng;
-Nghiên cứu cấu trúc và luồng nghiệp vụ của các nền tảng Crowdsourcing Testing quốc tế (uTest, Test.io) để đúc kết mô hình phù hợp;
-Phân tích tài liệu kỹ thuật về Next.js và Supabase để xác định các yêu cầu kỹ thuật và bảo mật (RLS).
1.2.2. Phân tích thông tin thu thập được
-Tester có nhu cầu lớn về kênh chính thức để xây dựng uy tín và theo dõi thu nhập minh bạch theo từng dự án;
-Client yêu cầu bắt buộc về bảo mật dữ liệu dự án và cần một hệ thống báo cáo lỗi tức thời (Realtime) và trực quan;
-Quy trình trao đổi lỗi hiện tại qua các công cụ không chuyên dụng làm chậm trễ quá trình xử lý và gây mất mát thông tin;
-Kiến trúc Next.js và Supabase là giải pháp tối ưu về mặt kỹ thuật để xây dựng ứng dụng đa vai trò với khả năng Realtime và bảo mật (RLS) vượt trội.
Tác nhân chính Mô tả vai trò
Xác định các Actor (tác nhân)Tester (Freelancer) Đăng ký hồ sơ, tìm kiếm, ứng tuyển và thực hiện kiểm thử các dự án (Exploratory/Test Case Cycles).
Nộp báo cáo lỗi chi tiết và theo dõi tài chính/thanh toán.
Nhà Phát triển (Client) Đăng ký thông tin đội nhóm/công ty, đăng tải dự án kiểm thử, duyệt ứng viên Tester.
Theo dõi báo cáo lỗi Realtime, giao tiếp với Tester và thực hiện thanh toán.
Quản trị viên (Admin) Duyệt tài khoản, kiểm duyệt các dự án được đăng, quản lý danh mục kỹ năng, và hỗ trợ giải quyết các tranh chấp phát sinh giữa Tester và Client.
Hệ thống (System) Xử lý xác thực người dùng (Supabase Auth), cung cấp cơ chế bảo mật dữ liệu (RLS), xử lý cập nhật trạng thái lỗi tức thời (Supabase Realtime) và gửi các thông báo tự động (email mời dự án).

1.2.3. Lý do xây dựng ứng dụng
Ứng dụng UVTester được xây dựng nhằm giải quyết các vấn đề sau:
-Thiếu kênh kết nối chính thức: Tạo cầu nối tập trung giúp Client dễ dàng tìm kiếm Tester tự do chuyên nghiệp, giải quyết nhu cầu kiểm thử linh hoạt và tiết kiệm chi phí.
-Quy trình báo cáo lỗi kém hiệu quả: Thay thế các công cụ rời rạc bằng một nền tảng thống nhất, cho phép báo cáo lỗi tức thời (Realtime) và theo dõi trạng thái minh bạch.
-Thiếu cơ chế uy tín: Cung cấp nơi để Tester xây dựng hồ sơ, uy tín cá nhân và theo dõi thu nhập một cách rõ ràng, minh bạch.
-Áp dụng công nghệ hiện đại: Chứng minh khả năng xây dựng ứng dụng phức tạp, đa vai trò bằng Next.js/JavaScript và kiến trúc Serverless/BaaS của Supabase (RLS, Realtime).
1.2.4. Những điểm nổi bật của ứng dụng
Các điểm nổi bật chính của nền tảng UVTester bao gồm:
-Hệ thống đa vai trò chuyên biệt: thiết kế Dashboard riêng cho Tester và Client, tối ưu hóa theo luồng nghiệp vụ kiểm thử.
-Bảo mật dữ liệu cấp độ Hàng (RLS): triển khai Row-Level Security của Supabase để đảm bảo an toàn tuyệt đối cho dữ liệu dự án mật.
-Báo cáo lỗi thời gian thực (Realtime): sử dụng Supabase Realtime để cập nhật trạng thái lỗi tức thì, giảm thiểu thời gian phản hồi.
-Quy trình lọc và duyệt ứng viên: Client có thể duyệt hồ sơ và phê duyệt Tester trước khi tham gia, đảm bảo chất lượng đầu vào.
-Kiến trúc hiện đại và hiệu suất: xây dựng bằng bộ công nghệ Next.js/JavaScript và kiến trúc Serverless/BaaS, dễ dàng mở rộng.
1.2.5. Giá trị mang lại
Tăng tốc thời gian phát hành (Time-to-Market): giúp đội phát triển tìm nguồn lực và xử lý lỗi nhanh chóng, rút ngắn chu kỳ kiểm thử.
Xây dựng uy tín và thu nhập cho Tester: cung cấp kênh chính thức để Tester xây dựng hồ sơ, nhận đánh giá và theo dõi thu nhập minh bạch.
Chuẩn hóa quy trình lỗi: Đưa quy trình báo cáo lỗi vào một hệ thống thống nhất, loại bỏ sự rời rạc và trùng lặp thông tin.
Hiệu quả chi phí: Client chỉ trả phí cho kết quả thực tế, tiết kiệm chi phí vận hành đội ngũ QA cố định.
Minh chứng Công nghệ: Thể hiện khả năng làm chủ các công nghệ tiên tiến Next.js và Supabase trong một giải pháp thực tiễn
1.3. Đánh giá sản phẩm
TÊN SẢN PHẨM Quản lý Tester/ Client Quản lý Ứng tuyển & Phê duyệt Báo cáo lỗi Realtime (Supabase) Bảo mật Cấp độ Hàng (RLS) Thanh toán mô phỏng
TesterWork X X X
Jira X (Thông qua plugin)
UVTester X X X X X

1.4. User story
1.4.1. Tài khoản (Người dùng chung)
1.4.1.1. Đăng nhập
Với tư cách là người dùng Tôi muốn đăng nhập vào hệ thống bằng email và mật khẩu để tôi có thể truy cập vào các tính năng chuyên biệt của Tester hoặc Client.
Đăng nhập Độ ưu tiên: Cao
Yêu cầu người dùng: Người dùng muốn đăng nhập vào hệ thống email và mật khẩu. Tiêu chuẩn chấp nhận
○Người dùng có thể đăng nhập thành công khi nhập email và mật khẩu đã đăng ký.
○Hệ thống sẽ tạo và sử dụng Session/Token để xác thực người dùng trong các yêu cầu tiếp theo (Sử dụng Supabase Auth).
○Hiển thị thông báo lỗi khi: Email không hợp lệ, Mật khẩu sai hoặc tài khoản chưa được kích hoạt.

1.4.1.2. Đăng ký
Với tư cách là người dùng mới Tôi muốn đăng ký tài khoản bằng email và mật khẩu để tôi có thể chọn vai trò (Tester/Client) và bắt đầu sử dụng nền tảng UVTester.
Đăng ký Độ ưu tiên: Cao
Yêu cầu người dùng: Người dùng muốn đăng ký tài khoản bằng email và mật khẩu, đồng thời chọn vai trò ban đầu. Tiêu chuẩn chấp nhận
○Người dùng có thể đăng ký thành công và nhận được email xác nhận (Nếu cần).
○Sau khi đăng ký, hệ thống phải lưu trữ vai trò (role: 'tester' hoặc 'client') vào bảng profiles liên kết với Supabase Auth.
○Hiển thị thông báo khi: Email đã tồn tại, Mật khẩu không đủ mạnh.

1.4.2. Quản lý dự án (Vai trò Client)
1.4.2.1. Đăng tải dự án
Với tư cách là Client Tôi muốn đăng tải chi tiết một dự án kiểm thử mới để Tester tự do có thể tìm thấy và ứng tuyển.
Đăng tải dự án Độ ưu tiên: Cao
Yêu cầu người dùng: Client cần nhập thông tin đầy đủ về dự án, loại hình kiểm thử (Exploratory/Test Case), và ngân sách. Tiêu chuẩn chấp nhận
○Dữ liệu dự án được lưu trữ an toàn vào bảng projects trên Supabase, bao gồm cả ID của Client.
○Dự án sẽ được chuyển sang trạng thái "Chờ xét duyệt" (nếu Admin cần kiểm duyệt) hoặc "Đang mở" ngay lập tức.
○Hiển thị thông báo lỗi nếu các trường bắt buộc (ví dụ: Mô tả dự án) bị bỏ trống.

1.4.2.2. Duyệt ứng viên
Với tư cách là Client Tôi muốn xem danh sách các Tester đã ứng tuyển và duyệt/từ chối họ để tôi có thể chọn được nguồn lực kiểm thử phù hợp cho dự án.
Duyệt ứng viên Độ ưu tiên: Trung bình
Yêu cầu người dùng: Client cần xem hồ sơ Tester, quyết định chấp nhận hoặc từ chối Tester. Tiêu chuẩn chấp nhận
○Client có thể truy cập hồ sơ chi tiết của các Tester đã ứng tuyển vào dự án của họ.
○Khi Client phê duyệt, hệ thống sẽ cập nhật trạng thái của Tester đó thành "Đã được chấp nhận" trong bảng applications.
○Tester nhận được thông báo Realtime (hoặc email) về kết quả ứng tuyển.

1.4.3. Quản lý lỗi (Vai trò Tester)
1.4.3.1. Nộp báo cáo lỗi (Bug report)
Với tư cách là Tester Tôi muốn nộp một báo cáo lỗi chi tiết cho dự án tôi đang thực hiện để Client có đầy đủ thông tin để tái hiện và khắc phục lỗi.
Nộp báo cáo lỗi (Bug report) Độ ưu tiên: Cao
Yêu cầu người dùng: Tester cần nhập mô tả lỗi, bước tái hiện, mức độ nghiêm trọng và đính kèm bằng chứng (ảnh/video). Tiêu chuẩn chấp nhận
○Báo cáo lỗi được lưu trữ thành công vào bảng bug_reports trên Supabase, liên kết với ID của Tester và ID của Dự án.
○Client nhận được thông báo Realtime ngay lập tức rằng một lỗi mới đã được nộp.
○Hệ thống phải giới hạn dung lượng file đính kèm và kiểm tra tính hợp lệ của các trường bắt buộc.

1.4.3.2. Theo dõi trạng thái dự án (Realtime)
Với tư cách là Tester Tôi muốn xem trạng thái mới nhất của các lỗi tôi đã nộp để tôi biết khi nào lỗi đã được Client xem, sửa, hoặc cần cung cấp thêm thông tin.
Theo dõi trạng thái dự án (Realtime) Độ ưu tiên: Trung bình
Yêu cầu người dùng: Tester cần cập nhật trạng thái lỗi Realtime (Đang xử lý, Đã sửa, Đã đóng). Tiêu chuẩn chấp nhận
○Trạng thái lỗi trên giao diện Tester được cập nhật tức thời (sử dụng Supabase Realtime) khi Client thay đổi trạng thái.
○Tester có thể xem lịch sử trao đổi (bình luận) giữa họ và Client về lỗi đó.

1.4.4. Quản lý hệ thống (Vai trò Admin)
1.4.4.1. Kiểm duyệt dự án
Với tư cách là Admin Tôi muốn kiểm duyệt các dự án mới do Client đăng tải để đảm bảo nội dung phù hợp, hợp pháp và đủ thông tin trước khi hiển thị công khai cho Tester.
Quản lý hệ thống Độ ưu tiên: Cao
Yêu cầu người dùng: Admin cần xem chi tiết dự án, phê duyệt hoặc từ chối. Tiêu chuẩn chấp nhận
○Admin có giao diện để xem tất cả các dự án có trạng thái "Chờ Kiểm duyệt".
○Khi Admin phê duyệt, trạng thái dự án chuyển thành "Đang mở" và hiển thị cho Tester.
○Nếu Admin từ chối, hệ thống gửi thông báo/email cho Client kèm lý do.

1.4.4.2. Quản lý tài khoản người dùng
Với tư cách là Admin Tôi muốn xem, khóa (tạm ngừng) hoặc mở lại tài khoản của Tester/Client để xử lý các vi phạm quy tắc hoặc tranh chấp.
Quản lý tài khoản người dùng
Độ ưu tiên: Trung bình
Yêu cầu người dùng: Admin cần có khả năng quản lý trạng thái tài khoản người dùng. Tiêu chuẩn chấp nhận
○Admin có thể tìm kiếm và xem chi tiết hồ sơ của bất kỳ Tester hoặc Client nào.
○Khi Admin khóa tài khoản, người dùng đó không thể đăng nhập hoặc thực hiện bất kỳ hành động nào trên nền tảng.
1.4.4.3. Quản lý danh mục kỹ năng
Với tư cách là Admin Tôi muốn thêm, sửa hoặc xóa các danh mục Kỹ năng/Công nghệ để đảm bảo danh sách kỹ năng trên nền tảng luôn được cập nhật và chính xác.
Quản lý tài khoản người dùng
Độ ưu tiên: Thấp
Yêu cầu người dùng: Admin cần quản lý các danh mục phụ trợ của hệ thống. Tiêu chuẩn chấp nhận
○Admin có giao diện để chỉnh sửa danh mục kỹ năng (ví dụ: JavaScript, Next.js, Android) và các thay đổi được áp dụng ngay lập tức cho form hồ sơ của Tester.

Chương 2
PHÂN TÍCH THIẾT KẾ HỆ THỐNG
2.1. Khảo sát yêu cầu
2.1.1. Hoạt động nghiệp vụ

Hình 2.1:Sơ đồ nghiệp vụ
2.1.2. Diễn giải quy trình nghiệp vụ
STT Hoạt động Input Data Output Data End User

1. Đăng ký/Đăng nhập Thông tin tài khoản (email, mật khẩu, chọn vai trò) Trạng thái đăng nhập (thành công/thất bại) Tester/Client/Admin
2. Quản lý hồ sơ Thông tin cá nhân (kỹ năng, thiết bị, kinh nghiệm) / Thông tin công ty Hồ sơ đã cập nhật Tester/Client
3. Đăng tải dự án Mô tả yêu cầu, loại test cycle, ngân sách, thời hạn Dự án mới được lưu (Trạng thái: Chờ Admin) Client
4. Kiểm duyệt dự án Danh sách dự án (Client ID, Mô tả) Dự án được chuyển trạng thái sang "Đang mở" hoặc "Từ chối" Admin
5. Quản lý danh mục Tên, mô tả danh mục kỹ năng/công nghệ Danh mục kỹ năng được cập nhật Admin
6. Ứng tuyển dự án ID Dự án, hồ sơ của Tester Đơn ứng tuyển được lưu (Trạng thái: Chờ duyệt) Tester
7. Duyệt ứng viên Danh sách Tester đã ứng tuyển, quyết định phê duyệt/từ chối Cập nhật trạng thái Tester sang "Được chấp nhận" / "Từ chối" Client
8. Nộp báo cáo lỗi Mô tả lỗi, bước tái hiện, mức độ nghiêm trọng, file đính kèm Báo cáo Lỗi mới được lưu (Trạng thái: Mới) và thông báo Realtime Tester
9. Xem xét lỗi Báo cáo lỗi chi tiết, phản hồi/bình luận Lỗi được cập nhật trạng thái "Đang xử lý" / "Phê duyệt" Client
10. Thanh toán mô phỏng Tổng hợp số lỗi đã phê duyệt và mức giá Giao dịch thanh toán được ghi nhận, lịch sử tài chính được cập nhật Client
11. Đánh giá công việc Điểm đánh giá (Rating) và nhận xét Đánh giá được lưu vào hồ sơ Tester/Client
12. Trao đổi giao tiếp (Chat) Nội dung tin nhắn Tin nhắn được hiển thị tức thời (Realtime) Tester/Client

Bảng 2.1:Diễn giải sơ đồ nghiệp vụ
2.1.3. Liệt kê người dùng và yêu cầu
2.1.3.1. Tester (Freelancer)
Là người dùng có mục đích tìm kiếm dự án, thực hiện kiểm thử theo yêu cầu, nộp báo cáo lỗi chi tiết và nhận thanh toán.
Yêu cầu chức năng:
Đăng ký/Đăng nhập tài khoản và chọn vai trò.
Quản lý Hồ sơ cá nhân (kỹ năng, kinh nghiệm, thiết bị kiểm thử).
Tìm kiếm và Ứng tuyển vào các dự án đang mở (Exploratory/Test Case Cycles).
Nộp Báo cáo Lỗi chi tiết (bao gồm mô tả, các bước tái hiện, file đính kèm).
Trao đổi Giao tiếp với Client trong phạm vi dự án.
Theo dõi Lịch sử Thanh toán và số dư công việc.
2.1.3.2. Client (Nhà Phát triển)
Là người chịu trách nhiệm đăng tải dự án, tìm kiếm và thuê Tester, quản lý quá trình kiểm thử, xem xét lỗi và thực hiện thanh toán.
Yêu cầu chức năng:
Đăng ký/Đăng nhập tài khoản và chọn vai trò.
Đăng tải Dự án mới với các yêu cầu, ngân sách và thời hạn cụ thể.
Duyệt Hồ sơ và Ứng viên Tester cho dự án của mình.
Xem xét Báo cáo Lỗi chi tiết và cập nhật trạng thái lỗi (Phê duyệt/Từ chối).
Theo dõi Tiến độ kiểm thử và trạng thái công việc của Tester.
Thực hiện Thanh toán mô phỏng và Đánh giá chất lượng công việc của Tester.
2.1.3.3. Quản trị viên (Admin)
Là người chịu trách nhiệm kiểm duyệt, quản lý dữ liệu toàn hệ thống, hỗ trợ kỹ thuật và giải quyết các vấn đề chung.
Yêu cầu chức năng:
Đăng nhập tài khoản với quyền hạn cao nhất.
Kiểm duyệt Dự án được đăng tải trước khi hiển thị công khai cho Tester.
Quản lý Tài khoản người dùng (Khóa/Mở) để xử lý vi phạm.
Quản lý Danh mục kỹ năng, công nghệ, lĩnh vực test được sử dụng trên nền tảng.
Thống kê và theo dõi tổng quan số lượng người dùng, dự án, và giao dịch.
2.1.3.4. Hệ thống (System)
Là phần tử xử lý logic, dữ liệu và đảm bảo hoạt động xuyên suốt giữa các tác nhân.
Yêu cầu chức năng:
Quản lý Xác thực và Phân quyền người dùng (Supabase Auth).
Đảm bảo Bảo mật Dữ liệu bằng cơ chế Row-Level Security (RLS).
Cập nhật Trạng thái Realtime cho các sự kiện quan trọng (báo cáo lỗi mới, thay đổi trạng thái lỗi) thông qua Supabase Realtime.
Gửi Thông báo tự động (email mời dự án, xác nhận thanh toán).
Quản lý Dữ liệu dự án, lỗi, hồ sơ và giao dịch một cách có cấu trúc (dữ liệu quan hệ).
2.2. Phân tích thiết kế hệ thống
2.2.1. Liệt kê Actor và Usecase
Actor Usecase tổng quát Usecase phân rã
Tester (Freelancer) Quản lý tài khoản & hồ sơ Đăng ký tài khoản
Đăng nhập hệ thống
Cập nhật hồ sơ (kỹ năng, thiết bị)
Xem lịch sử thanh toán/thu nhập
Tìm kiếm & ứng tuyển dự án Tìm kiếm/lọc dự án
Xem chi tiết dự án
Gửi đơn ứng tuyển dự án
Theo dõi trạng thái ứng tuyển
Thực hiện kiểm thử & báo cáo Nộp báo cáo lỗi chi tiết (Bug Report)
Thực hiện Test Cycle
Thực hiện Test Case (nếu có)
Giao tiếp với Client (Chat/Comment)
Đánh giá Client sau dự án
Client (Nhà phát triển) Quản lý tài khoản & dự án Đăng ký tài khoản (công ty/đội nhóm)
Đăng nhập hệ thống
Đăng tải dự án mới
Tạo và quản lý Test Cases
Theo dõi tiến độ dự án
Quản lý Tester Xem hồ sơ Tester ứng tuyển
Phê duyệt/Từ chối Tester
Quản lý lỗi & thanh toán Xem xét báo cáo lỗi (Realtime)
Cập nhật trạng thái lỗi (Phê duyệt/Từ chối)
Thực hiện thanh toán (mô phỏng)
Đánh giá Tester sau dự án
Quản trị viên (Admin) Quản lý người dùng Xem danh sách Tester/Client
Khóa/Mở tài khoản vi phạm
Quản lý hệ thống Kiểm duyệt dự án mới
Hỗ trợ & thống kê Xem thống kê tổng quan hệ thống
Bảng 2.2:Liệt kê Actor và Usecase

2.2.2. Sơ đồ usecase

Hình 2.2:Sơ đồ Usecase nền tảng kết nối và quản lý chu trình kiểm thử UVTester cho Tester (Freelancer)

2.2.3. Kịch bản và sơ đồ hoạt động
2.2.3.1. Kịch bản cho usecase “Đăng nhập”
Tên usecase Đăng nhập
Mô tả Người dùng (Tester, Client, Admin) đăng nhập vào hệ thống UVTester để truy cập các chức năng phù hợp với vai trò của họ.
Tác nhân Tester, Client, Admin
Dữ liệu đầu vào Email, mật khẩu
Dữ liệu đầu ra Đăng nhập thành công → Chuyển đến trang Dashboard theo vai trò.Đăng nhập thất bại → Hiển thị thông báo lỗi.
Luồng chính 1.Người dùng truy cập trang "Đăng nhập".
2.Nhập địa chỉ Email.
3.Nhập Mật khẩu.
4.Nhấn nút "Đăng nhập".
5.Hệ thống xác thực thông tin.
6.Kết quả: Xác thực thành công. Hệ thống tạo phiên (session) và chuyển hướng người dùng đến Dashboard tương ứng với vai trò (ví dụ: /tester/dashboard hoặc /client/dashboard).
Luồng thay thế (Alternative Flows) Luồng 1: Quên mật khẩu (Usecase <<extend>>)
1.Người dùng nhấn vào "Quên mật khẩu?".
2.Hệ thống chuyển hướng đến trang "Khôi phục mật khẩu".
Luồng 2: Chưa có tài khoản
1.Người dùng nhấn vào liên kết "Đăng ký".
2.Hệ thống chuyển hướng đến trang "Đăng ký".
Các trường hợp ngoại lệ 1.Sai thông tin: Hệ thống xác thực thất bại (email không tồn tại hoặc sai mật khẩu) → Hiển thị thông báo: "Email hoặc mật khẩu không chính xác."
2.Bỏ trống dữ liệu: Người dùng nhấn "Đăng nhập" khi Email hoặc Mật khẩu bị bỏ trống → Hiển thị thông báo lỗi tại trường tương ứng: "Vui lòng nhập email/mật khẩu."
3.Lỗi hệ thống: Lỗi kết nối đến server Supabase → Hiển thị thông báo: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau."

2.2.3.2. Kịch bản cho usecase “Đăng ký”
Tên usecase Đăng ký
Mô tả Người dùng mới (Tester hoặc Client) tạo tài khoản trên hệ thống UVTester để bắt đầu sử dụng dịch vụ.
Tác nhân Tester, Client (Người dùng mới)
Điều kiện tiên quyết Người dùng chưa đăng nhập.
Dữ liệu đầu vào Email, mật khẩu, vai trò mong muốn (Tester hoặc Client).
Dữ liệu đầu ra Tài khoản mới được tạo trong hệ thống (Supabase Auth + Bảng Profiles).
Luồng chính 1.Người dùng truy cập trang chủ và nhấn nút "Đăng ký".
2.Hệ thống hiển thị Form đăng ký.
3.Người dùng nhập Email hợp lệ.
4.Người dùng nhập mật khẩu và xác nhận mật khẩu (khớp nhau).
5.Người dùng chọn vai trò: "Tôi là Tester" hoặc "Tôi là Client".
6.Người dùng nhấn nút "Tạo tài khoản".
7.Hệ thống kiểm tra tính hợp lệ (Email chưa tồn tại, mật khẩu đủ mạnh).
8.Hệ thống tạo tài khoản xác thực (Auth User) và lưu thông tin vai trò vào cơ sở dữ liệu (Profile).
9.Kết quả: Hiển thị thông báo: "Đăng ký thành công" và tự động chuyển hướng đến trang "Cập nhật Hồ sơ" (để điền thêm thông tin chi tiết).
Luồng thay thế (Alternative Flows) Luồng 1: Đăng ký bằng Google
1.Người dùng nhấn nút "Đăng ký với Google".
2.Hệ thống chuyển hướng sang trang xác thực của Google.
3.Sau khi xác thực, hệ thống tự động tạo tài khoản dựa trên email Google.
Các trường hợp ngoại lệ 1.Email đã tồn tại: Hệ thống kiểm tra thấy email đã được sử dụng → Hiển thị thông báo: "Email này đã được đăng ký. Vui lòng đăng nhập."
2.Mật khẩu không khớp: Mật khẩu và Xác nhận mật khẩu không giống nhau → Hiển thị thông báo: "Mật khẩu nhập lại không khớp."
3.Mật khẩu yếu: Mật khẩu ngắn hơn 6 ký tự → Hiển thị thông báo: "Mật khẩu phải có ít nhất 6 ký tự."
2.2.3.3. Kịch bản cho usecase “Quên mật khẩu”
Tên usecase Quên mật khẩu
Mô tả Người dùng (Tester, Client, Admin) đã đăng ký nhưng quên mật khẩu, thực hiện quy trình để đặt lại mật khẩu mới.
Tác nhân Người dùng (Tester, Client, Admin)
Điều kiện tiên quyết Người dùng đang ở màn hình "Đăng nhập".
Dữ liệu đầu vào Email đã đăng ký.
Dữ liệu đầu ra Email hướng dẫn đặt lại mật khẩu được gửi đi.Mật khẩu mới được cập nhật.
Luồng chính 1.Tại trang "Đăng nhập", người dùng nhấn vào liên kết "Quên mật khẩu?".
2.Hệ thống chuyển hướng đến trang "Khôi phục mật khẩu", yêu cầu nhập Email.
3.Người dùng nhập Email đã đăng ký và nhấn nút "Gửi".
4.Hệ thống (sử dụng Supabase Auth) xác thực Email.
5.Hệ thống gửi một Email (Link) chứa liên kết đặt lại mật khẩu đến địa chỉ Email đó.
6.Kết quả: Hiển thị thông báo: "Đã gửi liên kết khôi phục. Vui lòng kiểm tra email."
7.Người dùng mở Email, nhấp vào liên kết.
8.Hệ thống chuyển hướng người dùng đến trang "Tạo Mật khẩu mới".
9.Người dùng nhập Mật khẩu mới và Xác nhận mật khẩu mới.
10.Người dùng nhấn "Lưu".
11.Hệ thống cập nhật mật khẩu mới thành công và tự động đăng nhập người dùng (hoặc chuyển về trang Đăng nhập).
Luồng thay thế (Alternative Flows) Không có.
Các trường hợp ngoại lệ 1.Email không tồn tại: Người dùng nhập Email không có trong hệ thống → Hiển thị thông báo: "Email không được tìm thấy." (Hoặc vì lý do bảo mật, vẫn hiển thị thông báo "Đã gửi liên kết" để tránh lộ thông tin).
2.Bỏ trống Email: Người dùng nhấn "Gửi" khi chưa nhập Email → Hiển thị thông báo: "Vui lòng nhập Email."
3.Liên kết hết hạn: Người dùng nhấp vào liên kết trong Email sau khi đã hết hạn (ví dụ: sau 1 giờ) → Hiển thị thông báo: "Liên kết đã hết hạn. Vui lòng thử lại."
2.2.3.4. Kịch bản cho usecase “Quản lý hồ sơ”
Tên usecase Quản lý hồ sơ
Mô tả Người dùng (Tester hoặc Client) cập nhật thông tin cá nhân, kỹ năng (Tester) hoặc thông tin công ty (Client) để xây dựng uy tín và quản lý tài khoản.
Tác nhân Tester, Client
Điều kiện tiên quyết Người dùng đã đăng nhập.
Dữ liệu đầu vào Tester: Họ tên, Ảnh đại diện, kỹ năng (VD: Những loại ứng dụng sẵn sàng test, loại hình kiểm thử chuyên môn,…), thiết bị (VD: Tên thiết bị, hệ điều hành,…), mô tả kinh nghiệm,….
Client: Tên công ty, website, quy mô, thông tin liên hệ,….
Dữ liệu đầu ra Hồ sơ người dùng được cập nhật trong Database.
Luồng chính 1.Người dùng truy cập trang dashboard của mình và nhấn vào mục "Hồ sơ" hoặc "Cài đặt tài khoản".
2.Hệ thống hiển thị form chứa các thông tin hồ sơ hiện tại.
3.Người dùng chỉnh sửa các trường thông tin (ví dụ: Tester thêm kỹ năng mới, Client cập nhật tên công ty).
4.Người dùng nhấn nút "Lưu thay đổi".
5.Hệ thống kiểm tra tính hợp lệ của dữ liệu (ví dụ: định dạng website của Client, danh sách kỹ năng của Tester).
6.Hệ thống cập nhật thông tin mới vào bảng profiles trong Database.
7.Kết quả: Hiển thị thông báo: "Cập nhật hồ sơ thành công."
Luồng thay thế (Alternative Flows) Luồng: Thay đổi Mật khẩu
1.Người dùng chọn tab/nút "Đổi Mật khẩu" trong trang Quản lý hồ sơ.
2.Hệ thống yêu cầu nhập Mật khẩu cũ và Mật khẩu mới (xác nhận 2 lần).
3.Hệ thống (Supabase Auth) xác thực và cập nhật mật khẩu mới.
Các trường hợp ngoại lệ 1.Dữ liệu không hợp lệ: Client nhập địa chỉ Website không đúng định dạng → Hiển thị thông báo: "Định dạng Website không hợp lệ."
2.Lỗi tải lên: Tester tải lên ảnh đại diện có dung lượng quá lớn hoặc sai định dạng (ví dụ: .zip) → Hiển thị thông báo: "File không hợp lệ hoặc dung lượng quá lớn."
3.Lỗi hệ thống: Mất kết nối Database khi đang lưu → Hiển thị thông báo: "Lưu hồ sơ thất bại. Vui lòng thử lại sau."

2.2.3.5. Kịch bản cho usecase “Thực hiện Test Cycle”
Tên usecase Thực hiện Test Cycle (Không gian làm việc dự án)
Mô tả Tester truy cập vào không gian làm việc chính của một dự án (sau khi được duyệt) để xem thông tin, thực hiện kiểm thử khám phá (Exploratory), và truy cập các chức năng con.
Tác nhân Tester
Điều kiện tiên quyết Tester đã đăng nhập và đã được Client phê duyệt vào dự án.
Dữ liệu đầu vào ID Dự án (Project ID).
Dữ liệu đầu ra Giao diện làm việc của dự án (Project Workspace).
Luồng chính 1.Tester truy cập "Dashboard" và chọn một dự án đang hoạt động.
2.Hệ thống (áp dụng RLS) xác thực Tester có quyền truy cập dự án này.
3.Hệ thống hiển thị giao diện làm việc chính (Test Cycle) bao gồm:
○Tab Thông tin/Scope: Mô tả chi tiết dự án, yêu cầu, các liên kết (link) đến sản phẩm cần test.
○Tab Báo cáo lỗi: Nơi Tester có thể nộp lỗi mới (kích hoạt Usecase (Nộp báo cáo lỗi)) và xem các lỗi mình đã nộp.
○Tab Chat: Để giao tiếp với Client.
4.Tester đọc thông tin và bắt đầu quá trình kiểm thử khám phá (Exploratory) trên ứng dụng của Client.
5.Kết quả: Tester tìm thấy lỗi và chuyển sang Usecase (Nộp báo cáo lỗi).
Luồng thay thế (Alternative Flows) Luồng: Dự án là Test Case Cycle (Usecase <<extend>>)
1.Hệ thống kiểm tra thấy loại dự án là "Test Case Cycle".
2.Hệ thống hiển thị thêm một Tab "Test Cases" trong giao diện làm việc.
3.Tester nhấn vào Tab "Test Cases" để kích hoạt Usecase (Thực hiện Test Case).
Các trường hợp ngoại lệ 1.Dự án đã đóng: Tester cố gắng truy cập một dự án đã kết thúc hoặc bị Client đóng → Hiển thị thông báo: "Dự án này đã kết thúc."
2.Truy cập trái phép: Tester cố gắng truy cập dự án bằng ID (qua URL) mà họ không được duyệt → Hệ thống (nhờ RLS) chặn và hiển thị lỗi "Không có quyền truy cập."

2.2.3.6. Kịch bản cho usecase “Thực hiện Test Case”
Tên usecase Thực hiện Test Case (Kịch bản có sẵn)
Mô tả Tester thực hiện các kịch bản kiểm thử (Test Cases) được Client định nghĩa trước và báo cáo kết quả (Pass/Fail) cho từng kịch bản.
Tác nhân Tester
Điều kiện tiên quyết Tester đang ở trong Usecase (Thực hiện Test Cycle) của một dự án "Test Case Cycle".
Dữ liệu đầu vào Danh sách các Test Cases (TC), các bước thực hiện của TC, kết quả (Pass/Fail).
Dữ liệu đầu ra Trạng thái của Test Case được cập nhật (Pass/Fail), Báo cáo lỗi mới (nếu Fail).
Luồng chính (Pass) 1.Tester nhấn vào Tab "Test Cases" (trong Usecase "Thực hiện Test Cycle").
2.Hệ thống hiển thị danh sách các Test Cases được giao (ví dụ: TC-01, TC-02...).
3.Tester chọn một Test Case (ví dụ: TC-01) để bắt đầu.
4.Tester đọc các bước hướng dẫn (Instructions) trong Test Case.
5.Tester thực hiện các bước trên ứng dụng/website cần test.
6.Kết quả: Ứng dụng hoạt động đúng như mong đợi.
7.Tester nhấn nút "Pass" (Đạt).
8.Hệ thống lưu kết quả "Pass" và cập nhật tiến độ (ví dụ: 1/6 test cases approved).
Luồng thay thế (Fail) (Các bước 1-5 như trên)
6.Kết quả: Ứng dụng hoạt động không đúng như mong đợi (ví dụ: bị crash, lỗi giao diện).
7.Tester nhấn nút "Fail" (Không đạt).
8.Hệ thống kích hoạt Usecase (Nộp báo cáo lỗi) <<include>>.
9.Tester bắt buộc phải điền Form báo cáo lỗi (đính kèm bằng chứng) để giải thích lý do "Fail".
10.Sau khi nộp lỗi, hệ thống lưu kết quả "Fail" cho Test Case đó.
Các trường hợp ngoại lệ 1. Bị chặn (Blocked): Tester không thể thực hiện Test Case này vì một lỗi ở Test Case trước đó (ví dụ: không thể đăng nhập) → Tester chọn trạng thái "Blocked" và ghi lý do.

2.2.3.7. Kịch bản cho usecase “Nộp báo cáo lỗi”
Tên usecase Nộp Báo cáo Lỗi
Mô tả Tester nộp một báo cáo lỗi chi tiết cho một dự án mà họ đã được phê duyệt tham gia.
Tác nhân Tester
Điều kiện tiên quyết Tester đã đăng nhập và đã được Client phê duyệt vào dự án.
Dữ liệu đầu vào Tiêu đề lỗi, Mô tả chi tiết, Các bước tái hiện, Mức độ nghiêm trọng, File đính kèm (ảnh/video).
Dữ liệu đầu ra Báo cáo lỗi mới được lưu vào Database (Trạng thái: "Mới"). Thông báo Realtime cho Client.
Luồng chính 1.Tester truy cập dự án đang làm việc.
2.Tester nhấn nút "Báo cáo Lỗi mới".
3.Hệ thống hiển thị Form "Báo cáo Lỗi".
4.Tester nhập đầy đủ thông tin (Tiêu đề, Mô tả, Bước tái hiện, Mức độ nghiêm trọng) và tải lên file đính kèm.
5.Tester nhấn nút "Gửi Báo cáo".
6.Hệ thống kiểm tra tính hợp lệ của dữ liệu.
7.Hệ thống lưu báo cáo lỗi vào Database (Trạng thái: "Mới")
8.Hệ thống (qua Supabase Realtime) gửi thông báo tức thời đến Client
9.Kết quả: Hiển thị thông báo: "Nộp báo cáo thành công."
Các trường hợp ngoại lệ 1.Bỏ trống dữ liệu bắt buộc: Tester nhấn "Gửi Báo cáo" nhưng thiếu Tiêu đề hoặc Bước tái hiện → Hiển thị thông báo lỗi tại các trường bắt buộc.
2.File đính kèm quá lớn: Tester tải lên file video vượt quá dung lượng cho phép → Hiển thị thông báo: "File đính kèm vượt quá dung lượng cho phép."
2.2.3.8. Kịch bản cho usecase “Xem lịch sử thanh toán”
Tên usecase Xem lịch sử thanh toán
Mô tả Tester xem lại lịch sử các khoản thanh toán đã nhận từ các dự án đã hoàn thành và xem số dư hiện tại.
Tác nhân Tester
Điều kiện tiên quyết Tester đã đăng nhập.
Dữ liệu đầu vào Yêu cầu truy cập trang "Thanh toán" (Payouts) hoặc "Thu nhập" (Earnings).
Dữ liệu đầu ra Danh sách các giao dịch (đã thanh toán, đang chờ), tổng thu nhập, số dư hiện tại.
Luồng chính 1.Tester truy cập Dashboard và nhấn vào mục "Thanh toán" (Payouts) hoặc "Lịch sử công việc".
2.Hệ thống truy vấn cơ sở dữ liệu để lấy tất cả các giao dịch liên quan đến Tester này.
3.Hệ thống hiển thị giao diện "Lịch sử thanh toán" bao gồm:
○Tổng số dư hiện tại (số tiền từ các lỗi đã được duyệt nhưng chưa rút).
○Tổng thu nhập (tổng tiền đã kiếm được từ trước đến nay).
○Danh sách giao dịch: Liệt kê chi tiết từng khoản thanh toán (ví dụ: "Thanh toán cho dự án XYZ", "Rút tiền ngày...", "Bonus...").
4.Tester có thể xem chi tiết từng giao dịch.
5.Kết quả: Tester nắm rõ được tình hình tài chính của mình trên nền tảng.
Luồng thay thế (Alternative Flows) Luồng: Yêu cầu rút tiền
1.Tester thấy số dư khả dụng và nhấn nút "Rút tiền".
2.Hệ thống yêu cầu Tester xác nhận phương thức thanh toán (ví dụ: Ngân hàng, PayPal).
3.Tester xác nhận yêu cầu.
4.Hệ thống tạo một giao dịch rút tiền mới với trạng thái "Đang xử lý".
Các trường hợp ngoại lệ 1.Không có dữ liệu: Tester là người dùng mới, chưa hoàn thành dự án nào → Hệ thống hiển thị thông báo: "Bạn chưa có giao dịch nào."
2.Lỗi tải dữ liệu: Mất kết nối Database khi đang tải lịch sử → Hiển thị thông báo lỗi: "Không thể tải lịch sử thanh toán. Vui lòng thử lại sau."
2.2.3.9. Kịch bản cho usecase “Chat”
Tên usecase Giao tiếp Chat (Đa kênh)
Mô tả Tester trao đổi thông tin qua một hệ thống chat đa kênh, bao gồm chat công khai với các tester khác, chat riêng với Quản lý (Test Manager), và chat hỗ trợ với Admin.
Tác nhân Tester, Client (TM-Test Manager, người đại diện client quản lý chu trình kiểm thử, giao tiếp với các tester), Admin
Điều kiện tiên quyết Đã đăng nhập. (Có thể áp dụng cho dự án cụ thể hoặc toàn hệ thống).
Dữ liệu đầu vào Nội dung tin nhắn (text), file đính kèm, ID Kênh chat (Channel ID).
Dữ liệu đầu ra Tin nhắn được lưu và hiển thị tức thời (Realtime) cho các thành viên của kênh chat tương ứng.
Luồng chính (Gửi tin nhắn) 1.Người dùng (Tester) truy cập vào mục "Chat" trên Dashboard.
2.Hệ thống hiển thị giao diện Chat với 3 tab/kênh: "Public chat", "Community test manager" (Chat 1-v-1), và "UVTester".
3.Tester chọn một kênh (ví dụ: "Public chat").
4.Hệ thống (sử dụng Supabase Realtime) tải lịch sử và đăng ký (subscribe) vào kênh chat đó.
5.Tester nhập tin nhắn và nhấn "Gửi".
6.Hệ thống lưu tin nhắn vào Database, đính kèm channel_id.
7.Kết quả: Hệ thống Realtime đẩy tin nhắn mới đến tất cả các thành viên đang hoạt động trong kênh đó (ví dụ: tất cả Tester + TM trong "Public chat", hoặc chỉ TM trong "Community test manager").
Luồng thay thế (Alternative Flows) Luồng 1: Chuyển kênh chat
1.Tester nhấn sang tab "UVTester" (để chat với Admin và cũng có sự có mặt của TM).
2.Hệ thống hủy đăng ký (unsubscribe) kênh "Public chat" và đăng ký (subscribe) vào kênh "UVTester".
3.Hệ thống tải lịch sử của kênh mới.
Các trường hợp ngoại lệ 1.Mất kết nối Internet: Người dùng nhấn "Gửi" nhưng không có mạng → Tin nhắn không được gửi, hiển thị thông báo "Gửi thất bại. Đang thử lại..."
2.Lỗi phân quyền: Người dùng cố gắng gửi tin nhắn vào một kênh private (ví dụ: kênh của Admin khác) mà không được phép → Hệ thống (nhờ RLS) chặn tin nhắn.

2.2.3.10. Kịch bản cho usecase “Gửi yêu cầu hỗ trợ”
Tên usecase Gửi yêu cầu hỗ trợ
Mô tả Người dùng (Tester/Client) gửi một yêu cầu hỗ trợ (ticket) đến Admin khi gặp vấn đề kỹ thuật, tài chính, hoặc các vấn đề chung không thể tự giải quyết.
Tác nhân Tester, Client
Điều kiện tiên quyết Người dùng đã đăng nhập. (Hoặc đang ở trang "Trung tâm hướng dẫn/hỗ trợ UVTester").
Dữ liệu đầu vào Tiêu đề yêu cầu, Mô tả chi tiết vấn đề, Phân loại vấn đề (ví dụ: Kỹ thuật, Thanh toán, Tài khoản), File đính kèm (nếu có).
Dữ liệu đầu ra Yêu cầu hỗ trợ (Ticket) mới được lưu vào Database với trạng thái "Mới" (New).
Luồng chính 1.Người dùng truy cập trang "Trung tâm hướng dẫn/hỗ trợ UVTester"
2.Người dùng nhấn nút "Gửi yêu cầu hỗ trợ"
3.Hệ thống hiển thị Form "Gửi yêu cầu".
4.Người dùng chọn "Phân loại vấn đề" (ví dụ: "Vấn đề về Thanh toán").
5.Người dùng nhập "Tiêu đề" (ví dụ: "Chưa nhận được thanh toán dự án XYZ")
6.Người dùng nhập "Mô tả chi tiết" vấn đề.
7.Người dùng (tùy chọn) tải lên file đính kèm (ví dụ: ảnh chụp màn hình lỗi).
8.Người dùng nhấn nút "Gửi Yêu cầu".
9.Hệ thống kiểm tra tính hợp lệ và lưu Ticket vào Database (Trạng thái: "Mới").
10.Kết quả: Hiển thị thông báo: "Gửi yêu cầu thành công. Mã ticket của bạn là [12345]. Admin sẽ sớm phản hồi."
Luồng thay thế Luồng 1: Gửi yêu cầu mà không đăng nhập
1.Người dùng (Guest) vào trang "Hỗ trợ" và nhấn "Gửi yêu cầu".
2.Hệ thống hiển thị Form, yêu cầu nhập thêm "Email liên hệ" (vì chưa đăng nhập).
3.Hệ thống lưu Ticket và gửi email xác nhận cho Guest.
Các trường hợp ngoại lệ 1.Bỏ trống dữ liệu bắt buộc: Người dùng nhấn "Gửi" khi chưa chọn Phân loại hoặc Tiêu đề → Hiển thị thông báo lỗi tại các trường bắt buộc.
2.File quá lớn: File đính kèm vượt quá dung lượng cho phép → Hiển thị thông báo: "File đính kèm quá lớn."
3.Lỗi hệ thống: Mất kết nối Database khi đang gửi → Hiển thị thông báo: "Gửi yêu cầu thất bại. Vui lòng thử lại sau."

2.2.3.11. Kịch bản cho usecase “Đăng tải dự án”
Tên usecase Đăng tải dự án
Mô tả Client (Công ty/đội ngũ nhà phát triển) tạo và đăng tải một dự án kiểm thử mới lên hệ thống để Admin duyệt.
Tác nhân Client
Điều kiện tiên quyết Client đã đăng nhập.
Dữ liệu đầu vào Tiêu đề dự án, Mô tả chi tiết, Yêu cầu, Loại test cycle (Exploratory Test Case hoặc Usability), Ngân sách (mô phỏng), Thời hạn.
Dữ liệu đầu ra Dự án mới được lưu vào Database với trạng thái "Chờ duyệt" (Pending Admin).
Luồng chính 1.Client truy cập Dashboard và nhấn nút "Tạo Dự án mới".
2.Hệ thống hiển thị Form "Tạo dự án".
3.Client nhập đầy đủ thông tin (Tiêu đề, Mô tả, Loại test, Ngân sách, Thời hạn).
4.Client nhấn nút "Đăng dự án để xét duyệt".
5.Hệ thống kiểm tra tính hợp lệ của dữ liệu (các trường bắt buộc đã được điền).
6.Hệ thống lưu dự án mới vào Database với trạng thái "Chờ duyệt".
7.Kết quả: Chuyển hướng Client về trang "Quản lý dự án" và hiển thị thông báo: "Đăng dự án thành công. Đang chờ Admin duyệt."
Luồng thay thế (Alternative Flows) Luồng: Lưu nháp
1.Client nhập thông tin nhưng chưa muốn gửi.
2.Client nhấn nút "Lưu nháp".
3.Hệ thống lưu dự án với trạng thái "Nháp" (chưa gửi cho Admin).
Các trường hợp ngoại lệ 1.Bỏ trống dữ liệu bắt buộc: Client nhấn "Đăng dự án" nhưng thiếu Tiêu đề hoặc Mô tả → Hiển thị thông báo lỗi tại các trường bắt buộc: "Vui lòng nhập Tiêu đề."
2.Ngân sách không hợp lệ: Client nhập ngân sách không phải là số (ví dụ: "abc") → Hiển thị thông báo: "Ngân sách không hợp lệ."

2.2.3.12. Kịch bản cho usecase “Tạo và quản lý Test Case”
Tên usecase Tạo và quản lý Test Case
Mô tả Client (TM - Test Manager) định nghĩa các kịch bản kiểm thử (Test Cases) chi tiết mà Tester sẽ phải thực hiện. Đây là bước bắt buộc khi đăng tải dự án.
Tác nhân Client
Điều kiện tiên quyết Client đang trong quá trình thực hiện Usecase "Đăng tải Dự án".
Dữ liệu đầu vào Tiêu đề Test Case (TC), Mô tả/Các bước thực hiện của TC, Kết quả mong đợi (Tùy chọn).
Dữ liệu đầu ra Một hoặc nhiều Test Case được lưu và liên kết với dự án.
Luồng chính (Tạo Test Case cho dự án Test Cycle) 1.Sau khi Client điền thông tin chung của dự án (trong Usecase "Đăng tải Dự án"), hệ thống <<include>> Usecase này, yêu cầu Client "Thêm Test Case".
2.Client được chuyển đến giao diện "Quản lý Test Case" của dự án.
3.Client nhấn nút "Thêm Test Case mới".
4.Client nhập Tiêu đề (ví dụ: "TC-01: Đăng nhập thành công").
5.Client nhập Các bước thực hiện (ví dụ: "1. Mở app...", "2. Nhập email...", "3. Nhấn Đăng nhập").
6.Client nhập Kết quả mong đợi (ví dụ: "Người dùng đăng nhập thành công và thấy trang chủ").
7.Client nhấn "Lưu Test Case".
8.Hệ thống lưu Test Case vào Database, liên kết với ID Dự án.
9.Client lặp lại bước 3-8 cho đến khi tạo đủ các Test Case.
10.10. Kết quả: Client hoàn thành việc tạo Test Case và quay lại luồng "Đăng tải Dự án" để Gửi duyệt.
Luồng thay thế (Alternative Flows) Luồng 1: Tạo Test Case "Dummy" (Cho dự án Exploratory - Theo logic mới)
(Các bước 1-3 như trên)
4.Client nhập Tiêu đề (ví dụ: "Nộp bằng chứng hoàn thành Exploratory Test").
5.Client nhập Các bước thực hiện (ví dụ: "Sau khi kiểm thử xong, vui lòng đính kèm 1 file tổng hợp lỗi hoặc video tại đây khi nhấn 'Fail'").
6.Client nhấn "Lưu Test Case".
7.Kết quả: Hệ thống có 1 Test Case bắt buộc để Tester có thể "Fail" và nộp bằng chứng.
Luồng 2: Chỉnh sửa/Xóa Test Case
1.(Trong bước 2 - giao diện quản lý các Test Case) Client nhấn nút "Sửa" hoặc "Xóa" bên cạnh một Test Case đã tạo.
2.Hệ thống cho phép cập nhật nội dung hoặc xóa Test Case khỏi dự án.
Các trường hợp ngoại lệ 1.Bỏ trống dữ liệu: Client nhấn "Lưu" khi Tiêu đề hoặc Các bước thực hiện bị bỏ trống → Hiển thị thông báo lỗi tại trường tương ứng.
2.Lỗi hệ thống: Mất kết nối Database khi đang lưu → Hiển thị thông báo: "Lưu Test Case thất bại."

2.2.3.13. Kịch bản cho usecase “Duyệt ứng viên Tester”
Tên usecase Duyệt ứng viên Tester
Mô tả Client xem xét hồ sơ của các Tester đã ứng tuyển vào dự án của mình và quyết định phê duyệt (chấp nhận) hoặc từ chối.
Tác nhân Client
Điều kiện tiên quyết Client đã đăng nhập và dự án đã được Admin duyệt (Trạng thái: "Đang mở").
Dữ liệu đầu vào Danh sách Tester đang ở trạng thái "Chờ duyệt", Quyết định (Chấp nhận/Từ chối).
Dữ liệu đầu ra Trạng thái của Tester trong dự án đó được cập nhật: "Được chấp nhận" hoặc "Từ chối".Thông báo (Realtime/Email) cho Tester.
Luồng chính (Phê duyệt) 1.Client truy cập "Dashboard" → "Quản lý Dự án" và chọn một dự án đang mở.
2.Client chọn tab "Ứng viên" (Applicants).
3.Hệ thống hiển thị danh sách các Tester đang chờ duyệt.
4.Client nhấn vào một Tester để xem hồ sơ chi tiết (kỹ năng, kinh nghiệm, lịch sử làm việc).
5.Client quyết định Tester này phù hợp và nhấn nút "Chấp nhận" (Approve).
6.Hệ thống cập nhật trạng thái của Tester trong dự án thành "Được chấp nhận".
7.Hệ thống (qua RLS) cấp quyền cho Tester này truy cập vào không gian làm việc của dự án (Usecase "Thực hiện Test Cycle").
8.Kết quả: Hệ thống gửi thông báo (email hoặc Realtime) cho Tester biết họ đã được duyệt.
Luồng thay thế (Alternative Flows) Luồng 1: Từ chối ứng viên
(Các bước 1-4 như trên)
5.Client quyết định Tester không phù hợp và nhấn nút "Từ chối" (Reject).\
6.Hệ thống cập nhật trạng thái của Tester thành "Từ chối".
7.Kết quả: Hệ thống gửi thông báo cho Tester biết họ đã bị từ chối.
Các trường hợp ngoại lệ 1.Dự án đã đủ Tester: Client cố gắng chấp nhận thêm Tester nhưng dự án đã đạt số lượng tối đa (nếu có cài đặt) → Hiển thị thông báo: "Dự án đã đủ số lượng Tester."
2.Lỗi hệ thống: Client nhấn "Chấp nhận" nhưng xảy ra lỗi kết nối Database → Hiển thị thông báo: "Đã xảy ra lỗi. Vui lòng thử lại sau."

2.2.3.14. Kịch bản cho usecase “Xem & Cập nhật báo cáo lỗi”
Tên usecase Xem & Cập nhật báo cáo lỗi
Mô tả Client (Test Manager - TM) xem xét các báo cáo lỗi do Tester nộp, xác nhận, chỉnh sửa (nếu cần) và cập nhật trạng thái của chúng.
Tác nhân Client (Test Manager - TM)
Điều kiện tiên quyết Client/TM đã đăng nhập và đang xem một dự án đang hoạt động.
Dữ liệu đầu vào Danh sách báo cáo lỗi (Trạng thái: "Mới"), Quyết định, Nội dung chỉnh sửa (nếu có).
Dữ liệu đầu ra Trạng thái của báo cáo lỗi được cập nhật (VD: "Đã phê duyệt", "Đã chỉnh sửa và phê duyệt" ,"Bị từ chối").Thông báo Realtime cho Tester.
Luồng chính (Phê duyệt đơn giản) 1.Client/TM truy cập vào không gian làm việc của dự án và chọn tab "Báo cáo lỗi".
2.Client/TM nhấn vào một báo cáo lỗi (Trạng thái: "Mới") để xem chi tiết.
3.Client/TM tự mình tái hiện lỗi.
4.Kết quả: Client/TM xác nhận lỗi hợp lệ và nội dung báo cáo đã rõ ràng.
5.Client/TM nhấn nút "Phê duyệt" (Approve).
6.Hệ thống cập nhật trạng thái của lỗi thành "Đã phê duyệt".
7.Kết quả: Hệ thống (qua Supabase Realtime) gửi thông báo tức thời cho Tester biết lỗi của họ đã được duyệt.
Luồng thay thế (Alternative Flows) Luồng 1: Chỉnh sửa và Phê duyệt
(Các bước 1-3 như trên)
4.Kết quả: Client/TM xác nhận lỗi hợp lệ, nhưng mô tả của Tester chưa rõ ràng hoặc cần chuẩn hóa cho đội ngũ nội bộ.
5.Client/TM nhấn nút "Chỉnh sửa" (Edit).
6.Hệ thống mở Form cho phép TM chỉnh sửa các trường (Tiêu đề, Mô tả, Mức độ nghiêm trọng).
7.TM chỉnh sửa nội dung cho rõ ràng hơn và nhấn nút "Lưu và Phê duyệt".Hệ thống cập nhật nội dung báo cáo lỗi VÀ cập nhật trạng thái lỗi thành "Edited and Accepted" (Đã chỉnh sửa và Chấp nhận).
8.Kết quả: Hệ thống gửi thông báo Realtime cho Tester (báo lỗi đã được duyệt) và Client/Dev team sẽ thấy báo cáo lỗi đã được chuẩn hóa.
Luồng 2: Từ chối lỗi (Trùng lặp/Không hợp lệ)
(Các bước 1-3 như trên)
4.Kết quả: Client/TM xác nhận lỗi này là không hợp lệ (không tái hiện được) hoặc bị trùng lặp.
5.Client/TM nhấn nút "Từ chối" (Reject) và chọn lý do (ví dụ: "Trùng lặp").
6.Hệ thống cập nhật trạng thái lỗi thành "Bị từ chối" và gửi thông báo Realtime cho Tester.
Các trường hợp ngoại lệ 1. Lỗi hệ thống: Client/TM nhấn "Lưu và Phê duyệt" nhưng xảy ra lỗi kết nối Database → Hiển thị thông báo: "Đã xảy ra lỗi. Vui lòng thử lại sau."

2.2.3.15. Kịch bản cho usecase “Kiểm duyệt dự án”
Tên usecase Kiểm duyệt dự án
Mô tả Admin xem xét nội dung dự án do Client đăng tải để đảm bảo tính hợp lệ, rõ ràng trước khi cho hiển thị công khai để Tester ứng tuyển.
Tác nhân Admin
Điều kiện tiên quyết Admin đã đăng nhập. Có ít nhất một dự án đang ở trạng thái "Chờ duyệt".
Dữ liệu đầu vào Dự án (Trạng thái: "Chờ duyệt"), Quyết định (Phê duyệt/Từ chối), Lý do từ chối (nếu có).
Dữ liệu đầu ra Trạng thái dự án được cập nhật: "Đang mở" hoặc "Bị từ chối".Thông báo (Realtime/Email) cho Client.
Luồng chính (Phê duyệt) 1.Admin truy cập Dashboard → mục "Quản lý Dự án" → tab "Chờ duyệt".
2.Hệ thống hiển thị danh sách các dự án đang chờ duyệt
3.Admin chọn một dự án để xem chi tiết (Mô tả, Ngân sách, Yêu cầu, thông tin Client).
4.Kết quả: Admin xác nhận dự án hợp lệ, đầy đủ thông tin và phù hợp với tiêu chuẩn nền tảng.
5.Admin nhấn nút "Phê duyệt".
6.Hệ thống cập nhật trạng thái dự án thành "Đang mở" .
7.Kết quả: Hệ thống tự động gửi thông báo (email) cho Client biết dự án đã được duyệt, và bắt đầu gửi thông báo mời Tester tham gia.
Luồng thay thế (Alternative Flows) Luồng 1: Từ chối dự án
(Các bước 1-3 như trên)
4.Kết quả: Admin xác nhận dự án không hợp lệ (ví dụ: nội dung vi phạm, mô tả không rõ ràng, sai ngân sách).
5.Admin nhấn nút "Từ chối"
6.Hệ thống (tùy chọn) yêu cầu Admin nhập lý do từ chối.
7.Admin nhập lý do (ví dụ: "Mô tả dự án quá ngắn, vui lòng cập nhật") và xác nhận.
8.Hệ thống cập nhật trạng thái dự án thành "Bị từ chối".
9.Kết quả: Hệ thống gửi thông báo cho Client (kèm lý do) biết dự án đã bị từ chối và yêu cầu chỉnh sửa, bổ sung (nếu có).
Các trường hợp ngoại lệ 1.Lỗi hệ thống: Admin nhấn "Phê duyệt" nhưng xảy ra lỗi kết nối Database → Hiển thị thông báo: "Đã xảy ra lỗi. Vui lòng thử lại sau."
2.Dự án bị Client hủy: Trong lúc Admin đang xem, Client hủy dự án (rút lại) → Hệ thống báo lỗi "Dự án này không còn tồn tại."

2.2.3.16. Kịch bản cho usecase “Khóa/Mở tài khoản người dùng”
Tên usecase Khóa/Mở tài khoản người dùng
Mô tả Admin tạm ngưng (khóa) hoặc kích hoạt lại (mở khóa) quyền truy cập của một tài khoản Tester hoặc Client do vi phạm quy định hoặc để giải quyết tranh chấp.
Tác nhân Admin
Điều kiện tiên quyết Admin đã đăng nhập.
Dữ liệu đầu vào ID Người dùng (Tester/Client), Quyết định (Khóa/Mở), Lý do (nếu có).
Dữ liệu đầu ra Trạng thái tài khoản người dùng được cập nhật (ví dụ: trangthai = 'Đã bị khóa' hoặc trangthai = ‘Hoạt động').Thông báo cho người dùng bị ảnh hưởng.
Luồng chính (Khóa tài khoản) 1.Admin truy cập Dashboard → mục "Quản lý Người dùng".
2.Hệ thống hiển thị danh sách tất cả người dùng (Tester và Client).
3.Admin sử dụng bộ lọc/tìm kiếm để tìm tài khoản cần xử lý (ví dụ: tìm theo email của Tester vi phạm).
4.Admin nhấn vào tài khoản đó để xem chi tiết.
5.Kết quả: Admin xác nhận tài khoản này cần bị khóa (ví dụ: do gian lận báo cáo lỗi, spam).
6.Admin nhấn nút "Khóa Tài khoản" (Lock Account).
7.Hệ thống yêu cầu Admin xác nhận (ví dụ: "Bạn có chắc chắn muốn khóa tài khoản này?").
8.Admin xác nhận
9.Hệ thống cập nhật trạng thái tài khoản thành "Đã bị khóa".
10.Kết quả: Người dùng đó ngay lập tức bị đăng xuất khỏi tất cả các phiên và không thể đăng nhập lại cho đến khi được mở khóa. Hệ thống gửi email thông báo cho người dùng về việc bị khóa.
Luồng thay thế (Alternative Flows) Luồng 1: Mở khóa tài khoản
(Các bước 1-4 như trên, Admin tìm tài khoản đang bị khóa).
5.Kết quả: Admin xác nhận tài khoản này đã hết thời hạn phạt hoặc đã giải quyết xong vấn đề.
6.Admin nhấn nút "Mở khóa Tài khoản".
7.Hệ thống cập nhật trạng thái tài khoản thành “Hoạt động".
8.Kết quả: Người dùng có thể đăng nhập lại bình thường.
Các trường hợp ngoại lệ 1.Không thể khóa Admin khác: Admin cố gắng khóa một tài khoản Admin khác (hoặc chính mình) → Hệ thống ẩn nút "Khóa" hoặc hiển thị thông báo: "Không thể thực hiện hành động này trên tài khoản Admin."
2.Lỗi hệ thống: Admin nhấn "Khóa" nhưng xảy ra lỗi kết nối Database → Hiển thị thông báo: "Đã xảy ra lỗi. Vui lòng thử lại sau."

2.2.3.17. Kịch bản cho usecase “Xem thống kê”
Tên usecase Xem thống kê
Mô tả Admin xem một bảng điều khiển (Dashboard) tổng quan, hiển thị các số liệu và biểu đồ quan trọng về hoạt động của toàn bộ nền tảng UVTester.
Tác nhân Admin
Điều kiện tiên quyết Admin đã đăng nhập.
Dữ liệu đầu vào Yêu cầu truy cập trang "Thống kê" của Admin.
Dữ liệu đầu ra Giao diện trang “Thống kê” hiển thị các thẻ số liệu (KPIs) và biểu đồ (Charts).
Luồng chính 1.Admin truy cập vào trang "Dashboard Thống kê" chính.
2.Hệ thống thực hiện các truy vấn tổng hợp (dùng các hàm count(), sum()) đến cơ sở dữ liệu Supabase.
3.Hệ thống hiển thị các thẻ số liệu (KPIs) tổng quan, ví dụ:

- Tổng số Tester đã đăng ký.
- Tổng số Client đã đăng ký.
- Tổng số Dự án (đã được phê duyệt).
- Tổng số Báo cáo lỗi (đã được phê duyệt).
- Tổng Thu nhập (mô phỏng) đã giao dịch trên nền tảng theo thời gian.
  4.Hệ thống (tùy chọn) hiển thị các biểu đồ đơn giản (ví dụ: Biểu đồ cột "Dự án mới theo tháng").
  5.Kết quả: Admin nắm được tình hình hoạt động tổng quan của nền tảng.
  Luồng thay thế Luồng 1: Lọc theo thời gian
  1.Admin chọn một bộ lọc thời gian (ví dụ: "7 ngày qua", "Tháng này").
  2.Hệ thống thực hiện lại các truy vấn (bước 2) với điều kiện lọc thời gian.
  3.Hệ thống cập nhật lại các thẻ số liệu và biểu đồ để phản ánh dữ liệu trong khoảng thời gian đó.
  Các trường hợp ngoại lệ 1.Lỗi tải dữ liệu: Mất kết nối Database khi đang truy vấn → Hiển thị thông báo: "Không thể tải dữ liệu thống kê. Vui lòng thử lại sau."
  2.Hệ thống mới (Chưa có dữ liệu): Hệ thống truy vấn và trả về kết quả 0 → Hiển thị các thẻ số liệu với giá trị là "0".

  2.2.3.18. Kịch bản cho usecase “Quản lý yêu cầu hỗ trợ”
  Tên usecase Quản lý yêu cầu hỗ trợ
  Mô tả Admin xem xét, theo dõi và phản hồi các yêu cầu hỗ trợ (ticket) do Tester và Client gửi lên để giải quyết các vấn đề của họ.
  Tác nhân Admin
  Điều kiện tiên quyết Admin đã đăng nhập. Có ít nhất một ticket đã được người dùng gửi (Trạng thái: "Mới").
  Dữ liệu đầu vào Danh sách các ticket (Trạng thái: "Mới", "Đang xử lý"), Nội dung phản hồi, Quyết định (Đóng ticket).
  Dữ liệu đầu ra Trạng thái ticket được cập nhật (VD: "Đang xử lý", "Đã đóng").Phản hồi được gửi cho người dùng (qua email hoặc hệ thống).
  Luồng chính (Xử lý và phản hồi) 1.Admin truy cập Dashboard → mục "Hỗ trợ" → tab "Quản lý Yêu cầu hỗ trợ"
  2.Hệ thống hiển thị danh sách các ticket, ưu tiên các ticket "Mới" lên đầu.
  3.Admin chọn một ticket (Trạng thái: "Mới") để xem chi tiết (Mô tả, Phân loại, File đính kèm, Thông tin người gửi).
  4.Kết quả: Admin hiểu rõ vấn đề của người dùng.
  5.Admin nhập nội dung "Phản hồi" vào ô trả lời.
  6.Admin nhấn nút "Gửi phản hồi và Chuyển sang Đang xử lý".
  7.Hệ thống cập nhật trạng thái ticket thành "Đang xử lý" và gửi email (hoặc thông báo hệ thống) chứa nội dung phản hồi cho người dùng (Tester/Client).
  8.Kết quả: Người dùng nhận được phản hồi và có thể trả lời lại nếu vấn đề chưa được giải quyết.
  9.(Sau khi vấn đề đã được giải quyết) Admin nhấn nút "Đóng Ticket" (Close Ticket).
  10.Hệ thống cập nhật trạng thái ticket thành "Đã đóng" (Closed).
  Luồng thay thế Luồng 1: Đóng ticket ngay lập tức
  (Các bước 1-3 như trên)
  4.Kết quả: Admin thấy đây là một yêu cầu spam, trùng lặp, hoặc đã được giải quyết ở kênh khác.
  5.Admin nhấn nút "Đóng Ticket" (có thể kèm ghi chú nội bộ).
  6.Hệ thống cập nhật trạng thái ticket thành "Đã đóng".
  Các trường hợp ngoại lệ 1.Lỗi hệ thống: Admin nhấn "Gửi phản hồi" nhưng xảy ra lỗi kết nối Database hoặc Dịch vụ Email → Hiển thị thông báo: "Gửi phản hồi thất bại. Vui lòng thử lại sau."
  2.Ticket không tồn tại: Admin cố gắng truy cập một ID ticket đã bị xóa → Hiển thị lỗi "Không tìm thấy yêu cầu này."

  2.2.3.19. Sơ đồ hoạt động cho usecase “Đăng nhập”

  2.2.3.20. Sơ đồ hoạt động cho usecase “Đăng ký”

  2.2.3.21. Sơ đồ hoạt động cho usecase “Quên mật khẩu”

  2.2.3.22. Sơ đồ hoạt động cho usecase “Quản lý hồ sơ”

  2.2.3.23. Sơ đồ hoạt động cho usecase “Thực hiện Test Cycle”

  2.2.3.24. Sơ đồ hoạt động cho usecase “Thực hiện Test Case”

  2.2.4. Sơ đồ Robustness
  2.2.5. Phác thảo giao diện
  2.2.6. Thiết kế ERD
  2.2.7. Sơ đồ Class mức 1
  2.2.8. Sơ đồ tuần tự
  2.2.9. Sơ đồ Class mức 2 (đã bổ sung Method từ các Message của sơ đồ tuần tự)

Chương 3
XÂY DỰNG CHƯƠNG TRÌNH
3.1. Công cụ xây dựng chương trình
….
3.2. Giao diện chương trình
3.2.1. Giao diện trang chủ
(Chụp hình các giao diện sau khi cài đặt chương trình – giải thích ý nghĩa từng giao diện.)
3.2.2. Giao diện ….

KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN
1.Kết luận
…
2.Hướng phát triển
…..

TÀI LIỆU THAM KHẢO
Tài liệu về MYSQL: https://dev.mysql.com/doc/
Tài liệu về Unity 6: https://docs.unity3d.com/
Tài liệu về C#: https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/
Trang trường: https://ute.udn.vn/default.aspx
