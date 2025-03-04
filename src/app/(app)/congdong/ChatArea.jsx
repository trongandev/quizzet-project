import React, { memo } from "react";
import ChatInput from "./ChatInput";
import { IoMdClose } from "react-icons/io";
import { FaRegImage } from "react-icons/fa";
import { Popover, Spin } from "antd";
import { MdOutlineInsertEmoticon } from "react-icons/md";
import Image from "next/image";
import { LoadingOutlined } from "@ant-design/icons";
import { IoSend } from "react-icons/io5";
import { GrFormClose } from "react-icons/gr";

const ChatArea = ({
    user,
    inputRef,
    replyingTo,
    handleImageChange,
    newMessage,
    handleMessageChange,
    handleKeyPress,
    handlePaste,
    searchEmoji,
    handleSendMessage,
    loading,
    imageReview,
    handleSetDefaultImage,
    open,
    emojiData,
    handleSearchEmoji,
    handleOpenChange,
    onEmojiSelect,
    // image,
    // imagePreview,
}) => {
    return (
        <div className="mt-5 border-t-2 border-top border-t-primary/10 pt-3">
            {user === null ? (
                <div className="text-center bg-primary/20 text-primary p-3 rounded-lg">
                    <p>Bạn cần đăng nhập để có thể chat cùng với cộng đồng</p>
                </div>
            ) : (
                <div className="">
                    {replyingTo && (
                        <label htmlFor="text" className="block replying-to relative bg-linear-item-blue px-3 py-1 rounded-lg mb-2 text-secondary ">
                            <div className="absolute top-2 right-3 cursor-pointer hover:text-red-500" onClick={() => setReplyingTo(null)}>
                                <IoMdClose />
                            </div>
                            <h1 className="text-secondary font-bold">Bạn đang trả lời{replyingTo?.userId?._id == userId ? " chính bạn" : ": " + replyingTo?.userId.displayName}</h1>
                            <p className="line-clamp-2">{replyingTo?.message}</p>
                            {replyingTo?.image && <Image src={replyingTo?.image} alt="" width={120} height={100} className="object-cover rounded-lg mt-2" />}
                        </label>
                    )}
                    <div className="flex gap-1">
                        <label htmlFor="image" className=" bg-primary px-3  rounded-md flex items-center justify-center text-white ">
                            <FaRegImage />
                        </label>
                        <input id="image" type="file" className="hidden" onChange={(e) => handleImageChange(e)} />
                        <ChatInput value={newMessage} handleMessageChange={handleMessageChange} inputRef={inputRef} handleKeyPress={handleKeyPress} onPaste={handlePaste} />

                        <Popover
                            content={
                                <div>
                                    <div className="">
                                        <input placeholder="Tìm icon mà bạn thích" value={searchEmoji} onChange={(e) => handleSearchEmoji(e)}></input>
                                    </div>
                                    <div className="grid grid-cols-5 gap-1 w-[300px]  mt-2">
                                        {emojiData &&
                                            emojiData.length > 0 && ( // Check if emoji exists and has elements
                                                <div className="grid grid-cols-5 gap-1 w-[300px] overflow-y-scroll h-[300px] mt-2">
                                                    {emojiData.map((item, index) => (
                                                        <div className="flex items-center justify-center hover:bg-gray-200 cursor-pointer" key={index}>
                                                            <h1 className="text-xl" onClick={() => onEmojiSelect(item.character)}>
                                                                {item.character}
                                                            </h1>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                    </div>
                                    {emojiData && emojiData?.length == 0 && <p className="h-[300px] flex items-center justify-center">Không tìm thấy Emojii này...</p>}
                                </div>
                            }
                            title="Chọn icon"
                            trigger="click"
                            open={open}
                            onOpenChange={handleOpenChange}>
                            <button className="btn btn-primary !rounded-md">
                                <MdOutlineInsertEmoticon size={20} />
                            </button>
                        </Popover>
                        <button type="submit" disabled={loading} onClick={handleSendMessage} className="btn btn-primary !rounded-md">
                            {loading ? <Spin indicator={<LoadingOutlined spin />} size="default" /> : <IoSend />}
                        </button>
                    </div>
                    {imageReview && (
                        <div className="relative w-[100px] h-[100px] mt-3">
                            <Image src={imageReview} unoptimized alt="" className="w-full h-full rounded-lg absolute object-cover" fill></Image>
                            <GrFormClose
                                className="absolute z-1 top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xl cursor-pointer hover:opacity-80"
                                onClick={() => handleSetDefaultImage()}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

ChatArea.displayName = "ChatArea";
export default ChatArea;
