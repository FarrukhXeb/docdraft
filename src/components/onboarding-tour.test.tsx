import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  OnboardingTourProvider,
  useOnboardingTour,
} from "@/components/onboarding-tour";

let pathname = "/dashboard";
const push = vi.fn((nextPath: string) => {
  pathname = nextPath;
});

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useRouter: () => ({ push }),
}));

const fetchMock = vi.fn();

function ReplayControl() {
  const { replayTour } = useOnboardingTour();
  return <button onClick={replayTour}>Replay product tour</button>;
}

function RouteTarget() {
  if (pathname === "/dashboard") return <nav data-tour="primary-nav">Navigation</nav>;
  if (pathname === "/library") return <section data-tour="library-entry-form">Library</section>;
  if (pathname === "/proposals") return <form data-tour="proposal-form">Proposal</form>;
  if (pathname === "/proposals/proposal-1") {
    return (
      <main>
        <button data-tour="generate-drafts">Generate</button>
        <section data-tour="requirement-review">Review</section>
        <a data-tour="export-docx">Export</a>
      </main>
    );
  }
  return null;
}

function App() {
  return (
    <OnboardingTourProvider>
      <ReplayControl />
      <RouteTarget />
    </OnboardingTourProvider>
  );
}

function jsonResponse(body: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    })
  );
}

function setProfile(status: "pending" | "completed" | "skipped", latestProposalId: string | null = null) {
  fetchMock.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
    if (String(input) === "/api/me/tour" && init?.method === "PATCH") {
      return jsonResponse({ status: JSON.parse(String(init.body)).status });
    }
    return jsonResponse({ status, latestProposalId });
  });
}

async function changeRoute(rerender: (ui: React.ReactNode) => void) {
  await act(async () => rerender(<App />));
}

describe("OnboardingTourProvider", () => {
  beforeEach(() => {
    pathname = "/dashboard";
    push.mockClear();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("automatically offers the tour to a first-run user", async () => {
    setProfile("pending");
    render(<App />);

    expect(await screen.findByRole("heading", { name: "Everything follows one simple path" })).toHaveFocus();
    expect(screen.getByText("1 / 3")).toBeVisible();
    expect(screen.getByRole("button", { name: "Back" })).toBeDisabled();
  });

  it("progresses across routes and persists completion", async () => {
    const user = userEvent.setup();
    setProfile("pending");
    const view = render(<App />);

    await user.click(await screen.findByRole("button", { name: "Next" }));
    expect(push).toHaveBeenCalledWith("/library");
    await changeRoute(view.rerender);
    expect(await screen.findByRole("heading", { name: "Start with approved answers" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(push).toHaveBeenCalledWith("/proposals");
    await changeRoute(view.rerender);
    expect(await screen.findByText("3 / 3")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Finish tour" }));
    await waitFor(() => expect(screen.queryByTestId("onboarding-tour")).not.toBeInTheDocument());
    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/me/tour",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ status: "completed" }),
      })
    );
  });

  it("persists skipping and closes on Escape", async () => {
    setProfile("pending");
    render(<App />);
    await screen.findByTestId("onboarding-tour");

    await userEvent.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByTestId("onboarding-tour")).not.toBeInTheDocument());
    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/me/tour",
      expect.objectContaining({ body: JSON.stringify({ status: "skipped" }) })
    );
  });

  it("does not auto-open after completion and remains replayable", async () => {
    const user = userEvent.setup();
    setProfile("completed", "proposal-1");
    render(<App />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(screen.queryByTestId("onboarding-tour")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Replay product tour" }));
    expect(await screen.findByText("1 / 6")).toBeVisible();
  });

  it("continues into a newly created proposal workspace", async () => {
    const user = userEvent.setup();
    setProfile("pending");
    const view = render(<App />);

    await user.click(await screen.findByRole("button", { name: "Next" }));
    await changeRoute(view.rerender);
    await user.click(await screen.findByRole("button", { name: "Next" }));
    await changeRoute(view.rerender);
    await screen.findByRole("heading", { name: "Paste one requirement per line" });

    pathname = "/proposals/proposal-1";
    await changeRoute(view.rerender);

    expect(await screen.findByRole("heading", { name: "Generate the unanswered requirements" })).toBeVisible();
    expect(screen.getByText("4 / 6")).toBeVisible();
  });

  it("waits for a slow route transition before checking the next target", async () => {
    const user = userEvent.setup();
    setProfile("pending");
    const view = render(<App />);

    await user.click(await screen.findByRole("button", { name: "Next" }));
    await act(() => new Promise((resolve) => window.setTimeout(resolve, 1900)));

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/library");
    expect(
      fetchMock.mock.calls.some(([, init]) => init?.method === "PATCH")
    ).toBe(false);

    await changeRoute(view.rerender);
    expect(await screen.findByText("2 / 3")).toBeVisible();
  });

  it("retries a transient persistence failure", async () => {
    let patchAttempts = 0;
    fetchMock.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      if (String(input) === "/api/me/tour" && init?.method === "PATCH") {
        patchAttempts += 1;
        return jsonResponse({}, patchAttempts === 1 ? 503 : 200);
      }
      return jsonResponse({ status: "pending", latestProposalId: null });
    });
    render(<App />);
    await screen.findByTestId("onboarding-tour");

    await userEvent.keyboard("{Escape}");

    await waitFor(() => expect(patchAttempts).toBe(2), { timeout: 1000 });
    expect(screen.queryByTestId("onboarding-tour")).not.toBeInTheDocument();
  });

  it("advances safely when a target is missing", async () => {
    setProfile("pending");
    pathname = "/dashboard";
    render(
      <OnboardingTourProvider>
        <ReplayControl />
      </OnboardingTourProvider>
    );

    await waitFor(() => expect(push).toHaveBeenCalledWith("/library"), { timeout: 2500 });
  });
});
