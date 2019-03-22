import * as React from 'react'
import Field from '@sanity/form-builder/lib/inputs/ObjectInput/Field'
import PatchEvent, { set, setIfMissing, unset } from '@sanity/form-builder/lib/PatchEvent'
import DefaultLabel from 'part:@sanity/components/labels/default'
import { LanguageContext } from './index'

class LocaleComponent extends React.Component {
	handleFieldChange = (fieldEvent, field) => {
		const { onChange, type, value, isRoot } = this.props

		let event = fieldEvent.prefixAll(field.name)

		if (!isRoot) {
			event = event.prepend(setIfMissing(type.name === 'object' ? {} : { _type: type.name }))
			if (value) {
				const valueTypeName = value && value._type
				const schemaTypeName = type.name

				// eslint-disable-next-line max-depth
				if (valueTypeName && schemaTypeName === 'object') {
					// The value has a _type key, but the type name from schema is 'object',
					// but _type: 'object' is implicit so we should fix it by removing it
					event = event.prepend(unset(['_type']))
				} else if (schemaTypeName !== 'object' && valueTypeName !== schemaTypeName) {
					// There's a mismatch between schema type and the value _type
					// fix it by setting _type to type name defined in schema
					event = event.prepend(set(schemaTypeName, ['_type']))
				}
			}
		}
		onChange(event)
	}

	switchLangHandler = (lang) => () => {
		this.props.language.changeLanguage(lang)
	}

	renderField(field, level, index) {
		const { type, value, markers, readOnly, focusPath, onFocus, onBlur, filterField } = this.props

		if (!filterField(type, field) || field.type.hidden) {
			return null
		}

		const fieldLang = field.name
		const currentLang = this.props.language.currentLanguage

		const style = fieldLang === currentLang ? { display: 'block' } : { display: 'none' }

		const fieldValue = value && value[field.name]
		return (
			<div style={style} key={field.name}>
				<Field
					key={field.name}
					field={field}
					value={fieldValue}
					onChange={this.handleFieldChange}
					onFocus={onFocus}
					onBlur={onBlur}
					markers={markers}
					focusPath={focusPath}
					level={level}
					readOnly={readOnly}
					filterField={filterField}
					ref={index === 0 && this.setFirstField}
				/>
			</div>
		)
	}

	render() {
		if (!this.props.type) return null
		const { level, type } = this.props
		return (
			<React.Fragment>
				<DefaultLabel level={level}>{type.title}</DefaultLabel>
				<div>
					<h5>Change Language:</h5>
					<button type="button" onClick={this.switchLangHandler('en')}>
						English
					</button>
					<button type="button" onClick={this.switchLangHandler('es')}>
						Spanish
					</button>
					<button type="button" onClick={this.switchLangHandler('de')}>
						German
					</button>
				</div>
				{this.props.type.fields.map((field, i) => this.renderField(field, level + 2, i))}
			</React.Fragment>
		)
	}
}

const ContextWrapper = (props) => (
	<LanguageContext.Consumer>{(language) => <LocaleComponent language={language} {...props} />}</LanguageContext.Consumer>
)

LocaleComponent.contextType = LanguageContext

const langs = [
	{
		name: 'English',
		code: 'en',
		default: true,
	},
	{
		name: 'Spanish',
		code: 'es',
	},
	{
		name: 'German',
		code: 'de',
	},
]

export const localizeField = (field) => {
	if (field.localize === false) return field

	const localizedFields = langs.map((lang) => ({
		...field,
		title: lang.name,
		name: lang.code,
	}))

	return {
		...field,
		type: 'object',
		fields: localizedFields,
		inputComponent: ContextWrapper,
	}
}
