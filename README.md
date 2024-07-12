# Website Blocker Chrome Extension

## Overview

Website Blocker is a Chrome extension that allows users to easily block and unblock multiple websites. This tool is perfect for improving productivity by restricting access to distracting websites during work or study hours.

## Features

- Block multiple websites simultaneously
- Easy-to-use interface with a simple input field and block button
- Individual unblock buttons for each blocked site
- Persistent storage of blocked sites across browser sessions
- Lightweight and fast performance

## Files

- `manifest.json`: Extension configuration file
- `popup.html`: HTML structure for the extension popup
- `popup.js`: JavaScript for popup interactions
- `background.js`: Background script for website blocking logic
- `icon.png`: Extension icon

## Installation

1. Clone this repository or download the source code.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Click on the extension icon in the Chrome toolbar to open the popup.
2. To block a website:
   - Enter the domain name (e.g., "example.com") in the input field.
   - Click the "Block" button.
3. To unblock a website:
   - Find the website in the list of blocked sites.
   - Click the "Unblock" button next to the site you want to unblock.
