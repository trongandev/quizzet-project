import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { LinkIcon, Save, Upload } from "lucide-react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import Image from "next/image";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { POST_API, POST_API_CLOUD } from "@/lib/fetchAPI";
import { useRouter } from "next/navigation";
import Loading from "../ui/loading";
interface QuizQuestion {
    id: string;
    type: "multiple-choice" | "true-false" | "short-answer";
    question: string;
    answers?: string[];
    correct: string;
    points: number;
}
interface Props {
    children: React.ReactNode;
    generatedQuiz?: QuizQuestion[];
}

export default function DialogAddMoreInfoQuiz({ children, generatedQuiz }: Props) {
    const [open, setOpen] = React.useState(false);
    const [tempQuiz, setTempQuiz] = useState({ title: "", subject: "", content: "", img: "" });
    const [loading, setLoading] = useState(false);
    const [avatarInputType, setAvatarInputType] = useState<"file" | "url">("file");
    const token = Cookies.get("token") || "";
    const router = useRouter();
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setTempQuiz((prev) => ({ ...prev, img: e.target?.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSetValueTempQuiz = (field: keyof typeof tempQuiz, value: string) => {
        setTempQuiz((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        try {
            setLoading(true);
            e.preventDefault();
            // nếu nó không bắt đầu là http hoặc https thì upload hình lên cloudinary
            let imageUrl = tempQuiz.img;
            if (!tempQuiz.img) {
                toast.warning("Vui lòng tải lên hình ảnh trước khi xuất bản", { duration: 3000, position: "top-center" });
                return;
            }
            if (tempQuiz.img && tempQuiz.img.startsWith("data:image")) {
                toast.warning("Đang tải hình ảnh lên server", { duration: 2000, position: "top-center" });
                const formData = new FormData();

                // Convert base64 to blob
                const response = await fetch(tempQuiz.img);
                const blob = await response.blob();

                // Append blob thay vì base64 string
                formData.append("image", blob, "image.jpg");

                const uploadResponse = await POST_API_CLOUD("/upload", formData, token);
                const data = await uploadResponse?.json();
                imageUrl = data.originalUrl;
                toast.warning("Đang tạo bài quiz", { duration: 3000, position: "top-center" });
            }
            const newQuiz = {
                title: tempQuiz.title,
                subject: tempQuiz.subject,
                content: tempQuiz.content,
                img: imageUrl,
                questions: generatedQuiz,
            };

            const req = await POST_API("/quiz", newQuiz, "POST", token);
            const data = await req?.json();
            if (data.ok) {
                toast.success("Đã lưu và xuất bản bài quiz", {
                    description: "Chúng tôi đang xem xét bài quiz của bạn, chờ cho đến khi được phê duyệt trước khi nó xuất hiện công khai.",
                    position: "top-center",
                    duration: 10000,
                    action: {
                        label: "Xem bài quiz",
                        onClick: () => {
                            router.push(`/quiz/${data._id}`);
                        },
                    },
                });
                setOpen(false);
            }
        } catch (error) {
            console.log("Error submitting quiz:", error);
            toast.error("Đã có lỗi xảy ra", {
                description: error instanceof Error ? error.message : "Lỗi không xác định",
                position: "top-center",
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Nhập thêm thông tin bài quiz </DialogTitle>
                        <DialogDescription>Nhập thông tin một cách rõ ràng giúp người khác biết bài quiz bạn thuộc chủ đề nào, có phù hợp với mọi người không</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 my-5">
                        <div className={`${tempQuiz.img ? "h-52" : "h-0"}  w-full relative`}>
                            <Image src={tempQuiz.img} fill alt="" className="absolute w-full h-full rounded-md object-cover"></Image>
                        </div>
                        <Tabs value={avatarInputType} onValueChange={(value) => setAvatarInputType(value as "file" | "url")}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="file">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Tải lên
                                </TabsTrigger>
                                <TabsTrigger value="url">
                                    <LinkIcon className="w-4 h-4 mr-2" />
                                    URL
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="file" className="space-y-2">
                                <Input type="file" accept="image/*" onChange={handleFileUpload} className="cursor-pointer" />
                            </TabsContent>

                            <TabsContent value="url" className="space-y-2">
                                <Input placeholder="Nhập URL hình ảnh" value={tempQuiz.img.startsWith("http") ? tempQuiz.img : ""} onChange={(e) => handleSetValueTempQuiz("img", e.target.value)} />
                            </TabsContent>
                        </Tabs>{" "}
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Tên bài quiz</Label>
                            <Input id="name-1" name="name" placeholder="Nhập tên bài quiz" value={tempQuiz.title} onChange={(e) => handleSetValueTempQuiz("title", e.target.value)} required />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1">Nội dung</Label>
                            <Input id="username-1" name="username" placeholder="Nhập nội dung" value={tempQuiz.content} onChange={(e) => handleSetValueTempQuiz("content", e.target.value)} required />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="subject">Môn học</Label>
                            <Input id="subject" name="subject" placeholder="Nhập môn học" value={tempQuiz.subject} onChange={(e) => handleSetValueTempQuiz("subject", e.target.value)} required />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button" size="lg">
                                Đóng
                            </Button>
                        </DialogClose>
                        <Button size="lg" className="text-white bg-gradient-to-r from-blue-500 to-cyan-500" type="submit" disabled={loading}>
                            {loading ? <Loading /> : <Save className="mr-2 h-4 w-4" />}
                            Lưu và xuất bản
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
