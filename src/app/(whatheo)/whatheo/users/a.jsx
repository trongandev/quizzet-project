// "use client";
// import React, { useEffect, useState } from "react";
// import { Switch, message, Spin } from "antd";

// import { LoadingOutlined } from "@ant-design/icons";
// import { GET_API, POST_API } from "@/lib/fetchAPI";
// import handleCompareDate from "@/lib/CompareDate";
// import Cookies from "js-cookie";
// import Image from "next/image";
// import Link from "next/link";

// export default function Usersâ() {
//     const [user, setUser] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [loadingSwitch, setLoadingSwitch] = useState(false);
//     const token = Cookies.get("token");
//     const [messageApi, contextHolder] = message.useMessage();
//     useEffect(() => {
//         const fetchUser = async () => {
//             const req = await GET_API("/profile/admin", token);
//             if (req.ok) {
//                 setLoading(true);
//                 setUser(req?.user);
//                 messageApi.success(req.message);
//             } else {
//                 messageApi.error(req.message);
//             }
//         };
//         fetchUser();
//     }, []);

//     const handleUpdateProfile = async (id, value) => {
//         setLoadingSwitch(true);
//         const req = await POST_API(`/profile`, { id, ...value }, "PATCH", token);
//         const data = req.json();
//         if (req.ok) {
//             setLoadingSwitch(false);
//             const newUser = user.map((item) => {
//                 if (item._id === id) return { ...item, ...value };
//                 return item;
//             });
//             setUser(newUser);
//             messageApi.success(data.message);
//         } else {
//             messageApi.error(data.message);
//         }
//     };

//     return (
//         <div className="">
//             {contextHolder}
//             <div className="">
//                 <h1 className="text-lg text-green-500 font-bold">Quản lí tài khoản người dùng</h1>

//                 <div className="relative overflow-x-auto mt-5">
//                     <table className="w-full text-sm text-left rtl:text-right ">
//                         <thead className="text-xs uppercase bg-zinc-200 text-zinc-500  ">
//                             <tr>
//                                 <th scope="col" className="px-6 py-3">
//                                     STT
//                                 </th>
//                                 <th scope="col" className="px-6 py-3">
//                                     Tên User
//                                 </th>
//                                 <th scope="col" className="px-6 py-3">
//                                     Email
//                                 </th>
//                                 <th scope="col" className="px-6 py-3">
//                                     Ngày đăng ký
//                                 </th>
//                                 <th scope="col" className="px-6 py-3">
//                                     Trạng thái
//                                 </th>
//                                 <th scope="col" className="px-6 py-3">
//                                     Quyền vụ
//                                 </th>
//                                 <th scope="col" className="px-6 py-3">
//                                     #
//                                 </th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {loading &&
//                                 user &&
//                                 user.map((item, index) => (
//                                     <tr className="bg-white border-b " key={index}>
//                                         <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
//                                             {index + 1}
//                                         </th>
//                                         <td className="px-6 py-4">
//                                             <Link href={`/profile/${item._id}`}>
//                                                 <div className="w-[40px] h-[40px] md:w-[35px] md:h-[35px] rounded-full overflow-hidden relative">
//                                                     <Image
//                                                         unoptimized
//                                                         src={item.profilePicture}
//                                                         alt=""
//                                                         className="object-cover h-full absolute"
//                                                         fill
//                                                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                                                     />
//                                                 </div>
//                                                 <p>{item.displayName}</p>
//                                             </Link>
//                                         </td>
//                                         <td className="px-6 py-4">{item.email}</td>
//                                         <td className="px-6 py-4">{handleCompareDate(item.created_at)}</td>

//                                         <td className="px-6 py-4">
//                                             {item.status ? (
//                                                 <div className="bg-green-200 text-green-500 rounded-full text-center px-1">Hoạt động</div>
//                                             ) : (
//                                                 <div className="bg-red-200 text-red-500 rounded-full text-center px-1">Khoá</div>
//                                             )}
//                                         </td>
//                                         <td className="px-6 py-4">
//                                             <select
//                                                 onChange={(e) => handleUpdateProfile(item._id, { role: e.target.value })}
//                                                 name=""
//                                                 id=""
//                                                 value={item.role}
//                                                 className="text-red-500 text-center font-bold border-[1px] border-red-500 ">
//                                                 <option value="user">User</option>
//                                                 <option value="admin">Admin</option>
//                                             </select>
//                                             <div className=""></div>
//                                         </td>
//                                         <td className="px-6 py-4">
//                                             <Switch loading={loadingSwitch} checked={item.status} onClick={() => handleUpdateProfile(item._id, { status: !item.status })} />
//                                         </td>
//                                     </tr>
//                                 ))}
//                         </tbody>
//                     </table>
//                     {!loading && (
//                         <div className="w-full h-[500px] flex items-center justify-center">
//                             <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }
