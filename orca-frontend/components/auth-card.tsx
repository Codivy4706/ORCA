'use client'

import { ReactNode } from 'react'
import Link from 'next/link'

interface AuthCardProps {
  title: string
  subtitle: string
  children: ReactNode
  footerText: ReactNode
}

export function AuthCard({ title, subtitle, children, footerText }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-black mb-2">{title}</h1>
            <p className="text-sm text-zinc-600">{subtitle}</p>
          </div>

          {/* Children (Form Content) */}
          {children}

          {/* Footer */}
          <div className="text-center text-xs text-zinc-500 mt-8">
            {footerText}
          </div>
        </div>
      </div>
    </div>
  )
}
