import config from '../config.js';

const attr = 'dialog';
const buttonAttr = 'dialog-button';
const panelAttr = 'dialog-panel';
const missingPanelMsg = 'Missing panel inside dialog...';
const titleAttr = 'dialog-title';
const descriptionAttr = 'dialog-description';

export default { init, open, close };

function selector() {
    return '[' + config.prefix + attr + ']';
}

function buttonSelector() {
    return '[' + config.prefix + buttonAttr + ']';
}

function panelSelector() {
    return '[' + config.prefix + panelAttr + ']';
}

function titleSelector() {
    return '[' + config.prefix + titleAttr + ']';
}

function descriptionSelector() {
    return '[' + config.prefix + descriptionAttr + ']';
}

// function getParentDialog(element) {
//     if (!element) {
//         console.warn('Could not get parent dialog from empty element.');
//         return;
//     }
//     let dialog = element.closest(selector());
//     if (!dialog) {
//         // TODO: better warning/logging
//         console.warn('Unexpected missing dialog!');
//     }
//     return dialog;
// }

function init() {
    console.log('initializing dialogs...');
    let dialogs = document.querySelectorAll(selector());
    for (let i = 0; i < dialogs.length; i++) {
        // portal if necessary to bring modal to top level
        let dialog = dialogs[i];
        if (dialog.parentElement !== document.body) {
            console.log('Portaling dialog...');
            dialog.remove();
            document.body.append(dialog);
        }
        let panel = dialogs[i].querySelector(panelSelector());
        if (!panel) {
            console.warn(missingPanelMsg, panel);
            continue;
        }
        if (!panel.hasAttribute('role')) {
            panel.setAttribute('role', 'dialog');
        }
        if (!panel.hasAttribute('aria-modal')) {
            panel.setAttribute('aria-modal', 'true');
        }
        panel.addEventListener('click', onPanelClick);
        panel.addEventListener('keydown', onPanelKeyDown);
    }

    let buttons = document.querySelectorAll(buttonSelector());

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', onButtonClick);
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
    close(evt.target.closest(selector()));
}

/**
 * @param {KeyboardEvent} evt
 */
function onPanelKeyDown(evt) {
    if (evt.key === 'Escape') {
        close(evt.target.closest(selector()));
    }
}

/**
 * @param {Event} evt
 */
function onButtonClick(evt) {
    // If currently in a modal, close it
    let currentDialog = evt.target.closest(selector());
    if (currentDialog) {
        close(currentDialog);
    }

    // If modal selector specified, find and open it
    let newDialogSelector = evt.target.getAttribute(config.prefix + buttonAttr);
    if (newDialogSelector) {
        let newDialog = document.querySelector(newDialogSelector);
        if (newDialog) {
            open(newDialog);
        } else {
            console.warn(
                'Could not locate modal dialog specified on...',
                evt.target,
            );
        }
    }
}
