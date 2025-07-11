(function () {
    const consentCookieName = 'consent';

    function setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
    }

    function getCookie(name) {
        return document.cookie.split('; ').reduce((r, v) => {
            const parts = v.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, '');
    }

    if (getCookie(consentCookieName) === 'true' || getCookie(consentCookieName) === 'declined') return;

    // Inject CSS into head
    const style = document.createElement('style');
    style.textContent = `
    #cookie-banner-wrapper {
      position: fixed;
      z-index: 99999;
      width: 100%;
      display: flex;
      justify-content: flex-end;
      pointer-events: none;
    }

    #cookie-consent-banner {
      background-color: #222;
      color: #eee;
      padding: 15px;
      font-size: 14px;
      font-family: Arial, sans-serif;
      line-height: 1.4;
      box-shadow: 0 0 10px rgba(0,0,0,0.7);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      opacity: 0;
      transform: translateY(20px);
      animation: cookieFadeIn 0.4s ease forwards;
      pointer-events: auto;
      box-sizing: border-box;
      max-width: 320px;
      margin: 20px;
    }

    #cookie-consent-banner span {
      margin-right: 10px;
    }

    #cookie-consent-banner a {
      color: #4CAF50;
      text-decoration: underline;
    }

    #cookie-consent-banner button {
      border: none;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      border-radius: 4px;
      margin-right: 8px;
    }

    #cookie-accept {
      background-color: #4CAF50;
      color: white;
    }

    #cookie-decline {
      background-color: #888;
      color: white;
    }

    #cookie-btn-row {
      display: flex;
      flex-wrap: wrap;
    }

    @keyframes cookieFadeIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 767px) {
      #cookie-banner-wrapper {
        bottom: 0;
        justify-content: center;
        padding: 0;
      }

      #cookie-consent-banner {
        width: 100%;
        max-width: 100%;
        border-radius: 0;
        margin: 0;
      }
    }

    @media (min-width: 768px) {
      #cookie-banner-wrapper {
        bottom: 20px;
        right: 20px;
      }
    }
  `;
    document.head.appendChild(style);

    // Structure
    const wrapper = document.createElement('div');
    wrapper.id = 'cookie-banner-wrapper';

    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';

    const text = document.createElement('span');
    text.innerHTML = `This site uses cookies to improve your experience. By continuing, you accept our <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.`;

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

    btnAccept.onclick = function () {
        setCookie(consentCookieName, 'true', 365);
        banner.remove();
    };

    btnDecline.onclick = function () {
        setCookie(consentCookieName, 'declined', 365);
        banner.remove();
    };

    banner.appendChild(text);
    banner.appendChild(btnRow);
    wrapper.appendChild(banner);
    document.body.appendChild(wrapper);
})();
