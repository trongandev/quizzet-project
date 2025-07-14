import React from "react";
import { GET_API } from "@/lib/fetchAPI";

import UserProfile from "@/components/profile/UserProfile";

export default async function ProfileUID({ params }) {
    const { slug } = params;
    // const [open, setOpen] = useState(false);
    // const [confirmLoading, setConfirmLoading] = useState(false);
    // const defaultReport = { type_of_violation: "spam", content: "" };
    // const [report, setReport] = useState(defaultReport);

    // if (profile.length) {
    //     return (
    //         <div className="flex items-center justify-center h-screen">
    //             <Spin size="large" />
    //         </div>
    //     );
    // }

    // const showModal = () => {
    //     setOpen(true);
    // };

    // const handleOk = () => {
    //     handleSendReport();
    // };

    // const handleCancel = () => {
    //     setOpen(false);
    // };

    // const handleSendReport = async () => {
    //     setConfirmLoading(true);
    //     const newReport = {
    //         type_of_violation: report.type_of_violation,
    //         content: report.content,
    //         link: `/profile/${params?.slug}`,
    //     };
    //     const req = await POST_API(`/report`, { ...newReport }, "POST", token);
    //     const res = await req.json();
    //     if (res.ok) {
    //         messageApi.success(res.message);
    //         handleCancel();
    //         setReport(defaultReport);
    //     } else {
    //         messageApi.error(res.message);
    //     }
    //     setConfirmLoading(false);
    // };
    const req = await GET_API(`/profile/${slug}`);
    return <UserProfile profile={req?.user} quiz={req?.quiz} flashcard={req?.flashcards} />;
}
