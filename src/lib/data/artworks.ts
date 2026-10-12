import type { Artwork, ArtworkImage } from '#lib/types.js';

const DL = '/artworks/david-law-crypto-nick-cave-vi';

/** A generated abstract placeholder (scripts/generate-placeholders.ts). Same file for tile and detail. */
function placeholderImage(
	file: string,
	width: number,
	height: number,
	alt: string
): ArtworkImage[] {
	const src = `/placeholders/${file}.svg`;
	return [{ src, thumb: src, width, height, alt, role: 'main' }];
}

export const artworks: Artwork[] = [
	// The one real work. Source: Carl's folder. Private items (certificate scan, registration
	// numbers, contact details) are deliberately left out: see docs/07.
	{
		id: 'CR-0001',
		slug: 'david-law-crypto-nick-cave-vi',
		title: 'Crypto Nick Cave VI',
		artistSlug: 'david-law',
		series: 'Crypto Rock Special Series',
		year: 2023, // TODO confirm: description says April 2023, certificate says Paris 2024 (docs/08 Q2)
		technique: 'Fotografische compositie',
		support: 'Print op wit vinyl, gelamineerd op twee aluminium platen',
		widthCm: 60,
		heightCm: 90,
		edition: { size: 8, artistProofs: 4, label: '1/4 E.A.' },
		signed: true,
		signatureNote: 'Genummerd en gesigneerd op de achterzijde',
		certificate: true,
		description:
			"Uit de Crypto Rock Special Series: een portret van Nick Cave, gereconstrueerd uit honderden foto's van de afgebeelde kunstenaar zelf. Van op afstand een krachtig, donker portret; van dichtbij een mozaïek van beelden.",
		details: [
			'Beperkte oplage van 8 exemplaren en 4 artist proofs (E.A.)',
			'Bevestiging aan de achterzijde, klaar om op te hangen',
			'Flexibele laminering aan de voorzijde ter bescherming tegen uv en vocht'
		],
		priceEur: undefined, // auction lot, see auctions.ts
		status: 'veiling',
		auctionSlug: 'crypto-nick-cave-vi',
		featured: true,
		addedAt: '2026-10-09',
		isDemo: false,
		images: [
			{
				src: `${DL}/main.webp`,
				thumb: `${DL}/main-thumb.webp`,
				width: 369,
				height: 751,
				role: 'main',
				alt: "Crypto Nick Cave VI van David Law: portret van Nick Cave in donker pak tegen een zwarte achtergrond, opgebouwd uit een mozaïek van kleine foto's"
			},
			{
				src: `${DL}/detail-face.webp`,
				thumb: `${DL}/detail-face-thumb.webp`,
				width: 653,
				height: 803,
				role: 'detail',
				alt: "Detail van het gezicht, waarin de afzonderlijke mozaïekfoto's zichtbaar worden"
			},
			{
				src: `${DL}/detail-mosaic.webp`,
				thumb: `${DL}/detail-mosaic-thumb.webp`,
				width: 1162,
				height: 833,
				role: 'detail',
				alt: "Close-up van kraag en kin: honderden kleine foto's vormen samen het beeld"
			},
			{
				src: `${DL}/detail-hand.webp`,
				thumb: `${DL}/detail-hand-thumb.webp`,
				width: 320,
				height: 768,
				role: 'detail',
				alt: 'Detail van de opgestoken hand'
			},
			{
				src: `${DL}/signature.webp`,
				thumb: `${DL}/signature-thumb.webp`,
				width: 493,
				height: 213,
				role: 'signature',
				alt: 'Handtekening van David Law'
			}
		]
	},

	// Placeholder works (docs/03). Invented artists and titles, generated abstract images.
	{
		id: 'D-01',
		slug: 'lotte-vanderzande-getijde-i',
		title: 'Getijde I',
		artistSlug: 'lotte-vanderzande',
		series: 'Getijde',
		year: 2022,
		technique: 'Acrylverf',
		support: 'Doek',
		widthCm: 80,
		heightCm: 100,
		signed: true,
		signatureNote: 'Gesigneerd op de achterzijde',
		certificate: true,
		description:
			'Brede, licht hellende banden in grijsgroen en zand, opgebouwd uit dunne lagen acryl. Het eerste doek uit de reeks Getijde, waarin de horizon nooit helemaal stil blijft liggen.',
		priceEur: 1450,
		status: 'te-koop',
		addedAt: '2026-09-02',
		isDemo: true,
		images: placeholderImage(
			'lotte-vanderzande-getijde-i',
			960,
			1200,
			'Abstracte demo-afbeelding: horizontale banden in grijsgroen, leisteen en zand'
		)
	},
	{
		id: 'D-02',
		slug: 'lotte-vanderzande-getijde-ii',
		title: 'Getijde II',
		artistSlug: 'lotte-vanderzande',
		series: 'Getijde',
		year: 2022,
		technique: 'Acrylverf',
		support: 'Doek',
		widthCm: 80,
		heightCm: 100,
		signed: true,
		signatureNote: 'Gesigneerd op de achterzijde',
		certificate: true,
		description:
			'Dezelfde compositie als Getijde I, maar in de paarsgrijze tinten van een avond aan zee. Samen vormen de twee doeken een tweeluik over hetzelfde uur op verschillende dagen.',
		priceEur: 1450,
		status: 'verkocht',
		addedAt: '2026-09-02',
		isDemo: true,
		images: placeholderImage(
			'lotte-vanderzande-getijde-ii',
			960,
			1200,
			'Abstracte demo-afbeelding: horizontale banden in paarsgrijs en zacht roze'
		)
	},
	{
		id: 'D-03',
		slug: 'milan-okafor-peeters-stille-kamer',
		title: 'Stille kamer',
		artistSlug: 'milan-okafor-peeters',
		year: 2024,
		technique: 'Olieverf',
		support: 'Paneel',
		widthCm: 40,
		heightCm: 40,
		signed: true,
		signatureNote: 'Gesigneerd rechtsonder',
		certificate: true,
		description:
			'Een kamer teruggebracht tot twee wanden, een donker vlak en een smalle strook licht. Klein van formaat, maar met een opvallende rust en diepte.',
		priceEur: 980,
		status: 'te-koop',
		addedAt: '2026-10-01',
		isDemo: true,
		images: placeholderImage(
			'milan-okafor-peeters-stille-kamer',
			1200,
			1200,
			'Abstracte demo-afbeelding: twee bruine kleurvlakken met een donker blok en een lichte strook'
		)
	},
	{
		id: 'D-04',
		slug: 'milan-okafor-peeters-noordlicht-oostende',
		title: 'Noordlicht, Oostende',
		artistSlug: 'milan-okafor-peeters',
		year: 2023,
		technique: 'Olieverf',
		support: 'Doek',
		widthCm: 120,
		heightCm: 90,
		signed: true,
		signatureNote: 'Gesigneerd op de achterzijde',
		certificate: true,
		description:
			'Het koele licht van een winterochtend aan de kust, vertaald naar strakke vlakken in groen en kalk. Het grootste werk van de kunstenaar tot nu toe.',
		priceEur: undefined,
		status: 'op-aanvraag',
		addedAt: '2026-09-18',
		isDemo: true,
		images: placeholderImage(
			'milan-okafor-peeters-noordlicht-oostende',
			1200,
			900,
			'Abstracte demo-afbeelding: groene kleurvlakken met een donker blok en een dunne horizontale lijn'
		)
	},
	{
		id: 'D-05',
		slug: 'ines-marrot-fragment-12',
		title: 'Fragment 12',
		artistSlug: 'ines-marrot',
		series: 'Fragmenten',
		year: 2021,
		technique: 'Gemengde techniek',
		support: 'Papier',
		widthCm: 50,
		heightCm: 70,
		signed: true,
		signatureNote: 'Gesigneerd en gedateerd rechtsonder',
		certificate: false,
		description:
			'Overlappende snippers in roest en oker, vastgezet met dunne getrokken lijnen. Een werk dat bij elke blik een andere volgorde lijkt te hebben.',
		priceEur: 640,
		status: 'te-koop',
		addedAt: '2026-09-25',
		isDemo: true,
		images: placeholderImage(
			'ines-marrot-fragment-12',
			857,
			1200,
			'Abstracte demo-afbeelding: gedraaide rechthoeken in roest en bruin op crèmekleurig papier'
		)
	},
	{
		id: 'D-06',
		slug: 'ines-marrot-fragment-19',
		title: 'Fragment 19',
		artistSlug: 'ines-marrot',
		series: 'Fragmenten',
		year: 2021,
		technique: 'Gemengde techniek',
		support: 'Papier',
		widthCm: 50,
		heightCm: 70,
		signed: true,
		signatureNote: 'Gesigneerd en gedateerd rechtsonder',
		certificate: false,
		description:
			'Een koelere variant uit dezelfde reeks, in grijs en violet. De fragmenten lijken net boven het papier te zweven.',
		priceEur: 640,
		status: 'te-koop',
		addedAt: '2026-09-25',
		isDemo: true,
		images: placeholderImage(
			'ines-marrot-fragment-19',
			857,
			1200,
			'Abstracte demo-afbeelding: gedraaide rechthoeken in grijs en violet op licht papier'
		)
	},
	{
		id: 'D-07',
		slug: 'ward-stoffels-zonder-titel-blauw',
		title: 'Zonder titel (blauw)',
		artistSlug: 'ward-stoffels',
		year: 2020,
		technique: 'Zeefdruk',
		support: 'Papier',
		widthCm: 70,
		heightCm: 100,
		edition: { size: 30, label: '12/30' },
		signed: true,
		signatureNote: 'Genummerd en gesigneerd in potlood',
		certificate: true,
		description:
			'Zeven concentrische cirkels in blauw, elk met de hand gedrukt en net niet in register. Juist die kleine verschuivingen geven de druk zijn trilling.',
		priceEur: undefined, // auction lot, see auctions.ts
		status: 'veiling',
		auctionSlug: 'demo-veiling-2',
		addedAt: '2026-09-10',
		isDemo: true,
		images: placeholderImage(
			'ward-stoffels-zonder-titel-blauw',
			840,
			1200,
			'Abstracte demo-afbeelding: concentrische cirkels in donker- en lichtblauw op grijs papier'
		)
	},
	{
		id: 'D-08',
		slug: 'ward-stoffels-raster-3',
		title: 'Raster 3',
		artistSlug: 'ward-stoffels',
		year: 2025,
		technique: 'Zeefdruk',
		support: 'Papier',
		widthCm: 50,
		heightCm: 50,
		edition: { size: 20, label: '4/20' },
		signed: true,
		signatureNote: 'Genummerd en gesigneerd in potlood',
		certificate: true,
		description:
			'Een raster van vierkanten en cirkels in oker en zwart, met hier en daar een lege plek. Het derde blad uit een reeks over herhaling en toeval.',
		priceEur: 420,
		status: 'te-koop',
		addedAt: '2026-10-05',
		isDemo: true,
		images: placeholderImage(
			'ward-stoffels-raster-3',
			1200,
			1200,
			'Abstracte demo-afbeelding: raster van vierkanten en cirkels in oker, bruin en zwart'
		)
	},
	{
		id: 'D-09',
		slug: 'yuna-breckx-hoogwater',
		title: 'Hoogwater',
		artistSlug: 'yuna-breckx',
		year: 2024,
		technique: 'Fotografie',
		support: 'Pigmentprint op dibond',
		widthCm: 60,
		heightCm: 120,
		signed: true,
		signatureNote: 'Gesigneerd op een label aan de achterzijde',
		certificate: true,
		description:
			'Een hoog, smal beeld waarin water en lucht oplossen in banden van blauw. Gemaakt met een lange sluitertijd bij springtij.',
		priceEur: 1900,
		status: 'te-koop',
		featured: true,
		addedAt: '2026-10-03',
		isDemo: true,
		images: placeholderImage(
			'yuna-breckx-hoogwater',
			600,
			1200,
			'Abstracte demo-afbeelding: getrapte horizontale banden van donker- naar lichtblauw'
		)
	},
	{
		id: 'D-10',
		slug: 'yuna-breckx-laagwater',
		title: 'Laagwater',
		artistSlug: 'yuna-breckx',
		year: 2024,
		technique: 'Fotografie',
		support: 'Pigmentprint op dibond',
		widthCm: 120,
		heightCm: 60,
		signed: true,
		signatureNote: 'Gesigneerd op een label aan de achterzijde',
		certificate: true,
		description:
			'De liggende tegenhanger van Hoogwater, bij eb op hetzelfde strand. Groen en zand in plaats van blauw.',
		priceEur: undefined, // upcoming auction lot, see auctions.ts
		status: 'veiling',
		auctionSlug: 'demo-veiling-3',
		addedAt: '2026-10-03',
		isDemo: true,
		images: placeholderImage(
			'yuna-breckx-laagwater',
			1200,
			600,
			'Abstracte demo-afbeelding: getrapte horizontale banden in grijsgroen en zand'
		)
	},
	{
		id: 'D-11',
		slug: 'lotte-vanderzande-getijde-iii',
		title: 'Getijde III',
		artistSlug: 'lotte-vanderzande',
		series: 'Getijde',
		year: 2025,
		technique: 'Acrylverf',
		support: 'Doek',
		widthCm: 100,
		heightCm: 150,
		signed: true,
		signatureNote: 'Gesigneerd op de achterzijde',
		certificate: true,
		description:
			'Het grootste doek uit de reeks: een staand formaat waarin de banden zich als golven opstapelen. Drie jaar na de eerste twee werken keert de kunstenaar terug naar hetzelfde thema.',
		priceEur: 2600,
		status: 'te-koop',
		featured: true,
		addedAt: '2026-10-07',
		isDemo: true,
		images: placeholderImage(
			'lotte-vanderzande-getijde-iii',
			800,
			1200,
			'Abstracte demo-afbeelding: horizontale banden in leisteenblauw, grijsgroen en zand'
		)
	},

	// Task 3b: marketplace inventory (docs/03, D-12 to D-23).
	{
		id: 'D-12',
		slug: 'noor-el-amrani-woestijnkleur-1',
		title: 'Woestijnkleur 1',
		artistSlug: 'noor-el-amrani',
		series: 'Woestijnkleur',
		year: 2023,
		technique: 'Olieverf',
		support: 'Doek',
		widthCm: 90,
		heightCm: 90,
		signed: true,
		signatureNote: 'Gesigneerd op de achterzijde',
		certificate: true,
		description:
			'Een oranje schijf die net in een zandkleurige horizon zakt, omringd door dunne bogen. Het eerste doek uit een tweeluik over de laatste minuten van een warme dag.',
		priceEur: 1750,
		status: 'te-koop',
		addedAt: '2026-09-28',
		isDemo: true,
		images: placeholderImage(
			'noor-el-amrani-woestijnkleur-1',
			1200,
			1200,
			'Abstracte demo-afbeelding: oranje schijf achter een zandkleurige horizon met dunne bogen'
		)
	},
	{
		id: 'D-13',
		slug: 'noor-el-amrani-woestijnkleur-2',
		title: 'Woestijnkleur 2',
		artistSlug: 'noor-el-amrani',
		series: 'Woestijnkleur',
		year: 2023,
		technique: 'Olieverf',
		support: 'Doek',
		widthCm: 90,
		heightCm: 90,
		signed: true,
		signatureNote: 'Gesigneerd op de achterzijde',
		certificate: true,
		description:
			'De tweede helft van het tweeluik, in diepere terracottatinten. De zon staat lager en de bogen liggen dichter op elkaar.',
		priceEur: undefined, // auction lot, see auctions.ts
		status: 'veiling',
		auctionSlug: 'demo-veiling-4',
		addedAt: '2026-09-28',
		isDemo: true,
		images: placeholderImage(
			'noor-el-amrani-woestijnkleur-2',
			1200,
			1200,
			'Abstracte demo-afbeelding: terracotta schijf achter een warme horizon met dunne bogen'
		)
	},
	{
		id: 'D-14',
		slug: 'noor-el-amrani-middaghitte',
		title: 'Middaghitte',
		artistSlug: 'noor-el-amrani',
		year: 2025,
		technique: 'Olieverf',
		support: 'Doek',
		widthCm: 140,
		heightCm: 100,
		signed: true,
		signatureNote: 'Gesigneerd op de achterzijde',
		certificate: true,
		description:
			'Een breed liggend doek waarin de zon bijna de hele hemel vult. Het grootste en lichtste werk van de kunstenaar tot nu toe.',
		priceEur: 3200,
		status: 'te-koop',
		featured: true,
		addedAt: '2026-10-08',
		isDemo: true,
		images: placeholderImage(
			'noor-el-amrani-middaghitte',
			1200,
			857,
			'Abstracte demo-afbeelding: brede oranje schijf boven een okerkleurige horizon'
		)
	},
	{
		id: 'D-15',
		slug: 'pieter-jan-lauwers-haven-05-40',
		title: 'Haven, 05:40',
		artistSlug: 'pieter-jan-lauwers',
		year: 2022,
		technique: 'Fotografie',
		support: 'Zilvergelatinedruk',
		widthCm: 40,
		heightCm: 50,
		signed: true,
		signatureNote: 'Gesigneerd en gedateerd op de achterzijde',
		certificate: true,
		description:
			'Een loods en een kade, nog bijna zonder licht, afgedrukt in de donkere kamer. De tijd in de titel is het moment van de opname.',
		priceEur: 750,
		status: 'te-koop',
		featured: true,
		addedAt: '2026-10-06',
		isDemo: true,
		images: placeholderImage(
			'pieter-jan-lauwers-haven-05-40',
			960,
			1200,
			'Abstracte demo-afbeelding: getrapte grijstinten met een donker rechthoekig silhouet'
		)
	},
	{
		id: 'D-16',
		slug: 'pieter-jan-lauwers-dok-7',
		title: 'Dok 7',
		artistSlug: 'pieter-jan-lauwers',
		year: 2023,
		technique: 'Fotografie',
		support: 'Pigmentprint',
		widthCm: 100,
		heightCm: 70,
		edition: { size: 7, label: '3/7' },
		signed: true,
		signatureNote: 'Genummerd en gesigneerd op een label aan de achterzijde',
		certificate: true,
		description:
			'Een leeg dok bij laagtij, met de kaaimuur als één donker vlak. Een van de meest gevraagde beelden uit de havenreeks.',
		priceEur: undefined, // auction lot, see auctions.ts
		status: 'veiling',
		auctionSlug: 'demo-veiling-5',
		addedAt: '2026-09-21',
		isDemo: true,
		images: placeholderImage(
			'pieter-jan-lauwers-dok-7',
			1200,
			840,
			'Abstracte demo-afbeelding: brede grijze banden met een donker blok onderaan'
		)
	},
	{
		id: 'D-17',
		slug: 'pieter-jan-lauwers-mist-over-de-schelde',
		title: 'Mist over de Schelde',
		artistSlug: 'pieter-jan-lauwers',
		year: 2024,
		technique: 'Fotografie',
		support: 'Pigmentprint op dibond',
		widthCm: 150,
		heightCm: 100,
		signed: true,
		signatureNote: 'Gesigneerd op een label aan de achterzijde',
		certificate: true,
		description:
			'De rivier verdwijnt in een dikke mist; alleen een kraan aan de rand blijft scherp. Op groot formaat afgedrukt, bedoeld voor een ruime wand.',
		priceEur: undefined,
		status: 'op-aanvraag',
		addedAt: '2026-09-14',
		isDemo: true,
		images: placeholderImage(
			'pieter-jan-lauwers-mist-over-de-schelde',
			1200,
			800,
			'Abstracte demo-afbeelding: lichte grijze banden met een donker blok aan de rechterrand'
		)
	},
	{
		id: 'D-18',
		slug: 'sanne-dewulf-lijnstudie-4',
		title: 'Lijnstudie 4',
		artistSlug: 'sanne-dewulf',
		series: 'Lijnstudies',
		year: 2024,
		technique: 'Inkt',
		support: 'Papier',
		widthCm: 30,
		heightCm: 40,
		signed: true,
		signatureNote: 'Gesigneerd rechtsonder in potlood',
		certificate: false,
		description:
			'Tientallen golvende inktlijnen, elk in één haal getrokken. Waar ze samenkomen ontstaat een donkere stroom.',
		priceEur: 290,
		status: 'te-koop',
		addedAt: '2026-10-04',
		isDemo: true,
		images: placeholderImage(
			'sanne-dewulf-lijnstudie-4',
			900,
			1200,
			'Abstracte demo-afbeelding: fijne golvende inktlijnen op crèmekleurig papier'
		)
	},
	{
		id: 'D-19',
		slug: 'sanne-dewulf-lijnstudie-9',
		title: 'Lijnstudie 9',
		artistSlug: 'sanne-dewulf',
		series: 'Lijnstudies',
		year: 2024,
		technique: 'Inkt',
		support: 'Papier',
		widthCm: 30,
		heightCm: 40,
		signed: true,
		signatureNote: 'Gesigneerd rechtsonder in potlood',
		certificate: false,
		description:
			'Een rustiger blad uit dezelfde reeks, met wijdere tussenruimtes. De lijnen lijken te ademen.',
		priceEur: 290,
		status: 'verkocht',
		addedAt: '2026-10-04',
		isDemo: true,
		images: placeholderImage(
			'sanne-dewulf-lijnstudie-9',
			900,
			1200,
			'Abstracte demo-afbeelding: ruim verspreide golvende lijnen op licht papier'
		)
	},
	{
		id: 'D-20',
		slug: 'sanne-dewulf-wolkenatlas',
		title: 'Wolkenatlas',
		artistSlug: 'sanne-dewulf',
		year: 2025,
		technique: 'Houtskool',
		support: 'Papier',
		widthCm: 70,
		heightCm: 100,
		signed: true,
		signatureNote: 'Gesigneerd en gedateerd rechtsonder',
		certificate: true,
		description:
			'Een groot blad waarin honderden lijnen samen een wolkenveld vormen. Het eerste werk waarin de kunstenaar van inkt naar houtskool overstapt.',
		priceEur: undefined, // auction lot, see auctions.ts
		status: 'veiling',
		auctionSlug: 'demo-veiling-6',
		addedAt: '2026-09-30',
		isDemo: true,
		images: placeholderImage(
			'sanne-dewulf-wolkenatlas',
			840,
			1200,
			'Abstracte demo-afbeelding: dichte bundels golvende lijnen in grijs op papier'
		)
	},
	{
		id: 'D-21',
		slug: 'ward-stoffels-raster-5',
		title: 'Raster 5',
		artistSlug: 'ward-stoffels',
		year: 2025,
		technique: 'Zeefdruk',
		support: 'Papier',
		widthCm: 50,
		heightCm: 50,
		edition: { size: 20, label: '7/20' },
		signed: true,
		signatureNote: 'Genummerd en gesigneerd in potlood',
		certificate: true,
		description:
			'Hetzelfde raster als Raster 3, nu in blauwtinten gedrukt. Naast elkaar gehangen vormen de twee bladen een paar.',
		priceEur: 420,
		status: 'te-koop',
		addedAt: '2026-10-05',
		isDemo: true,
		images: placeholderImage(
			'ward-stoffels-raster-5',
			1200,
			1200,
			'Abstracte demo-afbeelding: raster van vierkanten en cirkels in blauwtinten'
		)
	},
	{
		id: 'D-22',
		slug: 'ines-marrot-fragment-23',
		title: 'Fragment 23',
		artistSlug: 'ines-marrot',
		series: 'Fragmenten',
		year: 2022,
		technique: 'Gemengde techniek',
		support: 'Papier',
		widthCm: 50,
		heightCm: 70,
		signed: true,
		signatureNote: 'Gesigneerd en gedateerd rechtsonder',
		certificate: false,
		description:
			'Een collage in oker en olijf, opgebouwd uit oude drukproeven. Warmer en dichter dan de eerdere Fragmenten.',
		priceEur: 690,
		status: 'te-koop',
		addedAt: '2026-09-25',
		isDemo: true,
		images: placeholderImage(
			'ines-marrot-fragment-23',
			857,
			1200,
			'Abstracte demo-afbeelding: gedraaide rechthoeken in oker en olijfgroen op licht papier'
		)
	},
	{
		id: 'D-23',
		slug: 'milan-okafor-peeters-atelier-winter',
		title: 'Atelier, winter',
		artistSlug: 'milan-okafor-peeters',
		year: 2025,
		technique: 'Olieverf',
		support: 'Paneel',
		widthCm: 30,
		heightCm: 40,
		signed: true,
		signatureNote: 'Gesigneerd rechtsonder',
		certificate: true,
		description:
			'Het atelier van de kunstenaar op een grijze wintermiddag, gevangen in drie kleurvlakken. Een klein, intiem paneel.',
		priceEur: 850,
		status: 'te-koop',
		addedAt: '2026-10-10',
		isDemo: true,
		images: placeholderImage(
			'milan-okafor-peeters-atelier-winter',
			900,
			1200,
			'Abstracte demo-afbeelding: paarsgrijze kleurvlakken met een donker blok en een lichte strook'
		)
	}
];

/** Home page order: hero first, then the featured row (docs/03). */
const FEATURED_ORDER = ['CR-0001', 'D-11', 'D-14', 'D-09', 'D-15'];

const bySlug = new Map(artworks.map((artwork) => [artwork.slug, artwork]));
const byId = new Map(artworks.map((artwork) => [artwork.id, artwork]));

export function getArtwork(slug: string): Artwork | undefined {
	return bySlug.get(slug);
}

export function getArtworkById(id: string): Artwork | undefined {
	return byId.get(id);
}

export function getWorksByArtist(artistSlug: string): Artwork[] {
	return artworks.filter((artwork) => artwork.artistSlug === artistSlug);
}

/** Featured works in home page order. The first one is the hero. */
export function getFeatured(): Artwork[] {
	return FEATURED_ORDER.map((id) => byId.get(id)).filter(
		(artwork): artwork is Artwork => artwork?.featured === true
	);
}

/** The image used for tiles: the first with role 'main'. */
export function getMainImage(artwork: Artwork): ArtworkImage {
	return artwork.images.find((image) => image.role === 'main') ?? artwork.images[0];
}
