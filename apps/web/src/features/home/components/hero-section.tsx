import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const HeroSection = () => {
  return (
    <div className="relative isolate md:pt-14">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-primary/60 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      <div className="py-24 sm:py-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="row flex flex-col gap-5 max-w-xl py-8 sm:py-12 md:py-16">
            <h1 className="bg-gradient-to-br from-foreground from-30% via-muted-foreground via-80% to-muted bg-clip-text font-title text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-transparent">
              Tick off your technical SEO checklist
            </h1>
            <p className="max-w-md text-base sm:text-lg md:text-xl leading-snug tracking-tight text-grey-90">
              Onsite, a technical SEO platform built for the modern SEM team, by
              technical SEO experts that need more.
            </p>
            <Button
              asChild
              variant="default"
              className="flex items-center w-fit px-8 sm:px-12 md:px-16 transition-all duration-200 uppercase font-bold h-8 sm:h-9 md:h-10 text-sm sm:text-base text-foreground rounded-full border border-border bg-muted space-x-1"
            >
              <Link href="/register">
                <span>Try it Free</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 9"
                  className="w-4 sm:w-5 md:w-6 h-auto"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="m12.495 0 4.495 4.495-4.495 4.495-.99-.99 2.805-2.805H0v-1.4h14.31L11.505.99z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-3 text-sm tracking-tightxs:mx-0">
            <p className="font-light leading-none text-foreground/60 will-change-transform">
              Everything you need to start ranking better:
            </p>
            <div className="w-full xs:flex xs:overflow-hidden">
              <ul className="flex flex-col gap-2 md:flex-row flex-shrink-0 font-semibold leading-dense text-foreground will-change-transform xs:animate-infinityScroll">
                {[
                  'Onsite Analysis',
                  'Keyword Research',
                  'Backlink Analysis',
                  'Site Crawling',
                  'Technical Audits',
                  'Content Analysis',
                ].map((item, index) => (
                  <li
                    key={item}
                    className="relative sm:shrink-0 before:relative before:mx-2.5 before:inline-block before:aspect-square before:w-[3px] before:rounded-full before:bg-foreground/30 before:align-middle sm:before:mx-2"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <ul className="hidden flex-shrink-0 font-semibold leading-dense text-foreground will-change-transform xs:flex xs:animate-infinityScroll">
                {[
                  'Team Planner',
                  'Project Management',
                  'Virtual Office',
                  'Chat',
                  'Documents',
                  'Inbox',
                ].map((item) => (
                  <li
                    key={item}
                    className="relative before:relative before:mx-2.5 before:inline-block before:aspect-square before:w-[3px] before:rounded-full before:bg-foreground/30 before:align-middle sm:shrink-0 sm:before:mx-2"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>{' '}
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-muted/10 p-2 ring-1 ring-inset ring-muted/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <img
                src="https://tailwindui.com/plus/img/component-images/dark-project-app-screenshot.png"
                alt="App screenshot"
                width={2432}
                height={1442}
                className="rounded-md shadow-2xl ring-1 ring-muted/10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
