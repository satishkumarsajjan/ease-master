"use client"

import { pointsToLinear, solveSpring } from "@/core/math/spring"
import { ExportTarget } from "@/core/types"
import { useEaseStore } from "@/store/useEaseStore"
import { trackEvent } from "@/lib/analytics"
import { clsx } from "clsx"
import { Check, Copy } from "lucide-react"
import { useMemo, useState } from "react"

const TABS: { id: ExportTarget; label: string }[] = [
  { id: "css", label: "CSS" },
  { id: "tailwind", label: "Tailwind" },
  { id: "motion", label: "Motion" },
  { id: "gsap", label: "GSAP" },
]

export const ExportPanel = () => {
  const state = useEaseStore()
  const [activeTab, setActiveTab] = useState<ExportTarget>("css")
  const [copied, setCopied] = useState(false)

  // Helper to format numbers
  const f = (n: number) => n.toFixed(3).replace(/\.?0+$/, "")

  // 1. Calculate Real Physics & Generate Strings
  const { cssCode, tailwindCode, motionCode, gsapCode, calculatedDuration } =
    useMemo(() => {
      let duration = state.duration
      let timingFunc = ""
      let gsapEase = ""
      let springProps = ""

      if (state.mode === "bezier") {
        duration = state.duration
        const { p1, p2 } = state.bezier
        timingFunc = `cubic-bezier(${f(p1.x)}, ${f(p1.y)}, ${f(p2.x)}, ${f(
          p2.y
        )})`
        gsapEase = `"cubic-bezier(${f(p1.x)},${f(p1.y)},${f(p2.x)},${f(p2.y)})"`
      } else {
        const result = solveSpring(
          state.spring.mass,
          state.spring.stiffness,
          state.spring.damping
        )
        duration = result.duration
        timingFunc = pointsToLinear(result.points)

        const pathData = result.points
          .map((y, i) => {
            const x = i / (result.points.length - 1)
            return `${x === 0 ? "M" : "L"}${f(x)},${f(y)}`
          })
          .join(" ")
        gsapEase = `CustomEase.create("custom", "${pathData}")`

        springProps = `
  type: "spring",
  stiffness: ${state.spring.stiffness},
  damping: ${state.spring.damping},
  mass: ${state.spring.mass}`
      }

      const css = `.ease-element {
  transition: all ${duration}s;
  transition-timing-function: ${timingFunc};
}`

      const tailwind = `<div className="
  transition-all
  duration-[${Math.round(duration * 1000)}ms]
  ease-[${timingFunc.replace(/, /g, ",")}]
" />`

      const motion = `<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{${
    state.mode === "bezier"
      ? `
    duration: ${duration},
    ease: [${f(state.bezier.p1.x)}, ${f(state.bezier.p1.y)}, ${f(
      state.bezier.p2.x
    )}, ${f(state.bezier.p2.y)}]`
      : springProps
  }
  }}
/>`

      const gsap = `gsap.registerPlugin(CustomEase);\n
gsap.to(".element", {
  duration: ${duration},
  ease: ${gsapEase}
});`

      return {
        cssCode: css,
        tailwindCode: tailwind,
        motionCode: motion,
        gsapCode: gsap,
        calculatedDuration: duration,
      }
    }, [state.mode, state.bezier, state.spring, state.duration])

  // 2. Select Active Code
  const getActiveCode = () => {
    switch (activeTab) {
      case "css":
        return cssCode
      case "tailwind":
        return tailwindCode
      case "motion":
        return motionCode
      case "gsap":
        return gsapCode
      default:
        return ""
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getActiveCode())
    setCopied(true)
    trackEvent(
      "ease_curve_copied",
      {
        format: activeTab,
        mode: state.mode,
        duration: calculatedDuration,
      },
      "web_copy"
    )
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex h-full w-full flex-col border-t border-sidebar-border bg-sidebar">
      {/* HEADER */}
      <div className="flex flex-col gap-2 p-4 pb-0">
        <div className="flex items-center justify-between">
          <h2 className="mb-2 font-mono text-sm font-bold tracking-wider text-primary">
            Export Code
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-1 rounded-lg border border-sidebar-border bg-sidebar-accent p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "rounded py-1.5 text-[10px] font-bold tracking-wider uppercase transition-all",
                activeTab === tab.id
                  ? "bg-sidebar text-primary shadow-sm ring-1 ring-sidebar-border"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CODE BLOCK */}
      <div className="group relative flex-1 p-4">
        <div className="custom-scrollbar h-full w-full overflow-auto rounded-lg border border-sidebar-border bg-card p-4 font-mono text-xs leading-5 whitespace-pre text-sidebar-foreground">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={clsx(
              "absolute top-6 right-6 z-10 rounded-md border p-2 shadow-sm backdrop-blur-sm transition-all",
              copied
                ? "border-border bg-secondary text-primary"
                : "border-border bg-background text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground"
            )}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>

          {/* CSS */}
          {activeTab === "css" && (
            <div>
              <span className="text-chart-4">.ease-element</span>{" "}
              <span className="text-muted-foreground">{`{`}</span>
              <br />
              <span className="text-chart-5 pl-4">transition</span>
              <span className="text-muted-foreground">:</span>{" "}
              <span className="text-chart-3">all</span>{" "}
              <span className="text-chart-1">{calculatedDuration}s</span>;
              <br />
              <span className="text-chart-5 pl-4">
                transition-timing-function
              </span>
              <span className="text-muted-foreground">:</span>{" "}
              <span className="text-wrap break-all text-primary">
                {state.mode === "bezier"
                  ? `cubic-bezier(${f(state.bezier.p1.x)}, ${f(
                      state.bezier.p1.y
                    )}, ${f(state.bezier.p2.x)}, ${f(state.bezier.p2.y)})`
                  : cssCode.match(/linear\(.*\)/)?.[0]}
              </span>
              ;<br />
              <span className="text-muted-foreground">{`}`}</span>
            </div>
          )}

          {/* TAILWIND */}
          {activeTab === "tailwind" && (
            <div>
              <span className="text-muted-foreground">{`<`}</span>
              <span className="text-chart-4">div</span>{" "}
              <span className="text-chart-5">className</span>
              <span className="text-muted-foreground">=</span>
              <span className="text-chart-2">{'"'}</span>
              <br />
              <span className="text-chart-3 pl-4">transition-all</span>
              <br />
              <span className="text-chart-3 pl-4">
                duration-[{Math.round(calculatedDuration * 1000)}ms]
              </span>
              <br />
              <span className="pl-4 text-wrap break-all text-primary">
                ease-[
                {state.mode === "bezier"
                  ? `cubic-bezier(${f(state.bezier.p1.x)},${f(
                      state.bezier.p1.y
                    )},${f(state.bezier.p2.x)},${f(state.bezier.p2.y)})`
                  : cssCode.match(/linear\(.*\)/)?.[0].replace(/, /g, ",")}
                ]
              </span>
              <br />
              <span className="text-chart-2">{'"'}</span>
              <span className="text-muted-foreground">/{`>`}</span>
            </div>
          )}

          {/* MOTION */}
          {activeTab === "motion" && (
            <div>
              <span className="text-muted-foreground">{`<`}</span>
              <span className="text-chart-4">motion.div</span>
              <br />
              <span className="text-chart-5 pl-4">initial</span>
              <span className="text-muted-foreground">=</span>
              <span className="text-muted-foreground">{`{{`}</span>{" "}
              <span className="text-chart-5">opacity</span>
              <span className="text-muted-foreground">:</span>{" "}
              <span className="text-chart-1">0</span>{" "}
              <span className="text-muted-foreground">{`}}`}</span>
              <br />
              <span className="text-chart-5 pl-4">animate</span>
              <span className="text-muted-foreground">=</span>
              <span className="text-muted-foreground">{`{{`}</span>{" "}
              <span className="text-chart-5">opacity</span>
              <span className="text-muted-foreground">:</span>{" "}
              <span className="text-chart-1">1</span>{" "}
              <span className="text-muted-foreground">{`}}`}</span>
              <br />
              <span className="text-chart-5 pl-4">transition</span>
              <span className="text-muted-foreground">=</span>
              <span className="text-muted-foreground">{`{{`}</span>
              <br />
              {state.mode === "bezier" ? (
                <>
                  <span className="text-chart-5 pl-8">duration</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-chart-1">{state.duration}</span>,
                  <br />
                  <span className="text-chart-5 pl-8">ease</span>
                  <span className="text-muted-foreground">:</span> [
                  <span className="text-chart-1">{f(state.bezier.p1.x)}</span>,{" "}
                  <span className="text-chart-1">{f(state.bezier.p1.y)}</span>,{" "}
                  <span className="text-chart-1">{f(state.bezier.p2.x)}</span>,{" "}
                  <span className="text-chart-1">{f(state.bezier.p2.y)}</span>]
                </>
              ) : (
                <>
                  <span className="text-chart-5 pl-8">type</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-chart-2">{'"spring"'}</span>,<br />
                  <span className="text-chart-5 pl-8">stiffness</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-chart-1">{state.spring.stiffness}</span>
                  ,
                  <br />
                  <span className="text-chart-5 pl-8">damping</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-chart-1">{state.spring.damping}</span>,
                  <br />
                  <span className="text-chart-5 pl-8">mass</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-chart-1">{state.spring.mass}</span>
                </>
              )}
              <br />
              <span className="pl-4 text-muted-foreground">{`}}`}</span>
              <br />
              <span className="text-muted-foreground">/{`>`}</span>
            </div>
          )}

          {/* GSAP */}
          {activeTab === "gsap" && (
            <div>
              <span className="text-muted-foreground">
                {"// Requires CustomEase Plugin"}
              </span>
              <br />
              <span className="text-chart-4">gsap</span>.
              <span className="text-chart-5">registerPlugin</span>(
              <span className="text-chart-3">CustomEase</span>);
              <br />
              <br />
              <span className="text-chart-4">gsap</span>.
              <span className="text-chart-5">to</span>(
              <span className="text-chart-2">{'".element"'}</span>,{" "}
              <span className="text-muted-foreground">{`{`}</span>
              <br />
              <span className="text-chart-5 pl-4">duration</span>
              <span className="text-muted-foreground">:</span>{" "}
              <span className="text-chart-1">{calculatedDuration}</span>,
              <br />
              <span className="text-chart-5 pl-4">ease</span>
              <span className="text-muted-foreground">:</span>{" "}
              <span className="text-wrap break-all text-primary">
                {gsapCode.match(/ease: (.*)/)?.[1]}
              </span>
              <br />
              <span className="text-muted-foreground">{`});`}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
