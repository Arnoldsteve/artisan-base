import { HelpHeader } from "@/components/help-center/HelpHeader";
import { HelpSearch } from "@/components/help-center/HelpSearch";
import { QuickActions } from "@/components/help-center/QuickActions";
import { CategoryGrid } from "@/components/help-center/CategoryGrid";
import { PopularArticles } from "@/components/help-center/PopularArticles";
import { ContactOptions } from "@/components/help-center/ContactOptions";
import { SelfServiceTools } from "@/components/help-center/SelfServiceTools";

export default function HelpCenterPage() {
  return (
    <>
    <HelpHeader />
    <div className="bg-muted min-h-screen ">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <QuickActions />
        {/* <CategoryGrid /> */}
        {/* <PopularArticles /> */}
        {/* <ContactOptions /> */}
        <SelfServiceTools />
      </div>
    </div>
    </>
        
  );
}
