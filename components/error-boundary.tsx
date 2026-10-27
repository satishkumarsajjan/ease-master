"use client"

import * as React from "react"

import { ErrorState } from "@/components/ui/error-state"
import { logger } from "@/lib/logger"

interface ErrorBoundaryProps {
  children: React.ReactNode
  /** Label appears in the log line, e.g. "preview:pulse-card". */
  label?: string
  fallback?: (error: Error, reset: () => void) => React.ReactNode
  onError?: (error: Error, info: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logger.error(
      `[ErrorBoundary${this.props.label ? `:${this.props.label}` : ""}]`,
      error,
      info.componentStack
    )
    this.props.onError?.(error, info)
  }

  private reset = () => this.setState({ error: null })

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    if (this.props.fallback) return this.props.fallback(error, this.reset)

    return (
      <ErrorState
        title="This section failed to render"
        description={error.message}
        reset={this.reset}
      />
    )
  }
}
