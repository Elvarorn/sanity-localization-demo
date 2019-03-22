import React from 'react'
import DeskTool from '@sanity/desk-tool/lib'

export const LanguageContext = React.createContext({
	currentLanguage: 'en',
	changeLanguage: () => {},
})

class LanguageProvider extends React.Component {
	constructor(props) {
		super(props)
		this.changeLanguage = this.changeLanguage.bind(this)
	}

	state = {
		currentLanguage: 'en',
	}

	changeLanguage(lang) {
		this.setState({
			currentLanguage: lang,
		})
	}

	render() {
		const props = this.props
		const value = {
			changeLanguage: this.changeLanguage,
			currentLanguage: this.state.currentLanguage,
		}
		return (
			<LanguageContext.Provider value={value}>
				<DeskTool.component {...props} />
			</LanguageContext.Provider>
		)
	}
}

export default {
	...DeskTool,
	component: LanguageProvider,
}
