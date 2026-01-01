import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mocked,
} from "vitest";
import { HubtelAdapter } from "./hubtel.adapter.js";
import axios from "axios";
import { Currency, PaymentStatus } from "../../core/enums.js";

// Mock axios
vi.mock("axios");

describe("HubtelAdapter", () => {
  let adapter: HubtelAdapter;
  const mockedAxios = axios as unknown as Mocked<typeof axios>;

  beforeEach(() => {
    adapter = new HubtelAdapter({
      clientId: "client_id",
      clientSecret: "client_secret",
      merchantAccountNumber: "123456",
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should throw error if config is missing", () => {
      expect(
        () =>
          new HubtelAdapter({
            clientId: "",
            clientSecret: "",
            merchantAccountNumber: "",
          }),
      ).toThrow();
    });
  });

  describe("initializePayment", () => {
    const mockPayload = {
      amount: 10,
      email: "test@example.com",
      mobileNumber: "233240000000",
      currency: Currency.GHS,
      callbackUrl: "https://example.com/callback",
      reference: "ref_hubtel",
      description: "Test Payment",
      options: {
        hubtel: {
          returnUrl: "https://example.com/return",
        },
      },
    };

    it("should initialize payment successfully", async () => {
      const mockResponse = {
        data: {
          status: "success",
          data: {
            checkoutUrl: "https://hubtel.com/checkout",
            clientReference: "ref_hubtel",
            checkoutId: "valid_checkout_id",
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await adapter.initializePayment(mockPayload);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://payproxyapi.hubtel.com/items/initiate",
        expect.objectContaining({
          totalAmount: 10,
          description: "Test Payment",
          clientReference: "ref_hubtel",
        }),
        expect.any(Object),
      );

      expect(result).toEqual({
        status: PaymentStatus.PENDING,
        reference: "ref_hubtel",
        authorizationUrl: "https://hubtel.com/checkout",
        externalReference: "valid_checkout_id",
        raw: mockResponse.data,
      });
    });

    it("should throw error on API failure", async () => {
      const mockResponse = {
        data: {
          status: "error",
          data: {},
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      await expect(adapter.initializePayment(mockPayload)).rejects.toThrow();
    });
  });

  describe("verifyTransaction", () => {
    it("should verify transaction successfully", async () => {
      const mockResponse = {
        data: {
          status: "Success",
          data: {
            clientReference: "ref_hubtel",
            transactionId: "txn_123",
            status: "Paid",
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await adapter.verifyTransaction("ref_hubtel");

      expect(mockedAxios.get).toHaveBeenCalled();
      expect(result).toEqual({
        status: PaymentStatus.SUCCESS,
        reference: "ref_hubtel",
        externalReference: "txn_123",
        raw: mockResponse.data,
      });
    });

    it("should verify failed transaction", async () => {
      const mockResponse = {
        data: {
          status: "Success",
          data: {
            clientReference: "ref_hubtel",
            status: "Refunded",
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await adapter.verifyTransaction("ref_hubtel");
      expect(result.status).toBe(PaymentStatus.FAILED);
    });
  });
});
