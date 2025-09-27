(function () {
    const consentCookieName = 'consent';
    const consentChannel = new BroadcastChannel('cookie-consent');

    function setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        const domain = '.' + window.location.hostname.split('.').slice(-2).join('.');
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; domain=${domain}`;
    }

    function getCookie(name) {
        return document.cookie.split('; ').reduce((r, v) => {
            const parts = v.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, '');
    };
    let banner;
    const check = () => {
        if (banner && banner.parentNode) return;
        const style = document.createElement('style');
        style.textContent = `
      #cookie-banner-wrapper {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 99999;
        display: flex;
        justify-content: center;
        pointer-events: none;
        padding: 16px;
        box-sizing: border-box;
        background: linear-gradient(to top, rgba(10, 10, 10, 0.85), rgba(10, 10, 10, 0));
      }

      #cookie-consent-banner {
        background-color: #1e1e1e;
        color: #f5f5f5;
        padding: 14px 20px;
        font-size: 13px;
        font-family: "Inter", "Segoe UI", Arial, sans-serif;
        line-height: 1.5;
        border-radius: 6px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
        display: flex;
        align-items: center;
        gap: 16px;
        width: min(680px, calc(100% - 32px));
        pointer-events: auto;
        opacity: 0;
        transform: translateY(16px);
        animation: cookieFadeIn 0.35s ease forwards;
      }

      #cookie-consent-banner.closing {
        animation: cookieFadeOut 0.35s ease forwards;
      }

      #cookie-consent-text {
        flex: 1;
      }

      #cookie-consent-banner a {
        color: #ff8c32;
        text-decoration: none;
        font-weight: 600;
      }

      #cookie-consent-banner a:hover,
      #cookie-consent-banner a:focus {
        text-decoration: underline;
      }

      #cookie-btn-row {
        display: flex;
        gap: 10px;
        flex-wrap: nowrap;
      }

      #cookie-consent-banner button {
        border: none;
        padding: 10px 18px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        border-radius: 6px;
        transition: transform 0.15s ease, opacity 0.15s ease;
      }

      #cookie-consent-banner button:hover {
        transform: translateY(-1px);
      }

      #cookie-accept { background-color: #ff6a00; color: #ffffff; }
      #cookie-decline { background-color: #3c3f44; color: #f0f0f0; }

      #cookie-decline:hover { opacity: 0.85; }
      #cookie-accept:hover { opacity: 0.9; }

      #cookie-toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #333;
        color: white;
        font-family: Arial, sans-serif;
        font-size: 14px;
        padding: 10px 20px;
        border-radius: 4px;
        box-shadow: 0 0 5px rgba(0,0,0,0.5);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        z-index: 99999;
      }

      @keyframes cookieFadeIn {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes cookieFadeOut {
        to {
          opacity: 0;
          transform: translateY(20px);
        }
      }

      @media (max-width: 640px) {
        #cookie-consent-banner {
          flex-direction: column;
          align-items: stretch;
          gap: 12px;
        }

        #cookie-btn-row {
          width: 100%;
          justify-content: flex-end;
        }

        #cookie-btn-row button {
          flex: 1;
        }
      }
    `;
        document.head.appendChild(style);

        const wrapper = document.createElement('div');
        wrapper.id = 'cookie-banner-wrapper';

        banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';

        const text = document.createElement('span');
        text.id = 'cookie-consent-text';
        text.innerHTML = `We use cookies to help personalize content and enhance your experience. <a href="https://${window.location.hostname.split('.').slice(-2).join('.')}/privacy" target="_blank" rel="noopener noreferrer">Learn more</a>.`;

        const btnAccept = document.createElement('button');
        btnAccept.id = 'cookie-accept';
        btnAccept.textContent = 'Accept';

        const btnDecline = document.createElement('button');
        btnDecline.id = 'cookie-decline';
        btnDecline.textContent = 'Decline';

        const btnRow = document.createElement('div');
        btnRow.id = 'cookie-btn-row';
        btnRow.appendChild(btnAccept);
        btnRow.appendChild(btnDecline);

        banner.appendChild(text);
        banner.appendChild(btnRow);
        wrapper.appendChild(banner);
        document.body.appendChild(wrapper);

        const toast = document.createElement('div');
        toast.id = 'cookie-toast';
        document.body.appendChild(toast);

        function closeBanner() {
            banner.classList.add('closing');
            setTimeout(() => banner.remove(), 1000);
        }

        btnAccept.onclick = function () {
            setCookie(consentCookieName, 'true', 6 * 30);
            closeBanner();
            consentChannel.postMessage('accepted');
        };

        btnDecline.onclick = function () {
            setCookie(consentCookieName, 'declined', 6 * 30);
            closeBanner();
            consentChannel.postMessage('declined');
        };
    };
    consentChannel.onmessage = function (e) {
        if (e.data === 'accepted') {
            setCookie(consentCookieName, 'true', 6 * 30);
            if (banner && banner.parentNode) {
                banner.classList.add('closing');
                setTimeout(() => banner.remove(), 1000);
            }
        } else if (e.data === 'declined') {
            setCookie(consentCookieName, 'declined', 6 * 30);
            if (banner && banner.parentNode) {
                banner.classList.add('closing');
                setTimeout(() => banner.remove(), 1000);
            }
        } else if (e.data === 'pending') {
            check();
        }
    };
    const hasConsent = getCookie(consentCookieName);
    if (hasConsent === 'true' || hasConsent === 'declined') return;

    consentChannel.postMessage('pending');
    check();
})();
