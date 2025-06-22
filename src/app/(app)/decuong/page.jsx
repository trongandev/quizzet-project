import CTaiLieu from "@/components/CTaiLieu";
import { getCachedTool } from "@/lib/cacheData";

export default async function SubjectOutline() {
    const toolData = await getCachedTool();

    return (
        <div className="py-20">
            <CTaiLieu toolData={toolData} />
        </div>
    );
}
