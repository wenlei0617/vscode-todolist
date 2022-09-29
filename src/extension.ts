import * as vscode from 'vscode';
import { TodoListWebView } from './todolistWebview';

export function activate(context: vscode.ExtensionContext) {
	vscode.window
	vscode.commands
	
	const todolistWebview = new TodoListWebView(context);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(TodoListWebView.viewId, todolistWebview)
	)

	context.storageUri
}

export function deactivate() {}
