import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Topic() {
    const topic = [
        {
            value: "cntt",
            desc: "Công nghệ thông tin",
            image: "https://media.vneconomy.vn/w800/images/upload/2023/03/06/cns1.png",
        },
        {
            value: "ketoan",
            desc: "Kế toán",
            image: "https://fbu.edu.vn/wp-content/uploads/2023/11/top-truong-dao-tao-nganh-ke-toan-o-mien-bac-2.jpeg",
        },
        {
            value: "dieuduong",
            desc: "Điều dưỡng",
            image: "https://caodangkythuatyduochanoi.vn/uploads/images/chung-chi-hanh-nghe-dieu-duong-1.jpg",
        },
        {
            value: "kythuat",
            desc: "Kỹ thuật",
            image: "https://images.ctfassets.net/szez98lehkfm/1G5u8kZqBbe3YB2XAe6qEw/c96197f1f4f0c7a80e7a0a1569d6ad19/MyIC_Article_111602?fm=webp",
        },
        {
            value: "thucpham",
            desc: "Thực phẩm",
            image: "https://media.vneconomy.vn/images/upload/2023/05/21/nganh-tp-va-do-uong.jpg",
        },
        {
            value: "taichinh",
            desc: "Tài chính - ngân hàng",
            image: "https://9746c6837f.vws.vegacdn.vn/posts/files/tai-chinh.jpg",
        },
        {
            value: "qtkd",
            desc: "Quản trị kinh doanh",
            image: "https://vci.edu.vn/userfiles/images/gallerys/quan-tri-kinh-doanh.jpeg",
        },
        {
            value: "dulich",
            desc: "Du lịch - lữ hành",
            image: "https://huongnghiep.hocmai.vn/wp-content/uploads/2022/01/image1-62.png",
        },
        {
            value: "khachsan",
            desc: "Quản trị khách sạn",
            image: "https://eaut.edu.vn/wp-content/uploads/2020/03/lua-chon-phan-mem-quan-ly-khach-san-phu-hop.jpg",
        },
        {
            value: "dongphuonghoc",
            desc: "Đông phương học",
            image: "https://lhu.edu.vn/Data/News/640/images/Dong_phuong_hoc_la_gi_Co_nen_hoc_khoa_Dong_phuong_hoc_o_Dai_hoc_Lac_Hong.jpg",
        },
        {
            value: "anh",
            desc: "Ngôn ngữ anh",
            image: "https://tintuyensinh365.net/wp-content/uploads/2022/04/ngon-ngu-anh-1-1.jpg",
        },
        {
            value: "trung",
            desc: "Ngôn ngữ Trung",
            image: "https://htt.edu.vn/wp-content/uploads/2021/02/tim-hieu-nganh-ngon-ngu-trung-quoc.png",
        },
        {
            value: "tthcm",
            desc: "Tư tưởng Hồ Chí Minh",
            image: "https://www.nxbctqg.org.vn/img_data/images/590078416353_a4aeee8b-6cc8-4b00-b8f7-345c16fc650b.jpg",
        },
        {
            value: "lsdang",
            desc: "Lịch sử Đảng Cộng sản Việt Nam",
            image: "https://nxbctqg.org.vn/img_data/images/815399422137_dcns.jpg",
        },
        {
            value: "pldc",
            desc: "Pháp luật đại cương",
            image: "https://down-vn.img.susercontent.com/file/vn-11134208-7r98o-lni6zz11t7y256",
        },
        {
            value: "kttt",
            desc: "Kinh tế chính trị Mác - Lênin",
            image: "https://images.sachquocgia.vn/Picture/2024/3/21/image-20240321140905939.jpg",
        },
        {
            value: "cnxh",
            desc: "Chủ nghĩa xã hội khoa học",
            image: "https://images.sachquocgia.vn/Picture/2024/3/21/image-20240321140258405.jpg",
        },
        {
            value: "triet",
            desc: "Triết học Mác - Lênin",
            image: "https://nxbctqg.org.vn/img_data/images/773528504979_mllkc.jpg",
        },
    ];
    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {topic.map((item) => (
                    <Link to={`/topic/${item.value}`} className="bg-white shadow-md rounded-lg overflow-hidden" key={item.value}>
                        <img src={item.image} alt="" className="h-[150px] w-full object-cover" />
                        <div className="p-2">
                            <h1 className="text-lg font-bold text-green-700">{item.desc}</h1>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
