type WizardConfig = {
	onComplete?: (result: { nostrLogin: string; npub: string }) => void;
	onCancel?: () => void;
	width?: string;
	height?: string;
	baseUrl?: string;
	an: string;
	aa?: string;
	am?: 'light' | 'dark';
	s?: string[];
	asb?: boolean;
	afb?: boolean;
	aan?: boolean;
	aac?: boolean;
	awr?: string[];
	arr?: string[];
	ahc?: boolean;
};

export class NstartModal {
	private container!: HTMLDivElement;
	private iframe!: HTMLIFrameElement;
	private closeButton!: HTMLButtonElement;
	private config: WizardConfig;
	private baseURL: string;

	constructor(config: WizardConfig) {
		// Validate mandatory parameters
		if (!config.an) {
			throw new Error('NstartModal requires the an (appName) param');
		}

		config.baseUrl = config.baseUrl || window.location.origin;

		this.config = {
			onComplete: () => {},
			onCancel: () => {},
			width: '600px',
			height: '80vh',
			baseUrl: window.location.origin,
			...config
		};

		this.setupModal();
		this.setupMessageHandling();
		this.baseURL = this.buildURL();
	}

	private buildURL(): string {
		const url = new URL(this.config.baseUrl || window.location.origin);
		url.searchParams.set('an', this.config.an);
		url.searchParams.set('at', 'modal');
		url.searchParams.set('ac', 'modal');

		if (this.config.aa) url.searchParams.set('aa', this.config.aa);
		if (this.config.am) url.searchParams.set('am', this.config.am);
		if (this.config.s?.length) url.searchParams.set('s', this.config.s.join(','));
		if (this.config.asb) url.searchParams.set('asb', 'yes');
		if (this.config.afb) url.searchParams.set('afb', 'yes');
		if (this.config.aan) url.searchParams.set('aan', 'yes');
		if (this.config.aac) url.searchParams.set('aac', 'yes');
		if (this.config.awr?.length) url.searchParams.set('awr', this.config.awr.join(','));
		if (this.config.arr?.length) url.searchParams.set('arr', this.config.arr.join(','));

		if (!this.config.ahc) this.config.ahc = false;

		return url.toString();
	}

	private setupModal() {
		this.container = document.createElement('div');
		this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      z-index: 9999;
    `;

		// Create modal wrapper for positioning
		const modalWrapper = document.createElement('div');
		modalWrapper.style.cssText = `
      position: absolute;
      ${
				window.innerWidth >= 768
					? `
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: ${this.config.width};
          height: ${this.config.height};
          border-radius: 8px;
        `
					: `
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        `
			}
    `;

		if (!this.config.ahc) {
			this.closeButton = document.createElement('button');
			this.closeButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    `;
			this.closeButton.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

			this.closeButton.addEventListener('click', () => {
				this.config.onCancel?.();
				this.close();
			});

			modalWrapper.appendChild(this.closeButton);
		}

		this.iframe = document.createElement('iframe');

		this.iframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
    border-radius: inherit;
    background: white;
  `;

		modalWrapper.appendChild(this.iframe);
		this.container.appendChild(modalWrapper);
		document.body.appendChild(this.container);

		// Update modal size on window resize
		window.addEventListener('resize', () => {
			modalWrapper.style.cssText = `
      position: absolute;
      ${
				window.innerWidth >= 768
					? `
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: ${this.config.width};
          height: ${this.config.height};
          border-radius: 8px;
        `
					: `
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        `
			}
    `;
		});
	}

	private setupMessageHandling() {
		window.addEventListener('message', (event) => {
			if (!this.config.baseUrl) return;

			const baseOrigin = new URL(this.config.baseUrl).origin;
			if (event.origin !== baseOrigin) return;

			switch (event.data.type) {
				case 'WIZARD_COMPLETE':
					this.config.onComplete?.(event.data.result);
					console.log('Running sessionStorage.clear()');
					if (this.iframe?.contentWindow) {
						this.iframe.contentWindow.postMessage(
							{ type: 'CLEAR_SESSION_STORAGE' },
							this.config.baseUrl
						);
					}
					this.close();
					break;
				case 'WIZARD_CANCEL':
					this.config.onCancel?.();
					this.close();
					break;
			}
		});
	}

	private resetIframe() {
		this.iframe.src = this.baseURL;
	}

	open() {
		this.resetIframe();
		this.container.style.display = 'block';
	}

	close() {
		this.container.style.display = 'none';
		this.resetIframe();
	}

	destroy() {
		this.container.remove();
	}
}

if (typeof window !== 'undefined') {
	(window as any).NstartModal = NstartModal;
}
