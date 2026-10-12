// All Dutch UI copy (docs/05-copy-nl.md). Components never hardcode Dutch strings.
export const nl = {
	brand: {
		name: 'Kunstkamer',
		tagline: 'Hedendaagse kunst, zorgvuldig geselecteerd.',
		footerLine:
			'Een curated platform voor hedendaagse kunst. Koop direct of bied mee in onze veilingen.'
	},

	demo: {
		banner: 'Dit is een demo. Er worden geen echte aankopen of biedingen verwerkt.',
		bannerClose: 'Sluiten',
		badge: 'Demo-werk',
		artistBadge: 'Demo-kunstenaar',
		toastGeneric: 'Dit is een demo. In de echte versie ga je hier verder.',
		toastCheckout: 'In de echte versie ga je nu naar de beveiligde betaling.',
		toastInquiry:
			'Je aanvraag is verstuurd (demo). In de echte versie ontvang je een bevestiging per e-mail.',
		toastImport: '{count} werken geïmporteerd (demo). Er is niets opgeslagen.',
		toastImportOne: '1 werk geïmporteerd (demo). Er is niets opgeslagen.'
	},

	nav: {
		collection: 'Collectie',
		artists: 'Kunstenaars',
		auctions: 'Veilingen',
		search: 'Zoeken',
		searchPlaceholder: 'Zoek op titel, kunstenaar of techniek',
		menu: 'Menu',
		close: 'Sluiten',
		contact: 'Contact',
		admin: 'Beheer (demo)',
		skipToContent: 'Naar de inhoud'
	},

	home: {
		liveAuction: 'Live veiling',
		closesIn: 'Sluit over',
		currentBid: 'Huidig bod',
		viewAuction: 'Bekijk de veiling',
		featured: 'Uitgelicht',
		viewAll: 'Bekijk de hele collectie',
		heroIntro:
			'Schilderkunst, fotografie en grafiek van hedendaagse kunstenaars. Koop direct of bied mee in onze veilingen.',
		viewCollection: 'Bekijk de collectie',
		allAuctions: 'Alle veilingen',
		featuredLot: 'Uitgelichte kavel',
		closingSoon: 'Sluit binnenkort',
		browseTitle: 'Ontdek per techniek',
		runningAuctions: 'Lopende veilingen',
		toAuction: 'Naar de veiling',
		aboutTitle: 'Over het platform',
		about: [
			'Elk werk op Kunstkamer is met de hand geselecteerd. We werken rechtstreeks met kunstenaars en verzamelaars, zodat je weet waar een werk vandaan komt.',
			'Bij elk werk vind je de volledige specificaties en, waar van toepassing, een certificaat van echtheid van de kunstenaar.',
			'Koop een werk meteen tegen een vaste prijs, of bied mee in een van onze veilingen.'
		],
		artistsTitle: 'Kunstenaars',
		worksCount: '{count} werken',
		worksCountOne: '1 werk'
	},

	catalogue: {
		title: 'Collectie',
		resultCount: '{count} werken',
		resultCountOne: '1 werk',
		searchLabel: 'Zoeken in de collectie',
		sortLabel: 'Sorteren',
		sort: {
			newest: 'Nieuwste',
			priceAsc: 'Prijs laag–hoog',
			priceDesc: 'Prijs hoog–laag',
			artist: 'Kunstenaar A–Z'
		},
		filters: 'Filters',
		showResults: 'Toon {count} werken',
		clearAll: 'Wis alles',
		clearAllFilters: 'Wis alle filters',
		removeFilter: 'Verwijder filter {name}',
		empty: 'Geen werken gevonden voor deze filters.',
		groups: {
			status: 'Status',
			artist: 'Kunstenaar',
			technique: 'Techniek',
			price: 'Prijs',
			size: 'Formaat',
			orientation: 'Oriëntatie'
		},
		status: {
			'te-koop': 'Te koop',
			veiling: 'In veiling',
			verkocht: 'Verkocht',
			'op-aanvraag': 'Op aanvraag'
		},
		technique: {
			painting: 'Schilderkunst',
			photography: 'Fotografie',
			print: 'Zeefdruk',
			paper: 'Werk op papier'
		},
		priceMin: 'Min. €',
		priceMax: 'Max. €',
		size: {
			small: 'Klein (tot 50 cm)',
			medium: 'Middel (50–100 cm)',
			large: 'Groot (vanaf 100 cm)'
		},
		orientation: { portrait: 'Staand', landscape: 'Liggend', square: 'Vierkant' }
	},

	artwork: {
		breadcrumbRoot: 'Collectie',
		breadcrumbLabel: 'Kruimelpad',
		priceOnRequest: 'Prijs op aanvraag',
		sold: 'Verkocht',
		soldLong: 'Dit werk is verkocht',
		similarWorks: 'Vergelijkbare werken',
		buy: 'Kopen',
		ask: 'Stel een vraag',
		requestPrice: 'Prijs aanvragen',
		checkoutTitle: 'Je aankoop',
		shippingNote: 'Verzending wordt berekend bij het afrekenen.',
		toCheckout: 'Doorgaan naar afrekenen',
		cancel: 'Annuleren',
		inquiryTitle: 'Prijs aanvragen',
		inquiryName: 'Naam',
		inquiryEmail: 'E-mailadres',
		inquiryMessage: 'Bericht',
		inquirySend: 'Aanvraag versturen',
		trust: {
			certificate: 'Certificaat van echtheid inbegrepen',
			shipping: 'Zorgvuldig verpakt en verzekerd verzonden',
			returns: '14 dagen bedenktijd bij aankoop'
		},
		aboutWork: 'Over dit werk',
		specs: 'Specificaties',
		spec: {
			artist: 'Kunstenaar',
			title: 'Titel',
			series: 'Reeks',
			year: 'Jaar',
			technique: 'Techniek',
			support: 'Drager',
			dimensions: 'Afmetingen',
			edition: 'Oplage',
			signed: 'Gesigneerd',
			certificate: 'Certificaat',
			yes: 'Ja',
			no: 'Nee'
		},
		dimensions: '{w} × {h} cm',
		dimensions3d: '{w} × {h} × {d} cm',
		editionFull: 'Exemplaar {label} uit een oplage van {size} + {ap} E.A.',
		editionSimple: 'Oplage van {size}',
		editionWithProofs: 'Oplage van {size} + {ap} E.A.',
		editionLabelled: 'Exemplaar {label} uit een oplage van {size}',
		unique: 'Uniek werk',
		aboutArtist: 'Over de kunstenaar',
		viewArtist: 'Meer over {name}',
		moreByArtist: 'Meer van {name}',
		youMightLike: 'Misschien ook iets voor jou',
		galleryOpen: 'Afbeelding vergroten',
		galleryPrev: 'Vorige afbeelding',
		galleryNext: 'Volgende afbeelding',
		galleryClose: 'Sluiten',
		galleryImageOf: 'Afbeelding {n} van {total}'
	},

	artist: {
		indexTitle: 'Kunstenaars',
		basedIn: 'Gevestigd in {place}',
		worksBy: 'Werken van {name}'
	},

	auction: {
		indexTitle: 'Veilingen',
		tabRunning: 'Lopend',
		tabUpcoming: 'Binnenkort',
		lot: 'Kavel {n}',
		live: 'Live',
		currentBid: 'Huidig bod',
		startingBid: 'Startbod',
		bidsCount: '{count} biedingen',
		bidsCountOne: '1 bieding',
		closesIn: 'Sluit over',
		startsIn: 'Start over {time}',
		closed: 'Veiling gesloten',
		extended: 'Verlengd met 1 minuut',
		reserveNotMet: 'Minimumprijs nog niet bereikt',
		reserveMet: 'Minimumprijs bereikt',
		yourBid: 'Jouw bod',
		minBid: 'Minimaal {amount}',
		placeBid: 'Bod plaatsen',
		confirmBid: 'Bevestig je bod van {amount}',
		confirm: 'Bevestigen',
		cancel: 'Annuleren',
		errorTooLow: 'Je bod moet minstens {amount} zijn.',
		toastPlaced: 'Bod geplaatst (demo). Je bent de hoogste bieder.',
		toastOutbid: 'Je bent overboden.',
		fee: 'Koperskosten: {pct}% van het winnende bod. Dit is een demo — er wordt niets aangerekend.',
		history: 'Biedgeschiedenis',
		historyBidder: 'Bieder',
		historyAmount: 'Bod',
		historyTime: 'Tijd',
		you: 'Jij',
		bidderLabel: 'Bieder {n}',
		howTitle: 'Hoe werkt bieden?',
		howSteps: [
			'Plaats een bod van minstens het minimumbedrag. Je ziet meteen of je de hoogste bieder bent.',
			'Word je overboden, dan kun je opnieuw bieden tot de veiling sluit. Een bod in de laatste minuut verlengt de veiling met één minuut.',
			'Heb je het hoogste bod bij sluiting en is de minimumprijs bereikt, dan win je het werk. Bovenop je bod komen de koperskosten.',
			'Na betaling wordt het werk zorgvuldig verpakt en verzekerd naar je verzonden.'
		],
		countdown: { d: 'd', h: 'u', m: 'm', s: 's' }
	},

	admin: {
		title: 'Werken importeren uit Excel',
		intro:
			'Zo wordt je Excel-bestand de catalogus. Het bestand wordt alleen in je browser gelezen en nergens opgeslagen.',
		drop: 'Sleep je Excel-bestand hierheen of kies een bestand',
		preview: 'Voorbeeld van de eerste {count} rijen',
		summary: '{ok} werken klaar om te importeren, {warn} met waarschuwingen',
		ok: 'OK',
		missingImage: 'Afbeelding ontbreekt',
		missingPrice: 'Prijs ontbreekt',
		missingTitle: 'Titel ontbreekt',
		import: 'Importeren',
		template: 'Download voorbeeldbestand',
		errorRead: 'Dit bestand kon niet gelezen worden. Gebruik een .xlsx- of .csv-bestand.',
		summaryOne: '1 werk klaar om te importeren, {warn} met waarschuwingen',
		check: 'Controle',
		file: 'Bestand: {name}',
		ignored: 'Niet geïmporteerd (interne kolommen): {names}'
	},

	notFound: {
		title: 'Niet gevonden',
		page: 'Deze pagina bestaat niet.',
		work: 'Dit werk bestaat niet (meer).',
		error: 'Er ging iets mis. Probeer het later opnieuw.',
		back: 'Bekijk de collectie'
	},
	footer: {
		rights: '© 2026 Kunstkamer — demo'
	},

	meta: {
		homeTitle: 'Kunstkamer — Hedendaagse kunst kopen en veilen',
		homeDescription: 'Ontdek en koop hedendaagse kunst, of bied mee in onze veilingen.',
		collectionTitle: 'Collectie — Kunstkamer',
		auctionsTitle: 'Veilingen — Kunstkamer',
		artistsTitle: 'Kunstenaars — Kunstkamer'
	}
} as const;
