
import {
  Button,
  ScrollArea,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui"
import { navItems } from "@/utils/constants"

interface SidebarMobileProps {
    mobileSidebarOpen: boolean
    setMobileSidebarOpen: (open: boolean) => void
    children?: React.ReactNode
}

const SidebarMobile = ({ mobileSidebarOpen, setMobileSidebarOpen, children }: SidebarMobileProps) => {
    return (
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetContent
                side="left"
                className="w-[90%] max-w-[340px] border-r border-[var(--border-muted)] bg-[var(--bg-surface)] p-2 overflow-auto"
            >
              <SheetHeader className="text-left">
                <SheetTitle className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--fg-secondary)]">
                  Navegação
                </SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex flex-1 flex-col gap-4">
            <ScrollArea className="h-full pr-2 ">
                {navItems.length > 0 && (
                    <nav className="flex flex-col mb-4">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href
}
                                className="rounded-md px-3 py-2 text-sm font-medium text-[var(--fg-secondary)] hover:bg-[color:rgba(139,92,246,0.08)] hover:text-[var(--accent-light)] transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                )}
              {children}
            </ScrollArea>
          </div>
          <div className="mt-4 flex justify-end">
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-[var(--fg-secondary)] hover:text-[var(--accent)]"
              >
                Fechar
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    )
}

export default SidebarMobile