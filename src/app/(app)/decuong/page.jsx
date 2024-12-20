"use client";
import React, { useState } from "react";

export default function DeCuong() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileList, setFileList] = useState([]);
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        // handleUpload();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // const handleUpload = () => {
    //     fileList.forEach((file) => {
    //         const storageRef = ref(storage, `decuong/${file.name}`);
    //         const uploadTask = uploadBytesResumable(storageRef, file);

    //         uploadTask.on(
    //             "state_changed",
    //             (snapshot) => {
    //                 const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //                 console.log(`Upload is ${progress}% done`);
    //             },
    //             (error) => {
    //                 console.error("Upload failed:", error);
    //                 Swal.fire({
    //                     title: "Lỗi",
    //                     text: "Có lỗi xảy ra trong quá trình tải lên file",
    //                     icon: "error",
    //                 });
    //             },
    //             () => {
    //                 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //                     console.log("File available at", downloadURL);
    //                     Swal.fire({
    //                         title: "Thành công",
    //                         text: "File đã được tải lên thành công",
    //                         icon: "success",
    //                     });
    //                 });
    //             }
    //         );
    //     });
    //     setIsModalOpen(false);
    // };

    const props = {
        onRemove: (file) => {
            setFileList(fileList.filter((item) => item !== file));
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };
    return (
        <div className="h-screen flex justify-center items-center flex-col p-5 text-third">
            <h1 className="text-primary text-2xl font-bold">Đề cương</h1>
            <p>Khu vực hiển thị các đề cương mà mọi người share cũng như mình sưu tầm</p>
            <p className="text-secondary">Hiện đang làm tính năng này...</p>
            <p>dự kiến cuối tháng 12</p>

            {/* <div className="">
                <div className="bg-white p-5 mt-2 flex flex-col">
                    <h1 className="text-2xl text-gray-800 font-bold">Đề cương từ cộng đồng chúng tôi</h1>
                    <p className="text-gray-500">Nếu bạn có đề cương và muốn chia sẻ</p>
                    <div className="mt-2">
                        <Button type="primary" onClick={showModal}>
                            Upload File Đề cương
                        </Button>
                    </div>
                    <Modal title="Upload File Đề cương ở đây" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Nhấn vào hoặc kéo thả tệp vào vùng này</p>
                            <p className="ant-upload-hint">Hỗ trợ các file tài liệu</p>
                        </Dragger>
                    </Modal>
                </div>
                <div className="bg-white p-5 mt-2 flex items-center justify-between flex-col md:flex-row gap-3 md:gap-0"></div>
            </div> */}
        </div>
    );
}
