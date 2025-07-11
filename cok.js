(function () {
    const consentCookieName = 'firecone_cookie_consent';

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

    // vytvořit wrapper podle body šířky
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.zIndex = '99999';
    wrapper.style.left = '0';
    wrapper.style.right = '0';
    wrapper.style.display = 'flex';
    wrapper.style.justifyContent = 'center';
    wrapper.style.pointerEvents = 'none'; // aby nepřekážel mimo banner

    // banner
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    Object.assign(banner.style, {
        backgroundColor: '#222',
        color: '#eee',
        padding: '15px',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.4',
        boxShadow: '0 0 10px rgba(0,0,0,0.7)',
        maxWidth: '320px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        pointerEvents: 'auto', // aktivní kliky
    });

    function setPosition() {
        if (window.innerWidth < 768) {
            wrapper.style.bottom = '0';
            wrapper.style.top = 'auto';
            banner.style.borderRadius = '0';
            banner.style.width = '100%';
        } else {
            wrapper.style.bottom = '20px';
            wrapper.style.top = 'auto';
            banner.style.borderRadius = '8px';
            banner.style.width = '320px';
        }
    }

    setPosition();
    window.addEventListener('resize', setPosition);

    // text
    const text = document.createElement('span');
    text.innerHTML = `This site uses cookies to improve your experience. By continuing, you accept our <a href="/privacy" style="color:#4CAF50; text-decoration:underline;" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.`;
    text.style.flex = '1 1 auto';
    text.style.marginRight = '10px';

    // accept btn
    const btnAccept = document.createElement('button');
    btnAccept.textContent = 'Accept';
    Object.assign(btnAccept.style, {
        backgroundColor: '#4CAF50',
        border: 'none',
        color: 'white',
        padding: '8px 16px',
        fontSize: '14px',
        cursor: 'pointer',
        borderRadius: '4px',
        flex: '0 0 auto',
        marginRight: '8px',
    });

    // decline btn
    const btnDecline = document.createElement('button');
    btnDecline.textContent = 'Decline';
    Object.assign(btnDecline.style, {
        backgroundColor: '#888',
        border: 'none',
        color: 'white',
        padding: '8px 16px',
        fontSize: '14px',
        cursor: 'pointer',
        borderRadius: '4px',
        flex: '0 0 auto',
    });

    btnAccept.onclick = function () {
        setCookie(consentCookieName, 'true', 365);
        fadeOutAndRemove(wrapper);
    };

    btnDecline.onclick = function () {
        setCookie(consentCookieName, 'declined', 365);
        fadeOutAndRemove(wrapper);
    };

    banner.appendChild(text);
    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.appendChild(btnAccept);
    btnContainer.appendChild(btnDecline);
    banner.appendChild(btnContainer);

    wrapper.appendChild(banner);
    document.body.appendChild(wrapper);

    // fade in
    requestAnimationFrame(() => {
        banner.style.opacity = '1';
        banner.style.transform = 'translateY(0)';
    });

    // fade out helper
    function fadeOutAndRemove(el) {
        el.firstChild.style.opacity = '0';
        el.firstChild.style.transform = 'translateY(20px)';
        setTimeout(() => {
            if (el.parentNode) el.parentNode.removeChild(el);
        }, 400);
    }
})();
