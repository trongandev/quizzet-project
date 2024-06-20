const template = [
    {
        question: "Đâu là thuế trực thu",
        answer: "Thuế TNDN",
    },
    {
        question: "Tìm nội dung KHÔNG phải là đặc trưng cơ bản\r\ncủa thuế",
        answer: "Mang tính bắt buộc",
    },
    {
        question: "Đâu là đặc trưng của thuế gián thu?",
        answer: "Được tính vào giá bán của hàng hóa, dịch vụ.",
    },
    {
        question: "Đâu là đặc trưng của thuế trực thu?",
        answer: "Đảm bảo sự công bằng trong việc thực hiện nghĩa vụ với ngân sách nhà nước; đánh vào thu\r\nnhập chịu thuế; tăng lên cùng mức tăng của thu nhập chịu thuế.",
    },
    {
        question: "Đối với các loại thuế kê khai theo quý, thời hạn nộp tờ khai chậm nhất là",
        answer: "ngày thứ 30 của quý tiếp theo.",
    },
    {
        question: "Đơn vị áp dụng năm tính thuế là năm dương\r\nlịch thì hồ sơ quyết toán thuế năm có thời hạn nộp chậm nhất là:",
        answer: "ngày 31/3 của năm tiếp theo.",
    },
    {
        question: "Thuế nào sau đây là thuế gián thu",
        answer: "Thuế GTGT",
    },
    {
        question: "Tính không hoàn trả trực tiếp của thuế được thể hiện là:",
        answer: "việc thực hiện nghĩa vụ thuế không tương xứng với lợi ích mà chủ thể nộp thuế nhận được.",
    },
    {
        question:
            "Công ty A nhận nhập khẩu uỷ thác một dây chuyền sản xuất cho công ty B, ngân hàng C là người bảo lãnh về số tiền thuế nhập khẩu phải nộp. Chủ thể có trách nhiệm nộp thuế nhập\r\nkhẩu của dây chuyền trên là:",
        answer: "Công ty A",
    },
    {
        question: "Đối tượng nộp thuế xuất nhập khẩu là:",
        answer: "tất cả các tổ chức, cá nhân xuất nhập khẩu hàng hóa thuộc đối\r\ntượng chịu thuế theo quy định.",
    },
    {
        question:
            "Đối với đối tượng nộp thuế chưa Thực hiện thanh toán qua ngân hàng theo quy định của pháp luật, có hàng hóa nhập khẩu\r\nlà vật tư, vật liệu để sản xuất hàng hóa xuất khẩu thì thời hạn nộp thuế nhập khẩu là:",
        answer: "nộp thuế trước khi nhận hàng.",
    },
    {
        question: "Tỷ giá làm cơ sở để xác định giá tính thuế đối với hàng hóa xuất khẩu, nhập khẩu là:",
        answer: "tỷ giá do cơ quan Hải quan xác định.",
    },
    {
        question: "Trường hợp người nộp thuế tính thuế, thì thời hạn nộp thuế",
        answer: "30 ngày kể từ ngày đăng ký tờ khai hải quan.",
    },
    {
        question: "Giá tính thuế xuất khẩu",
        answer: "Giá bán tại cửa khẩu xuất ở Việt Nam (giá FOB, giá DAP) không\r\nbao gồm phí bảo hiểm I và phí vận tải F",
    },
    {
        question: "Giá tính thuế nhập khẩu",
        answer: "Giá CIF - I. cif=fob+I+f",
    },
    {
        question: "Thời điểm tính thuế xuất khẩu, thuế nhập khẩu là:",
        answer: "ngày đối tượng nộp thuế đăng ký tờ khai hàng hóa xuất khẩu, nhập khẩu với cơ quan hải quan theo quy định của Luật Hải\r\nquan.",
    },
    {
        question: "Số lượng hàng hóa làm căn cứ tính thuế xuất nhập khẩu là:",
        answer: "số lượng của từng mặt hàng thực tế xuất nhập khẩu ghi trong tờ\r\nkhai hải quan.",
    },
    {
        question: "Phương thức nộp thuế xuất nhập khẩu nộp vào ngân sách nhà\r\nnước là:",
        answer: "nộp tiền mặt hoặc chuyển khoản bằng đồng Việt Nam.",
    },
    {
        question: "Những hàng hóa nào sau đây thuộc diện được miễn thuế xuất\r\nkhẩu, nhập khẩu?",
        answer: "Hàng hóa tạm nhập - tái xuất hoặc tạm xuất - tái nhập để tham dự hội trợ, triển lãm.",
    },
    {
        question: "Hàng hóa nào sau đây KHÔNG chịu thuế nhập khẩu?",
        answer: "Hàng hóa quá cảnh, chuyển khẩu, trung chuyển.",
    },
    {
        question: "Hàng hóa nào sau đây KHÔNG chịu thuế nhập khẩu?",
        answer: "Hàng nhập khẩu từ nước ngoài vào khu phi thuế quan.",
    },
    {
        question: "Hàng hóa nào sau đây thuộc diện miễn thuế xuất nhập khẩu?",
        answer: "Hàng tạm nhập, tái xuất để tham dự hội trợ triển lãm trong thời",
    },
    {
        question: "Hàng hóa do các doanh nghiệp trong nước bán cho các doanh\r\nnghiệp chế xuất trong khu phi thuế quan:",
        answer: "thuộc diện chịu thuế xuất khẩu.",
    },
    {
        question: "Thuế xuất khẩu- nhập khẩu là",
        answer: "Thuế xuất khẩu – nhập khẩu là loại thuế gián thu, thu vào hàng hóa được phép giao thương qua biên giới các quốc gia, nhóm quốc gia, hình thành và gắn liền với hoạt động thương mại quốc",
    },
    {
        question: "Đâu KHÔNG phải là đặc điểm của Thuế xuất khẩu- nhập khẩu",
        answer: "Tạo khoản thu cho NSNN nhà nước",
    },
    {
        question: "Đâu KHÔNG phải là VAI TRÒ của Thuế xuất khẩu- nhập khẩu",
        answer: "Thuế gián thu",
    },
    {
        question: "Đối tượng chịu thuế xuất khẩu - nhập khẩu",
        answer: "Hàng hóa XK- NK qua cửa khẩu biên giới Việt Nam",
    },
    {
        question: "Đối tượng chịu thuế xuất khẩu - nhập khẩu",
        answer: "Hàng hóa XK từ thị trường trong nước vào khu phi thuế quan và",
    },
    {
        question: "Đối tượng chịu thuế xuất khẩu - nhập khẩu",
        answer: "Hàng hóa xuất khẩu, nhập khẩu tại chỗ và hàng hóa xuất khẩu, nhập\r\nkhẩu của DN thực hiện quyền xuất khẩu, quyền nhập khẩu, quyền phân phối",
    },
    {
        question: "Đối tượng không chịu thế xuất khẩu - nhập khẩu",
        answer: "Hàng hóa quá cảnh, chuyển khẩu, trung chuyển",
    },
    {
        question: "Đối tượng không chịu thế xuất khẩu - nhập khẩu (3 câu này đều ;à\r\nđáp án chịu thuế)",
        answer: "B) Hàng hóa viện trợ nhân đạo không hoàn lại",
    },
    {
        question: "Đối tượng không chịu thế xuất khẩu - nhập khẩu",
        answer: "Phần dầu khí được dùng để trả thuế tài nguyên cho Nhà nước khi\r\nxuất khẩu",
    },
    {
        question: "Đối tượng không chịu thế xuất khẩu - nhập khẩu",
        answer: "Hàng hóa xuất khẩu từ khu phi thuế quan ra nước ngoài; hàng hóa nhập khẩu từ nước ngoài vào khu phi thuế quan và chỉ sử dụng trong khu phi thuế quan; hàng hóa chuyển từ khu phi  thuế quan này\r\nsang khu phi thuế quan khác",
    },
    {
        question: "Ai KHÔNG phải là người nộp thuế xuất khẩu - nhập khẩu",
        answer: "Người mua hàng hóa NK- XK",
    },
    {
        question: "Ai chịu thuế nhập khẩux",
        answer: "Người tiêu dùng hóa nhập khẩu",
    },
    {
        question:
            "Công ty lương thực miền Bắc xuất khẩu 1000 tần gạo sang Trung Quốc, giá thanh toán tại cửa khẩu Tân Thanh là 410 USD/tấn. Chi phí vận chuyển từ kho đến cửa khẩu là 50.000 đ/tấn. Xác định thuế xuất khẩu, biết rằng tỷ giá 1USD = 22.500\r\nVNĐ. Thuế suất thuế XK gạo: 2%. Thuế xuất khẩu công ty phải Nộp\r\n(410x22.500)x1000x2%",
        answer: "184.500.000 đồng",
    },
    {
        question:
            "Công ty cà phê Trung Nguyên xuất khẩu lô hàng gồm 5 container cà phê hộp sang Hàn Quốc. Hai bên thanh toán theo giá mua tại cảng Pusan, Hàn Quốc. Chi phí vận chuyển quốc tế là 500USD/container. Chi phí bảo hiểm cho cả lô hàng hóa là 1700 USD. Tổng giá trị hợp đồng là 25.000 USD. Hãy xác định thuế XK của lô hàng trên. Thuế suất thuế XK: 2%. Tỷ giá tính thuế 23.000 đ/usd. Thuế XK công ty Trung Nguyên phải nộp",
        answer: "25.000 usd x 2% x 23.000 đ/usd",
    },
    {
        question:
            "Công ty ô tô Trường Hải NK 100 chiếc ô tô 4 chỗ ngồi giá hợp đồng theo giá FOB là 10.000 USD/ SP, phí vận chuyển vào bảo hiểm quốc tế là 2.000 USD/SP. Tỷ giá tính thuế là 22.800đ/USD. Hãy xác định thuế NK của lô hàng trên? Thuế suất thuế NK ô tô 70%\r\n(10.000+2.000)x22.800= 273.600.000\r\n100 x 273.600.000x70%= 19.152.000.000",
        answer: "19.152.000.000 đồng",
    },
    {
        question: "Đối tượng miễn thuế nhập khẩu",
        answer: "Miễn thuế đối với hàng hóa nhập khẩu để gia công, sản phẩm gia\r\ncông xuất khẩu",
    },
    {
        question: "Đối tượng miễn thuế nhập khẩu",
        answer: "Miễn thuế đối với hàng hóa nhập khẩu để sản xuất hàng hóa xuất\r\nkhẩu",
    },
    {
        question:
            "Công ty cổ phần Long Thành nhận xuất khẩu uỷ thác 3.000 sản phẩm A theo Điều kiện CIF là 15 USD/sản phẩm, chi phí vận chuyển và bảo hiểm quốc tế là 2 USD/sản phẩm. Tỷ giá tính thuế 1 USD = 22.500 VND. Thuế suất thuế xuất khẩu của sản\r\nphẩm là 2%. Xác định thuế xuất khẩu Công ty Long Thành phải nộp?\r\n3000x(15-2) x 2% x 22.500",
        answer: "17.550.000 đồng.",
    },
    {
        question:
            "Công ty cổ phần Thiên Trang mua 100 máy vi tính của một doanh nghiệp chế xuất có giá trị 1 tỷ đồng, thuế suất thuế nhập khẩu là 10%. Thuế nhập khẩu công ty Thiên Trang phải nộp là:\r\n1 tỷ x 10%= 100 triệu",
        answer: "100.000.000 đồng.",
    },
    {
        question:
            "Công ty cổ phần Thuần Châu bán cho một doanh nghiệp khu chế xuất một lô hàng có trị giá 200 triệu đồng. Biết rằng thuế suất thuế xuất khẩu đối với mặt hàng trên là 1% thuế suất khẩu công ty Thuần Châu phải nộp là:\r\n200trieu x 1%",
        answer: "2.000.000 đồng.",
    },
    {
        question:
            "Công ty cổ phần Trường An nhận uỷ thác nhập khẩu một lô\r\nhàng tiêu dùng, giá CIF Hải Phòng là 55.000 USD. Hoa hồng \tuỷ\r\nthác là 2% trên giá nhập\t. Thuế suất thuế giá trị gia tăng là \t\r\n10%. Tỷ giá tính thuế 22.500 VND/USD. Thuế giá trị gia tăn mà doanh nghiệp phải kê khai, nộp ở khâu nhập khẩu là:\tg",
        answer: "225,42 triệu đồng.",
    },
    {
        question:
            "Công ty Hoa Sen nhập khẩu một dây chuyền sản xuất, tổng giá trị của dây chuyền là 125.000 USD, trong đó 25.000 USD là chi phí lắp đặt chạy thử và đào tạo nhân viên vận hành tại Việt Nam. Thuế suất thuế nhập khẩu của dây chuyền là 10%. Tỷ giá tính thuế 1 USD = 22.500 VND. Thuế nhập khẩu phải nộp là:\r\n(125.000 - 25.000) x 10% x 22.500",
        answer: "225.000.000 đồng",
    },
    {
        question:
            "Công ty Hưng Long xuất khẩu 40.000 kg sản phẩm A, giá bán tại kho công ty là 50.000 đồng/kg, chi phí vận chuyển từ kho đến cảng xuất khẩu do bên mua chịu là 5.000 đồng/kg, thuế suất thuế xuất khẩu của sản phẩm A là 3%. Thuế xuất khẩu phải nộp là:\r\n40.000 x (50.000+5.000) x 3%",
        answer: "66.000.000 đồng.",
    },
    {
        question:
            "Công ty Hưng Long xuất khẩu 40.000 kg sản phẩm A, giá bán tại kho công ty là 50.000 đồng/kg, chi phí vận chuyển từ kho đến cảng xuất khẩu do bên mua chịu là 5.000 đồng/kg, thuế suất\r\nthuế xuất khẩu của sản phẩm A là 3%. Số lượng hàng hóa tính thuế xuất khẩu là",
        answer: "40.000 kg",
    },
    {
        question:
            "Công ty Hưng Long xuất khẩu 40.000 kg sản phẩm A, giá bán tại kho công ty là 50.000 đồng/kg, chi phí vận chuyển từ kho đến cảng xuất khẩu do bên mua chịu là 5.000 đồng/kg, thuế suất\r\nthuế xuất khẩu của sản phẩm A là 3%. Giá tính thuế xuất khẩu tính trên 1 kg là",
        answer: "55.000 đồng",
    },
    {
        question: "Giá tính thuế tiêu thụ đặc biệt đối với hàng gia công là:",
        answer: "giá tính thuế của hàng hóa bán ra của cơ sở giao gia công hoặc giá\r\nbán của sản phẩm cùng loại hoặc tương đương tại cùng thời điểm bán hàng.",
    },
    {
        question: "Giá tính thuế tiêu thụ đặc biệt đối với hàng bán trả góp, trả chậm là:",
        answer: "giá tính thuế tiêu thụ đặc biệt của hàng bán trả ngay một lần.",
    },
    {
        question: "Giá tính thuế tiêu thụ đặc biệt đối với dịch vụ kinh doanh gôn là:",
        answer: "doanh thu từ bán thẻ hội viên, bán vé chơi gôn, các khoản phí chơi gôn và tiền ký quỹ chưa có thuế giá trị gia tăng/(1 + Thuế suất thuế tiêu\r\nthụ đặc biệt).",
    },
    {
        question: "Giá tính thuế đối với kinh doanh vũ trường là:",
        answer: "tổng doanh thu chưa có thuế giá trị gia tăng/(1+ Thuế suất thuế tiêu\r\nthụ đặc biệt).",
    },
    {
        question: "Giá tính thuế đối với kinh doanh massage là:",
        answer: "tổng doanh thu chưa có thuế giá trị gia tăng/(1+ Thuế suất thuế tiêu\r\nthụ đặc biệt).",
    },
    {
        question: "Giá tính thuế tiêu thụ đặc biệt đối với hàng hóa thuộc diện chịu thuế tiêu\r\nthụ đặc biệt sản xuất bán ra trong nước được xác định bằng:",
        answer: "giá chưa có thuế giá trị gia tăng/(1+ thuế suất tiêu thụ đặc biệt).",
    },
    {
        question: "Giá tính thuế tiêu thụ đặc biệt đối với hàng hóa thuộc diện chịu thuế tiêu\r\nthụ đặc biệt do doanh nghiệp sản xuất bán ra trong nước là:",
        answer: "giá chưa có thuế tiêu thụ đặc biệt, chưa có thuế giá trị gia tăng.",
    },
    {
        question: "Giá tính thuế tiêu thụ đặc biệt đối với hàng hóa nhập khẩu thuộc diện chịu thuế tiêu thụ đặc biệt được xác định bằng:",
        answer: "giá tính thuế nhập khẩu + thuế nhập khẩu.",
    },
    {
        question: "Hàng hóa nào sau đây thuộc đối tượng KHÔNG chịu thuế tiêu thụ đặc",
        answer: "Điều hoà nhiệt độ có công suất 12.000 BTU.",
    },
    {
        question: "Ai là người nộp thuế TTĐB",
        answer: "Nhà sản xuất hàng hóa chịu thuế TTĐB bán ra hoặc cung cấp dịch vụ\r\nchịu thuế TTĐB trong nước.",
    },
    {
        question: "Thuế tiêu thu đặc biệt là",
        answer: "Thuế tiêu thụ đặc biệt là sắc thuế thuộc loại thuế gián thu đánh\r\nvào một số hàng hóa, dịch vụ có tính chất đặc biệt nằm trong danh mục do Nhà nước qui định nhằm điều tiết sản xuất và tiêu dùng",
    },
    {
        question: "Đâu KHÔNG phải là đặc điểm của thuế TTĐB",
        answer: "Thu trong quá trình luân chuẩn hàng hóa từ khâu sản xuất, lưu thông,\r\ntiêu dùng",
    },
    {
        question: "Đâu KHÔNG phải là vai trò thuế TTĐB",
        answer: "Là thuế gián thu",
    },
    {
        question: "Đối tượng KHÔNG chịu thuế TTĐB",
        answer: "Hàng hóa do cơ sở sản xuất, gia công trực tiếp xuất khẩu hoặc bán, ủy\r\nthác cho cơ sở kinh doanh khác để xuất khẩu",
    },
    {
        question: "Đối tượng KHÔNG chịu thuế TTĐB",
        answer: "Hàng hóa NK là hàng viện trợ nhân đạo, viện trợ không hoàn lại, quà\r\ntặng, quà biếu",
    },
    {
        question: "Đối tượng KHÔNG chịu thuế TTĐB",
        answer: "Hàng hóa nhập khẩu từ nước ngoài vào khu phi thuế quan, hàng hóa từ\r\nnội địa bán vào khu phi thuế quan và chỉ sử dụng trong khu phi thuế quan, hàng hóa được mua bán giữa các khu phi thuế quan với nhau",
    },
    {
        question: "Đối tượng KHÔNG chịu thuế TTĐB",
        answer: "Tàu bay, du thuyền sử dụng cho mục đích kinh doanh vận chuyển hàng\r\nhóa, hành khách, kinh doanh du lịch và tàu bay sử dụng cho mục đích an\r\nninh, quốc phòng",
    },
    {
        question: "Đối tượng KHÔNG chịu thuế TTĐB",
        answer: "Điều hoà nhiệt độ có công suất từ 90.000 BTU trở xuống, theo thiết kế\r\ncủa nhà sản xuất chỉ để lắp trênphương tiện vận tải, bao gồm ô tô, toa xe lửa, tàu, thuyền, tàu bay",
    },
    {
        question: "Người nộp thuế TTĐB",
        answer: "Tổ chức, cá nhân sản xuất, nhập khẩu hàng hóa chịu thuế tiêu thụ đặc\r\nbiệt;",
    },
    {
        question: "Người nộp thuế TTĐB",
        answer: "Tổ chức, cá nhân kinh doanh dịch vụ chịu thuế tiêu thụ đặc biệt",
    },
    {
        question: "Người nộp thuế TTĐB",
        answer: "Tổ chức, cá nhân mua hàng chịu thuế tiêu thụ đặc biệt để xuất khẩu\r\nnhưng không xuất khẩu",
    },
    {
        question: "Công ty thuốc lá Thăng Long sản xuất thuốc lá điếu, bán cho công ty Thương Mại Hà Nội để phân phối cho người tiêu dùng.\r\nCông ty nào phải nộp thuế tiêu thụ đặc biệt?",
        answer: "Công ty thuốc là Thăng Long",
    },
    {
        question:
            "Trong tháng 1/20XX, Công ty TNHH ô tô Trường Hải, Nhập khẩu Một xe\r\nô tô Mercedes-Benz C 200; dung tích xi lanh 1497 (cc) giá CIF:\r\n10.000 USD; thuế suất thuế nhập khẩu của mẫu xe này là 70%; thuế suất thuế TTĐB là 45%; giả sử tỷ giá để tính thuế nhập khẩu tại thời điểm nhập\r\nkhẩu là 23.400 VND/USD. Giá tính thuế Nhập khẩu công ty phải nộp",
        answer: "234.000.000 đồng",
    },
    {
        question:
            "Trong tháng 1/20XX, Công ty TNHH ô tô Trường Hải, Nhập khẩu\r\nMột xe\t\r\nô tô Mercedes-Benz C 200; giá CIF: 10.000 USD; thuế suất thuế nhập khẩu của mẫu xe này là 70%; thuế suất thuế TTĐB là 45%; giả\r\nsử tỷ giá để tính thuế nhập khẩu tại thời điểm nhập khẩu là 23.400 VND/USD.\r\nThuế Nhập khẩu công ty phải nộp",
        answer: "234.000.000 đồng",
    },
    {
        question:
            "Trong tháng 1/20XX, Công ty TNHH ô tô Trường Hải, Nhập khẩu Một xe\r\nô tô Mercedes-Benz C 200; dung tích xi lanh 1497 (cc) giá CIF:\r\n10.000 USD; thuế suất thuế nhập khẩu của mẫu xe này là 70%; thuế suất thuế TTĐB là 45%; giả sử tỷ giá để tính thuế nhập khẩu tại thời điểm nhập\r\nkhẩu là 23.400 VND/USD. Giá tính thuế TTĐB xe ô tô",
        answer: "397.800.000 đồng",
    },
    {
        question:
            "Trong tháng 1/20XX, Công ty TNHH ô tô Trường Hải, Nhập khẩu Một xe\r\nô tô Mercedes-Benz C 200; dung tích xi lanh 1497 (cc) giá CIF:\r\n10.000 USD; thuế suất thuế nhập khẩu của mẫu xe này là 70%; thuế suất thuế TTĐB là 45%; giả sử tỷ giá để tính thuế nhập khẩu tại thời điểm nhập\r\nkhẩu là 23.400 VND/USD. Thuế TTĐB xe ô tô phải nộp",
        answer: "179.010.000 đồng",
    },
    {
        question:
            "Trong tháng 1/20XX, Công ty TNHH ô tô Trường Hải, Nhập khẩu Một xe\r\nô tô Mercedes-Benz C 200 và bán cho khách hàng, giá bán chưa có thuế GTGT là: 7,9 tỷ đồng. Thuế suất thuế TTĐB là 45%; Giá tính thuế TTĐB\r\nkhi bán xe ô tô là",
        answer: "7,9/ (1+45%) tỷ",
    },
    {
        question:
            "Trong tháng 1/20XX, Công ty TNHH ô tô Trường Hải, Nhập khẩu Một xe\r\nô tô Mercedes-Benz C 200 và bán cho khách hàng, giá bán chưa có thuế GTGT là: 7,9 tỷ đồng. Thuế suất thuế TTĐB là 45%; Giá tính  thuế TTĐB\r\nkhi bán xe ô tô là",
        answer: "7,9/ (1+45%) tỷ",
    },
    {
        question:
            "Nhập khẩu 1 xe Mercedes-Benz C 200 Exclusive, giá FOB: 10.000 USD;\r\nphí bảo hiểm + vận tải biển: 2.000 USD; thuế suất thuế nhập khẩu của mẫu xe này là 70%; thuế suất thuế TTĐB là 45%; giả sử tỷ giá để tính thuế nhập khẩu tại thời điểm nhập khẩu là 23.400 VND/USD. Giá tính\r\nthuế Nhập khẩu",
        answer: "12.000 usd",
    },
    {
        question:
            "Nhập khẩu 1 xe Mercedes-Benz C 200 Exclusive, giá FOB: 10.000 USD;\r\nphí bảo hiểm + vận tải biển: 2.000 USD; thuế suất thuế nhập khẩu của mẫu xe này là 70%; thuế suất thuế TTĐB là 45%; giả sử tỷ giá để tính thuế nhập khẩu tại thời điểm nhập khẩu là 23.400 VND/USD.\r\nThuế nhập\r\nkhẩu công ty phải nộp",
        answer: "196.560.000 đồng",
    },
    {
        question: "Doanh nghiệp sản xuất rượu đóng chai, bán rượu cho doanh nghiệp trong khu công nghiệp",
        answer: "Tính thuế TTĐB theo giá bán chưa có thuế TTĐB và chưa có thuế\r\nGTGT",
    },
    {
        question: "Doanh nghiệp sản xuất sản phẩm chịu thế TTĐB, sản phẩm này dùng để\r\ntiêu dùng nội bộ thì doanh nghiệp",
        answer: "Tính thuế TTĐB theo giá tính thuế TTĐB của sản phẩm bán ra cùng loại,\r\ncùng thời điểm",
    },
    {
        question: "Doanh nghiệp sản xuất sản phẩm chịu thế TTĐB, sản phẩm này dùng để\r\ntrao đổi",
        answer: "Tính thuế TTĐB theo giá tính thuế TTĐB của sản phẩm bán ra cùng loại,\r\ncùng thời điểm",
    },
    {
        question: "Hàng hóa nhập khẩu thuộc diện chịu thuế TTĐB được giảm thuế nhập",
        answer: "Giá tính thuế NK+ Thuế NK chưa giảm",
    },
    {
        question: "Doanh nghiệp A mua 1.000 chai rượu từ DN sản xuất B để xuất khẩu, tuy\r\nnhiên A chỉ xuất khẩu đươc 950 chai, 50 chai còn lại DN A bán trong nước.",
        answer: "50 chai rượu bán trong nước chịu thuế TTĐB, DN A là người nộp thuế\r\nTTĐB",
    },
    {
        question:
            "DN A sản xuất rượu, giá thành 1 chai rượu là 10.000 đ/chai, Giá bán 1 chai rượu chưa thuế GTGT là 18.000 đ/chai, thuế suất thuế TTĐB rượu là 30%, khi dùng rượu để trao đổi với DN B theo hợp đồng\r\ngiá trao đổi\r\nchưa thuế GTGT là 14.000 đ/chai. Giá tính thuế TTĐB đối với rượu là",
        answer: "18.000 đ.chai",
    },
    {
        question:
            "DN A sản xuất rượu, giá thành 1 chai rượu là 10.000 đ/chai, Giá bán 1 chai rượu chưa thuế GTGT là 18.000 đ/chai, thuế suất thuế TTĐB rượu là 30%, khi dùng rượu để trao đổi với DN B theo hợp đồng\r\ngiá trao đổi\r\nchưa thuế GTGT là 14.000 đ/chai. DN A",
        answer: "Tính thuế TTĐB= [18.000 : (1+30%)] x30%",
    },
    {
        question:
            "DN A gia công thuốc là điếu cho DN B, giá gia công chưa thuế GTGT\r\n16.000 đ/cây. Giá bán thuốc lá chưa thuế GTGT 120.000 đ/cây, thuế suất thuế TTĐB 70%, khi DN A xuất trả thuốc lá điếu cho DN B thì",
        answer: "DN A phải nộp thuế TTĐB",
    },
    {
        question:
            "DN A gia công thuốc là điếu cho DN B, giá gia công chưa thuế GTGT\r\n16.000 đ/cây. Giá bán thuốc lá chưa thuế GTGT 120.000 đ/cây, thuế suất thuế TTĐB 70%, khi DN A xuất trả thuốc lá điếu cho DN B thì DN A\r\nphải nộp thuế TTĐB. Giá tính thuế TTĐB của DN A là",
        answer: "120.000 đ/cây",
    },
    {
        question:
            "Doanh nghiệp Toàn Thắng nhập khẩu rượu đã nộp thuế nhập khẩu\r\ntriệu đồng, thuế tiêu thụ đặc biệt 242,5 triệu đồng. Doanh nghiệp đã sử\r\ndụng số rượu này sản xuất được 60.000 chai rượu 30 độ, thuế suất tiêu thụ đặc biệt 45%, rồi tiêu thụ trong nước 12.000 chai với giá bán chưa có thuế giá trị gia tăng là 125.000 đồng/chai; Xuất khẩu 40.000 chai, giá FOB 8 USD/chai. Tỷ giá tính thuế 22.500 VND/USD. Thuế tiêu\r\nthụ đặc\r\nbiệt được khấu trừ là:",
        answer: "48.500.000 đồng.",
    },
    {
        question:
            "Doanh nghiệp Toàn Thắng nhập khẩu rượu đã nộp thuế nhập khẩu 120 triệu đồng, thuế tiêu thụ đặc biệt 242,5 triệu đồng. Doanh nghiệp đã\r\nsử dụng số rượu này sản xuất được 60.000 chai rượu 30 độ, thuế suất tiêu thụ đặc biệt 45%, rồi tiêu thụ trong nước 12.000 chai với giá bán chưa có thuế giá trị gia tăng là 125.000 đồng/chai; Xuất khẩu 40.000 chai, giá\r\nFOB 8 USD/chai. Tỷ giá 22.500 đồng/USD. Thuế tiêu thụ đặc biệt\r\ncuối kỳ phải nộp cho cơ quan thuế là:",
        answer: "255.350.574 đồng.",
    },
    {
        question:
            "Doanh nghiệp Toàn Thắng nhập khẩu rượu đã nộp thuế nhập khẩu 120 triệu đồng, thuế tiêu thụ đặc biệt 242,5 triệu đồng. Doanh nghiệp đã\r\nsử dụng số rượu này sản xuất được 60.000 chai rượu 30 độ, thuế suất thuế tiêu thụ đặc biệt là 45%, doanh nghiệp tiêu thụ trong nước\r\n12.000 chai với giá bán chưa có thuế giá trị gia tăng là 125.000 đồng/chai. Xuất khẩu 40.000 chai, giá FOB 8 USD/chai. Tỷ giá tính thuế 22.500\r\nVND/USD. Thuế tiêu thụ đặc biệt của hàng bán trong nước là:",
        answer: "465.517.241 đồng.",
    },
    {
        question:
            "Công ty TNHH Tuấn Thành sản xuất thuốc lá bán cho công ty xuất nhập\r\nkhẩu INTIMEX 500 cây thuốc lá để xuất khẩu với giá bán chưa có thuế giá trị gia tăng là 105.000 đồng/cây. Công ty INTIMEX xuất khẩu 400 cây với giá FOB Hải Phòng là 8.5 USD/cây, số còn lại bán trong nước với giá chưa có thuế giá trị gia tăng là 125.000 đồng/cây. Thuế suất thuế xuất khẩu của thuốc là là 1%. Thuế suất thuế tiêu thụ đặc biệt của thuốc lá là 65%. Tỷ giá 22.500 đồng/USD. Thuế tiêu thụ đặc biệt mà chủ thể có\r\ntrách nhiệm phải nộp là:",
        answer: "4.924.242 đồng.",
    },
    {
        question:
            "Công ty TNHH Tuấn Thành sản xuất thuốc lá bán cho công ty xuất nhập\r\nkhẩu INTIMEX 500 cây thuốc lá để xuất khẩu với theo hợp đồng đã ký với nước ngoài, giá bán chưa có thuế giá trị gia tăng là 105.000 đồng/cây. Công ty INTIMEX xuất khẩu 400 cây với giá FOB Hải Phòng là\r\n8.5 USD/cây, số còn lại bán trong nước với giá chưa có thuế giá trị gia tăng là 125.000 đồng/cây. Thuế suất thuế xuất khẩu của thuốc là là 1%. Tỷ giá 22.500 đồng/USD. Thuế suất thuế tiêu thụ đặc biệt của thuốc lá\r\nlà 65%. Chủ thể phải nộp thuế tiêu thụ đặc biệt là:",
        answer: "công ty INTIMEX.",
    },
    {
        question:
            "Công ty TNHH sản xuất ô tô Thanh Thảo bán xe ô tô 16 chỗ chỗ theo hai\r\nphương thức: trả ngay giá chưa có thuế giá trị gia tăng là 320 triệu đồng/xe, trả góp 1 năm là 360 triệu đồng/xe (bao gồm cả thuế giá trị gia tăng). Trong tháng 9/N doanh nghiệp bán được 50 xe theo phương thức trả ngay và 25 xe theo phương thức trả góp. Thuế suất thuế tiêu thụ đặc biệt đối với ô tô 16 chỗ là 30%. Thuế tiêu thụ đặc biệt mà công\r\nty phải nộp của tháng 9 là:",
        answer: "5.538.461.538 đồng.",
    },
    {
        question:
            "Công ty TNHH Tuấn Cường mua 1000 cây thuốc lá điếu của công ty thuốc lá Thăng Long với giá chưa thuế giá trị gia tăng là\r\n105.000 đồng/cây, và bán ra với giá chưa thuế giá trị gia tăng là\r\n135.000 đồng/cây, thuế suất thuế tiêu thụ đặc biệt của thuốc là trên là 65%.\r\nThuế tiêu thụ đặc biệt Công ty TNHH Tuấn Cường phải nộp là:",
        answer: "Không phải nộp thuế TTĐB",
    },
    {
        question:
            "Công ty TNHH Thế Kỷ Mới kinh doanh vũ trường tháng 9/N đạt doanh số\r\n(chưa có thuế giá trị gia tăng 10%) là 3.456.756.000 đồng, trong đó doanh số vé vào cửa là 12.456.000 đồng, doanh số bán rượu là 2.345.980.000 đồng, còn lại là doanh số bán các mặt hàng khác Thuế suất thuế tiêu thụ đặc biệt của vũ trường là 40%. Thuế tiêu thụ đặc\r\nbiệt mà công ty phải nộp là:",
        answer: "987.644.571 đồng.",
    },
    {
        question:
            "Công ty TNHH Tân Thành Phát kinh doanh trò chơi điện tử có thưởng,\r\ntháng 9/N đạt doanh số bán hàng (chưa bao gồm thuế giá trị gia tăng 10%) là 654.680.000 đồng. Công ty đã trả thưởng cho khách hàng là 123.470.000 đồng. Thuế suất thuế tiêu thụ đặc biệt của kinh doanh trò chơi điện tử có thưởng là 30%. Thuế tiêu thụ đặc biệt mà công ty phải\r\nnộp là:",
        answer: "122.586.923 đồng.",
    },
    {
        question:
            "Công ty TNHH Đại Quang Nam kinh doanh dịch vụ massage, tháng 9/N\r\ncó tổng doanh số bán hàng (chưa bao gồm thuế giá trị gia tăng 10%) là 345.900.000 đồng, trong đó doanh số dịch vụ massage là 236.000.000 đồng, dịch vụ ăn uống đi kèm là 109.900.000 đồng. Thuế suất thuế tiêu thụ đặc biệt của kinh doanh massage là 30%, thuế tiêu thụ đặc biệt mà\r\ncông ty phải nộp là bao nhiêu?",
        answer: "79.823.077 đồng.",
    },
    {
        question:
            "Công ty thương mại Thiên Phúc nhập khẩu 1.500 chai rượu, Giá CIF Hải\r\nPhòng là 13 USD/chai. Trong quá trình vận chuyển, xếp dỡ (hàng còn nằm trong khu vực hải quan quản lý) vỡ 20 chai. Thuế suất thuế nhập khẩu rượu: 150%, thuế suất thuế tiêu thụ đặc biệt của rượu là 45%. Tỷ giá tính thuế 22.500 VND/USD. Thuế tiêu thụ đặc",
        answer: "488.215.000 đồng.",
    },
    {
        question: "Chủ thể nào sau đây KHÔNG thuộc đối tượng nộp thuế giá trị gia tăng?",
        answer: "Nông dân sản xuất lúa gạo.",
    },
    {
        question: "Có mấy phương pháp tính thuế giá trị gia tăng",
        answer: "2 phương pháp",
    },
    {
        question: "Tính trên phần giá trị tăng thêm của hàng hóa dịch vụ phát sinh",
        answer: "Tính trên phần giá trị tăng thêm của hàng hóa dịch vụ phát sinh\r\ntrong quá trình từ sản xuất, lưu thông đến tiêu dùng",
    },
    {
        question: "Vai trò thuế GTGT",
        answer: "Tạo nguồn thu cho NSNN",
    },
    {
        question: "Đối tượng chịu thuế GTGT",
        answer: "Hàng hóa, dịch vụ dùng cho sản xuất, kinh doanh và tiêu dùng ở\r\nViệt Nam",
    },
    {
        question: "Người nộp thuế GTGT",
        answer: "Các tổ chức, cá nhân sản xuất, kinh doanh hàng hóa, dịch vụ\r\nchịu thuế giá trị gia tăng",
    },
    {
        question: "Người nộp thuế GTGT",
        answer: "Các tổ chức, cá nhân sản xuất, kinh doanh hàng hóa, dịch vụ\r\nchịu thuế giá trị gia tăng",
    },
    {
        question: "Trường hợp nào không phải kê khai nộp thuế",
        answer: "Thu hộ",
    },
    {
        question: "Trường hợp nào không phải kê khai nộp thuế",
        answer: "Ông A là cá nhân không kinh doanh bán xe 4 chỗ ngồi cho ông B với giá 600 triệu",
    },
    {
        question: "Đối tượng không chịu thuế GTGT",
        answer: "Người kinh doanh có doanh thu hàng năm từ 100 triệu đồng trở\r\nxuống",
    },
    {
        question: "Thời điểm tính thuế GTGT đói với hàng hóa",
        answer: "Thời điểm chuyển giao quyền sở hữu, quyền sử dụng hàng hóa cho người mua",
    },
    {
        question: "Thời điểm tính thuế GTGT đối với dịch vụ",
        answer: "Thời điểm hoàn thành việc cung ứng dịch vụ hoặc thời điểm lập\r\nhóa đơn cung cứng dịch vụ",
    },
    {
        question: "Thời điểm tính thuế GTGT đối với hàng hóa nhập khẩu",
        answer: "Thời điểm đăng ký tờ khai hải quan",
    },
    {
        question:
            "Ngày 30/8 Công ty A đặt hàng công ty S một thiết bị lọc nước. Ngày 31/8 thiết bị được giao đến công ty A. Ngày 3/9 công ty S chuyển giao quyền sở hữu cho công ty A. Ngày 6/9 công ty A thanh toán cho công ty S. Hỏi thời điểm tính thuế GTGT tại\r\ncông ty S",
        answer: "Ngày 3/9",
    },
    {
        question:
            "Ngày 14/6 Công ty G ký hợp đồng cung cấp dịch vụ lắp đặt Internet và dịch vụ Internet cho công ty A.\r\nNgày 15/6 thu tiền lắp đặt : 3 triệu;\r\nngày 20/6 hoàn thành việc lắp đặt Internet và thu trước tiền cước dịch vụ Internet 1 năm là 60 triệu. 21/6 công ty A bắt đầu sử dụng Internet\r\nThời điểm tính thuế GTGT với dịch vụ lắp đặt Internet là ngày",
        answer: "Ngày 15/6",
    },
    {
        question: "Ngày 15/6",
        answer: "Ngày 14/6 Công ty G ký hợp đồng cung cấp dịch vụ lắp đặt Internet và dịch vụ Internet cho công ty A.\r\nNgày 15/6 thu tiền lắp đặt : 3 triệu;\r\nngày 20/6 hoàn thành việc lắp đặt Internet và thu trước tiền cước dịch vụ Internet 1 năm là 60 triệu\r\n21/6 công ty A bắt đầu sử dụng Internet\r\nThời điểm tính thuế GTGT với dịch vụ Internet là ngày",
    },
    {
        question:
            "Ngày 14/6 Công ty G ký hợp đồng cung cấp dịch vụ lắp đặt Internet và dịch vụ Internet cho công ty A.\r\nNgày 15/6 thu tiền lắp đặt : 3 triệu;\r\nngày 20/6 hoàn thành việc lắp đặt Internet và thu trước tiền cước dịch vụ Internet 1 năm là 60 triệu\r\n21/6 công ty A bắt đầu sử dụng Internet\r\nThời điểm tính thuế GTGT với dịch vụ Internet là ngày",
        answer: "Ngày 20/6",
    },
    {
        question: "Công thức tính Thuế giá trị gia tăng theo phương pháp tính trực\r\ntiếp áp dụng với các tổ chức mua, bán, chế tác vàng bạc, đá quý",
        answer: "Thuế GTGT = Giá trị gia tăng x Thuế suất thuế GTGT",
    },
    {
        question: "Công thức tính Thuế giá trị gia tăng theo phương pháp tính trực tiếp áp dụng với Hộ các nhân kinh doanh",
        answer: "Thuế GTGT = Doanh thu x tỷ lệ %",
    },
    {
        question: "Tỷ lệ % để tính thuế GTGT trên doanh thu áp dụng các đơn vị tính thuế GTGT theo phương pháp trực tiếp đối với hoạt động\r\nPhân phối hàng hóa",
        answer: "là 1%",
    },
    {
        question: "Tỷ lệ % để tính thuế GTGT trên doanh thu áp dụng các đơn vị\r\ntính thuế GTGT theo phương pháp trực tiếp đối với hoạt động Dịch vụ, xây dựng không bao thầu nguyên vật liệu",
        answer: "Là 5%",
    },
    {
        question:
            "Tỷ lệ % để tính thuế GTGT trên doanh thu áp dụng các đơn vị tính thuế GTGT theo phương pháp trực tiếp đối với Hoạt động Sản xuất, vận tải, dịch vụ có gắn với hàng hóa, xây dựng có bao\r\nthầu nguyên vật liệu",
        answer: "Là 3%",
    },
    {
        question: "Tỷ lệ % để tính thuế GTGT trên doanh thu áp dụng các đơn vị\r\ntính thuế GTGT theo phương pháp trực tiếp đối với Hoạt động kinh doanh khác",
        answer: "Là 2%",
    },
    {
        question:
            "Công ty A kê khai, nộp thuế GTGT theo phương pháp trực tiếp. Trong tháng 12/20xx có doanh thu từ hoạt động tư vấn thành lập\r\ndoanh nghiệp 10 tỷ. Thuế suất thuế GTGT áp dụng hoạt động Dịch vụ là 5%. Số thuế GTGT công ty phải nộp trong tháng 12?",
        answer: "0,5 tỷ",
    },
    {
        question:
            "Công ty X kinh doanh vàng bạc đá quý, tháng 2 công ty mua 1 cây vàng SJC giá 50 triệu. Sau đó bán ra giá 60 triệu. Số thuế\r\nGTGT công ty X nộp trong tháng 2 là. Thuế suất thuế GTGT với vàng bạc 10%",
        answer: "1 triệu",
    },
    {
        question: "Công thức tính thuế GTGT phải nộp theo phương pháp khấu trừ",
        answer: "Số thuế GTGT phải nộp = Thuế GTGT đầu ra - Thuế GTGT đầu vào được khấu trừ",
    },
    {
        question: "Công thức tính thuế GTGT đầu ra",
        answer: "Thuế GTGT = Giá bán chưa có thuế GTGT x thuế suất thuế\r\nGTGT",
    },
    {
        question: "Giá tính thuế GTGT đối với hàng hóa, dịch vụ do cơ sở sản xuất, kinh doanh bán ra",
        answer: "Là giá bán chưa có thuế GTGT",
    },
    {
        question: "Giá tính thuế GTGT đối với hàng hóa, dịch vụ chịu thuế TTĐB",
        answer: "Là giá bán đã có thuế TTĐB nhưng chưa có thuế GTGT",
    },
    {
        question: "Giá tính thuế GTGT đối với hàng hóa nhập khẩu",
        answer: "Là giá nhập tại cửa khẩu nhập đầu tiên cộng với thuế nhập khẩu\r\n(nếu có), cộng (+) thuế tiêu thụ đặc biệt (nếu có) (+) thuế bảo vệ môi trường (nếu có).",
    },
    {
        question: "Giá tính thuế GTGT đối với Đối với hàng hóa, dịch vụ dùng để\r\ntrao đổi, tiêu dùng nội bộ, biếu, tặng cho",
        answer: "Là giá tính thuế giá trị gia tăng của hàng hóa, dịch vụ cùng loại\r\nhoặc tương đương tại thời điểm phát sinh các hoạt động này.",
    },
    {
        question: "Giá tính thuế GTGT đối với Đối với hàng hóa bán theo phương\r\nthức trả góp, trả chậm",
        answer: "Là giá bán bao gồm lãi trả chậm, trả góp",
    },
    {
        question:
            "Công ty bán ô tô, giá bán trả góp chưa bao gồm thuế GTGT là 800 triệu. Trong đó giá bán xe là 700 triệu, lãi trả góp là 100\r\ntriêu. Thuế suất thuế GTGT ô tô 10%. Thuế GTGT phát sinh khi bán 1 chiếc xe là?",
        answer: "70 triệu",
    },
    {
        question: "Giá tính thuế GTGT Đối với gia công hàng hóa",
        answer: "Là giá gia công, chưa có thuế giá trị gia tăng",
    },
    {
        question: "Giá tính thuế GTGT Đối với hoạt động cho thuê tài sản là",
        answer: "Số tiền cho thuê chưa có thuế giá trị gia tăng",
    },
    {
        question: "Giá tính thuế GTGT Đối với hoạt động đại lý, môi giới mua bán hàng hóa và dịch vụ hưởng hoa hồng",
        answer: "Là tiền hoa hồng thu được từ các hoạt động này, chưa có thuế\r\ngiá trị gia tăng",
    },
    {
        question:
            "Giá tính thuế GTGT Đối với hàng hóa, dịch vụ được sử dụng\r\nloại chứng từ thanh toán ghi giá thanh toán là giá đã có thuế giá trị gia tăng thì giá tính thuế được xác định theo công thức:",
        answer: "Giá đã có thuế GTGT/(1+ Thuế suất thuế GTGT)",
    },
    {
        question: "Đối với hàng hóa dịch vụ dùng để khuyến mãi theo chương trình\r\nkhuyến mãi được thực hiện theo quy định của pháp luật về thương mại. Giá tính thuế GTGT",
        answer: "Bằng 0",
    },
    {
        question: "Đâu KHÔNG phải là mức thuế suất thuế GTGT",
        answer: "15%",
    },
    {
        question:
            "Công ty Lavie sản xuất nước đóng chai bán với giá chưa thuế GTGT 4.000 đ/chai. Trong tháng 10/20XX công ty xuất 100 chai nước phục vụ họp khách hàng; 100 chai phục vụ kỳ nghỉ\r\nmát hàng năm của công ty. Thuế suất thuế GTGT nước đóng chai 10%; Trong tháng 10 công ty tính thuế GTGT đối với",
        answer: "200 chai nước",
    },
    {
        question: "Điều kiện để khấu trừ thuế GTGT đầu vào",
        answer: "Cả 2 điều kiện trên",
    },
    {
        question:
            "Tháng 9/N,\t công ty A tập hợp được Thuế giá trị gia tăng đầu\r\nvào trên các hóa đơn, chứng từ mua nguyên liệu, hàng hóa đầu vào của quá trình sản xuất gồm có 2 hóa đơn:\r\n•\tHóa đơn 1: Giá chưa thuế 15 triệu đồng, thuế giá trị gia tăng 1,5 triệu đồng.\r\n•\tHóa đơn 2: Giá chưa thuế 20 triệu đồng, thuế giá trị gia tăng 2triệu đồng. Thanh toán qua ngân hàng.\r\nXác định thuế giá trị gia tăng được khấu trừ của công ty trong tháng",
        answer: "3,5 triệu",
    },
    {
        question:
            "Tháng 9/N, công ty A tập hợp được Thuế giá trị gia tăng đầu vào trên các hóa đơn, chứng từ mua nguyên liệu, hàng hóa đầu vào của quá trình sản xuất có hóa đơn mua hàng hóa: Giá chưa thuế 30 triệu đồng; thuế giá trị gia tăng 3 triệu đồng. Thanh toán\r\n½ bằng tiền mặt; ½ tiền gửi ngân hàng.\r\nXác định thuế giá trị gia tăng được khấu trừ của các hóa đơn nêu trên",
        answer: "1,5 triệu",
    },
    {
        question:
            "Công ty A tháng 9/N, có tài liệu sau:\r\nMua ô tô hiệu Lexus ES 350 giá 3.260.000.000 VNĐ tạo tài sản cố định phục vụ hoạt động quản lý của công ty. Biết thuế suất thuế GTGT đối với ô tô là 10%.\r\nTính số thuế VAT được khấu trừ đầu vào của công ty?",
        answer: "160 triệu",
    },
    {
        question:
            "160 triệu\r\nTrong tháng 1/20XX, Công ty TNHH ô tô Trường Hải, Nhập khẩu 1 Mercedes-Maybach S 450, dung tích xi lanh 2996 (cc), giá CIF: 75.000 USD; trong đó Phí bảo hiểm và vận tải biển là\r\n5.000 USD; thuế suất thuế nhập khẩu của mẫu xe này là 70%; thuế suất thuế TTĐB là 50%; tỷ giá để tính thuế nhập khẩu tại thời điểm nhập khẩu là 23.400 VND/USD. Giá tính thuế Nhập\r\nkhẩu xe ô tô",
        answer: "75.000 usd x 23.400",
    },
    {
        question:
            "Trong tháng 1/20XX, Công ty TNHH ô tô Trường Hải, Nhập khẩu 1 Mercedes-Maybach S 450, dung tích xi lanh 2996 (cc), giá CIF: 75.000 USD; trong đó Phí bảo hiểm và vận tải biển là\r\n5.000 USD; thuế suất thuế nhập khẩu của mẫu xe này là 70%;\r\nthuế suất thuế TTĐB là 50%; tỷ giá để tính thuế nhập khẩu tại thời điểm nhập khẩu là 23.400 VND/USD. Thuế NK ô tô là",
        answer: "75.000 usd x 70% x 23.400",
    },
    {
        question:
            "Trong tháng 1/20XX, Công ty TNHH ô tô Trường Hải, Nhập khẩu 1 Mercedes-Maybach S 450, dung tích xi lanh 2996 (cc), giá CIF: 75.000 USD; trong đó Phí bảo hiểm và vận tải biển là\r\n5.000 USD; thuế suất thuế nhập khẩu của mẫu xe này là 70%; thuế suất thuế TTĐB là 50%; tỷ giá để tính thuế nhập khẩu tại thời điểm nhập khẩu là 23.400 VND/USD. Giá tính thuế TTĐB\r\nô tô",
        answer: "(75.000 + 75.000 x 70%)x 23.400",
    },
    {
        question:
            "Trong tháng 1/20XX, Công ty TNHH ô tô Trường Hải, Nhập khẩu 1 Mercedes-Maybach S 450, dung tích xi lanh 2996 (cc), giá CIF: 75.000 USD; trong đó Phí bảo hiểm và vận tải biển là\r\n5.000 USD; thuế suất thuế nhập khẩu của mẫu xe này là 70%;\r\nthuế suất thuế TTĐB là 50%; tỷ giá để tính thuế nhập khẩu tại thời điểm nhập khẩu là 23.400 VND/USD. Thuế TTĐB ô tô là",
        answer: "(75.000 + 75.000 x 70%)x 50% x 23.400",
    },
    {
        question:
            "Trong tháng 1/20XX, Công ty TNHH ô tô Trường Hải, Nhập khẩu 1 Mercedes-Maybach S 450, dung tích xi lanh 2996 (cc), giá CIF: 75.000 USD; trong đó Phí bảo hiểm và vận tải biển là\r\n5.000 USD; thuế suất thuế nhập khẩu của mẫu xe này là 70%; thuế suất thuế TTĐB là 50%; tỷ giá để tính thuế nhập khẩu tại thời điểm nhập khẩu là 23.400 VND/USD. Giá tính thuế GTGT\r\nhàng nhập khẩu",
        answer: "4.475.250.000 đồng",
    },
    {
        question:
            "Trong tháng 1/20XX, Công ty TNHH ô tô Trường Hải, Nhập khẩu 1 Mercedes-Maybach S 450, dung tích xi lanh 2996 (cc), giá CIF: 75.000 USD; thuế suất thuế nhập khẩu của mẫu xe này là 70%; thuế suất thuế TTĐB là 50%; giả sử tỷ giá để tính thuế nhập khẩu tại thời điểm nhập khẩu là 23.400 VND/USD. Công ty đã giao xe cho KH, giá bán ĐÃ có thuế GTGT ghi trên hóa đơn của nhà nhập khẩu là 7.369.000.000 đồng.Thuế GTGT phải\r\nnộp khi nhập khẩu hàng hóa",
        answer: "Trong tháng 1/20XX, Công ty TNHH ô tô Trường Hải, Nhập khẩu 1 Mercedes-Maybach S 450, dung tích xi lanh 2996 (cc), giá CIF: 75.000 USD; thuế suất thuế nhập khẩu của mẫu xe này là 70%; thuế suất thuế TTĐB là 50%; giả sử tỷ giá để tính thuế nhập khẩu tại thời điểm nhập khẩu là 23.400 VND/USD. Công ty đã giao xe cho KH, giá bán ĐÃ có thuế GTGT ghi trên hóa đơn của nhà nhập khẩu là 7.369.000.000 đồng.Thuế GTGT phải\r\nnộp khi nhập khẩu hàng hóa",
    },
    {
        question:
            "Trong tháng 1/20XX, Công ty TNHH ô tô Trường Hải, Nhập khẩu 1 Mercedes-Maybach S 450, dung tích xi lanh 2996 (cc), giá CIF: 75.000 USD; thuế suất thuế nhập khẩu của mẫu xe này là 70%; thuế suất thuế TTĐB là 50%; giả sử tỷ giá để tính thuế nhập khẩu tại thời điểm nhập khẩu là 23.400 VND/USD. Công ty đã giao xe cho KH, giá bán ĐÃ có thuế GTGT ghi trên hóa đơn của nhà nhập khẩu là 7.369.000.000. Giá tính thuế GTGT\r\nbán xe",
        answer: "7.369.000.0000/(1+10%) đồng",
    },
    {
        question:
            "Trong tháng 1/20XX, Công ty TNHH ô tô Trường Hải, Nhập khẩu 1 Mercedes-Maybach S 450, dung tích xi lanh 2996 (cc), giá CIF: 75.000 USD; thuế suất thuế nhập khẩu của mẫu xe này là 70%; thuế suất thuế TTĐB là 50%; giả sử tỷ giá để tính thuế nhập khẩu tại thời điểm nhập khẩu là 23.400 VND/USD. Công ty đã giao xe cho KH, giá bán ĐÃ có thuế GTGT ghi trên hóa\r\nđơn của nhà nhập khẩu là 7.369.000.000. Thuế GTGT đầu ra",
        answer: "7.369.000.0000*10%/(1+10%) đồng",
    },
    {
        question:
            "Cơ sở kinh doanh sản xuất hai loại mặt hàng là xe đạp và xe lăn. Thuế giá trị gia tăng đầu vào của nguyên vật liệu sản xuất hai mặt hàng là 60 triệu đồng. Cơ sở sản xuất không hạch toán riêng nguyên vật liệu sản xuất từng mặt hàng. Biết rằng doanh thu trong kỳ tính thuế của xe đạp là 600 triệu đồng, của xe lăn là\r\n900 triệu đồng. Tính thuế giá trị gia tăng khấu trừ trong kỳ (thuế suất thuế giá trị gia tăng là 10%)?",
        answer: "24 triệu đồng.",
    },
    {
        question:
            "Cơ sở kinh doanh nộp thuế giá trị gia tăng theo phương pháp khấu trừ bán hàng hóa xuất hóa đơn giá trị gia tăng chỉ ghi giá thanh toán, không ghi giá chưa có thuế và thuế giá trị gia tăng\r\nthì giá tính thuế giá trị gia tăng đầu ra là:",
        answer: "giá thanh toán ghi trên hóa đơn giá trị gia tăng.",
    },
    {
        question:
            "Công ty A hoạt động kinh doanh thương mại nội địa, trong tháng 9 công ty có số thuế giá trị gia tăng đầu vào chưa được khấu trừ của riêng tháng 8 chuyển sang là 15 triệu, thuế giá trị gia tăng đầu vào tập hợp được trong tháng là 195 triệu. Tháng 7 doanh nghiệp đã nộp 25 triệu tiền thuế giá trị gia tăng. Số thuế\r\ngiá trị gia tăng được hoàn tháng 9 là:",
        answer: "Không đủ đk",
    },
    {
        question:
            "Công ty A là đại lý cho công ty B, trong tháng đã bán được lượng hàng hóa theo giá chưa thuế giá trị gia tăng mà công ty B\r\nquy định là 750 triệu đồng, hoa hồng phí 10% trên giá chưa thuế giá trị gia tăng. Doanh thu của công ty A là bao nhiêu?",
        answer: "75.000.000 đồng.",
    },
    {
        question:
            "Công ty A là đại lý phân phối bán đúng giá hưởng hoa hồng sản phẩm dầu nhờn. Trong tháng 9 có doanh số tiêu thụ là 660 triệu đồng (đã bao gồm thuế giá trị gia tăng 10%). Hoa hồng đại lý chưa có thuế giá trị gia tăng được hưởng là 15% tính trên giá\r\nthanh toán. Giá tính thuế giá trị gia tăng của Công ty A là bao nhiêu?",
        answer: "99 triệu đồng.",
    },
    {
        question:
            "Công ty A nhập khẩu 200 lít rượu 450 để sản xuất 3000 sản phẩm A, giá nhập khẩu 20 USD/1ít (thuế suất thuế nhập khẩu 90%, thuế suất thuế tiêu thụ đặc biệt của rượu là 65%). Bán 1000 sản phẩm A trong nước với giá chưa thuế giá trị gia tăng là\r\n450.000 đồng/sản phẩm.Tỷ giá tính thuế 22.500 VND/USD.\r\nThuế giá trị gia tăng đầu vào được khấu trừ là:",
        answer: "28.215.000 đồng.",
    },
    {
        question:
            "Công ty A nộp thuế giá trị gia tăng theo phương pháp khấu trừ thuế, trong năm đã xuất khẩu 10.000 sản phẩm X với giá CIF là 15 USD/sản phẩm, chi phí vận chuyển và bảo hiểm quốc tế của cả lô hàng là 5000 USD, sản phẩm X chịu thuế suất thuế giá trị gia tăng 10%, tỷ giá tính thuế 22.500 VND/USD. Thuế suất thuế xuất khẩu là 4%. Doanh thu của 10.000 sản phẩm trên là bao\r\nnhiêu?",
        answer: "3.375.000.000 đồng.",
    },
    {
        question:
            "Công ty TNHH Thanh Thảo sản xuất mũ bảo hiểm trong tháng 9 có tình hình sau: Thuế giá trị gia tăng chưa được khấu trừ tháng trước chuyển sang 45 triệu đồng. Thuế giá trị gia tăng ghi trên hóa đơn mua hàng phát sinh tháng 120 triệu đồng, trong đó số hàng hóa chưa xuất dùng trong tháng có số thuế giá trị gia tăng 20 triệu đồng. Tổng số thuế giá trị gia tăng đầu vào được khấu\r\ntrừ trong tháng của doanh nghiệp này là:",
        answer: "165 triệu đồng.",
    },
    {
        question:
            "Công ty TNHH Tân Cương sử dụng 20 sản phẩm để làm quà khuyến mại cho khách hàng. Giá thành sản xuất là 1,2 triệu đồng/sản phẩm. Giá bán chưa có thuế giá trị gia tăng là 1,5 triệu đồng/sản phẩm. Khách hàng mua 5 sản phẩm được tặng 1 sản phẩm. Công ty có đăng ký chương trình khuyến mại với Sở\r\nCông thương. Doanh thu của hàng dùng là quà khuyến mại là:",
        answer: "0 triệu đồng",
    },
    {
        question: "Thuế TNDN là",
        answer: "là sắc thuế thuộc loại thuế thu nhập đánh vào thu nhập chịu thuế của các doanh nghiệp trong một kỳ kinh doanh nhất định.",
    },
    {
        question: "Đâu KHÔNG phải là đặc điểm của thuế TNDN",
        answer: "Là sắc thuế gián thu",
    },
    {
        question: "Cách tính thuế TNDN phải nộp",
        answer: "Thuế TNDN phải nộp trong kỳ = (Thu nhập tính thuế trong kỳ - phần trích\r\nquỹ KH &CN) x thuế suất thuế TNDN",
    },
    {
        question: "Thu nhập tính thuế bằng",
        answer: "Thu nhập chịu thuế- Thu nhập được miễn thuế - Các khoản lỗ được kết chuyển",
    },
    {
        question: "Thu nhập chịu thuế trong kỳ tính thuế bằng",
        answer: "Doanh thu tính thu nhập chịu thuế trong kỳ - Chi phí được trừ trong kỳ + Thu nhập chịu thuế khác trong kỳ",
    },
    {
        question: "Doanh thu tính thu nhập chịu thuế",
        answer: "Là toàn bộ tiền bán hàng hóa, tiền cung ứng dịch vụ, bao gồm cả các khoản\r\ntrợ giá, phụ thu, phụ trội mà cơ sở kinh doanh được hưởng",
    },
    {
        question: "Thời điểm xác định doanh thu đối với hoạt động mua bán hàng hóa",
        answer: "là thời điểm chuyển giao quyền sở hữu, quyền sử dụng hàng hóa cho người mua",
    },
    {
        question: "Thời điểm xác định doanh thu đối với Hoạt động cung ứng dịch vụ",
        answer: "là thời điểm hoàn thành việc cung ứng dịch vụ hoặc hoàn thành từng phần việc\r\ncung ứng dịch vụ cho người mua",
    },
    {
        question: "Nếu cơ sở kinh doanh nộp thuế giá trị gia tăng theo phương pháp khấu trừ thì doanh thu",
        answer: "Không bao gồm thuế GTGT",
    },
    {
        question: "Nếu cơ sở kinh doanh nộp thuế giá trị gia tăng theo phương pháp trực tiếp thì doanh thu",
        answer: "Bao gồm thuế GTGT",
    },
    {
        question:
            "Doanh nghiệp A là đối tượng nộp thuế GTGT theo phương pháp khấu trừ. Hóa đơn GTGT gồm các chỉ tiêu sau:\r\n§ Giá bán: 100.000.000 đồng.\r\n§ Thuế GTGT (10%): 10.000.000 đồng.\r\n§ Tổng giá thanh toán: 110.000.000 đồng.\r\n§ Doanh thu để tính thu nhập chịu thuế là",
        answer: "100.000.000 đồng",
    },
    {
        question:
            "Doanh nghiệp B là đối tượng nộp thuế GTGT theo phương pháp trực tiếp trên GTGT. Hóa đơn bán hàng chỉ ghi giá bán là 110.000.000 đồng (giá đã có thuế\r\nGTGT). Doanh thu để tính thu nhập chịu thuế là",
        answer: "110.000.000 đồng",
    },
    {
        question: "Doanh thu để tính thu nhập chịu thuế đối với hàng hóa, dịch vụ bán theo phương thức trả góp, trả chậm",
        answer: "là tiền bán hàng trả một lần, không bao gồm lãi trả góp, trả chậm",
    },
    {
        question:
            "Doanh thu để tính thu nhập chịu thuế đĐối với hàng hóa, dịch vụ dùng để trao đổi, biếu tặng, cho, tiêu dùng nội bộ (không bao gồm hàng hóa, dịch vụ sử\r\ndụng để tiếp tục quá trình sản xuất, kinh doanh của doanh nghiệp",
        answer: "Là giá bán của sản phẩm, hàng hóa, dịch vụ cùng loại hoặc tương đương;",
    },
    {
        question: "Doanh thu để tính thu nhập chịu thuế Đối với hàng hóa bán qua đại lý, ký gửi đúng giá hưởng hoa hồng: Doanh nghiệp giao hàng",
        answer: "Là số tiền bán hàng hóa",
    },
    {
        question: "Doanh thu để tính thu nhập chịu thuế Đối với hàng hóa bán qua đại lý, ký gửi đúng giá hưởng hoa hồng: Doanh nghiệp làm đại lý, ký gửi",
        answer: "Là hoa hồng được hưởng",
    },
    {
        question: "Doanh thu để tính thu nhập chịu thuế Đối với hoạt động cho thuê tài sản",
        answer: "số tiền thuê trả từng kỳ",
    },
    {
        question: "Doanh thu tính thu nhập chịu thuế Đối với hoạt động tín dụng, cho thuê tài chính",
        answer: "là tiền lãi cho vay, doanh thu về cho thuê tài chính phải thu trong kỳ.",
    },
    {
        question: "Doanh thu tính thu nhập chịu thuế Đối với\thoạt động vận tải",
        answer: "tải là toàn bộ doanh thu vận chuyển hành khách, hàng hóa, hành lý.",
    },
    {
        question: "Doanh thu tính thu nhập chịu thuế Đối với hoạt động xây dựng, lắp đặt",
        answer: "đặt là giá trị công trình, hạng mục công trình hoặc khối lượng công trình\r\nnghiệm thu",
    },
    {
        question: "Doanh thu tính thu nhập chịu thuế Đối với hoạt động kinh doanh trò chơi có thưởng",
        answer: "là số tiền thu từ hoạt động này trừ số tiền đã trả thưởng cho khách hàng.",
    },
    {
        question:
            "Công ty A chuyên kinh doanh máy khoan nhồi bê tông. Công ty ký hợp đồng với công ty B là đơn vị thi công với điều khoản hai bên cùng khai thác máy khoan, doanh thu thu được sẽ chia theo tỷ lệ: Công ty A: 70%, công ty B: 30%. Mọi chi phí khách hàng, sửa chữa, vận hành công ty A sẽ chịu.Mọi chi phí giao dịch để thực hiện hợp đồng công ty B chịu. Tháng 9 doanh\r\nthu của việc sử dụng máy là 100 triệu. doanh thu tính thu nhập chịu thuế của công ty A là",
        answer: "70 triệu",
    },
    {
        question: "Đâu KHÔNG phải là điều kiện xác định các khoản chi phí được trừ:",
        answer: "Khoản chi thanh toán tiền lương cho nhân viên",
    },
    {
        question: "Các trường hợp nào sau đây KHÔNG được tính vào chi phí được trừ khi xác định thu nhập chịu thuế thu nhập doanh nghiệp?",
        answer: "Tiền phạt vi phạm hành chính về thuế, vi phạm luật giao thông.",
    },
    {
        question: "Các trường hợp nào sau đây KHÔNG được tính vào chi phí được trừ khi xác định thu nhập chịu thuế thu nhập doanh nghiệp?",
        answer: "Chi ủng hộ Đoàn thanh niên cắm trại nhân ngày thành lập đoàn 26/3.",
    },
    {
        question: "Các trường hợp nào sau đây KHÔNG được tính vào chi phí được trừ khi xác định thu nhập chịu thuế thu nhập doanh nghiệp?",
        answer: "Đóng bảo hiểm nhân thọ cho lãnh đạo doanh nghiệp.",
    },
    {
        question: "Thuế thu nhập doanh nghiệp là loại thuế:",
        answer: "thuế trực thu đánh trên thu nhập có được của các cơ sở kinh doanh.",
    },
    {
        question: "Thuế suất thuế thu nhập doanh nghiệp áp dụng đối với hầu hết cơ sở sản xuất kinh doanh là:",
        answer: "20%",
    },
    {
        question: "Khoản chi phí nào KHÔNG được tính vào chi phí được trừ khi tính thuế thu nhập doanh nghiệp?",
        answer: "Lãi tiền vay để bổ sung vốn",
    },
    {
        question: "Khoản nào sau đây được xem là chi phí được trừ khi xác định thu nhập chịu thuế thu nhập doanh nghiệp?",
        answer: "b.\tChi trợ cấp thôi việc cho người lao động theo đúng quy định hiện hành.",
    },
    {
        question: "Khoản nào sau đây KHÔNG tính vào thu nhập khác khi tính thu nhập chịu thuế thu nhập doanh nghiệp?",
        answer: "a.\tKhách hàng thanh toán tiền hàng.",
    },
    {
        question: "Thời hạn doanh nghiệp được chuyển lỗ là:",
        answer: "3\tnăm 5 năm",
    },
    {
        question: "Đối tượng nào KHÔNG thuộc diện chịu thuế thu nhập doanh nghiệp?",
        answer: "d.\tHộ kinh doanh cá thể.",
    },
    {
        question: "Đối tượng nào sau đây KHÔNG thuộc diện nộp thuế thu nhập doanh nghiệp?",
        answer: "d.\tHộ gia đình, cá nhân nông dân sản xuất hàng hóa lớn có thu nhập cao từ sản phẩm trồng trọt, chăn nuôi, nuôi trồng thủy sản.",
    },
    {
        question: "Đối tượng nào thuộc diện nộp thuế thu nhập doanh nghiệp?",
        answer: "d.\tCá nhân nông dân là chủ doanh nghiệp tư nhân kinh doanh sản phẩm nông nghiệp.",
    },
    {
        question:
            "Doanh nghiệp tư nhân A nộp thuế giá trị gia tăng theo phương pháp trực tiếp trên giá trị gia tăng, hóa đơn bán hàng ghi giá bán là 1.320.000 đồng. Thuế suất thuế giá trị gia tăng các mặt hàng doanh nghiệp kinh doanh đều là 10%. Doanh thu để tính thu nhập chịu thuế thu nhập doanh nghiệp là bao nhiêu?",
        answer: "d.\t1.320.000 đồng.",
    },
    {
        question:
            "Doanh nghiệp A nhận ủy thác nhập khẩu một lô hàng theo giá CIF là 100.000 USD, tương đương 1,75 tỷ đồng. Hoa hồng ủy thác được hưởng là 4% tính trên giá trị lô hàng. Doanh thu chịu thuế thu nhập doanh nghiệp là bao nhiêu?",
        answer: "70 triệu đồng.",
    },
    {
        question:
            "Công ty bán ô tô, giá bán trả góp chưa bao gồm thuế GTGT là 800 triệu.\r\nTrong đó giá bán xe là 700 triệu, lãi trả góp là 100 triêu. Thuế suất thuế GTGT ô tô 10%. Doanh thu phát sinh khi bán 1 chiếc xe là?",
        answer: "700 triệu",
    },
    {
        question:
            "Công ty A kinh doanh áo sơ mi; trong kỳ phát sinh nghiệp vụ\r\n•\tBán 100 chiếc áo, giá bán 200.000 đ/cái.\r\n•\tDùng cho nhân viên làm đồng phục : 50 cái Doanh thu để tính thu nhập chịu thuế trong kỳ là",
        answer: "30 triêu",
    },
    {
        question:
            "Công ty X tính thuế GTGT theo phương pháp khấu trừ, trong kỳ có nghiệp vụ\r\n-\tBán 1.000 cây thuốc lá giá bán Đã thuế GTGT 22.000 đ/cây. Thuế giá trị gia tăng 10%\r\n-\tGia công thuốc lá điếu cho công ty Nam Hà là 10.000 bao đơn giá gia công\r\nĐã thuế GTGT 5.500 đ/bao, đã xong và đã giao hàng cho công ty Nam Hà. Doanh thu tính thu nhập chịu thuế trong kỳ của công ty",
        answer: "70 triệu",
    },
    {
        question:
            "Công ty X tính thuế GTGT theo phương pháp trực tiếp, trong kỳ có nghiệp vụ\r\n-\tBán 1.000 cây thuốc lá giá bán Đã thuế GTGT 22.000 đ/cây. Thuế giá trị gia tăng 10%\r\n-\tGia công thuốc lá điếu cho công ty Nam Hà là 10.000 bao đơn giá gia công Đã thuế GTGT 5.500 đ/bao, đã xong và đã giao hàng cho công ty Nam Hà.\r\nDoanh thu tính thu nhập chịu thuế trong kỳ của công ty",
        answer: "77 triệu",
    },
    {
        question:
            "T6.20XX S Ký hợp đồng lắp đặt ADSL và đăng ký dịch vụ Internet mức 5tr/t, thời han 1 năm\r\n-\t15/6 Thu trước tiền lắp đặt 3 triệu\r\n-\t20/6 Hoàn tất việc lắp đặt và thu tiền sử dụng dịch vụ 1 năm: 60 triệu\r\n21/6 A bắt đầu sử dụng dịch vụ. Doanh thu của công ty S thu được trong tháng 6 là",
        answer: "63 triệu",
    },
    {
        question:
            "Tại một doanh nghiệp trong kỳ tính thuế Quý 1/20XX có các số liệu sau: (Đơn vị: trđ)\r\n-\tDoanh thu: 2.000;\r\n-\tTổng chi phí phát sinh trong kỳ: 1.640 (trong đó có 40 triệu là chi tiền phạt do vi phạm hợp đồng)\r\n-\tThu lãi tiền gửi: 220; Thu khoản nợ2k3h/1ó5đòi đã xoá nay đòi được 100; Chi phí được trừ trong Quý 1/20xx của công ty là",
        answer: "1.640",
    },
    {
        question:
            "Tại một doanh nghiệp trong kỳ tính thuế Quý 1/20XX có các số liệu sau: (Đơn vị: trđ)\r\n-\tDoanh thu: 2.000;\r\n-\tTổng chi phí phát sinh trong kỳ: 1.640 (trong đó có 40 triệu là chi tiền phạt do vi phạm hợp đồng)\r\n-\tThu lãi tiền gửi: 220; Thu khoản nợ khó đòi đã xoá nay đòi được 100; Thu nhập chịu thuế khác",
        answer: "320",
    },
    {
        question:
            "Tại một doanh nghiệp trong kỳ tính thuế Quý 1/20XX có các số liệu sau: (Đơn vị: trđ)\r\n-\tDoanh thu: 2.000;\r\n-\tTổng chi phí phát sinh trong kỳ: 1.640 (trong đó có 40 triệu là chi tiền phạt do vi phạm hợp đồng)\r\n-\tThu lãi tiền gửi: 220; Thu khoản nợ khó đòi đã xoá nay đòi được 100;\r\nThu nhập chịu thuế trong kỳ",
        answer: "680",
    },
    {
        question:
            "Tại một doanh nghiệp trong kỳ tính thuế Quý 1/20XX có các số liệu sau: (Đơn vị: trđ)\r\n-\tDoanh thu: 2.000;\r\n-\tTổng chi phí phát sinh trong kỳ: 1.640 (trong đó có 40 triệu là chi tiền phạt do vi phạm hợp đồng)\r\n-\tThu lãi tiền gửi: 220; Thu khoản nợ khó đòi đã xoá nay đòi được 100; Thuế TNDN phải nộp trong quý là",
        answer: "136",
    },
    {
        question:
            "Tại một doanh nghiệp trong kỳ tính thuế Quý 1/20XX có các số liệu sau: (Đơn vị: trđ)\r\n-\tDoanh thu: 2.000;\r\n-\tTổng chi phí phát sinh trong kỳ: 1.640 (trong đó có 40 triệu là chi tiền phạt do nộp chậm tiền thuế)\r\n-\tThu lãi tiền gửi: 220; Thu khoản nợ khó đòi đã xoá nay đòi được 100; Chi phí được trừ trong Quý 1/20xx của công ty là",
        answer: "1.600",
    },
    {
        question:
            "Tại một doanh nghiệp trong kỳ tính thuế Quý 1/20XX có các số liệu sau: (Đơn vị: trđ)\r\n-\tDoanh thu: 2.000;\r\n-\tTổng chi phí phát sinh trong kỳ: 1.640 (trong đó có 40 triệu là chi tiền phạt do nộp chậm tiền thuế)\r\n-\tThu lãi tiền gửi: 220; Thu khoản nợ2k5h/1ó5đòi đã xoá nay đòi được 100;\r\nThu nhập chịu thuế trong Quý 1/20xx của công ty là",
        answer: "720",
    },
    {
        question:
            "Tại một doanh nghiệp trong kỳ tính thuế Quý 1/20XX có các số liệu sau: (Đơn vị: trđ)\r\n-\tDoanh thu: 2.000;\r\n-\tTổng chi phí phát sinh trong kỳ: 1.640 (trong đó có 40 triệu là chi tiền phạt do nộp chậm tiền thuế)\r\n-\tThu lãi tiền gửi: 220; Thu khoản nợ khó đòi đã xoá nay đòi được 100; Thuế TNDN phải nộp trong Quý 1/20xx của công ty là",
        answer: "144",
    },
    {
        question:
            "Doanh nghiệp A xuất khẩu lô hàng có trị giá FOB 40.000 USD. Chi phí vận chuyển và bảo hiểm quốc tế của lô hàng là 2.000 USD, chi phí này do doanh nghiệp A thanh toán bên nhập khẩu sẽ hoàn trả cùng tiền hàng, thuế suất thuế\r\nxuất khẩu 2%. Tỷ giá tính thuế 22.500 VND/USD. Doanh thu của lô hàng xuất\r\nkhẩu trên là bao nhiêu?",
        answer: "945.000.000 đồng.",
    },
    {
        question:
            "Trong năm N, Công ty A bán lượng hàng hóa có trị giá vốn là 2.500 triệu đồng, giá bán chưa có thuế giá trị gia tăng là 2.800 triệu đồng. Việc thu nợ đến\r\n31/12 đạt 95%, phần còn lại 5% chắc chắn không thu hồi được do khách hàng bị bão lũ mất khả năng thanh toán. Doanh thu tính thu nhập cá của năm N là:",
        answer: "2.800 triệu đồng.",
    },
    {
        question:
            "Một doanh nghiệp trong năm tính thuế có doanh thu bán hàng: 150.000 triệu đồng (trong đó có doanh thu hàng xuất khẩu 80.000 triệu đồng); Chính phủ thưởng do có doanh thu xuất khẩu cao 500 triệu đồng. Thu khách hàng hủy hợp đồng 100 triệu đồng. Xác định doanh thu để tính thu nhập chịu thuế thu\r\nnhập doanh nghiệp?",
        answer: "150.500 triệu đồng.",
    },
    {
        question:
            "Một doanh nghiệp trong năm tính thuế có doanh thu bán hàng: 150.000 triệu đồng (trong đó có doanh thu hàng xuất khẩu 80.000 triệu đồng); Chính phủ thưởng do có doanh thu xuất khẩu cao 500 triệu đồng. Thu khách hàng hủy\r\nhợp đồng 100 triệu đồng. Xác định thu nhập khác để tính thu nhập chịu thuế\r\nthu nhập doanh nghiệp?",
        answer: "100 trđ",
    },
    {
        question: "Khoản chi có hóa đơn, chứng từ hợp pháp nào sau đây là khoản chi phí KHÔNG được trừ khi tính thuế TNDN",
        answer: "Khoản tiền phạt do vi phạm hành chính",
    },
    {
        question: "Khoản chi c\tó hóa đơn, chứng từ hợp pháp nào sau đây là khoản chi phí\r\nKHÔNG được trừ khi\ttính thuế TNDN",
        answer: "Phần chi trả lãi tiền vay vốn sản xuất kinh doanh của ngân hàng thương mại\r\nvượt quá 150% mức lãi suất cơ bản do Ngân hàng nhà nước Việt Nam công\r\n\r\nbố tại thời điểm vay",
    },
    {
        question: "Thuế TNDN phải nộp trong kỳ được tính bằng",
        answer: "Thu nhập tính thuế nhân với thuế suất",
    },
    {
        question: "Theo Quy định thì các khoản chi ủng hộ, tài trợ của doanh nghiệp cho các hoạt động phòng, chống dịch Covid-19 sẽ:",
        answer: "Tính vào chi phí được trừ khi xác định thu nhập chịu thuế TNDN",
    },
    {
        question: "Công ty chi trả khoản tiền lương cho người lao động nghỉ trong thời gian giãn cách xã hội do ảnh hưởng dịch Covid-19 thì:",
        answer: "Tính vào chi phí được trừ khi xác định thu nhập chịu thuế TNDN",
    },
    {
        question: "Theo Quy định hiện tại thì tổng số thuế TNDN đã tạm nộp của mấy quý đầu năm tính thuế không được thấp hơn 75% số thuế TNDN phải nộp theo quyết toán năm.",
        answer: "3",
    },
    {
        question:
            "Ba người bạn A, B và C nhận được 3 học bổng: A nhận được học bổng của một trường đại học ở nước ngoài, B nhận được học bổng của tổ chức DAAD theo chương trình hỗ trợ sinh viên Việt Nam, C nhận được học bổng của tập đoàn nước ngoài tại Việt Nam do bốc thăm khuyến mại của tổ chức đó. Học bổng chịu thuế thu nhập cá nhân là:",
        answer: "các khoản học bổng không chịu thuế thu nhập cá nhân.",
    },
    {
        question: "Cá nhân cư trú là người có mặt tại Việt Nam từ bao nhiêu ngày trở lên tính\r\ntrong một năm dương lịch hoặc trong 12 tháng liên tục kể từ ngày đầu tiên có mặt tại Việt Nam?",
        answer: "183 ngày.",
    },
    {
        question: "Các khoản thu nhập nào sau đây KHÔNG phải chịu thuế thu nhập cá nhân?",
        answer: "Thu nhập của chủ doanh nghiệp tư nhân từ kết quả hoạt động kinh doanh.",
    },
    {
        question: "Đối tượng nào sau đây KHÔNG được tính giảm trừ gia cảnh người nộp thuế?",
        answer: "Mẹ ruột ngoài tuổi lao động có lương hưu 1.200.000 đồng/tháng.",
    },
    {
        question: "Mẹ ruột ngoài tuổi lao động có lương hưu 1.200.000 đồng/tháng.",
        answer: "Đối tượng nộp thuế thu nhập cá nhân ở nước ta là:",
    },
    {
        question: "Đối tượng nộp thuế thu nhập cá nhân ở nước ta là:",
        answer: "cá nhân người Việt Nam, cá nhân nước ngoài cư trú có thu nhập chịu thuế và cá nhân nước ngoài không cư trú có thu nhập chịu thuế phát sinh tại Việt Nam.",
    },
    {
        question: "Trợ cấp nào sau đây tính vào thu nhập chịu thuế thu nhập cá nhân?",
        answer: "Trợ cấp tiền ăn giữa ca doanh nghiệp trả người lao động vượt mức quy định của",
    },
    {
        question: "Thuế thu nhập cá nhân KHÔNG được xét miễn giảm trong trường hợp nào?",
        answer: "Đối tượng nộp thuế bị trộm cắp tài sản ảnh hưởng đến khả năng nộp thuế",
    },
    {
        question: "Thuế thu nhập cá nhân là gì?",
        answer: "Là loại thuế trực thu đánh trên thu nhập chịu thuế của các cá nhân",
    },
    {
        question: "Thu nhập nào sau đây là thu nhập được miễn thuế thu nhập cá nhân?",
        answer: "Thu nhập từ nhận thừa kế, quà tặng bằng tiền giữa: Vợ với chồng; cha mẹ đẻ với con đẻ; cha mẹ nuôi với con nuôi; cha mẹ chồng với con dâu; cha mẹ vợ với con rể; ông bà ngoại với cháu ngoại; anh chị em ruột với nhau.",
    },
    {
        question: "Thu nhập nào sau đây là thu nhập chịu thuế thu nhập cá nhân?",
        answer: "Thu nhập từ tiền thưởng tết.",
    },
    {
        question: "Thu nhập nào sau đây KHÔNG phải là thu nhập chịu thuế thu nhập cá nhân?",
        answer: "Thu nhập từ quà tặng trong lễ cưới.",
    },
    {
        question:
            "Ông A cùng ông B và ông C kinh doanh dưới hình thức nhóm cá nhân kinh\r\ndoanh trong năm tính thuế có mức lợi nhuận (sau khi trừ chi phí) là 100 triệu đồng. Ông A được chia theo tỷ lệ 40%. Tuy nhiên do để có tiền kinh doanh ông A vay của ngân hàng và phải trả lãi 12%/năm. Thu nhập chịu thuế của\r\nông A là:",
        answer: "35,2 triệu đồng",
    },
    {
        question:
            "Ông A nhượng bán cho ông B một xe ô tô 7 chỗ ngồi với giá 260 triệu đồng,\r\nchiếc xe này ông A mua với giá 350 triệu cách đây 1 năm. Để bán xe ông A đã bỏ 5 triệu để bảo dưỡng. Ông A có mức thu nhập chịu thuế thu nhập cá nhân là:",
        answer: "thu nhập của ông A từ nhượng bán xe ô tô không chịu thuế thu nhập cá nhân.",
    },
    {
        question:
            "Ông Mạnh nhận được quà tặng là một căn hộ chung cư từ ông nội, căn hộ có giá thị trường là 1,2 tỷ đồng, trước đây ông nội đã mua với giá 500 triệu. Theo khung giá nhà nước quy định, căn hộ trên có giá trị là 350 triệu. Biết rằng thuế suất thuế thu nhập cá nhân đối với thu nhập từ nhận quà tặng là 10%.\r\nXác định thuế thu nhập cá nhân mà ông Mạnh phải nộp?",
        answer: "Không chịu thuế thu nhập cá nhân.",
    },
    {
        question:
            "Ông Minh được cô ruột cho một căn hộ chung cư cũ có giá trị thị trường 700 triệu đồng, theo khung giá nhà nước 210 triệu đồng. Trước đây cô đã mua căn hộ trên là 400 triệu đồng. Biết rằng thuế suất thuế thu nhập cá nhân đối với thu nhập từ nhận quà tặng là 10%. Xác định thuế thu nhập cá nhân mà Ông M phải nộp?",
        answer: "21.000.00 đồng",
    },
    {
        question:
            "Ông Tuấn cho Công ty A vay 200 triệu đồng, với lãi suất là 10%/năm. Năm N ông nhận được 20 triệu đồng tiền lãi. Thu nhập từ tiền lương của ông Tuấn bình quân trong năm là 3,5 triệu đồng/tháng (sau khi đã trừ các khoản đóng góp bắt buộc). Ông Tuấn không đăng ký người phụ thuộc. Số thuế thu nhập cá nhân mà ông Tuấn phải nộp là:",
        answer: "1.000.000 đồng.",
    },
    {
        question:
            "Ông Tuấn có 3 người con A, B, C với độ tuổi lần lượt là 15, 17 và 21 tuổi. A\r\n\tsư được\r\nđang theo học cấp 3,\tB đang là học sinh lớp 11 hàng tháng có làm gia\t\r\n600.000 đồng/tháng,\tC đang là sinh viên hệ cao đẳng. Theo quy định hiện\r\nhành, ông Tuấn có thể kê khai:",
        answer: "cả 3 người con là đối tượng phụ thuộc.",
    },
    {
        question: "Các khoản thu nhập chịu thuế TNCN thu nhập từ kinh doanh- Đối với các\r\nnhân kinh doanh nộp thuế theo phương pháp khoán",
        answer: "Doanh thu tính thuế là doanh thu bao gồm thuế (trường hợp thuộc diện chịu thuế) của toàn bộ tiền bán hàng, tiền gia công, tiền hoa hồng, tiền cung ứng dịch vụ phát sinh trong kỳ tính thuế từ các hoạt động sản xuất, kinh doanh hàng hóa, dịch vụ.",
    },
    {
        question: "Các khoản thu nhập chịu thuế TNCN thu nhập từ kinh doanh- Đối với các\r\nnhân kinh doanh nộp thuế theo phương pháp khoán",
        answer: "Doanh thu tính thuế là doanh thu bao gồm thuế (trường hợp thuộc diện chịu thuế) của toàn bộ tiền bán hàng, tiền gia công, tiền hoa hồng, tiền cung ứng dịch vụ phát sinh trong kỳ tính thuế từ các hoạt động sản xuất, kinh doanh hàng hóa, dịch vụ.",
    },
    {
        question: "Các khoản thu nhập chịu thuế TNCN thu nhập từ kinh doanh- Đối với cá\r\nnhân cho thuê tài sản:",
        answer: "Doanh thu tính thuế thu nhập cá nhân đối với hoạt động cho thuê tài sản là doanh thu bao gồm thuế (trường hợp thuộc diện chịu thuế) của số tiền bên thuê trả từng\t kỳ theo hợp đồng thuê và các khoản thu khác bao gồm khoản tiền phạt, bồi thường mà bên cho thuê nhận được theo thỏa thuận tại hợp đồng thu",
    },
    {
        question: "Các khoản thu nhập chịu thuế TNCN thu nhập từ kinh doanh- Đối với cá\r\nnhân trực tiếp ký hợp đồng làm đại lý xổ số, đại lý bảo hiểm, bán hàng đa cấp:",
        answer: "Doanh thu tính thuế là doanh thu bao gồm thuế (trường hợp thuộc diện chịu thuế) của tổng số tiền hoa hồng, các khoản thưởng dưới mọi hình thức, các khoản hỗ trợ và các khoản thu khác mà cá nhân nhận được từ công ty xổ số kiến thiết, doanh nghiệp bảo hiểm, doanh nghiệp bán hàng đa cấp.",
    },
    {
        question: "Ông A có căn hộ cho thuê theo hợp đồng bên thuê phải trả số tiền hàng tháng\r\nlà",
        answer: "Xác định thu nhập từ kinh doanh của ông A",
    },
    {
        question:
            "Chị B kinh doanh vải trên chợ Đồng Xuân. Doanh thu của cửa hàng chị B hàng tháng là 30.000.000 đồng. Chị B thuộc nhóm nộp thuế theo phương pháp khóan. Xác định thu nhập từ kinh doanh của chị B?",
        answer: "30.000.000 đồng",
    },
    {
        question: "Các khoản thu nhập được trừ khi xác định thuế thu nhập cá nhân:",
        answer: "Phụ cấp đối với người có công với cách mạng",
    },
    {
        question: "Khoản Trợ cấp nào KHÔNG được trừ khi xác định thu nhập cá nhân",
        answer: "Trợ cấp tiền tham gia bảo hiểm nhân thọ cho nhân viên",
    },
    {
        question:
            "Ông Nguyễn Văn A kê khai trong tháng 9 có các khoản thu nhập sau:\r\n•\tTiền lương theo hệ số: 3,56\r\n•\tPhụ cấp chức vụ: 0,4\t\r\n•\tTiền thưởng tháng: 1.000.000 đồng\r\n•\tTiền lễ 2/9: 5.000.000 đồng\r\nBiết lương tối thiểu là 1.490.000 đồng.",
        answer: "5.900.400 đồng",
    },
    {
        question:
            "Ông Nguyễn Văn A kê khai trong tháng 9 có các khoản thu nhập sau:\r\n•\tTiền lương theo hệ số: 3,56\r\n•\tPhụ cấp chức vụ: 0,4\r\n* Phụ cấp thu hút vùng kinh tế mới: 0,15\r\n•\tTiền thưởng tháng: 1.000.000 đồng\r\n•\tTiền lễ 2/9: 5.000.000 đồng\r\nBiết lương tối thiểu là 1.490.000 đồng.\r\nXác định thu nhập chịu thuế",
        answer: "Ông Nguyễn Văn A kê khai trong tháng 9 có các khoản thu nhập sau:\r\nTiền lương theo hệ số: 3,56\r\nPhụ cấp chức vụ: 0,4\r\n* Phụ cấp thu hút vùng kinh tế mới: 0,15\r\nTiền thưởng tháng: 1.000.000 đồng\r\nTiền lễ 2/9: 5.000.000 đồng\r\nBiết lương tối thiểu là 1.490.000 đồng.\r\nXác định thu nhập chịu thuế",
    },
    {
        question:
            "Ông Nguyễn Văn A kê khai trong tháng 9 có các khoản thu nhập sau:\r\nTiền lương theo hệ số: 3,56\r\nPhụ cấp chức vụ: 0,4\r\n* Phụ cấp thu hút vùng kinh tế mới: 0,15\r\nTiền thưởng tháng: 1.000.000 đồng\r\nTiền lễ 2/9: 5.000.000 đồng\r\nBiết lương tối thiểu là 1.490.000 đồng.\r\nXác định thu nhập chịu thuế",
        answer: "11.900.400 đồng",
    },
    {
        question: "Anh A nhận được giải thưởng bốc thăm trúng thưởng của công ty × 1 chiếc xe\r\nmáy có giá trị 25 triệu.Thu nhập tính thuế",
        answer: "15 triệu",
    },
    {
        question: "Anh A nhận được giải thưởng bốc thăm trúng thưởng của công ty × 1 chiếc xe\r\nmáy có giá trị 25 triệu. Mức thuế suất thuế TNCN là",
        answer: "10%",
    },
    {
        question: "Anh A nhận được giải thưởng bốc thăm trúng thưởng của công ty × 1 chiếc xe\r\nmáy có giá trị 25 triệu. Thuế TNCN anh A phải nộp",
        answer: "2,5 triệu",
    },
    {
        question: "Công thức tính thuế TNCN đối với cá nhân cư trú có thu nhập từ hoạt động",
        answer: "Doanh thu tính thuế TNCN x Tỷ lệ thuế TNCN",
    },
    {
        question: "Công thức tính thuế TNCN đối với cá nhân cư trú có thu nhập từ đầu tư vốn",
        answer: "Thu nhập từ đầu tư vốn x 5%",
    },
    {
        question: "Công thức tính thuế TNCN đối với cá nhân cư trú có thu nhập từ chuyển",
        answer: "Giá trị chuyển nhượng x 0,1%",
    },
    {
        question: "Công thức tính thuế TNCN đối với cá nhân cư trú có thu nhập từ chuyển",
        answer: "Giá trị chuyển nhượng x 0,1%",
    },
    {
        question: "Công thức tính thuế TNCN đối với cá nhân cư trú có thu nhập từ chuyển",
        answer: "Giá trị chuyển nhượng x 2%",
    },
    {
        question: "Công thức tính thuế TNCN đối với cá nhân cư trú có thu nhập từ bản quyền",
        answer: "Thu nhập tính thuế x 5%",
    },
    {
        question: "Công thức tính thuế TNCN đối với cá\r\nquyền thương mại",
        answer: "Thu nhập tính thuế x 5%",
    },
    {
        question: "Công\r\nthưở\tthức tính thuế TNCN đối với cá nhân cư trú có thu\r\nng",
        answer: "Thu nhập tính thuế x 10%",
    },
    {
        question: "Công thức tính thuế TNCN đối với cá nhân cư trú c\r\nquà tặng",
        answer: "Thu nhập tính thuế x 10%",
    },
    {
        question: "Công thức tính thuế TNCN đối với cá nhân cư trú c\r\nquà tặng",
        answer: "Thu nhập tính thuế x 10%",
    },
    {
        question: "C\r\nti\tông thức tính thuế TNCN đối với cá nhân KHÔNG cư trú có thu nhập từ\r\nền lương, tiền công",
        answer: "Thu nhập tính thuế x 20%",
    },
    {
        question:
            "Ông John là chuyên gia được mời sang tư vấn kỹ thuật cho công ty cổ phần\r\nX. Lương hàng tháng của ông John là 3.500 USD. Công ty thuê một căn hộ 5 triệu/tháng và 1 xe ô tô 15 triệu/tháng để phục vụ chuyên gia. Thời gian ông John làm việc từ T4/N đến hết tháng T8/N. Trong thời gian này ông có tham gia nói chuyện theo đề tài cho một trung tâm, mức thù lao được hưởng là 500 USD/lần. Biết tỷ giá 1 USD = 22.000 VNĐ. Ông John là cá nhân",
        answer: "Không cư trú",
    },
    {
        question:
            "Ông John là chuyên gia được mời sang tư vấn kỹ thuật cho công ty cổ phần\r\nX. Lương hàng tháng của ông John là 3.500 USD. Công ty thuê một căn hộ 5 triệu/tháng và 1 xe ô tô 15 triệu/tháng để phục vụ chuyên gia. Thời gian ông John làm việc từ T4/N đến hết tháng T8/N. Trong thời gian này ông có tham gia nói chuyện theo đề tài cho một trung tâm, mức thù lao được hưởng là 500 USD/lần. Biết tỷ giá 1 USD = 22.000 VNĐ. Tổng thu nhập tính thuế TNCN của ông John là",
        answer: "108 triệu",
    },
    {
        question:
            "Ông John là chuyên gia được mời sang tư vấn kỹ thuật cho công ty cổ phần\r\nX. Lương hàng tháng của ông John là 3.500 USD (Trong đó đã bao gồm tiền công ty thuê một căn hộ 5 triệu/tháng và 1 xe ô tô 15 triệu/tháng để phục vụ chuyên gia). Thời gian ông John làm việc từ T4/N đến hết tháng T8/N. Trong thời gian này ông có tham gia nói chuyện theo đề tài cho một trung tâm, mức thù lao được hưởng là 500 USD/lần. Biết tỷ giá 1 USD =\r\n22.000 VNĐ. Tổng thu nhập tính thuế TNCN của ông John là",
        answer: "88 triệu",
    },
    {
        question:
            "Ông John là chuyên gia được mời sang tư vấn kỹ thuật cho công ty cổ phần\r\nX. Lương hàng tháng của ông John là 3.500 USD. Tiền công ty thuê một căn hộ 5 triệu/tháng và 1 xe ô tô 15 triệu/tháng để phục vụ chuyên gia. Thời gian ông John làm việc từ T4/N đến hết tháng T8/N. Biết tỷ giá 1 USD =\r\n22.000 VNĐ. Tổng thu nhập tính thuế TNCN của ông John là",
        answer: "97 triệu",
    },
    {
        question:
            "Ông John là chuyên gia được mời sang tư vấn kỹ thuật cho công ty cổ phần\r\nX. Lương hàng tháng của ông John là 3.500 USD. Công ty thuê một căn hộ 5 triệu/tháng và 1 xe ô tô 15 triệu/tháng để phục vụ chuyên gia. Thời gian ông John làm việc từ T4/N đến hết tháng T8/N. Trong thời gian này ông có tham gia nói chuyện theo đề tài cho một trung tâm, mức thù lao được hưởng là 500 USD/lần. Biết tỷ giá 1 USD = 22.000 VNĐ. Thuế TNCN ông John phải nộp là",
        answer: "21,6 triệu",
    },
    {
        question:
            "A là nhân viên Kế toán của công ty TNHH Nam Hà. Trong tháng 9/20xx Công ty chi tiền phụ cấp ăn trưa cho nhân viên A là750.000 đ/tháng. Tiền ăn giữa ca được tính vào thu nhập chịu thuế của A trong tháng 9 là",
        answer: "20.000 đồng",
    },
    {
        question:
            "A là nhân viên Kế toán của công ty TNHH Nam Hà. Trong năm 20XX, Công\r\nty chi tiền TRANG PHỤC cho nhân viên bằng tiền là 5.500.000 đ/người/năm. Tiền trang phục được tính vào thu nhập chịu thuế nhân viên\r\ncông ty trong năm XX là",
        answer: "500.0000 đồng",
    },
    {
        question:
            "A là nhân viên Kế toán của công ty TNHH Nam Hà. Trong năm 20XX, Công ty đặt may TRANG PHỤC cho nhân viên bằng tiền tương ứng với số tiền là\r\n5.500.000 đ/người/năm. Tiền trang phục được tính vào thu nhập chịu thuế nhân viên công ty trong năm XX là",
        answer: "Không tính vào thu nhập chịu thuế",
    },
    {
        question: "Mức giảm trừ gia cảnh đối với cá nhân cư trú có thu nhập từ tiền lương tiền công hiện đang áp dụng đối với cá nhân người nộp thuế là",
        answer: "4.400.000 đ/người/tháng",
    },
    {
        question: "Mức giảm trừ gia cảnh đối với cá nhân cư trú có thu nhập từ tiền lương tiền công\r\nhiện đang áp dụng đối với mỗi người phụ thuộc",
        answer: "4.400.000 đ/người/tháng",
    },
    {
        question: "Thuế TNCN áp dụng đối với thu nhập từ tiền lương tiền công áp dụng theo biểu\r\nthuế lũy tiến từng phần. Bậc 1 là",
        answer: "Phần thu nhập tính thuế/tháng (triệu đồng) x 5%",
    },
    {
        question: "Thuế TNCN áp dụng đối với thu nhập từ tiền lương tiền công áp dụng theo biểu\r\nthuế lũy tiến từng phần. Bậc 2 là",
        answer: "Phần thu nhập tính thuế/tháng (triệu đồng) x 10%",
    },
    {
        question: "Thuế TNCN áp dụng đối với thu nhập từ tiền lương tiền công áp dụng theo biểu\r\nthuế lũy tiến từng phần. Bậc 4 là",
        answer: "Phần thu nhập tính thuế/tháng (triệu đồng) x 20%",
    },
    {
        question: "Thuế TNCN áp dụng đối với thu nhập từ tiền lương tiền công áp dụng theo biểu\r\nthuế lũy tiến từng phần. Bậc 4 là",
        answer: "Phần thu nhập tính thuế/tháng (triệu đồng) x 20%",
    },
    {
        question: "Thuế suất thuế TNCN áp dụng đối với thu nhập từ tiền lương tiền công áp dụng\r\ntheo biểu thuế lũy tiến từng phần. Phần thu nhập tính thuế/tháng (Triệu đồng) áp dụng với bậc 1 là",
        answer: "Đến 5 triệu",
    },
    {
        question: "Thuế suất thuế TNCN áp dụng đối với thu nhập từ tiền lương tiền công áp dụng\r\ntheo biểu thuế lũy tiến từng phần. Phần thu nhập tính thuế/tháng (Triệu đồng) áp dụng với bậc 7 là",
        answer: "Trên 80",
    },
    {
        question: "Thuế suất thuế TNCN áp dụng đối với thu nhập từ tiền lương tiền công áp dụng\r\ntheo biểu thuế lũy tiến từng phần. Phần thu nhập tính thuế/tháng (Triệu đồng) áp dụng với bậc 2 là",
        answer: "Trên 5 đến 10",
    },
];
export default template;
