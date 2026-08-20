"use client"

import { useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const underlineFieldClasses =
  "rounded-none border-0 border-b border-input bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:border-b-foreground"

export function ContactDetails() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section
      id="form"
      data-slot="contact-details"
      data-navbar-theme="light"
      className="bg-background scroll-mt-(--navbar-height) px-6 py-24 lg:px-16 lg:py-32 xl:px-24"
    >
      <div className="mx-auto grid max-w-400 gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        <div className="flex flex-col gap-y-8">
          <dl className="grid grid-cols-[100px_1fr] items-start gap-x-8 gap-y-8 lg:grid-cols-[120px_1fr]">
            <dt className="text-right font-serif text-base">Phone</dt>
            <dd>
              <a
                href="tel:+639662448818"
                className="font-serif text-3xl leading-snug font-medium hover:underline lg:text-4xl"
              >
                +63 966 244 8818
              </a>
            </dd>

            <dt className="text-right font-serif text-base">Email</dt>
            <dd className="min-w-0">
              <a
                href="mailto:hnddesignbuild@gmail.com"
                className="font-serif text-2xl leading-snug font-medium wrap-break-word hover:underline sm:text-3xl lg:text-4xl"
              >
                hnddesignbuild@gmail.com
              </a>
            </dd>
          </dl>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Juan Dela Cruz"
                className={underlineFieldClasses}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@email.com"
                className={underlineFieldClasses}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="Project inquiry"
              className={underlineFieldClasses}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us about your project — location, size, timeline..."
              className={`min-h-40 resize-none ${underlineFieldClasses}`}
              required
            />
          </div>

          <div className="mt-2 flex justify-end">
            <motion.div
              whileHover={{ scale: 1.12 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Button
                type="submit"
                variant="brand"
                size="lg"
                className="bg-black text-white shadow-none transition-colors duration-300 hover:bg-black/90"
              >
                Send Message
              </Button>
            </motion.div>
          </div>

          {submitted && (
            <p className="text-muted-foreground text-right text-sm">
              Thanks — we&apos;ve received your message and will get back to you
              shortly.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
