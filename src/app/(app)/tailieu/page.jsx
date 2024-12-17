import CTaiLieu from "@/components/CTaiLieu";
import { getCachedTool } from "@/lib/cacheData";

export default async function SubjectOutline() {
    const toolData = await getCachedTool();

    return (
        <div>
            <CTaiLieu toolData={toolData} />
        </div>
    );
}
