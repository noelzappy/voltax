import { HubtelAdapter } from "../providers/hubtel/hubtel.adapter.js";
import { HubtelConfig } from "../providers/hubtel/types.js";
import { PaystackAdapter } from "../providers/paystack/paystack.adapter.js";
import { PaystackConfig } from "../providers/paystack/types.js";
import { FlutterwaveAdapter } from "../providers/flutterwave/flutterwave.adapter.js";
import { FlutterwaveConfig } from "../providers/flutterwave/types.js";
import { VoltaxValidationError } from "./errors.js";
import { MoolreAdapterOptions } from "../providers/moolre/types.js";
import { MoolreAdapter } from "../providers/moolre/moolre.adapter.js";

export interface VoltaxConfig {
  paystack?: PaystackConfig;
  hubtel?: HubtelConfig;
  flutterwave?: FlutterwaveConfig;
  moolre?: MoolreAdapterOptions;
}

export class Voltax {
  private _paystack?: PaystackAdapter;
  private _hubtel?: HubtelAdapter;
  private _flutterwave?: FlutterwaveAdapter;
  private _moolre?: MoolreAdapter;

  constructor(private readonly config: VoltaxConfig) {}

  /**
   * Get Paystack provider instance
   */
  get paystack(): PaystackAdapter {
    if (this._paystack) {
      return this._paystack;
    }

    if (!this.config.paystack) {
      throw new VoltaxValidationError(
        'Paystack configuration is missing. Please provide "paystack" in the Voltax constructor.',
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
        'Hubtel configuration is missing. Please provide "hubtel" in the Voltax constructor.',
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
        'Flutterwave configuration is missing. Please provide "flutterwave" in the Voltax constructor.',
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
        'Moolre configuration is missing. Please provide "moolre" in the Voltax constructor.',
      );
    }

    this._moolre = new MoolreAdapter(this.config.moolre);
    return this._moolre;
  }
}
