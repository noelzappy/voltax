import { describe, it, expect } from 'vitest';
import { VoltaxAdapter } from '../voltax.js';
import { VoltaxValidationError } from '../errors.js';
import { PaystackAdapter } from '../../providers/paystack/paystack.adapter.js';
import { HubtelAdapter } from '../../providers/hubtel/hubtel.adapter.js';
import { FlutterwaveAdapter } from '../../providers/flutterwave/flutterwave.adapter.js';

describe('Voltax Core', () => {
  const validConfig = {
    paystack: { secretKey: 'sk_test_123' },
    hubtel: {
      clientId: 'id',
      clientSecret: 'secret',
      merchantAccountNumber: '123',
    },
    flutterwave: { secretKey: 'flw_secret' },
  };

  it('should instantiate successfully', () => {
    const voltax = new VoltaxAdapter(validConfig);
    expect(voltax).toBeInstanceOf(VoltaxAdapter);
  });

  describe('Provider Access', () => {
    it('should lazy load Paystack adapter', () => {
      const voltax = new VoltaxAdapter(validConfig);
      // Accessing provider for the first time
      const paystack = voltax.paystack;
      expect(paystack).toBeInstanceOf(PaystackAdapter);

      // Accessing it again should return the same instance
      expect(voltax.paystack).toBe(paystack);
    });

    it('should lazy load Hubtel adapter', () => {
      const voltax = new VoltaxAdapter(validConfig);
      const hubtel = voltax.hubtel;
      expect(hubtel).toBeInstanceOf(HubtelAdapter);
      expect(voltax.hubtel).toBe(hubtel);
    });

    it('should lazy load Flutterwave adapter', () => {
      const voltax = new VoltaxAdapter(validConfig);
      const flutterwave = voltax.flutterwave;
      expect(flutterwave).toBeInstanceOf(FlutterwaveAdapter);
      expect(voltax.flutterwave).toBe(flutterwave);
    });
  });

  describe('Validation', () => {
    it('should throw if accessing Paystack without config', () => {
      const voltax = new VoltaxAdapter({});
      expect(() => voltax.paystack).toThrow(VoltaxValidationError);
    });

    it('should throw if accessing Hubtel without config', () => {
      const voltax = new VoltaxAdapter({});
      expect(() => voltax.hubtel).toThrow(VoltaxValidationError);
    });

    it('should throw if accessing Flutterwave without config', () => {
      const voltax = new VoltaxAdapter({});
      expect(() => voltax.flutterwave).toThrow(VoltaxValidationError);
    });
  });
});
