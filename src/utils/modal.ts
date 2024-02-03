import * as vscode from 'vscode';

export async function showNotification({message, timeout = 5000 }: { message: string, timeout?: number }) {
    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            cancellable: false
        },
        async (progress) => {
            progress.report({ increment: 100, message: `${message}` });
            await new Promise((resolve) => setTimeout(resolve, timeout));
        }
    );
}