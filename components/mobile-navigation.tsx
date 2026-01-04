"use client"

import { Home, Star, Calendar, TrendingUp, Briefcase, Heart, Zap, Target, Wrench } from "lucide-react"

interface MobileNavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function MobileNavigation({ activeTab, setActiveTab }: MobileNavigationProps) {
  const tabs = [
    { id: "overview", icon: Home, label: "Home" },
    { id: "chart", icon: Star, label: "Chart" },
    { id: "dasha", icon: Calendar, label: "Dasha" },
    { id: "transit", icon: TrendingUp, label: "Transit" },
    { id: "career", icon: Briefcase, label: "Career" },
    { id: "love", icon: Heart, label: "Love" },
    { id: "remedies", icon: Zap, label: "Remedies" },
    { id: "yogas", icon: Target, label: "Yogas" },
    { id: "tools", icon: Wrench, label: "Tools" },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-purple-500/30 pb-safe">
      <div className="grid grid-cols-5 gap-1 p-2">
        {tabs.slice(0, 5).map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-label={`Navigate to ${tab.label}`}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${isActive ? "bg-purple-500/20 text-purple-400" : "text-gray-400 hover:text-white hover:bg-slate-800/50"
                }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
      <div className="grid grid-cols-4 gap-1 px-2 pb-2 -mt-1">
        {tabs.slice(5).map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-label={`Navigate to ${tab.label}`}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${isActive ? "bg-purple-500/20 text-purple-400" : "text-gray-400 hover:text-white hover:bg-slate-800/50"
                }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
