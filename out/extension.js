"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "health" is now active! The extension will remind you to have a rest up if you continue to work in VS code for more than 1 hour.');
    loadMessage();
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
async function loadMessage() {
    let editorBefore = new Editor();
    let editorCurrent = new Editor();
    //timer in milliseconds
    let idleTimer = 0;
    let activeTimer = 0;
    const minimumRequiredIdleDuration = 4 * 60 * 1000;
    const allowanceDuration = 2 * 60 * 1000;
    const maximumActiveDuration = 60 * 60 * 1000;
    const checkInterval = 20000;
    //change this;
    while (true) {
        let activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            editorCurrent.uri = activeEditor.document.uri.toString();
            editorCurrent.position = activeEditor.selection.active;
        }
        if (editorCurrent.hasActivities(editorBefore)) {
            editorBefore.uri = editorCurrent.uri;
            editorBefore.position = editorCurrent.position;
            activeTimer += checkInterval + idleTimer;
            idleTimer = 0;
            if (activeTimer >= maximumActiveDuration) {
                vscode.window.showInformationMessage('Time to rest! You need to be away from your keyboard at least ' + minimumRequiredIdleDuration / 60 * 1000, { modal: true });
                activeTimer -= minimumRequiredIdleDuration + allowanceDuration;
            }
        }
        else {
            idleTimer += checkInterval;
            if (idleTimer >= minimumRequiredIdleDuration) {
                activeTimer = 0;
            }
        }
        // console.log("You have been idle for: " + idleTimer / 1000 + " secs");
        // console.log("You have been working in VS code for: " + activeTimer / 1000 + " secs");
        await sleep(checkInterval);
    }
}
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};
class Editor {
    constructor() {
        this.uri = '';
        this.position = new vscode.Position(0, 0);
    }
    hasActivities(editorBefore) {
        return (this.uri != editorBefore.uri) || !this.position.isEqual(editorBefore.position);
    }
}
//# sourceMappingURL=extension.js.map