# Health README

health is a simple extension which records the active duration you spend on VS code. When the duration exceeds the maximum value, VS code will activate a modal to remind you for a short break.

## Extension Settings

This extension runs with the VS code without extra command activation.


## Release Notes


### 0.0.1

Initial release of Health extension, it now checks the interactions with the active editor to determine the activity duration.

### How to install the extension

At the moment the extension is not in the marketplace so you will need to locate the vsix file in the repo and install it manually.
Save 'health-x.x.x.vsix' file to your local drive. Then use VS code command line providing the path to the .vsix file.
For example: code --install-extension "myExtensionFolder\health-0.0.1.vsix"