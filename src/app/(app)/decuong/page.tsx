import CTaiLieu from "@/components/decuong/CDeCuong";
import { getCachedDeCuong } from "@/lib/cacheData";

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
    const res = await getCachedDeCuong();
    const findText = res?.findText;
    const findFile = res?.findFile;
    return (
        <div className="py-20">
            <CTaiLieu findText={findText} findFile={findFile} />
        </div>
    );
}
