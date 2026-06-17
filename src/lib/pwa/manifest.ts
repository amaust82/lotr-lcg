export const manifest = {
	name: 'LOTR LCG Wayfellow',
	short_name: 'LOTR LCG',
	description: 'Turn guide and rules reference for the Lord of the Rings Living Card Game.',
	theme_color: '#201d18',
	background_color: '#201d18',
	display: 'standalone' as const,
	start_url: '/turn-guide',
	scope: '/',
	icons: [
		{
			src: '/icons/pwa-64x64.png',
			sizes: '64x64',
			type: 'image/png'
		},
		{
			src: '/icons/pwa-192x192.png',
			sizes: '192x192',
			type: 'image/png'
		},
		{
			src: '/icons/pwa-512x512.png',
			sizes: '512x512',
			type: 'image/png'
		},
		{
			src: '/icons/maskable-icon-512x512.png',
			sizes: '512x512',
			type: 'image/png',
			purpose: 'maskable' as const
		}
	]
};
