import { LoadingOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Popconfirm, Spin } from "antd";
import React from "react";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";

export default function ItemFCSimple({ item, index, listFlashcard, user, loadingAudio, speakWord, confirmDelete, loadingConfirm }: any) {
    return (
        <div key={index} className="bg-white dark:bg-slate-800/50 dark:text-white border border-white/10 p-5 shadow-sm rounded-xl font-bold text-secondary space-y-2">
            <div className="flex items-center justify-between">
                <div
                    className={`rounded-full text-white text-[12px] px-3 py-[1px] font-bold ${
                        item?.status === "reviewing" ? "bg-[#FFC107]" : item?.status === "remembered" ? "bg-[#2196F3]" : "bg-[#4CAF50]"
                    }`}>
                    {item?.status}
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h1 className="text-primary text-lg" title={item?.title}>
                        {item?.title}
                    </h1>
                    {listFlashcard?.language != "english" && <HiMiniSpeakerWave className="flex items-center gap-1 cursor-pointer" onClick={() => speakWord(item?.title, 2, item?._id)} />}
                </div>
                {user?._id == listFlashcard?.userId?._id && (
                    <Popconfirm
                        title={`Xóa từ "${item?.title}"`}
                        description="Bạn có chắc muốn xóa từ này không?"
                        okText="Chắc chắn"
                        onConfirm={() => confirmDelete(item._id)}
                        okButtonProps={{
                            loading: loadingConfirm,
                        }}
                        cancelText="Để suy nghĩ lại"
                        icon={
                            <QuestionCircleOutlined
                                style={{
                                    color: "red",
                                }}
                            />
                        }>
                        <IoClose className="hover:text-red-500 cursor-pointer" />
                    </Popconfirm>
                )}
            </div>
            <p>{item?.transcription}</p>
            <div className="flex items-center gap-3">
                {listFlashcard?.language == "english" && (
                    <>
                        <div className="flex items-center gap-1 mr-2 cursor-pointer" onClick={() => speakWord(item?.title, 1, item?._id)}>
                            {loadingAudio == item?._id ? <Spin indicator={<LoadingOutlined spin />} size="small" style={{ color: "blue" }} /> : <HiMiniSpeakerWave />}
                            <p>UK</p>
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer" onClick={() => speakWord(item?.title, 2, item?._id)}>
                            {loadingAudio == item?._id ? <Spin indicator={<LoadingOutlined spin />} size="small" style={{ color: "blue" }} /> : <HiMiniSpeakerWave />}
                            US
                        </div>
                    </>
                )}
            </div>
            <p className="font-bold text-gray-600 dark:text-white/70">
                Định nghĩa: <span className="italic font-thin">{item?.define}</span>
            </p>
        </div>
    );
}
