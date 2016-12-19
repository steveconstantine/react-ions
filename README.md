# React{ions}

[ ![Circle CI Status for GetAmbassador/react-ions](https://circleci.com/gh/GetAmbassador/react-ions.svg?style=shield&circle-token=d8458a09c88aa541c37a7d45b471f48c14cb6a71)](https://circleci.com/)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e8a2a7c1977a4bc480defb75d598d4f1)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=GetAmbassador/react-ions&amp;utm_campaign=Badge_Grade)

**React{ions}** is a suite of React components that implement Ambassador's Design and UX patterns. They are designed to be re-usable and composable across large-scale web applications.

Check out our [documentation site](http://react-ions.herokuapp.com/) for live examples.

## Installation
Ambassador's React{ions} is available as an [npm package](https://npmjs.com/react-ions).

`$ npm install react-ions`

### Run the app:
`$ npm start`

Point your browser to **http://localhost:3000**

### Usage
Using Ambassador's react components is very straightforward.

	import React from 'react'
	import Button from 'react-ions/lib/Button'

	const MyComponent = () => (
	  <Button />
	);

	export default MyComponent

### License
This project is licensed under the terms of the [MIT license](LICENSE)

### Release Process
1. Checkout / pull latest master branch
2. Create a new branch (named like `release_v0_0_5`)
3. Run: `$ npm run build:release`
4. Run: `$ npm version <semantic_version> (ex: 0.57.0)`
5. Edit `CHANGELOG.md` to reflect changes since last release
6. Ping someone to review `CHANGELOG.md`
3. Create a pull request for this branch
7. Merge pull request
8. Create release on Github
9. Run: `$ npm publish`
10. Ensure new version is published: [https://npmjs.com/react-ions](https://npmjs.com/react-ions)
