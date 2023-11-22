# React Labyrinth



# __Table of Contents__
1. [Overview](#overview)
2. [Features](#features)
3. [Installation](#installation)
4. [Getting Started](#getting-started)
5. [Known Issues](#known-issues)
6. [Release Notes](#release-notes)
7. [Meet Our Team](#meet-our-team)
8. [License](#license)

*work in progress as of 11/13/23*
## Overview
React Server Components are components that run exclusively on the server, allowing the components to do things such as making their own database queries inside of the component, rather than having to make a request to the backend first. These components are different from the components we usually write in React, which under this new paradigm are refered to as Client Components. But the problem is it's not always clear which Client Components could instead be Server Components which would save space on the bundle size and decrease TTI(time to interactive) for the client.

We want to create a visualization tool to help developers know where these changes could be implemented and how much time and space their application would save from these potential changes. _(Make sure to "trust our extension" in order to see the bundle size and TTI metrics)_

## Features

Our tool will 
* Show which components are currently considered Client Components or Server Components 
* Show if a Client Component has the potential to be a Server Component. 
* Display the change in Bundle Size and TTI for the web application

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Installation

Our visualization tool can be downloaded as an extension in the VS Code Editor. Search for React Labrynth and click "install".

## Getting Started

Select the root file for your React App to load the tree.

Any components that are Client Components will have a blue background and Server Components will have an orange background. 

If the component has the potential to be a Server Component, there will be an orange dotted outline surrounding the component node on the tree.

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

## Meet Our Team

* Ashley Luu
* Christina Raether
* Francisco Lopez
* Johnny Arroyo
* Louis Kuczykowski


## License

React Labrynth is developed under the [MIT license](https://en.wikipedia.org/wiki/MIT_License)
