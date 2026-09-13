import { useState } from "react"

import { SidebarNav, type WorkspaceTab } from "./SidebarNav"
import Home from "./tabs/Home"
import CustomForms from "./tabs/CustomForms"
import Settings from "./tabs/Settings"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("assess")

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        {activeTab === "assess" && <Home />}
        {activeTab === "forms" && <CustomForms />}
        {activeTab === "settings" && <Settings />}
      </div>
    </div>
  )
}
