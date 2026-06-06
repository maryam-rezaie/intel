document.addEventListener("DOMContentLoaded", () => {
    const newsletterForm = document.getElementById("newsletter-form");
    const bootstrapStylesheet = document.getElementById("bootstrap-css");
    const rtlLanguages = new Set([
        "ar",
        "arc",
        "ckb",
        "dv",
        "fa",
        "he",
        "ku",
        "ps",
        "sd",
        "ug",
        "ur",
        "yi"
    ]);
    const bootstrapLtrUrl = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css";
    const bootstrapRtlUrl = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.rtl.min.css";
    const bootstrapRtlIntegrity = "sha384-CfCrinSRH2IR6a4e6fy2q6ioOX7O6Mtm1L9vRvFZ1trBncWmMePhzvafv7oIcWiW";

    function getGoogleTranslateLanguage() {
        const googleTranslateSelect = document.querySelector(".goog-te-combo");
        const selectedLanguage = googleTranslateSelect?.value;

        if (selectedLanguage) {
            return selectedLanguage;
        }

        return document.documentElement.lang || "en";
    }

    function isRtlLanguage(languageCode) {
        const normalizedLanguage = languageCode.toLowerCase().split("-")[0];

        return rtlLanguages.has(normalizedLanguage);
    }

    function updateBootstrapDirection(isRtl) {
        if (!bootstrapStylesheet) {
            return;
        }

        const nextBootstrapUrl = isRtl ? bootstrapRtlUrl : bootstrapLtrUrl;

        if (isRtl) {
            bootstrapStylesheet.integrity = bootstrapRtlIntegrity;
        } else {
            bootstrapStylesheet.removeAttribute("integrity");
        }

        if (bootstrapStylesheet.href !== nextBootstrapUrl) {
            bootstrapStylesheet.href = nextBootstrapUrl;
        }
    }

    function applyTranslatedDirection() {
        const bodyClassList = document.body.classList;
        const translatedRtl = bodyClassList.contains("translated-rtl");
        const translatedLtr = bodyClassList.contains("translated-ltr");
        const detectedLanguage = getGoogleTranslateLanguage();
        const shouldUseRtl = translatedRtl || (!translatedLtr && isRtlLanguage(detectedLanguage));
        const nextDirection = shouldUseRtl ? "rtl" : "ltr";

        if (document.documentElement.dir !== nextDirection) {
            document.documentElement.dir = nextDirection;
        }

        document.body.dir = nextDirection;
        document.documentElement.classList.toggle("rtl-mode", shouldUseRtl);
        document.documentElement.classList.toggle("ltr-mode", !shouldUseRtl);
        updateBootstrapDirection(shouldUseRtl);
    }

    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Thank you! Your email address has been successfully registered for Intel sustainability updates.");
            newsletterForm.reset();
        });
    }

    document.addEventListener("change", (event) => {
        if (event.target.matches(".goog-te-combo")) {
            applyTranslatedDirection();
        }
    });

    let directionUpdateQueued = false;

    function queueDirectionUpdate() {
        if (directionUpdateQueued) {
            return;
        }

        directionUpdateQueued = true;

        requestAnimationFrame(() => {
            directionUpdateQueued = false;
            applyTranslatedDirection();
        });
    }

    const translationObserver = new MutationObserver(queueDirectionUpdate);

    translationObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "dir", "lang"],
        childList: true,
        subtree: true
    });
    translationObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ["class", "dir"],
        childList: true,
        subtree: true
    });

    applyTranslatedDirection();
});
