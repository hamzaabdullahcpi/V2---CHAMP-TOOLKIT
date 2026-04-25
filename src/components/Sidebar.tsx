import { motion } from "motion/react";
import { LayoutDashboard, Target, Building2, Network, Coins, TrendingUp, User, BookOpen, X } from "lucide-react";

interface SidebarProps {
  currentStep: number | 'intro';
  setCurrentStep: (step: number | 'intro') => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ currentStep, setCurrentStep, isOpen, toggleSidebar }: SidebarProps) {
  const navItems: { id: number | 'intro', label: string, icon: any }[] = [
    { id: 0, label: "Dashboard", icon: LayoutDashboard },
    { id: 'intro', label: "Introduction", icon: BookOpen },
    { id: 1, label: "1. Assess Environments", icon: Target },
    { id: 2, label: "2. Institutionalize MLG", icon: Building2 },
    { id: 3, label: "3. Build Pipelines", icon: Network },
    { id: 4, label: "4. Mobilize Finance", icon: Coins },
    { id: 5, label: "5. Scale Systems", icon: TrendingUp },
  ];

  return (
    <div className={`w-64 h-screen bg-surface border-r border-line flex flex-col fixed left-0 top-0 z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 border-b border-line flex justify-between items-start">
        <div>
          <h1 className="font-heading font-semibold text-xl text-ink leading-[1.2] tracking-tight">
            CHAMP Toolkit
          </h1>
          <p className="font-mono text-[10px] text-ink-muted mt-2 uppercase tracking-widest font-semibold flex items-center gap-1.5">
             Multilevel Gov
          </p>
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-1.5 text-ink-muted hover:text-ink hover:bg-paper transition-colors"
          aria-label="Close Sidebar"
        >
          <X size={16} className="stroke-[1.5]" />
        </button>
      </div>

      <nav className="flex-1 py-6 flex flex-col overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentStep === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentStep(item.id)}
              className={`group w-full flex items-center gap-3 px-6 py-3 text-sm transition-all duration-200 border-l-2 ${
                isActive
                  ? "bg-accent/[0.03] border-accent text-ink font-semibold"
                  : "border-transparent text-ink-muted hover:bg-accent hover:border-accent hover:text-surface font-medium"
              }`}
            >
              <Icon size={16} className={`stroke-[2] ${isActive ? "text-accent" : "text-ink-muted group-hover:text-surface"}`} />
              <span className="text-left tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
