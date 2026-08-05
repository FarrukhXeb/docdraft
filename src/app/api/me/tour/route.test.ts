import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getRouteUser: vi.fn(),
  userFindUnique: vi.fn(),
  userUpdate: vi.fn(),
  proposalFindFirst: vi.fn(),
}));

vi.mock("@/lib/api-auth", () => ({ getRouteUser: mocks.getRouteUser }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: mocks.userFindUnique,
      update: mocks.userUpdate,
    },
    proposal: { findFirst: mocks.proposalFindFirst },
  },
}));

import { GET, PATCH } from "@/app/api/me/tour/route";

describe("/api/me/tour", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getRouteUser.mockResolvedValue({ id: "user-1" });
    mocks.userFindUnique.mockResolvedValue({ onboardingTourStatus: "PENDING" });
    mocks.proposalFindFirst.mockResolvedValue({ id: "proposal-1" });
    mocks.userUpdate.mockImplementation(({ data }) =>
      Promise.resolve({ onboardingTourStatus: data.onboardingTourStatus })
    );
  });

  it("returns the account's durable status and latest proposal", async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      status: "pending",
      latestProposalId: "proposal-1",
    });
    expect(mocks.proposalFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1" } })
    );
  });

  it.each(["completed", "skipped"] as const)("persists %s for only the authenticated user", async (status) => {
    const response = await PATCH(
      new Request("http://localhost/api/me/tour", {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })
    );

    expect(response.status).toBe(200);
    expect(mocks.userUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "user-1" },
        data: { onboardingTourStatus: status.toUpperCase() },
      })
    );
  });

  it("rejects invalid status values", async () => {
    const response = await PATCH(
      new Request("http://localhost/api/me/tour", {
        method: "PATCH",
        body: JSON.stringify({ status: "pending" }),
      })
    );

    expect(response.status).toBe(400);
    expect(mocks.userUpdate).not.toHaveBeenCalled();
  });

  it("rejects malformed request bodies", async () => {
    const response = await PATCH(
      new Request("http://localhost/api/me/tour", {
        method: "PATCH",
        body: "not-json",
      })
    );

    expect(response.status).toBe(400);
    expect(mocks.userUpdate).not.toHaveBeenCalled();
  });

  it("requires authentication for reads and writes", async () => {
    mocks.getRouteUser.mockResolvedValue(null);

    const getResponse = await GET();
    const patchResponse = await PATCH(
      new Request("http://localhost/api/me/tour", {
        method: "PATCH",
        body: JSON.stringify({ status: "skipped" }),
      })
    );

    expect(getResponse.status).toBe(401);
    expect(patchResponse.status).toBe(401);
    expect(mocks.userFindUnique).not.toHaveBeenCalled();
    expect(mocks.userUpdate).not.toHaveBeenCalled();
  });
});
