// /components/CookieConsentBanner.tsx
"use client"

import React, { useEffect, useState } from "react"
import { Consent, getConsentFromDocument, setConsentCookie } from "@/lib/cookie"
import { Button } from "@repo/ui/components/ui/button"
import { Checkbox } from "@repo/ui/components/ui/checkbox"
import { Label } from "@repo/ui/components/ui/label"
import { Card, CardContent } from "@repo/ui/components/ui/card"

type Props = { initialConsent: Consent | null }

export default function CookieConsentBanner({ initialConsent }: Props) {
  const [visible, setVisible] = useState<boolean>(!initialConsent)
  const [prefsOpen, setPrefsOpen] = useState(false)
  const [analytics, setAnalytics] = useState<boolean>(
    initialConsent?.analytics ?? false
  )
  const [marketing, setMarketing] = useState<boolean>(
    initialConsent?.marketing ?? false
  )

  useEffect(() => {
    // sync if cookie changed elsewhere
    const c = getConsentFromDocument()
    if (c) {
      setVisible(false)
      setAnalytics(c.analytics)
      setMarketing(c.marketing)
    }
  }, [])

  useEffect(() => {
    function onOpenPrefs() {
      setVisible(true)
      setPrefsOpen(true)
    }
    window.addEventListener("open-cookie-preferences", onOpenPrefs)
    return () =>
      window.removeEventListener("open-cookie-preferences", onOpenPrefs)
  }, [])

  function makeConsent(a: boolean, m: boolean): Consent {
    return {
      necessary: true,
      analytics: a,
      marketing: m,
      timestamp: new Date().toISOString(),
    }
  }

  function broadcastAndHide(c: Consent) {
    setConsentCookie(c)
    try {
      window.dispatchEvent(new CustomEvent("cookie-consent", { detail: c }))
    } catch {}
    setVisible(false)
  }

  function acceptAll() {
    broadcastAndHide(makeConsent(true, true))
  }

  function rejectAll() {
    broadcastAndHide(makeConsent(false, false))
  }

  function savePreferences() {
    const c = makeConsent(analytics, marketing)
    broadcastAndHide(c)
  }

  if (!visible) return null

  return (
    <Card
      role="dialog"
      aria-live="polite"
      className="fixed left-4 right-4 bottom-4 z-50 md:left-8 md:right-8"
    >
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex-1">
            <p className="font-semibold">We use cookies</p>
            <p className="text-sm text-slate-600">
              We use essential cookies to make the site work, and optional
              cookies for analytics & marketing. Manage preferences or accept
              all.{" "}
              <a href="/privacy" className="underline">
                Privacy policy
              </a>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={rejectAll} aria-label="Reject all cookies">
              Reject all
            </Button>

            <Button
              variant="outline"
              onClick={() => setPrefsOpen((s) => !s)}
              aria-label="Manage cookies"
            >
              Manage
            </Button>

            <Button onClick={acceptAll} aria-label="Accept all cookies">
              Accept all
            </Button>
          </div>
        </div>

        {prefsOpen && (
          <div className="mt-3 border-t pt-3 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Analytics cookies</p>
                <p className="text-sm text-slate-600">
                  Helps us understand usage and improve the app.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="analytics"
                  checked={analytics}
                  onCheckedChange={(c) => setAnalytics(!!c)}
                />
                <Label htmlFor="analytics">Enabled</Label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing cookies</p>
                <p className="text-sm text-slate-600">
                  Used for advertising and personalization.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="marketing"
                  checked={marketing}
                  onCheckedChange={(c) => setMarketing(!!c)}
                />
                <Label htmlFor="marketing">Enabled</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setPrefsOpen(false)
                  setVisible(false)
                }}
              >
                Cancel
              </Button>
              <Button onClick={savePreferences}>Save preferences</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
