import handleCompareDate from "@/lib/CompareDate"
import React from "react"
import { HiMiniSpeakerWave } from "react-icons/hi2"
import { TiEdit } from "react-icons/ti"
import { Button } from "../ui/button"
import Loading from "@/components/ui/loading"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { X } from "lucide-react"
export default function ItemFC({
    item,
    index,
    listFlashcard,
    speakWord,
    editWord,
    setEditWord,
    loadingAudio,
    user,
    handleEditWord,
    openEditWord,
    handleCancelEditWord,
    handleOkEditWord,
    loadingConfirm,
    confirmDelete,
    loading,
    openTrick,
    handleOpenChangeTrick,
    handleKeyPressEdit,
    handleSendPrompt,
}: any) {
    return (
        <div
            className="bg-gray-100 dark:bg-slate-800/50 border border-white/10 p-5 shadow-sm rounded-xl"
            key={index}
        >
            <div className="flex items-center justify-between">
                <div
                    className={`rounded-full text-white text-[12px] px-3 py-[1px] font-bold ${
                        item?.status === "reviewing"
                            ? "bg-[#FFC107]"
                            : item?.status === "remembered"
                            ? "bg-[#2196F3]"
                            : "bg-[#4CAF50]"
                    }`}
                >
                    {item?.status === "reviewing"
                        ? "Cần ôn tập"
                        : item?.status === "remembered"
                        ? "Đã nhớ"
                        : "Đã học"}
                </div>
                <div
                    className={`rounded-full text-white text-[12px] px-3 py-[1px] font-bold bg-[#4CAF50]`}
                >
                    Số lần học: {item?.progress?.learnedTimes}
                </div>
                <div
                    className={`rounded-full text-white text-[12px] px-3 py-[1px] font-bold bg-[#9C27B0]`}
                >
                    Ghi nhớ: {item?.progress?.percentage}%
                </div>
            </div>
            <div className="flex items-center justify-between gap-5">
                <div className="flex gap-2 items-center font-bold flex-wrap">
                    <h1 className="text-primary text-lg" title={item?.title}>
                        {item?.title}
                    </h1>

                    <p>{item?.transcription}</p>
                    {listFlashcard?.language == "english" ? (
                        <>
                            <div
                                className="flex items-center gap-1 mr-2 cursor-pointer hover:text-secondary"
                                onClick={() =>
                                    speakWord(item?.title, 1, item?._id)
                                }
                            >
                                {loadingAudio == item?._id ? (
                                    <Loading />
                                ) : (
                                    <HiMiniSpeakerWave />
                                )}
                                <p>UK</p>
                            </div>
                            <div
                                className="flex items-center gap-1 cursor-pointer hover:text-secondary"
                                onClick={() =>
                                    speakWord(item?.title, 2, item?._id)
                                }
                            >
                                {loadingAudio == item?._id ? (
                                    <Loading />
                                ) : (
                                    <HiMiniSpeakerWave />
                                )}
                                US
                            </div>
                        </>
                    ) : (
                        <HiMiniSpeakerWave
                            className="flex items-center gap-1 cursor-pointer hover:text-secondary"
                            onClick={() => speakWord(item?.title, 2, item?._id)}
                        />
                    )}
                </div>
                {user?._id == listFlashcard?.userId?._id ? (
                    <div className="flex gap-2 items-center">
                        <TiEdit
                            className="hover:text-primary cursor-pointer"
                            onClick={() => handleEditWord(item)}
                        />
                        <Popover>
                            <PopoverTrigger>
                                <X className="text-red-500" />
                            </PopoverTrigger>
                            <PopoverContent>
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm">
                                        Bạn có chắc muốn xóa từ này?
                                    </p>
                                    <Button
                                        variant="destructive"
                                        onClick={() => confirmDelete(item._id)}
                                        disabled={loadingConfirm}
                                    >
                                        Xóa
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                ) : (
                    ""
                )}

                {/* model chỉnh sửa từ */}
                {/* <Modal
                    title="Chỉnh sửa từ"
                    open={openEditWord == item?._id}
                    onOk={handleOkEditWord}
                    confirmLoading={loadingConfirm}
                    cancelText="Hủy bỏ"
                    okText="Chỉnh sửa"
                    onCancel={handleCancelEditWord}>
                    <div className="space-y-3">
                        <div className="flex gap-3 items-end">
                            <div className="flex-1">
                                <div className="flex gap-2 items-center">
                                    <p className="ml-2">Tên từ (nhập rồi bấm vào AI Generate)</p>
                                    <Popover
                                        content={
                                            <div>
                                                <p>Bấm Enter để AI Generate</p>
                                                <p>Bấm Ctrl + Enter để tạo</p>
                                            </div>
                                        }
                                        title="Mẹo nhỏ"
                                        trigger="click"
                                        open={openTrick}
                                        onOpenChange={handleOpenChangeTrick}>
                                        <MdOutlineQuestionMark className="text-red-500" />
                                    </Popover>
                                </div>
                                <input
                                    type="text"
                                    className=""
                                    placeholder="Tên từ mới "
                                    value={editWord.title}
                                    onChange={(e) => setEditWord({ ...editWord, title: e.target.value })}
                                    onKeyDown={handleKeyPressEdit}
                                />
                            </div>
                            <Button onClick={() => handleSendPrompt(1)}>
                                {loading ? <Loading /> : <FaBrain />}
                                AI Generate
                            </Button>
                        </div>
                        <div className="">
                            <p className="ml-2">Định nghĩa</p>
                            <input placeholder="Định nghĩa  (bắt buộc)" value={editWord.define} onChange={(e) => setEditWord({ ...editWord, define: e.target.value })} />
                        </div>
                        <div className="border border-secondary  p-2 rounded-md space-y-2">
                            <p className="text-gray-700">Không yêu cầu phải điền</p>
                            <div className="flex gap-3 items-center">
                                <div className="flex-1">
                                    <p className="ml-2">Loại từ</p>
                                    <input type="text" placeholder="Loại từ (N,V,Adj,...)" value={editWord.type_of_word} onChange={(e) => setEditWord({ ...editWord, type_of_word: e.target.value })} />
                                </div>
                                <div className="flex-1">
                                    <p className="ml-2">Phiên âm</p>
                                    <input type="text" placeholder="Phiên âm" value={editWord.transcription} onChange={(e) => setEditWord({ ...editWord, transcription: e.target.value })} />
                                </div>
                            </div>
                            <div className="">
                                <p className="ml-2">Ví dụ</p>
                                <textarea
                                    placeholder="Ví dụ (tối đa 10 câu)"
                                    className="h-32"
                                    onChange={(e) => {
                                        const updatedExamples = e.target.value.split("\n\n").map((sentence) => {
                                            const [enLine, transLine, viLine] = sentence.split("\n");
                                            const en = enLine?.replace(/^LANG: /, "").trim();
                                            const trans = transLine?.replace(/^TRANS: /, "").trim();
                                            const vi = viLine?.replace(/^VIE: /, "").trim();
                                            return { en, trans, vi };
                                        });
                                        setEditWord({ ...editWord, example: updatedExamples });
                                    }}
                                />
                            </div>
                            <div className="">
                                <p className="ml-2">Ghi chú</p>
                                <textarea className="h-20" placeholder="Ghi chú" value={editWord.note} onChange={(e) => setEditWord({ ...editWord, note: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </Modal> */}
            </div>
            <p className="font-bold text-gray-600 dark:text-white/60">
                ({item?.type_of_word || "Không có loại từ"})
            </p>
            <p className="font-bold text-gray-600 dark:text-white">
                Định nghĩa:{" "}
                <span className="italic font-thin">{item?.define}</span>
            </p>
            <div className="flex items-center justify-between">
                <p className="font-bold text-gray-600 dark:text-white/60">
                    Ví dụ:{" "}
                </p>
                <p className="text-xs text-gray-600 dark:text-white/60">
                    {item?.created_at && handleCompareDate(item?.created_at)}
                </p>
            </div>

            <div className=" border border-secondary dark:border-white/10 rounded-sm px-5 py-3 my-3 h-[220px] overflow-y-auto">
                {item?.example?.map((ex: any, idx: number) => (
                    <div key={ex.en} className="mb-1">
                        <div className="">
                            <div className="flex items-center gap-2">
                                <p className="text-gray-600 dark:text-white/50 font-bold">
                                    {idx + 1}. {ex.en}
                                </p>
                                {listFlashcard?.language != "english" && (
                                    <HiMiniSpeakerWave
                                        className="cursor-pointer hover:text-primary"
                                        onClick={() =>
                                            speakWord(ex.en, 2, item?._id + idx)
                                        }
                                    />
                                )}
                            </div>
                            <p className="text-gray-600 dark:text-white/50  font-bold">
                                {ex?.trans}
                            </p>
                            <div className="text-xs text-gray-500 flex">
                                {listFlashcard?.language == "english" && (
                                    <>
                                        <div
                                            className="flex items-center gap-1 mr-3 cursor-pointer hover:text-secondary"
                                            onClick={() =>
                                                speakWord(
                                                    ex.en,
                                                    1,
                                                    item?._id + idx
                                                )
                                            }
                                        >
                                            {loadingAudio == item?._id + idx ? (
                                                <Loading />
                                            ) : (
                                                <HiMiniSpeakerWave />
                                            )}
                                            <p>UK</p>
                                        </div>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-secondary"
                                            onClick={() =>
                                                speakWord(
                                                    ex.en,
                                                    2,
                                                    item?._id + idx
                                                )
                                            }
                                        >
                                            {loadingAudio == item?._id + idx ? (
                                                <Loading />
                                            ) : (
                                                <HiMiniSpeakerWave />
                                            )}
                                            US
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-white/50 italic">
                            {ex.vi}
                        </p>
                    </div>
                ))}
                {item?.example?.length === 0 && (
                    <p className="text-gray-500 text-sm">Không có ví dụ...</p>
                )}
            </div>

            <p className="font-bold text-gray-600 dark:text-white">
                Ghi chú: <span className="italic font-thin">{item?.note}</span>
            </p>
        </div>
    )
}
