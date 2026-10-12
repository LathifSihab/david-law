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
		toastImportOne: '1 werk geïmporteerd (demo). Er is niets opgeslagen.',
		toastLogin: 'Inloggen bestaat niet in de demo. In de echte versie log je hier in.',
		toastNewsletter: 'Je bent ingeschreven (demo). Er wordt niets verstuurd of opgeslagen.'
	},

	favourites: {
		title: 'Favorieten',
		intro:
			'Werken die je bewaart, staan hier zolang dit venster open is. In de demo wordt niets opgeslagen.',
		empty: 'Je hebt nog geen werken bewaard. Tik op het hartje bij een werk om het hier te zetten.',
		add: '{title} bewaren in favorieten',
		remove: '{title} verwijderen uit favorieten',
		added: 'Bewaard in je favorieten (demo).',
		removed: 'Verwijderd uit je favorieten.',
		headerLabel: 'Favorieten, {count} bewaard'
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
		skipToContent: 'Naar de inhoud',
		login: 'Inloggen',
		categories: 'Categorieën',
		home: 'Home'
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
		allArtists: 'Alle kunstenaars',
		newTitle: 'Nieuw in de collectie',
		newSubtitle: 'De werken die het laatst zijn toegevoegd.',
		closingSoonSubtitle: 'Laatste kans om mee te bieden.',
		featuredSubtitle: 'Door ons gekozen uit de collectie.',
		bidNow: 'Bied mee',
		lotsCount: '{count} kavels',
		lotsCountOne: '1 kavel',
		promoAuctionsTitle: 'Lopende veilingen',
		promoAuctionsText: 'Bied mee voordat de klok stopt.',
		promoBuyTitle: 'Koop direct',
		promoBuyText: '{count} werken met een vaste prijs',
		categoriesTitle: 'Populaire categorieën',
		uspTitle: 'Waarom Kunstkamer',
		usp: {
			selected: { title: 'Met de hand geselecteerd', text: 'Elk werk wordt door ons gekozen.' },
			choice: { title: 'Koop direct of bied mee', text: 'Een vaste prijs of een veiling.' },
			certificate: {
				title: 'Certificaat van echtheid',
				text: 'Waar van toepassing, van de kunstenaar.'
			},
			shipping: { title: 'Verzekerd verzonden', text: 'Zorgvuldig verpakt, tot aan je deur.' }
		},
		howTitle: 'Zo werkt Kunstkamer',
		how: {
			discover: {
				title: 'Ontdek',
				text: 'Blader door schilderkunst, fotografie en grafiek, of zoek op kunstenaar.'
			},
			bid: {
				title: 'Bied mee of koop',
				text: 'Koop een werk tegen een vaste prijs, of bied mee tot de veiling sluit.'
			},
			receive: {
				title: 'Ontvang',
				text: 'Je werk wordt zorgvuldig verpakt en verzekerd naar je verzonden.'
			}
		},
		newsletterTitle: 'Mis geen enkele veiling',
		newsletterText: 'Elke week de nieuwste werken en veilingen in je mailbox.',
		newsletterLabel: 'Je e-mailadres',
		newsletterButton: 'Inschrijven',
		worksCount: '{count} werken',
		worksCountOne: '1 werk'
	},

	catalogue: {
		title: 'Collectie',
		heroTitle: 'Kunst om elke dag',
		heroAccent: 'naar te kijken',
		heroIntro:
			'Schilderkunst, fotografie, zeefdruk en werk op papier, met de hand geselecteerd bij hedendaagse kunstenaars.',
		heroSummary: '{works} werken van {artists} kunstenaars',
		heroBrowse: 'Blader per techniek',
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
		inquiryNameInvalid: 'Vul je naam in.',
		inquiryEmailInvalid: 'Vul een geldig e-mailadres in.',
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
			weight: 'Gewicht',
			condition: 'Staat',
			madeIn: 'Plaats van creatie',
			originCountry: 'Land van herkomst',
			soldBy: 'Verkocht door',
			yes: 'Ja',
			no: 'Nee'
		},
		dimensions: '{w} × {h} cm',
		dimensions3d: '{w} × {h} × {d} cm',
		weight: '{kg} kg',
		allSpecs: 'Alle specificaties',
		keyFacts: 'Kerngegevens',
		editionFull: 'Exemplaar {label} uit een oplage van {size}\u00a0+\u00a0{ap}\u00a0E.A.',
		editionSimple: 'Oplage van {size}',
		editionWithProofs: 'Oplage van {size}\u00a0+\u00a0{ap}\u00a0E.A.',
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
		heroTitle: 'De handen achter',
		heroAccent: 'het werk',
		heroIntro: 'Ontdek wie er achter elk werk staat: hun verhaal, hun techniek en wat hen drijft.',
		heroIndex: 'Alle kunstenaars',
		basedIn: 'Gevestigd in {place}',
		worksBy: 'Werken van {name}'
	},

	auction: {
		indexTitle: 'Veilingen',
		heroTitle: 'Elke seconde',
		heroAccent: 'telt',
		heroIntro:
			'Bied mee op geselecteerde werken. Een bod in de laatste minuut verlengt de veiling, zodat iedereen een eerlijke kans krijgt.',
		heroRunning: 'lopend',
		heroUpcoming: 'binnenkort',
		heroShowLot: 'Toon kavel {n}',
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
		errorSize: 'Dit bestand is te groot. Gebruik een bestand tot 5 MB.',
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
		rights: '© 2026 Kunstkamer — demo',
		discover: 'Ontdekken',
		categories: 'Categorieën',
		help: 'Hulp',
		howBidding: 'Hoe werkt bieden?'
	},

	meta: {
		homeTitle: 'Kunstkamer — Hedendaagse kunst kopen en veilen',
		homeDescription: 'Ontdek en koop hedendaagse kunst, of bied mee in onze veilingen.',
		collectionTitle: 'Collectie — Kunstkamer',
		auctionsTitle: 'Veilingen — Kunstkamer',
		artistsTitle: 'Kunstenaars — Kunstkamer',
		favouritesTitle: 'Favorieten — Kunstkamer'
	}
} as const;
