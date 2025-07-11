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

    // wrapper (to keep it aligned)
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.zIndex = '99999';
    wrapper.style.display = 'flex';
    wrapper.style.justifyContent = 'flex-end';
    wrapper.style.pointerEvents = 'none';
    wrapper.style.width = '100%';
    wrapper.style.padding = '0 16px';

    // banner
    const banner = document.createElement('div');
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
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '10px',
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        pointerEvents: 'auto',
        width: '100%',
        boxSizing: 'border-box',
    });

    function setPosition() {
        if (window.innerWidth < 768) {
            wrapper.style.bottom = '0';
            wrapper.style.right = '0';
            banner.style.borderRadius = '0';
            banner.style.width = '100%';
            banner.style.margin = '0';
        } else {
            wrapper.style.bottom = '20px';
            wrapper.style.right = '20px';
            banner.style.width = '320px';
            banner.style.borderRadius = '8px';
        }
    }

    setPosition();
    window.addEventListener('resize', setPosition);

    const text = document.createElement('span');
    text.innerHTML = `This site uses cookies to improve your experience. By continuing, you accept our <a href="/privacy" style="color:#4CAF50; text-decoration:underline;" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.`;

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
        marginRight: '8px',
    });

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
    });

    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.flexWrap = 'wrap';
    btnRow.appendChild(btnAccept);
    btnRow.appendChild(btnDecline);

    btnAccept.onclick = function () {
        setCookie(consentCookieName, 'true', 365);
        fadeOutAndRemove(wrapper);
    };

    btnDecline.onclick = function () {
        setCookie(consentCookieName, 'declined', 365);
        fadeOutAndRemove(wrapper);
    };

    banner.appendChild(text);
    banner.appendChild(btnRow);
    wrapper.appendChild(banner);
    document.body.appendChild(wrapper);

    requestAnimationFrame(() => {
        banner.style.opacity = '1';
        banner.style.transform = 'translateY(0)';
    });

    function fadeOutAndRemove(el) {
        el.firstChild.style.opacity = '0';
        el.firstChild.style.transform = 'translateY(20px)';
        setTimeout(() => {
            if (el.parentNode) el.parentNode.removeChild(el);
        }, 400);
    }
})();
