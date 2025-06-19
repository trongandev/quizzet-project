import CTaiLieu from "@/components/CTaiLieu";
import { getCachedTool } from "@/lib/cacheData";

export default async function SubjectOutline() {
    const toolData = await getCachedTool();

    return (
        <div className="flex items-center justify-center px-5 md:px-0">
            <div className="w-full md:w-[1000px] xl:w-[1200px] py-5 pt-20">
                <CTaiLieu toolData={toolData} />
            </div>
        </div>
    );
}
