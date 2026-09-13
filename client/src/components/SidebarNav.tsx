import { ClipboardList, LayoutTemplate, Settings } from "lucide-react"

import { cn } from "@/lib/utils"

export type WorkspaceTab = "assess" | "forms" | "settings"

const items: { id: WorkspaceTab; label: string; icon: typeof ClipboardList }[] = [
  { id: "assess", label: "Assess", icon: ClipboardList },
  { id: "forms", label: "Forms", icon: LayoutTemplate },
  { id: "settings", label: "Settings", icon: Settings },
]

export function SidebarNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: WorkspaceTab
  setActiveTab: (tab: WorkspaceTab) => void
}) {
  return (
    <nav
      aria-label="Workspace"
      className="flex w-[72px] shrink-0 flex-col items-center gap-1 border-r border-hairline bg-white/40 py-3 backdrop-blur-sm"
    >
      {items.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex w-14 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10.5px] font-medium tracking-wide transition-colors",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground"
            )}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2 : 1.75} />
            {label}
          </button>
        )
      })}
    </nav>
  )
}
