import { describe, it, expect, vi, beforeEach, afterEach, type Mocked } from 'vitest';
import { LibertePayAdapter } from './libertepay.adapter.js';
import axios from 'axios';
import { Currency, PaymentStatus } from '../../core/enums.js';
import { VoltaxValidationError } from '../../core/errors.js';
import { LibertePayPaymentDTO } from '../../core/provider-schemas/libertepay.schema.js';

vi.mock('axios');

describe('LibertePayAdapter', () => {
  let adapter: LibertePayAdapter;
  const mockedAxios = axios as unknown as Mocked<typeof axios>;
  const mockCreate = vi.fn();

  const defaultConfig = {
    secretKey: 'test_secret_key',
    testEnv: true,
  };

  beforeEach(() => {
    const mockPost = vi.fn();
    const mockGet = vi.fn();
    mockedAxios.create = mockCreate;
    mockCreate.mockReturnValue({
      post: mockPost,
      get: mockGet,
    });
    adapter = new LibertePayAdapter(defaultConfig);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw VoltaxValidationError if secret key is missing', () => {
      expect(() => new LibertePayAdapter({ secretKey: '', testEnv: true })).toThrow(
        VoltaxValidationError,
      );
    });

    it('should create axios instance with test environment URL when testEnv is true', () => {
      new LibertePayAdapter({ secretKey: 'test_key', testEnv: true });
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://uat-360pay-merchant-api.libertepay.com/v1',
        headers: {
          Authorization: 'Bearer test_key',
        },
      });
    });

    it('should create axios instance with production URL when testEnv is false', () => {
      new LibertePayAdapter({ secretKey: 'prod_key', testEnv: false });
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://360pay-merchant-api.libertepay.com/v1',
        headers: {
          Authorization: 'Bearer prod_key',
        },
      });
    });
  });

  describe('initiatePayment', () => {
    const validPayload: LibertePayPaymentDTO = {
      amount: 100,
      email: 'test@example.com',
      currency: Currency.GHS,
      mobileNumber: '0240000000',
      paymentSlug: 'test-payment-slug',
    };

    it('should throw VoltaxValidationError for invalid payload', async () => {
      const invalidPayload = { ...validPayload, amount: -100 };
      await expect(adapter.initiatePayment(invalidPayload)).rejects.toThrow(VoltaxValidationError);
    });

    it('should throw VoltaxValidationError if email is missing', async () => {
      const payload = { ...validPayload, email: '' };
      await expect(adapter.initiatePayment(payload)).rejects.toThrow(VoltaxValidationError);
    });

    it('should throw VoltaxValidationError for invalid currency', async () => {
      const payload = { ...validPayload, currency: 'INVALID' as Currency };
      await expect(adapter.initiatePayment(payload)).rejects.toThrow(VoltaxValidationError);
    });

    it('should initialize payment successfully', async () => {
      const mockResponse = {
        data: {
          Code: '200',
          status: 'success',
          msg: 'Payment initialized',
          data: {
            access_code: 'test_access_code',
            payment_url: 'https://libertepay.com/checkout/test',
            reference: 'liberte_ref_123',
          },
        },
      };

      const mockPost = vi.fn().mockResolvedValue(mockResponse);
      mockCreate.mockReturnValue({ post: mockPost, get: vi.fn() });
      adapter = new LibertePayAdapter(defaultConfig);

      const result = await adapter.initiatePayment(validPayload);

      expect(mockPost).toHaveBeenCalledWith('/transactions/initiate', {
        amount: validPayload.amount,
        emailid: validPayload.email,
        phone_number: validPayload.mobileNumber,
        payment_slug: validPayload.paymentSlug,
      });

      expect(result).toEqual({
        status: PaymentStatus.PENDING,
        reference: 'liberte_ref_123',
        authorizationUrl: 'https://libertepay.com/checkout/test',
        externalReference: 'liberte_ref_123',
        raw: mockResponse.data,
      });
    });
  });

  describe('verifyTransaction', () => {
    it('should throw VoltaxValidationError if reference is missing', async () => {
      await expect(adapter.verifyTransaction('')).rejects.toThrow(
        'Transaction reference is required for verification',
      );
    });

    it('should verify a successful transaction', async () => {
      const mockResponse = {
        data: {
          Code: '200',
          status: 'success',
          msg: 'Transaction found',
          data: {
            account_name: 'Test Account',
            account_number: '1234567890',
            amount: '100.00',
            date_created: '2024-01-01T00:00:00Z',
            external_transaction_id: 'ext_trx_123',
            isReversed: false,
            message: 'Transaction successful',
            status_code: 'success',
            transaction_id: 'trx_123',
          },
        },
      };

      const mockGet = vi.fn().mockResolvedValue(mockResponse);
      mockCreate.mockReturnValue({ post: vi.fn(), get: mockGet });
      adapter = new LibertePayAdapter(defaultConfig);

      const result = await adapter.verifyTransaction('test_ref');

      expect(mockGet).toHaveBeenCalledWith('/transactions/transaction-check/test_ref');
      expect(result).toEqual({
        status: PaymentStatus.SUCCESS,
        reference: 'test_ref',
        externalReference: 'trx_123',
        raw: mockResponse.data,
      });
    });

    it('should handle a failed transaction', async () => {
      const mockResponse = {
        data: {
          Code: '200',
          status: 'success',
          msg: 'Transaction found',
          data: {
            account_name: 'Test Account',
            account_number: '1234567890',
            amount: '100.00',
            date_created: '2024-01-01T00:00:00Z',
            external_transaction_id: 'ext_trx_failed',
            isReversed: false,
            message: 'Transaction failed',
            status_code: 'failed',
            transaction_id: 'trx_failed',
          },
        },
      };

      const mockGet = vi.fn().mockResolvedValue(mockResponse);
      mockCreate.mockReturnValue({ post: vi.fn(), get: mockGet });
      adapter = new LibertePayAdapter(defaultConfig);

      const result = await adapter.verifyTransaction('failed_ref');
      expect(result.status).toBe(PaymentStatus.FAILED);
    });

    it('should handle a reversed transaction', async () => {
      const mockResponse = {
        data: {
          Code: '200',
          status: 'success',
          msg: 'Transaction found',
          data: {
            account_name: 'Test Account',
            account_number: '1234567890',
            amount: '100.00',
            date_created: '2024-01-01T00:00:00Z',
            external_transaction_id: 'ext_trx_reversed',
            isReversed: true,
            message: 'Transaction reversed',
            status_code: 'reversed',
            transaction_id: 'trx_reversed',
          },
        },
      };

      const mockGet = vi.fn().mockResolvedValue(mockResponse);
      mockCreate.mockReturnValue({ post: vi.fn(), get: mockGet });
      adapter = new LibertePayAdapter(defaultConfig);

      const result = await adapter.verifyTransaction('reversed_ref');
      expect(result.status).toBe(PaymentStatus.FAILED);
    });

    it('should handle an abandoned transaction', async () => {
      const mockResponse = {
        data: {
          Code: '200',
          status: 'success',
          msg: 'Transaction found',
          data: {
            account_name: 'Test Account',
            account_number: '1234567890',
            amount: '100.00',
            date_created: '2024-01-01T00:00:00Z',
            external_transaction_id: 'ext_trx_abandoned',
            isReversed: false,
            message: 'Transaction abandoned',
            status_code: 'abandoned',
            transaction_id: 'trx_abandoned',
          },
        },
      };

      const mockGet = vi.fn().mockResolvedValue(mockResponse);
      mockCreate.mockReturnValue({ post: vi.fn(), get: mockGet });
      adapter = new LibertePayAdapter(defaultConfig);

      const result = await adapter.verifyTransaction('abandoned_ref');
      expect(result.status).toBe(PaymentStatus.FAILED);
    });

    it('should handle a pending transaction', async () => {
      const mockResponse = {
        data: {
          Code: '200',
          status: 'success',
          msg: 'Transaction found',
          data: {
            account_name: 'Test Account',
            account_number: '1234567890',
            amount: '100.00',
            date_created: '2024-01-01T00:00:00Z',
            external_transaction_id: 'ext_trx_pending',
            isReversed: false,
            message: 'Transaction pending',
            status_code: 'pending',
            transaction_id: 'trx_pending',
          },
        },
      };

      const mockGet = vi.fn().mockResolvedValue(mockResponse);
      mockCreate.mockReturnValue({ post: vi.fn(), get: mockGet });
      adapter = new LibertePayAdapter(defaultConfig);

      const result = await adapter.verifyTransaction('pending_ref');
      expect(result.status).toBe(PaymentStatus.PENDING);
    });
  });

  describe('getPaymentStatus', () => {
    it('should return the status from verifyTransaction', async () => {
      const verificationResult = {
        status: PaymentStatus.SUCCESS,
        reference: 'ref',
        externalReference: 'ext_ref',
        raw: {},
      };

      const verifySpy = vi
        .spyOn(adapter, 'verifyTransaction')
        .mockResolvedValue(verificationResult);

      const status = await adapter.getPaymentStatus('some_ref');

      expect(verifySpy).toHaveBeenCalledWith('some_ref');
      expect(status).toBe(PaymentStatus.SUCCESS);

      verifySpy.mockRestore();
    });

    it('should return FAILED status for failed transactions', async () => {
      const verificationResult = {
        status: PaymentStatus.FAILED,
        reference: 'ref',
        externalReference: 'ext_ref',
        raw: {},
      };

      const verifySpy = vi
        .spyOn(adapter, 'verifyTransaction')
        .mockResolvedValue(verificationResult);

      const status = await adapter.getPaymentStatus('failed_ref');

      expect(status).toBe(PaymentStatus.FAILED);

      verifySpy.mockRestore();
    });

    it('should return PENDING status for pending transactions', async () => {
      const verificationResult = {
        status: PaymentStatus.PENDING,
        reference: 'ref',
        externalReference: 'ext_ref',
        raw: {},
      };

      const verifySpy = vi
        .spyOn(adapter, 'verifyTransaction')
        .mockResolvedValue(verificationResult);

      const status = await adapter.getPaymentStatus('pending_ref');

      expect(status).toBe(PaymentStatus.PENDING);

      verifySpy.mockRestore();
    });
  });
});
