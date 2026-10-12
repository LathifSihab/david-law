import type { Artist } from '#lib/types.js';

// docs/03. Placeholder artists are invented and not meant to refer to real people.
export const artists: Artist[] = [
	{
		slug: 'david-law',
		name: 'David Law',
		basedIn: 'Parijs',
		shortBio: "Fotograaf uit Parijs die iconen uit de rockmuziek herbouwt uit duizenden foto's.",
		bio: [
			// TODO: replace with the official bio once received (docs/08 Q1).
			// Until then keep it to facts we can see in the material. Do not invent biography.
			"David Law is een fotograaf gevestigd in Parijs. In zijn Crypto Rock Special Series reconstrueert hij portretten van muzikanten uit honderden foto's van de afgebeelde artiest zelf."
		],
		isDemo: false
	},
	{
		slug: 'lotte-vanderzande',
		name: 'Lotte Vanderzande',
		basedIn: 'Gent',
		shortBio: 'Schildert brede, gelaagde vlakken in acryl, geïnspireerd op getijden en kustlicht.',
		bio: [
			'Lotte Vanderzande werkt in grote formaten en bouwt haar doeken op uit dunne, transparante lagen acrylverf. In de reeks Getijde onderzoekt ze hoe licht en water elkaar steeds opnieuw verschuiven. (Demo-kunstenaar)'
		],
		isDemo: true
	},
	{
		slug: 'milan-okafor-peeters',
		name: 'Milan Okafor-Peeters',
		basedIn: 'Antwerpen',
		shortBio: 'Olieverfschilder van stille, geometrische binnenruimtes en noordelijk licht.',
		bio: [
			'Milan Okafor-Peeters schildert in olieverf op paneel en doek. Zijn composities zijn teruggebracht tot een paar strakke kleurvlakken die samen een ruimte of een moment van de dag oproepen. (Demo-kunstenaar)'
		],
		isDemo: true
	},
	{
		slug: 'ines-marrot',
		name: 'Inès Marrot',
		basedIn: 'Lille',
		shortBio: 'Maakt collages en gemengde technieken op papier uit gevonden fragmenten.',
		bio: [
			'Inès Marrot verzamelt papier, verpakkingen en drukproeven en verwerkt ze tot gelaagde collages. Elk Fragment is een studie in kleur, gewicht en toeval. (Demo-kunstenaar)'
		],
		isDemo: true
	},
	{
		slug: 'ward-stoffels',
		name: 'Ward Stoffels',
		basedIn: 'Brussel',
		shortBio: 'Zeefdrukker die met rasters, cirkels en kleine verschuivingen werkt.',
		bio: [
			'Ward Stoffels drukt zijn werk met de hand in kleine oplages. De kleine onregelmatigheden van het zeefdrukproces zijn voor hem geen fout maar het eigenlijke onderwerp. (Demo-kunstenaar)'
		],
		isDemo: true
	},
	{
		slug: 'yuna-breckx',
		name: 'Yuna Breckx',
		basedIn: 'Oostende',
		shortBio: 'Fotografeert de zee tot er alleen nog kleur en lijn overblijven.',
		bio: [
			'Yuna Breckx werkt met lange sluitertijden aan de Noordzeekust. Haar pigmentprints op dibond tonen water en lucht als opeenvolgende banden van tint. (Demo-kunstenaar)'
		],
		isDemo: true
	},
	// Task 3b: three more invented artists (docs/03).
	{
		slug: 'noor-el-amrani',
		name: 'Noor El Amrani',
		basedIn: 'Mechelen',
		shortBio: 'Schildert warme, vlakke landschappen waarin zon en horizon samenvallen.',
		bio: [
			'Noor El Amrani schildert in olieverf, met een palet van zand, oker en terracotta. Haar landschappen zijn teruggebracht tot een horizon, een schijf en een paar bogen: meer een temperatuur dan een plek. (Demo-kunstenaar)'
		],
		isDemo: true
	},
	{
		slug: 'pieter-jan-lauwers',
		name: 'Pieter-Jan Lauwers',
		basedIn: 'Antwerpen',
		shortBio: 'Fotograaf van havens en dokken in grijstinten, vaak bij het eerste licht.',
		bio: [
			'Pieter-Jan Lauwers fotografeert de haven van Antwerpen in zwart-wit. Hij werkt vroeg in de ochtend, wanneer kranen en loodsen nog vlakke silhouetten zijn tegen een grijze lucht. (Demo-kunstenaar)'
		],
		isDemo: true
	},
	{
		slug: 'sanne-dewulf',
		name: 'Sanne Dewulf',
		basedIn: 'Leuven',
		shortBio: 'Tekent met inkt en houtskool, lijn na lijn, tot er een beweging ontstaat.',
		bio: [
			'Sanne Dewulf maakt tekeningen uit honderden fijne lijnen, getrokken in één beweging. Haar Lijnstudies en de reeks Wolkenatlas gaan over ritme, herhaling en de kleine afwijkingen van de hand. (Demo-kunstenaar)'
		],
		isDemo: true
	}
];

const bySlug = new Map(artists.map((artist) => [artist.slug, artist]));

export function getArtist(slug: string): Artist | undefined {
	return bySlug.get(slug);
}
