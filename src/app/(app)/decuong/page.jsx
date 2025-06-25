import CTaiLieu from "@/components/CTaiLieu";
import { getCachedTool } from "@/lib/cacheData";

export async function generateMetadata() {
    return {
        title: `Quizzet | Đê cương`,
        description: `Trang đề cương của Quizzet, nơi bạn có thể tìm thấy các đề cương học tập hữu ích. Đồng thời, bạn cũng có thể đóng góp đề cương của mình để giúp đỡ cộng đồng.`,
        openGraph: {
            title: `Quizzet | Đê cương`,
            description: `Trang đề cương của Quizzet, nơi bạn có thể tìm thấy các đề cương học tập hữu ích. Đồng thời, bạn cũng có thể đóng góp đề cương của mình để giúp đỡ cộng đồng.`,
            type: "website",
            images: "/decuong.png",
            url: "https://quizzet.site/decuong",
        },
    };
}

export default async function SubjectOutline() {
    const toolData = await getCachedTool();

    return (
        <div className="py-20">
            <CTaiLieu toolData={toolData} />
        </div>
    );
}
