import { HubtelAdapter } from '../providers/hubtel/hubtel.adapter.js';
import { HubtelConfig } from '../providers/hubtel/types.js';
import { PaystackAdapter } from '../providers/paystack/paystack.adapter.js';
import { PaystackConfig } from '../providers/paystack/types.js';
import { FlutterwaveAdapter } from '../providers/flutterwave/flutterwave.adapter.js';
import { FlutterwaveConfig } from '../providers/flutterwave/types.js';
import { VoltaxValidationError } from './errors.js';
import { MoolreAdapterOptions } from '../providers/moolre/types.js';
import { MoolreAdapter } from '../providers/moolre/moolre.adapter.js';
import { LibertePayAdapter } from '../providers/libertepay/libertepay.adapter.js';
import { LibertePayConfig } from '../providers/libertepay/types.js';

/**
 * Supported payment providers
 */
export type VoltaxProviders = 'paystack' | 'hubtel' | 'flutterwave' | 'moolre' | 'libertepay';

/**
 * Maps provider names to their config types
 */
export interface VoltaxConfigMap {
  paystack: PaystackConfig;
  hubtel: HubtelConfig;
  flutterwave: FlutterwaveConfig;
  moolre: MoolreAdapterOptions;
  libertepay: LibertePayConfig;
}

/**
 * Maps provider names to their adapter types
 */
export interface VoltaxAdapterMap {
  paystack: PaystackAdapter;
  hubtel: HubtelAdapter;
  flutterwave: FlutterwaveAdapter;
  moolre: MoolreAdapter;
  libertepay: LibertePayAdapter;
}

/**
 * Multi-provider config for VoltaxAdapter
 */
export interface VoltaxMultiConfig {
  paystack?: PaystackConfig;
  hubtel?: HubtelConfig;
  flutterwave?: FlutterwaveConfig;
  moolre?: MoolreAdapterOptions;
  libertepay?: LibertePayConfig;
}

/**
 * Create a Voltax payment provider instance
 *
 * @example
 * ```ts
 * const hubtel = Voltax('hubtel', { clientId: '...', clientSecret: '...', merchantAccountNumber: '...' });
 * const paystack = Voltax('paystack', { secretKey: '...' });
 *
 * await hubtel.initiatePayment({ amount: 100, ... });
 * ```
 */
export function Voltax<T extends VoltaxProviders>(
  provider: T,
  config: VoltaxConfigMap[T],
): VoltaxAdapterMap[T];
export function Voltax(provider: VoltaxProviders, config: unknown) {
  switch (provider) {
    case 'paystack':
      return new PaystackAdapter(config as PaystackConfig);
    case 'hubtel':
      return new HubtelAdapter(config as HubtelConfig);
    case 'flutterwave':
      return new FlutterwaveAdapter(config as FlutterwaveConfig);
    case 'moolre':
      return new MoolreAdapter(config as MoolreAdapterOptions);
    case 'libertepay':
      return new LibertePayAdapter(config as LibertePayConfig);
    default:
      throw new VoltaxValidationError(`Unsupported provider: ${provider}`);
  }
}

/**
 * Multi-provider adapter for managing multiple payment gateways
 *
 * @example
 * ```ts
 * const voltax = new VoltaxAdapter({
 *   hubtel: { clientId: '...', clientSecret: '...', merchantAccountNumber: '...' },
 *   paystack: { secretKey: '...' }
 * });
 *
 * await voltax.hubtel.initiatePayment({ amount: 100, ... });
 * await voltax.paystack.initiatePayment({ amount: 100, ... });
 * ```
 */
export class VoltaxAdapter {
  private _paystack?: PaystackAdapter;
  private _hubtel?: HubtelAdapter;
  private _flutterwave?: FlutterwaveAdapter;
  private _moolre?: MoolreAdapter;
  private _libertepay?: LibertePayAdapter;

  constructor(private readonly config: VoltaxMultiConfig) {}

  /**
   * Get Paystack provider instance
   */
  get paystack(): PaystackAdapter {
    if (this._paystack) {
      return this._paystack;
    }

    if (!this.config.paystack) {
      throw new VoltaxValidationError(
        'Paystack configuration is missing. Please provide "paystack" in the VoltaxAdapter constructor.',
      );
    }

    this._paystack = new PaystackAdapter(this.config.paystack);
    return this._paystack;
  }

  /**
   * Get Hubtel provider instance
   */
  get hubtel(): HubtelAdapter {
    if (this._hubtel) {
      return this._hubtel;
    }

    if (!this.config.hubtel) {
      throw new VoltaxValidationError(
        'Hubtel configuration is missing. Please provide "hubtel" in the VoltaxAdapter constructor.',
      );
    }

    this._hubtel = new HubtelAdapter(this.config.hubtel);
    return this._hubtel;
  }

  /**
   * Get Flutterwave provider instance
   */
  get flutterwave(): FlutterwaveAdapter {
    if (this._flutterwave) {
      return this._flutterwave;
    }

    if (!this.config.flutterwave) {
      throw new VoltaxValidationError(
        'Flutterwave configuration is missing. Please provide "flutterwave" in the VoltaxAdapter constructor.',
      );
    }

    this._flutterwave = new FlutterwaveAdapter(this.config.flutterwave);
    return this._flutterwave;
  }

  /**
   * Get Moolre provider instance
   */
  get moolre(): MoolreAdapter {
    if (this._moolre) {
      return this._moolre;
    }

    if (!this.config.moolre) {
      throw new VoltaxValidationError(
        'Moolre configuration is missing. Please provide "moolre" in the VoltaxAdapter constructor.',
      );
    }

    this._moolre = new MoolreAdapter(this.config.moolre);
    return this._moolre;
  }

  /**
   * Get LibertePay provider instance
   */
  get libertepay(): LibertePayAdapter {
    if (this._libertepay) {
      return this._libertepay;
    }

    if (!this.config.libertepay) {
      throw new VoltaxValidationError(
        'LibertePay configuration is missing. Please provide "libertepay" in the VoltaxAdapter constructor.',
      );
    }

    this._libertepay = new LibertePayAdapter(this.config.libertepay);
    return this._libertepay;
  }
}
