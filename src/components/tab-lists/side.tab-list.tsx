import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { useModsFilters } from "@/stores/mod-filters";

export default function SideTabList() {
	const { side, setSide } = useModsFilters();

	return (
		<Tabs onValueChange={setSide} value={side}>
			<TabsList className="h-9">
				<TabsTab aria-label="Any" className="h-9" value="any">
					Any
				</TabsTab>
				<TabsTab aria-label="Client" className="h-9" value="client">
					Client
				</TabsTab>
				<TabsTab aria-label="Server" className="h-9" value="server">
					Server
				</TabsTab>
				<TabsTab aria-label="Both" className="h-9" value="both">
					Both
				</TabsTab>
				<span className="top-0 px-2 start-1 text-xs z-10 block -translate-y-1/2 rounded-md absolute inline-flex text-muted-foreground pointer-events-none bg-background">
					Side
				</span>
			</TabsList>
		</Tabs>
	);
}
