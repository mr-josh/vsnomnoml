import * as vscode from 'vscode';

export class NomnomlViewer {
    private _doc: vscode.TextDocument;
    private _nml: string = '';

    constructor (
        doc: vscode.TextDocument
    ) {
        this._doc =  doc;
        this.view();
    }

    public view() {
        const panel = vscode.window.createWebviewPanel(
            'nomnoml.viewer',
            'Nomnoml Viewer',
            vscode.ViewColumn.Beside,
            {}
        );

        const renderLoop = setInterval(() => {
            let nomnoml = require('nomnoml');

            if (this._nml !== this._doc.getText()) {
                this._nml = this._doc.getText();
            } else {
                return;
            }

            let svg;
            if (!this._nml.includes('#background')) {
                svg = nomnoml.renderSvg(this._nml.concat('\n\n#background: lightgrey'));
            } else {
                svg = nomnoml.renderSvg(this._nml);
            }


            panel.webview.html = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                </head>
                <body>
                    <h1> Nomnoml </h1>
                    <div style="transform: scale(1)">
                        ${svg}
                    </div>
                </body>
            </html>
            `;
        }, 500);
        
        panel.onDidDispose(() => {
            clearInterval(renderLoop);
        });
    }

    public get doc() { return this._doc; }
    public get uri() { return this._doc.uri; }
}