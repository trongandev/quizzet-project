import CTaiLieu from "@/components/CTaiLieu";
import { getCachedTool } from "@/lib/cacheData";

export default async function SubjectOutline() {
    const toolData = await getCachedTool();

    return (
        <div className="px-2 md:px-0">
            <CTaiLieu toolData={toolData} />
        </div>
    );
}
