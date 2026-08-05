"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type TourStatus = "pending" | "completed" | "skipped";

interface TourProfile {
  status: TourStatus;
  latestProposalId: string | null;
}

interface TourStep {
  id: string;
  route: string;
  selector: string;
  eyebrow: string;
  title: string;
  description: string;
}

interface TourContextValue {
  replayTour: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);
const PROTECTED_ROUTE = /^\/(dashboard|library|proposals)(\/|$)/;
const PROPOSAL_ROUTE = /^\/proposals\/([^/]+)$/;

export function useOnboardingTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useOnboardingTour must be used inside OnboardingTourProvider");
  }
  return context;
}

export function OnboardingTourProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<TourProfile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const previousFocus = useRef<HTMLElement | null>(null);
  const autoAdvancedProposalId = useRef<string | null>(null);
  const isProtectedRoute = PROTECTED_ROUTE.test(pathname);
  const detailProposalId = pathname.match(PROPOSAL_ROUTE)?.[1] ?? null;
  const workspaceProposalId = detailProposalId ?? profile?.latestProposalId ?? null;

  const steps = useMemo<TourStep[]>(() => {
    const result: TourStep[] = [
      {
        id: "navigation",
        route: "/dashboard",
        selector: '[data-tour="primary-nav"]',
        eyebrow: "Your workspace",
        title: "Everything follows one simple path",
        description:
          "Save trusted company answers, turn RFP requirements into a proposal, then review and export the finished response.",
      },
      {
        id: "library",
        route: "/library",
        selector: '[data-tour="library-entry-form"]',
        eyebrow: "Build your source material",
        title: "Start with approved answers",
        description:
          "Add reusable language for common topics. DocDraft uses the most relevant entries as context when it drafts a response.",
      },
      {
        id: "proposal",
        route: "/proposals",
        selector: '[data-tour="proposal-form"]',
        eyebrow: "Create a compliance matrix",
        title: "Paste one requirement per line",
        description: workspaceProposalId
          ? "Add a title, optional company context, and the RFP questions. Next, we'll open your latest proposal to see the drafting workflow."
          : "Add a title, optional company context, and the RFP questions. Create a proposal now to continue the tour in its workspace, or finish here.",
      },
    ];

    if (workspaceProposalId) {
      const route = `/proposals/${workspaceProposalId}`;
      result.push(
        {
          id: "generate",
          route,
          selector: '[data-tour="generate-drafts"]',
          eyebrow: "Draft efficiently",
          title: "Generate the unanswered requirements",
          description:
            "DocDraft combines each requirement with your company context and relevant library entries. You can generate all missing drafts or redraft one response at a time.",
        },
        {
          id: "review",
          route,
          selector: '[data-tour="requirement-review"]',
          eyebrow: "Keep a human in control",
          title: "Review, edit, and flag every answer",
          description:
            "Edit drafts inline, save your changes, or mark uncertain answers for follow-up. The status badge keeps review progress visible.",
        },
        {
          id: "export",
          route,
          selector: '[data-tour="export-docx"]',
          eyebrow: "Finish the workflow",
          title: "Export a clean Word document",
          description:
            "When the responses are ready, download the full question-and-answer set as a .docx file for final formatting and submission.",
        }
      );
    }

    return result;
  }, [workspaceProposalId]);
  const activeStep = steps[currentStep];
  const routeReady = activeStep?.route === pathname;

  const restoreFocus = useCallback(() => {
    window.setTimeout(() => {
      const replayControl = document.querySelector<HTMLElement>(
        '[aria-label="Replay product tour"]'
      );
      const focusTarget = previousFocus.current?.isConnected
        ? previousFocus.current
        : replayControl;
      focusTarget?.focus();
    }, 0);
  }, []);

  const beginTour = useCallback(() => {
    previousFocus.current = document.activeElement as HTMLElement | null;
    setCurrentStep(0);
    setOpen(true);
    if (pathname !== "/dashboard") router.push("/dashboard");
  }, [pathname, router]);

  useEffect(() => {
    if (!isProtectedRoute) {
      setLoaded(false);
      setProfile(null);
      setOpen(false);
      return;
    }
    if (loaded) return;

    const controller = new AbortController();
    fetch("/api/me/tour", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as TourProfile;
      })
      .then((nextProfile) => {
        if (!nextProfile) return;
        setProfile(nextProfile);
        if (nextProfile.status === "pending") {
          previousFocus.current = document.activeElement as HTMLElement | null;
          setCurrentStep(0);
          setOpen(true);
          if (pathname !== "/dashboard") router.push("/dashboard");
        }
      })
      .catch((error: unknown) => {
        if ((error as Error).name !== "AbortError") console.error(error);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoaded(true);
      });

    return () => controller.abort();
  }, [isProtectedRoute, loaded, pathname, router]);

  useEffect(() => {
    if (!open) return;
    const step = steps[currentStep];
    if (!step) return;

    if (currentStep === 2 && detailProposalId) {
      if (autoAdvancedProposalId.current !== detailProposalId) {
        autoAdvancedProposalId.current = detailProposalId;
        setProfile((current) =>
          current ? { ...current, latestProposalId: detailProposalId } : current
        );
        setCurrentStep(3);
      } else if (pathname !== step.route) {
        router.push(step.route);
      }
      return;
    }

    if (pathname !== step.route) router.push(step.route);
  }, [currentStep, detailProposalId, open, pathname, router, steps]);

  const saveStatus = useCallback(async (status: Exclude<TourStatus, "pending">) => {
    let lastError: unknown;
    for (const delay of [0, 400, 1200]) {
      if (delay) await new Promise((resolve) => window.setTimeout(resolve, delay));
      try {
        const response = await fetch("/api/me/tour", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        if (response.ok) return;
        lastError = new Error("Could not save onboarding tour status");
      } catch (error) {
        lastError = error;
      }
    }
    console.error(lastError);
  }, []);

  const persistAndClose = useCallback(
    (status: Exclude<TourStatus, "pending">) => {
      setOpen(false);
      setProfile((current) =>
        current ? { ...current, status } : { status, latestProposalId: null }
      );
      restoreFocus();
      void saveStatus(status);
    },
    [restoreFocus, saveStatus]
  );

  const next = useCallback(() => {
    if (currentStep >= steps.length - 1) {
      persistAndClose("completed");
      return;
    }
    setCurrentStep((value) => value + 1);
  }, [currentStep, persistAndClose, steps.length]);

  const back = useCallback(() => {
    setCurrentStep((value) => Math.max(0, value - 1));
  }, []);

  const skipMissingTarget = useCallback(() => {
    if (currentStep >= steps.length - 1) {
      persistAndClose("completed");
      return;
    }
    setCurrentStep((value) => value + 1);
  }, [currentStep, persistAndClose, steps.length]);

  const skip = useCallback(() => persistAndClose("skipped"), [persistAndClose]);

  return (
    <TourContext.Provider value={{ replayTour: beginTour }}>
      {children}
      {open && activeStep && routeReady ? (
        <TourCoachmark
          key={activeStep.id}
          step={activeStep}
          current={currentStep + 1}
          total={steps.length}
          onBack={back}
          onNext={next}
          onSkip={skip}
          onTargetMissing={skipMissingTarget}
        />
      ) : null}
    </TourContext.Provider>
  );
}

interface Rect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

function TourCoachmark({
  step,
  current,
  total,
  onBack,
  onNext,
  onSkip,
  onTargetMissing,
}: {
  step: TourStep;
  current: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  onTargetMissing: () => void;
}) {
  const [rect, setRect] = useState<Rect | null>(null);
  const [cardHeight, setCardHeight] = useState(250);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const hasRect = rect !== null;

  useEffect(() => {
    let target: HTMLElement | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let missingTimer = 0;
    let frame = 0;

    const measure = () => {
      if (!target) return;
      const next = target.getBoundingClientRect();
      setRect({
        top: next.top,
        right: next.right,
        bottom: next.bottom,
        left: next.left,
        width: next.width,
        height: next.height,
      });
    };

    const findTarget = () => {
      target = document.querySelector<HTMLElement>(step.selector);
      if (!target) return false;
      mutationObserver?.disconnect();
      window.clearTimeout(missingTimer);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({
        block: step.id === "proposal" && window.innerWidth < 640 ? "end" : "center",
        inline: "nearest",
        behavior: reducedMotion ? "auto" : "smooth",
      });
      frame = window.requestAnimationFrame(measure);
      window.addEventListener("resize", measure);
      window.addEventListener("scroll", measure, true);
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(measure);
        resizeObserver.observe(target);
      }
      return true;
    };

    if (!findTarget()) {
      mutationObserver = new MutationObserver(() => {
        findTarget();
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
      missingTimer = window.setTimeout(() => {
        mutationObserver?.disconnect();
        onTargetMissing();
      }, 1800);
    }

    return () => {
      mutationObserver?.disconnect();
      window.clearTimeout(missingTimer);
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
      resizeObserver?.disconnect();
    };
  }, [onTargetMissing, step.id, step.selector]);

  useEffect(() => {
    if (!hasRect) return;
    titleRef.current?.focus({ preventScroll: true });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onSkip();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [hasRect, onSkip, step.id]);

  useEffect(() => {
    if (!cardRef.current || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => setCardHeight(entry.contentRect.height));
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  if (!rect) return null;

  const padding = 6;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const spotlight = {
    top: Math.max(0, rect.top - padding),
    left: Math.max(0, rect.left - padding),
    right: Math.min(viewportWidth, rect.right + padding),
    bottom: Math.min(viewportHeight, rect.bottom + padding),
  };
  const mobile = viewportWidth < 640;
  const mobilePlaceTop = mobile && spotlight.bottom > viewportHeight * 0.58;
  const cardWidth = Math.min(360, viewportWidth - 32);
  const roomBelow = viewportHeight - spotlight.bottom;
  const placeBelow = roomBelow >= cardHeight + 28 || spotlight.top < cardHeight + 28;
  const cardTop = mobile
    ? mobilePlaceTop
      ? 16
      : undefined
    : placeBelow
      ? Math.min(spotlight.bottom + 12, viewportHeight - cardHeight - 16)
      : Math.max(16, spotlight.top - cardHeight - 12);
  const cardLeft = mobile
    ? 16
    : Math.min(
        viewportWidth - cardWidth - 16,
        Math.max(16, rect.left + rect.width / 2 - cardWidth / 2)
      );

  return createPortal(
    <div data-testid="onboarding-tour">
      <div
        aria-hidden="true"
        className="dd-tour-spotlight"
        style={{
          top: spotlight.top,
          left: spotlight.left,
          width: spotlight.right - spotlight.left,
          height: spotlight.bottom - spotlight.top,
        }}
      />
      <div
        ref={cardRef}
        role="dialog"
        aria-labelledby={`tour-title-${step.id}`}
        aria-describedby={`tour-description-${step.id}`}
        className="dd-tour-coachmark"
        style={{
          width: cardWidth,
          maxHeight: "calc(100vh - 32px)",
          overflowY: "auto",
          left: cardLeft,
          top: cardTop,
          bottom: mobile && !mobilePlaceTop ? 16 : undefined,
        }}
      >
        <div className="dd-tour-heading-row">
          <Badge tone="brand">{current} / {total}</Badge>
          <Button size="sm" variant="ghost" onClick={onSkip}>Skip tour</Button>
        </div>
        <p className="dd-tour-eyebrow">{step.eyebrow}</p>
        <h2
          ref={titleRef}
          tabIndex={-1}
          id={`tour-title-${step.id}`}
          className="dd-tour-title"
        >
          {step.title}
        </h2>
        <p id={`tour-description-${step.id}`} className="dd-tour-description">
          {step.description}
        </p>
        <div className="dd-tour-actions">
          <Button variant="outline" onClick={onBack} disabled={current === 1}>
            Back
          </Button>
          <Button onClick={onNext} iconRight={current === total ? "check" : "chevron-right"}>
            {current === total ? "Finish tour" : "Next"}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
