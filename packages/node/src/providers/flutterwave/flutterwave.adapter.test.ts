import { describe, it, expect, vi, beforeEach, afterEach, type Mocked } from 'vitest';
import { FlutterwaveAdapter } from './flutterwave.adapter.js';
import axios from 'axios';
import { Currency, PaymentStatus } from '../../core/enums.js';

// Mock axios
vi.mock('axios');

describe('FlutterwaveAdapter', () => {
  let adapter: FlutterwaveAdapter;
  const mockedAxios = axios as unknown as Mocked<typeof axios>;
  const mockCreate = vi.fn();

  beforeEach(() => {
    mockedAxios.create = mockCreate;
    mockCreate.mockReturnValue({
      post: vi.fn(),
      get: vi.fn(),
    });

    adapter = new FlutterwaveAdapter({ secretKey: 'flw_secret' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw error if secret key is missing', () => {
      expect(() => new FlutterwaveAdapter({ secretKey: '' })).toThrow();
    });
  });

  describe('initiatePayment', () => {
    const mockPayload = {
      amount: 100,
      email: 'test@example.com',
      currency: Currency.NGN,
      callbackUrl: 'https://example.com/callback',
      reference: 'ref_flw',
      mobileNumber: '08012345678',
      description: 'Test Payment',
    };

    it('should initialize payment successfully', async () => {
      const mockResponse = {
        data: {
          status: 'success',
          data: {
            link: 'https://flutterwave.com/pay',
          },
        },
      };

      const mockPost = vi.fn().mockResolvedValue(mockResponse);
      mockCreate.mockReturnValue({ post: mockPost });
      adapter = new FlutterwaveAdapter({ secretKey: 'flw_secret' });

      const result = await adapter.initiatePayment(mockPayload);

      expect(mockPost).toHaveBeenCalledWith(
        '/payments',
        expect.objectContaining({
          tx_ref: 'ref_flw',
          amount: 100,
          currency: Currency.NGN,
        }),
      );

      expect(result).toEqual({
        status: PaymentStatus.PENDING,
        reference: 'ref_flw',
        authorizationUrl: 'https://flutterwave.com/pay',
        raw: mockResponse.data,
      });
    });
  });

  describe('verifyTransaction', () => {
    it('should verify transaction successfully', async () => {
      const mockResponse = {
        data: {
          status: 'success',
          data: {
            status: 'successful',
            tx_ref: 'ref_flw',
            flw_ref: 'flw_123',
            amount: 100,
          },
        },
      };

      const mockGet = vi.fn().mockResolvedValue(mockResponse);
      mockCreate.mockReturnValue({ get: mockGet });
      adapter = new FlutterwaveAdapter({ secretKey: 'flw_secret' });

      const result = await adapter.verifyTransaction('ref_flw');

      expect(mockGet).toHaveBeenCalledWith('/transactions/verify_by_reference?tx_ref=ref_flw');
      expect(result).toEqual({
        status: PaymentStatus.SUCCESS,
        reference: 'ref_flw',
        externalReference: 'flw_123',
        raw: mockResponse.data,
      });
    });

    it('should handle failed transaction', async () => {
      const mockResponse = {
        data: {
          status: 'success',
          data: {
            status: 'failed',
            tx_ref: 'ref_flw',
          },
        },
      };

      const mockGet = vi.fn().mockResolvedValue(mockResponse);
      mockCreate.mockReturnValue({ get: mockGet });
      adapter = new FlutterwaveAdapter({ secretKey: 'flw_secret' });

      const result = await adapter.verifyTransaction('ref_flw');
      expect(result.status).toBe(PaymentStatus.FAILED);
    });
  });
});
