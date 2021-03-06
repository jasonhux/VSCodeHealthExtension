// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let idleTimer = 0;
let activeTimer = 0;


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	let disposable = vscode.commands.registerCommand('extension.displayTimers',()=>{
		vscode.window.showInformationMessage("You have been working in VS code for:" + activeTimer / 1000 + " secs");
	});
	context.subscriptions.push(disposable);
	loadMessage();
}

// this method is called when your extension is deactivated
export function deactivate() { }


async function loadMessage() {	
	vscode.window.showInformationMessage('Congratulations, your extension "health" is now active! The extension will remind you to have a rest up if you continue to work in VS code for more than 1 hour.');
	let editorBefore = new Editor();
	let editorCurrent = new Editor();
	//timer in milliseconds
	const minimumRequiredIdleDuration = 4 * 60 * 1000;
	const allowanceDuration = 2 * 60 *1000;
	const maximumActiveDuration = 60 * 60 * 1000;
	const checkInterval = 10000;
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
				vscode.window.showInformationMessage('Time to rest! You need to be away from your keyboard at least ' + minimumRequiredIdleDuration / (60 * 1000) + " minutes", { modal: true });
				activeTimer -= minimumRequiredIdleDuration + allowanceDuration;
			} 
		} else {
			idleTimer += checkInterval;
			if (idleTimer >= minimumRequiredIdleDuration) {   
				activeTimer = 0;
				idleTimer = 0;
			}
		}
		await sleep(checkInterval);
	}
}

const sleep = (milliseconds: number) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class Editor {
	uri: string;
	position: vscode.Position;
	constructor() {
		this.uri = ''
		this.position = new vscode.Position(0, 0)
	}
	hasActivities(editorBefore: Editor): boolean {
		return (this.uri != editorBefore.uri) || !this.position.isEqual(editorBefore.position)
	}
}
