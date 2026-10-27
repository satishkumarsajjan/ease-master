import { PulseCard } from "@/registry/ui/pulse-card"

export default function PulseCardDemo() {
  return (
    <div className="flex min-h-[320px] w-full items-center justify-center p-8">
      <PulseCard
        title="Pulse Card"
        description="Distributed through the registry, rendered by the previewer."
      />
    </div>
  )
}
