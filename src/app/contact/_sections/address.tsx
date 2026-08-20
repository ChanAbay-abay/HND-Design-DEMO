export function ContactAddress() {
  return (
    <section
      data-slot="contact-address"
      data-navbar-theme="light"
      className="bg-background px-6 py-24 lg:px-16 lg:py-32 xl:px-24"
    >
      <div className="mx-auto grid max-w-400 gap-16 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-24">
        <dl className="grid grid-cols-[100px_1fr] items-start gap-x-8 lg:grid-cols-[120px_1fr]">
          <dt className="text-right font-serif text-base">Address</dt>
          <dd className="font-serif text-2xl leading-snug font-medium lg:text-3xl">
            014 Salvador St, Cebu City, 6000 Cebu
          </dd>
        </dl>

        <div className="aspect-4/3 w-full overflow-hidden rounded-lg lg:aspect-video">
          <iframe
            title="HND Design + Build location"
            src="https://www.google.com/maps?q=HND+Design+%2B+Build,+014+Salvador+St,+Cebu+City,+6000+Cebu&output=embed"
            className="h-full w-full border-0 grayscale-[0.2]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}
