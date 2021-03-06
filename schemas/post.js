import { localizeField } from '../plugins/localized/localizeField'

const post = {
	name: 'post',
	title: 'Post',
	type: 'document',
	fields: [
		localizeField({
			name: 'title',
			title: 'Title',
			type: 'string',
		}),
		localizeField({
			name: 'body',
			title: 'Body',
			type: 'blockContent',
		}),
		{
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			localize: false,
			options: {
				source: 'title',
				maxLength: 96,
			},
		},
		{
			name: 'author',
			title: 'Author',
			type: 'reference',
			to: { type: 'author' },
		},
		{
			name: 'mainImage',
			title: 'Main image',
			type: 'image',
			options: {
				hotspot: true,
			},
		},
		{
			name: 'categories',
			title: 'Categories',
			type: 'array',
			of: [{ type: 'reference', to: { type: 'category' } }],
		},
		{
			name: 'publishedAt',
			title: 'Published at',
			type: 'datetime',
		},
	],

	preview: {
		select: {
			title: 'title',
			author: 'author.name',
			media: 'mainImage',
		},
		prepare(selection) {
			const { author } = selection
			return Object.assign({}, selection, {
				subtitle: author && `by ${author}`,
			})
		},
	},
}

export default post
