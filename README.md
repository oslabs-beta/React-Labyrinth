<h1 align="center"><b>React Labyrinth</b></h1>
<p align="center">
  <img width="400" height="400" src="https://github.com/oslabs-beta/React-Labyrinth/assets/127361061/ca9ab4e5-cb28-4dc3-83fa-9ef47e4fdbeb" alt="react labyrinth logo">
</p>

  <h3 align="center">
    A VS Code Extension that generates a hierarchical tree of React components<br/>
    and identifies the component type with a single file upload.
    <br />
  </h3>

<div align="center">      
    <b><u><span><a href="https://marketplace.visualstudio.com/items?itemName=react-labyrinth.react-labyrinth" target="_blank">
    Install React Labyrinth</a>
    </span></u></b>
    <p><img src="https://img.shields.io/visual-studio-marketplace/v/react-labyrinth.react-labyrinth"></p>
</div>

## __Table of Contents__
1. [Overview](#overview)
2. [Installation](#installation)
3. [Getting Started](#getting-started)
4. [Tech Stack](#tech-stack)
5. [Publications](#publications)
6. [Contributing](#contributing)
7. [Meet Our Team](#meet-our-team)
8. [License](#license)

## Overview
React Server Components operate exclusively on the server, enabling tasks such as executing database queries within the component itself, rather than relying on backend requests. This paradigm distinguishes them from traditional React components, known as Client Components. However, identifying which Client Components could be optimized as Server Components isn't always straightforward, potentially leading to inefficient bundle sizes and longer time to interactive (TTI) for clients.

To address this challenge, we aim to develop a visualization tool to help developers determine their application's component types. By enhancing component-type visibility and aiding in the transition to server components, our tool empowers developers to optimize their applications effectively.

## Installation

React Labyrinth extension can be installed via the VS Code Marketplace. Start by clicking the Extensions icon in the Activity Bar on the side of VS Code or by using the View: Extensions command (Ctrl/Cmd+Shift+X). Search for 'react labyrinth' and click the "install" button. Upon completion, VS Code will have installed the extension and React Labyrinth is ready for use.

<p align="center">
  <img width="481" alt="screenshot of react labyrinth in VS Code extension store" src="https://github.com/oslabs-beta/React-Labyrinth/assets/127361061/07d5cd9b-5308-4233-bf4f-f044e40e73dd">
</p>

## Getting Started

Once React Labyrinth is installed in your VS Code, you'll notice its logo added to the Activity Bar on the left-hand side. Simply click on the React Labyrinth logo to launch the extension.
<p align="center">
  <img width="250" height="450" src="https://github.com/oslabs-beta/React-Labyrinth/assets/127361061/d72b483b-7785-4a5d-9836-9c79ff46e3a3" alt="how to activate react labyrinth extension">
</p>

Upon activation, a sidebar will appear, featuring a 'View Tree' button. Clicking this button will prompt the file explorer to open, allowing you to select the root file of your React App to load the tree structure.

Client Components will be distinguished by an orange background, while Server Components will feature a blue background for easy identification.

<p align="center">
   <img src="https://github.com/oslabs-beta/React-Labyrinth/assets/127361061/d27a3c97-3dde-457a-9ad3-9aad0f7cb469" alt="gif of using react labyrinth extension" >
</p>

## Tech Stack

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=js,ts,html,css,tailwind,babel,react,d3,jest,nodejs,webpack,git,azure,vscode)](https://skillicons.dev" alt="list of tech stack icons"/>
  </a>
</p>

## Publications

Check out our Medium articles: [Part 1](https://medium.com/@franciscoglopez49/react-labyrinth-a-helping-hand-with-react-server-components-84406d2ebf2c) and [Part 2](https://medium.com/@ashleyluu87/data-flow-from-vs-code-extension-webview-panel-react-components-2f94b881467e) for more information about React Labyrinth!


## Contributing

Contributions are the cornerstone of the open-source community, fostering an environment of learning, inspiration, and innovation. Your contributions are invaluable and greatly appreciated.

For more details and to begin exploring React Labyrinth, visit its [LinkedIn page](https://www.linkedin.com/company/react-labyrinth). These resources offer comprehensive insights into the project, its functionality, key features, and how to get started.

Furthermore, you can access the project's source code, documentation, and issue tracker on GitHub. Feel free to fork the project, implement changes, and submit pull requests to enhance its development.

If you find React Labyrinth beneficial, consider starring it on GitHub to boost its visibility and attract more contributors and users. Your support is crucial in advancing the project's growth and impact.

[Request Feature / Report Bug](https://github.com/oslabs-beta/React-Labyrinth/issues)

## Meet Our Team

* Ashley Luu — [Github](https://github.com/ash-t-luu) & [LinkedIn](https://www.linkedin.com/in/ashley-t-luu/)
* Christina Raether — [Github](https://github.com/ChristinaRaether) & [LinkedIn](https://www.linkedin.com/in/christinaraether/)
* Francisco Lopez — [Github](https://github.com/Ponch49) & [LinkedIn](https://www.linkedin.com/in/francisco-g-lopez/)
* Johnny Arroyo — [Github](https://github.com/Johnny-Arroyo) & [LinkedIn](https://www.linkedin.com/in/johnny-arroyo/)
* Louis Kuczykowski — [Github](https://github.com/Louka3) & [LinkedIn](https://www.linkedin.com/in/louiskuczykowski/)


## License

React Labyrinth is developed under the [MIT license](https://en.wikipedia.org/wiki/MIT_License)
