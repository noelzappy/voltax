import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mocked,
} from "vitest";
import { MoolreAdapter } from "./moolre.adapter.js";
import axios from "axios";
import { Currency, PaymentStatus } from "../../core/enums.js";
import { VoltaxValidationError } from "../../core/errors.js";
import { InitiatePaymentDTO } from "../../core/schemas.js";

vi.mock("axios");

describe("MoolreAdapter", () => {
  let adapter: MoolreAdapter;
  const mockedAxios = axios as unknown as Mocked<typeof axios>;
  const mockCreate = vi.fn();

  const options = {
    apiUser: "test_user",
    apiPublicKey: "pk_test_123",
    accountNumber: "1234567890",
  };

  beforeEach(() => {
    const mockPost = vi.fn();
    mockedAxios.create = mockCreate;
    mockCreate.mockReturnValue({
      post: mockPost,
    });
    adapter = new MoolreAdapter(options);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should create an axios instance with the correct config", () => {
      new MoolreAdapter(options);
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: "https://api.moolre.com",
        headers: {
          "X-API-USER": options.apiUser,
          "X-API-PUBKEY": options.apiPublicKey,
          "Content-Type": "application/json",
        },
      });
    });
  });

  describe("initializePayment", () => {
    const validPayload: InitiatePaymentDTO = {
      amount: 100,
      currency: Currency.GHS,
      email: "test@example.com",
      reference: "test_ref",
      callbackUrl: "https://example.com/callback",
      options: {
        moolre: {
          redirectUrl: "https://example.com/redirect",
        },
      },
    };

    it("should throw VoltaxValidationError for invalid payload", async () => {
      const invalidPayload = { ...validPayload, amount: -100 };
      await expect(adapter.initializePayment(invalidPayload)).rejects.toThrow(
        VoltaxValidationError,
      );
    });

    it("should throw VoltaxValidationError if reference is missing", async () => {
      const payload = { ...validPayload, reference: undefined };
      await expect(adapter.initializePayment(payload)).rejects.toThrow(
        "Reference is required for Moolre",
      );
    });

    it("should throw VoltaxValidationError if callbackUrl is missing", async () => {
      const payload = { ...validPayload, callbackUrl: undefined };
      await expect(adapter.initializePayment(payload)).rejects.toThrow(
        "Callback URL is required for Moolre",
      );
    });

    it("should throw VoltaxValidationError if redirectUrl is missing", async () => {
      const payload = { ...validPayload, options: { moolre: {} } };
      await expect(adapter.initializePayment(payload)).rejects.toThrow(
        "Redirect URL is required for Moolre",
      );
    });

    it("should initialize payment successfully", async () => {
      const mockResponse = {
        data: {
          status: 1,
          code: "200",
          message: "Link Generated.",
          data: {
            authorization_url: "https://moolre.com/pay/test_auth",
            reference: "moolre_ref_123",
          },
        },
      };

      const mockPost = vi.fn().mockResolvedValue(mockResponse);
      mockCreate.mockReturnValue({ post: mockPost });
      adapter = new MoolreAdapter(options);

      const result = await adapter.initializePayment(validPayload);

      expect(mockPost).toHaveBeenCalledWith("/embed/link", {
        type: 1,
        amount: validPayload.amount,
        accountNumber: options.accountNumber,
        email: validPayload.email,
        externalref: validPayload.reference,
        callback: validPayload.callbackUrl,
        redirect: validPayload.options?.moolre?.redirectUrl,
        reusable: "Non-reusable",
        currency: validPayload.currency,
        accountnumber: options.accountNumber,
        metadata: {},
      });

      expect(result).toEqual({
        status: PaymentStatus.PENDING,
        reference: "moolre_ref_123",
        authorizationUrl: "https://moolre.com/pay/test_auth",
        externalReference: "moolre_ref_123",
        raw: mockResponse.data,
      });
    });
  });

  describe("verifyTransaction", () => {
    it("should throw VoltaxValidationError if reference is missing", async () => {
      await expect(adapter.verifyTransaction("")).rejects.toThrow(
        "Reference is required for verification",
      );
    });

    it("should verify a successful transaction", async () => {
      const mockResponse = {
        data: {
          status: 1,
          code: "200",
          message: "Transaction Found",
          data: {
            txstatus: 1, // Success
            externalref: "test_ref",
            transactionid: "moolre_trx_id",
          },
        },
      };
      const mockPost = vi.fn().mockResolvedValue(mockResponse);
      mockCreate.mockReturnValue({ post: mockPost });
      adapter = new MoolreAdapter(options);

      const result = await adapter.verifyTransaction("some_ref");

      expect(mockPost).toHaveBeenCalledWith("/open/transact/status", {
        type: 1,
        idtype: 1,
        id: "some_ref",
        accountnumber: options.accountNumber,
      });

      expect(result).toEqual({
        status: PaymentStatus.SUCCESS,
        reference: "test_ref",
        externalReference: "moolre_trx_id",
        raw: mockResponse.data,
      });
    });

    it("should handle a failed transaction", async () => {
      const mockResponse = {
        data: {
          data: {
            txstatus: 2, // Failed
            externalref: "test_ref_failed",
            transactionid: "moolre_trx_id_failed",
          },
        },
      };
      const mockPost = vi.fn().mockResolvedValue(mockResponse);
      mockCreate.mockReturnValue({ post: mockPost });
      adapter = new MoolreAdapter(options);

      const result = await adapter.verifyTransaction("some_failed_ref");
      expect(result.status).toBe(PaymentStatus.FAILED);
    });

    it("should handle a pending transaction", async () => {
      const mockResponse = {
        data: {
          data: {
            txstatus: 0, // Pending
            externalref: "test_ref_pending",
            transactionid: "moolre_trx_id_pending",
          },
        },
      };
      const mockPost = vi.fn().mockResolvedValue(mockResponse);
      mockCreate.mockReturnValue({ post: mockPost });
      adapter = new MoolreAdapter(options);

      const result = await adapter.verifyTransaction("some_pending_ref");
      expect(result.status).toBe(PaymentStatus.PENDING);
    });
  });

  describe("getPaymentStatus", () => {
    it("should return the status from verifyTransaction", async () => {
      const verificationResult = {
        status: PaymentStatus.SUCCESS,
        reference: "ref",
        externalReference: "ext_ref",
        raw: {},
      };
      // Mock verifyTransaction to control its output for this test
      const verifySpy = vi
        .spyOn(adapter, "verifyTransaction")
        .mockResolvedValue(verificationResult);

      const status = await adapter.getPaymentStatus("some_ref");

      expect(verifySpy).toHaveBeenCalledWith("some_ref");
      expect(status).toBe(PaymentStatus.SUCCESS);

      verifySpy.mockRestore();
    });
  });
});
