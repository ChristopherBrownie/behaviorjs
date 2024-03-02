// Modal dialog
(function () {
    const self = {
        init: init,
        open: open,
        close: close,

        // dialog
        attr: 'dialog',
        selector: selector,

        buttonAttr: 'dialog-button',
        buttonSelector: buttonSelector,
        onButtonClick: onButtonClick,

        // panel
        panelAttr: 'dialog-panel',
        panelSelector: panelSelector,
        missingPanelMsg: 'Missing panel inside dialog...',
        onPanelClick: onPanelClick,
        onPanelKeyDown: onPanelKeyDown,

        // title (optional)
        titleAttr: 'dialog-title',
        titleSelector: titleSelector,

        // description (optional)
        descriptionAttr: 'dialog-description',
        descriptionSelector: descriptionSelector,
    };

    function selector() {
        return '[' + window.prefix + self.attr + ']';
    }

    function buttonSelector() {
        return '[' + window.prefix + self.buttonAttr + ']';
    }

    function panelSelector() {
        return '[' + window.prefix + self.panelAttr + ']';
    }

    function titleSelector() {
        return '[' + window.prefix + self.titleAttr + ']';
    }

    function descriptionSelector() {
        return '[' + window.prefix + self.descriptionAttr + ']';
    }

    // function getParentDialog(element) {
    //     if (!element) {
    //         console.warn('Could not get parent dialog from empty element.');
    //         return;
    //     }
    //     let dialog = element.closest(self.selector());
    //     if (!dialog) {
    //         // TODO: better warning/logging
    //         console.warn('Unexpected missing dialog!');
    //     }
    //     return dialog;
    // }

    function init() {
        console.log('initializing dialogs...');
        let dialogs = document.querySelectorAll(self.selector());
        for (let i = 0; i < dialogs.length; i++) {
            // portal if necessary to bring modal to top level
            let dialog = dialogs[i];
            if (dialog.parentElement !== document.body) {
                console.log('Portaling dialog...');
                dialog.remove();
                document.body.append(dialog);
            }
            let panel = dialogs[i].querySelector(self.panelSelector());
            if (!panel) {
                console.warn(self.missingPanelMsg, panel);
                continue;
            }
            if (!panel.hasAttribute('role')) {
                panel.setAttribute('role', 'dialog');
            }
            if (!panel.hasAttribute('aria-modal')) {
                panel.setAttribute('aria-modal', 'true');
            }
            panel.addEventListener('click', self.onPanelClick);
            panel.addEventListener('keydown', self.onPanelKeyDown);
        }

        let buttons = document.querySelectorAll(self.buttonSelector());

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', self.onButtonClick);
        }
    }

    /**
     * @param {HTMLElement} dialog
     */
    function open(dialog) {
        console.log('Opening dialog...');
        if (!dialog) {
            return;
        }
        dialog.style.display = 'block';
    }

    /**
     * @param {HTMLElement} dialog
     */
    function close(dialog) {
        console.log('Closing dialog...');
        if (!dialog) {
            return;
        }
        dialog.style.display = 'none';
    }

    /**
     * @param {Event} evt
     */
    function onPanelClick(evt) {
        self.close(evt.target.closest(self.selector()));
    }

    /**
     * @param {KeyboardEvent} evt
     */
    function onPanelKeyDown(evt) {
        if (evt.key === 'Escape') {
            self.close(evt.target.closest(self.selector()));
        }
    }

    /**
     * @param {Event} evt
     */
    function onButtonClick(evt) {
        // If currently in a modal, close it
        let currentDialog = evt.target.closest(self.selector());
        if (currentDialog) {
            self.close(currentDialog);
        }

        // If modal selector specified, find and open it
        let newDialogSelector = evt.target.getAttribute(
            window.prefix + self.buttonAttr,
        );
        if (newDialogSelector) {
            let newDialog = document.querySelector(newDialogSelector);
            if (newDialog) {
                self.open(newDialog);
            } else {
                console.warn(
                    'Could not locate modal dialog specified on...',
                    evt.target,
                );
            }
        }
    }

    window.dialog = self;
})();
