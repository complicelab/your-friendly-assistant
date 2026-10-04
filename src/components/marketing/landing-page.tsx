import { useEffect } from "react";

import { Hero } from "./hero";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { WhatsAppFloat } from "./whatsapp-float";
import {
  AiMethodSection,
  ChangeSection,
  ServicesSection,
  SimpleSection,
  TrainingSection,
  WaysSection,
} from "./sections-primary";
import {
  AboutSection,
  EntrepreneurSection,
  FaqSection,
  MainCtaSection,
  PrinciplesSection,
  ProcessSection,
  ProjectsSection,
  ReachSection,
} from "./sections-secondary";

function ExperienceRuntime() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;

    if (!reduced) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
      );

      document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

      const onPointerMove = (event: PointerEvent) => {
        root.style.setProperty("--mouse-x", `${event.clientX}px`);
        root.style.setProperty("--mouse-y", `${event.clientY}px`);
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });

      return () => {
        observer.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
      };
    }

    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
    return undefined;
  }, []);

  return <div className="mouse-glow" aria-hidden="true" />;
}

export function LandingPage() {
  return (
    <div className="site-shell">
      <ExperienceRuntime />
      <SiteHeader />
      <main>
        <Hero />
        <ChangeSection />
        <ServicesSection />
        <WaysSection />
        <AiMethodSection />
        <TrainingSection />
        <SimpleSection />
        <AboutSection />
        <EntrepreneurSection />
        <ProjectsSection />
        <ProcessSection />
        <ReachSection />
        <PrinciplesSection />
        <MainCtaSection />
        <FaqSection />
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}
