import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mocked,
} from "vitest";
import { PaystackAdapter } from "./paystack.adapter.js";
import axios from "axios";
import { Currency, PaymentStatus } from "../../core/enums.js";
import { VoltaxValidationError } from "../../core/errors.js";

// Mock axios
vi.mock("axios");

describe("PaystackAdapter", () => {
  let adapter: PaystackAdapter;
  const mockedAxios = axios as unknown as Mocked<typeof axios>;
  const mockCreate = vi.fn();

  beforeEach(() => {
    // Setup mock for axios.create
    mockedAxios.create = mockCreate;
    mockCreate.mockReturnValue({
      post: vi.fn(),
      get: vi.fn(),
    });

    adapter = new PaystackAdapter({ secretKey: "sk_test_123" });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should throw validation error if secret key is missing", () => {
      expect(() => new PaystackAdapter({ secretKey: "" })).toThrow(
        VoltaxValidationError,
      );
    });

    it("should create axios instance with correct config", () => {
      new PaystackAdapter({ secretKey: "sk_test_123" });
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: "https://api.paystack.co",
        timeout: 10000,
        headers: {
          Authorization: "Bearer sk_test_123",
          "Content-Type": "application/json",
        },
      });
    });
  });

  describe("initializePayment", () => {
    const mockPayload = {
      amount: 100,
      email: "test@example.com",
      currency: Currency.GHS,
      callbackUrl: "https://example.com/callback",
      reference: "ref_12345",
    };

    it("should initialize payment successfully", async () => {
      const mockResponse = {
        data: {
          status: true,
          message: "Authorization URL created",
          data: {
            authorization_url: "https://checkout.paystack.com/access_code",
            access_code: "access_code",
            reference: "ref_12345",
          },
        },
      };

      const mockPost = vi.fn().mockResolvedValue(mockResponse);
      mockCreate.mockReturnValue({ post: mockPost });
      adapter = new PaystackAdapter({ secretKey: "sk_test_123" });

      const result = await adapter.initializePayment(mockPayload);

      expect(mockPost).toHaveBeenCalledWith("/transaction/initialize", {
        amount: "10000", // 100 * 100 converted to string
        email: "test@example.com",
        reference: "ref_12345",
        callback_url: "https://example.com/callback",
        currency: Currency.GHS,
        metadata: JSON.stringify({
          description: "Payment for ref_12345",
        }),
      });

      expect(result).toEqual({
        status: PaymentStatus.PENDING,
        reference: "ref_12345",
        authorizationUrl: "https://checkout.paystack.com/access_code",
        externalReference: "ref_12345",
        raw: mockResponse.data,
      });
    });

    it("should throw error for invalid amount", async () => {
      const invalidPayload = { ...mockPayload, amount: -100 };
      await expect(adapter.initializePayment(invalidPayload)).rejects.toThrow(
        VoltaxValidationError,
      );
    });
  });

  describe("verifyTransaction", () => {
    it("should verify transaction successfully", async () => {
      const mockResponse = {
        data: {
          status: true,
          message: "Verification successful",
          data: {
            id: 12345,
            status: "success",
            reference: "ref_12345",
            amount: 10000,
          },
        },
      };

      const mockGet = vi.fn().mockResolvedValue(mockResponse);
      mockCreate.mockReturnValue({ get: mockGet });
      adapter = new PaystackAdapter({ secretKey: "sk_test_123" });

      const result = await adapter.verifyTransaction("ref_12345");

      expect(mockGet).toHaveBeenCalledWith("/transaction/verify/ref_12345");
      expect(result).toEqual({
        status: PaymentStatus.SUCCESS,
        reference: "ref_12345",
        externalReference: "12345",
        raw: mockResponse.data,
      });
    });

    it("should handle failed transaction", async () => {
      const mockResponse = {
        data: {
          status: true,
          data: {
            status: "failed",
            reference: "ref_12345",
          },
        },
      };

      const mockGet = vi.fn().mockResolvedValue(mockResponse);
      mockCreate.mockReturnValue({ get: mockGet });
      adapter = new PaystackAdapter({ secretKey: "sk_test_123" });

      const result = await adapter.verifyTransaction("ref_12345");
      expect(result.status).toBe(PaymentStatus.FAILED);
    });
  });
});
