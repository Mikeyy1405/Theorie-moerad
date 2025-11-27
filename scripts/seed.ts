
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.examResult.deleteMany()
  await prisma.progress.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.question.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.course.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const hashedPassword = await bcrypt.hash('johndoe123', 12)
  const studentPassword = await bcrypt.hash('password123', 12)
  const writgoPassword = await bcrypt.hash('Testtheorie2025!', 12)

  const adminUser = await prisma.user.create({
    data: {
      email: 'john@doe.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'ADMIN'
    }
  })

  const writgoUser = await prisma.user.create({
    data: {
      email: 'info@writgo.nl',
      password: writgoPassword,
      firstName: 'Writgo',
      lastName: 'Admin',
      role: 'ADMIN'
    }
  })

  const studentUser = await prisma.user.create({
    data: {
      email: 'student@example.com',
      password: studentPassword,
      firstName: 'Test',
      lastName: 'Student',
      role: 'STUDENT'
    }
  })

  const studentUser2 = await prisma.user.create({
    data: {
      email: 'anna@example.com',
      password: studentPassword,
      firstName: 'Anna',
      lastName: 'de Vries',
      role: 'STUDENT'
    }
  })

  // Create courses
  const autoTheorieCourse = await prisma.course.create({
    data: {
      title: 'Auto Theorie',
      description: 'Complete auto theorie cursus voor het Nederlandse CBR examen. Leer alle verkeersregels, verkeersborden en situaties die je nodig hebt om te slagen.',
      price: 29.99,
      category: 'Auto',
      imageUrl: 'https://static.abacusaicdn.net/images/bc404062-2e20-4aab-9424-e310cf0a1a49.png',
      isActive: true
    }
  })

  const motorTheorieCourse = await prisma.course.create({
    data: {
      title: 'Motor Theorie',
      description: 'Volledige motor theorie cursus voor het Nederlandse CBR motorrijbewijs. Inclusief specifieke motorregels en veiligheidssituaties.',
      price: 34.99,
      category: 'Motor',
      imageUrl: 'https://static.abacusaicdn.net/images/ddbee4d9-054b-4565-a844-7104c465ef1d.png',
      isActive: true
    }
  })

  // Create lessons for Auto Theorie (5 lessons, first 3 free)
  const autoLessons = await Promise.all([
    prisma.lesson.create({
      data: {
        title: 'Basis Verkeersregels',
        description: 'Leer de fundamentele verkeersregels in Nederland',
        content: `# Basis Verkeersregels

## Inleiding
Welkom bij de eerste les over Nederlandse verkeersregels! In deze les behandelen we de basisprincipes die elke weggebruiker moet kennen.

## Belangrijke Basisregels
- **Rechts hebben**: In Nederland geldt de regel dat verkeer van rechts voorrang heeft, tenzij anders aangegeven
- **Snelheidslimiet**: Respecteer altijd de aangegeven snelheidslimiet
- **Verkeerslichten**: Rood = stop, oranje = voorbereiden op stoppen, groen = doorrijden

## Praktische Tips
1. Controleer altijd je dode hoek voor je van baan wisselt
2. Gebruik je richtingaanwijzer tijdig
3. Houd voldoende afstand tot de voorligger

Deze basisregels vormen de fundamenten voor veilig verkeer.`,
        order: 1,
        isFree: true,
        contentType: 'TEXT',
        courseId: autoTheorieCourse.id
      }
    }),
    prisma.lesson.create({
      data: {
        title: 'Verkeersborden Herkennen',
        description: 'Alle belangrijke verkeersborden en hun betekenis',
        content: `# Verkeersborden Herkennen

## Waarschuwingsborden
- **Driehoekige borden**: Waarschuwen voor gevaar
- **Geel met zwarte symbolen**: Extra aandacht vereist

## Gebods- en Verbodsborden
- **Ronde blauwe borden**: Geven geboden aan
- **Ronde rode borden**: Geven verboden aan

## Voorrangsborden
- **Oranje driehoek**: Voorrang verlenen
- **Achthoekig rood bord**: Stop, absolute voorrang verlenen
- **Gele ruit**: Voorrangsweg

## Oefenvragen
Na deze les kun je een oefentest doen om je kennis te testen!`,
        order: 2,
        isFree: true,
        contentType: 'TEXT',
        courseId: autoTheorieCourse.id
      }
    }),
    prisma.lesson.create({
      data: {
        title: 'Kruispunten en Voorrang',
        description: 'Hoe navigeer je veilig door kruispunten',
        content: `# Kruispunten en Voorrang

## Soorten Kruispunten
1. **Geregelde kruispunten**: Met verkeerslichten of verkeersregelaars
2. **Ongeregelde kruispunten**: Voorrangsregels gelden

## Voorrangsregels
- Verkeer van rechts heeft voorrang
- Hoofdweg heeft voorrang op zijweg
- Rechtdoorgaand verkeer heeft voorrang op afslaand verkeer

## Bijzondere Situaties
- **Rotonde**: Verkeer op de rotonde heeft voorrang
- **Voetgangersoversteken**: Voetgangers hebben altijd voorrang
- **Uitrit/inrit**: Uitrijdend verkeer moet voorrang verlenen

## Veilig Navigeren
1. Verminder snelheid bij nadering van kruispunt
2. Kijk goed om je heen
3. Maak oogcontact met andere weggebruikers
4. Wees voorspelbaar in je gedrag`,
        order: 3,
        isFree: true,
        contentType: 'TEXT',
        courseId: autoTheorieCourse.id
      }
    }),
    prisma.lesson.create({
      data: {
        title: 'Snelwegen en Invoegen',
        description: 'Veilig rijden op snelwegen',
        content: `# Snelwegen en Invoegen

## Snelwegregels
- Minimumsnelheid: 60 km/h
- Maximumsnelheid: 100-130 km/h (afhankelijk van aangegeven limiet)
- Rechts rijden, links inhalen

## Invoegen op de Snelweg
1. **Accelereren**: Pas je snelheid aan aan het verkeer
2. **Invoegstrook**: Gebruik de volledige lengte
3. **Kijk goed**: Controleer je spiegels en dode hoek
4. **Soepel invoegen**: Geen plots remmen of accelereren

## Uitvoegen
1. Tijdig naar de rechterrijstrook
2. Richtingaanwijzer aan
3. Afremmen op de uitvoegstrook, niet op de hoofdbaan

## Veiligheidsafstand
- 3-seconden regel: Tel 3 seconden tussen jou en de voorligger
- Bij slecht weer: vergroot de afstand`,
        order: 4,
        isFree: false,
        contentType: 'TEXT',
        courseId: autoTheorieCourse.id
      }
    }),
    prisma.lesson.create({
      data: {
        title: 'Examensituaties en Praktijktips',
        description: 'Bereid je voor op het CBR theorie-examen',
        content: `# Examensituaties en Praktijktips

## Examen Voorbereiding
- **50 vragen**: Je moet minimaal 44 goed hebben
- **Tijd**: 30 minuten voor het examen
- **Concentratie**: Lees elke vraag goed door

## Veel Voorkomende Fouten
1. **Snelheid**: Te snel door bochten of bij slecht weer
2. **Afstand**: Onvoldoende veiligheidsafstand
3. **Voorrang**: Voorrangsregels niet goed toepassen

## Praktische Situaties
- **File**: Geduld hebben, niet van baan wisselen
- **Slecht weer**: Aangepaste rijstijl
- **Voetgangers**: Extra oplettendheid bij scholen en winkelcentra

## Laatste Tips
1. Blijf kalm tijdens het examen
2. Gebruik je gezonde verstand
3. Denk aan de verkeersveiligheid
4. Oefenen, oefenen, oefenen!

**Succes met je theorie-examen!**`,
        order: 5,
        isFree: false,
        contentType: 'TEXT',
        courseId: autoTheorieCourse.id
      }
    })
  ])

  // Create lessons for Motor Theorie (4 lessons, first 3 free)
  const motorLessons = await Promise.all([
    prisma.lesson.create({
      data: {
        title: 'Motor Basis en Veiligheid',
        description: 'Fundamentele kennis voor motorrijders',
        content: `# Motor Basis en Veiligheid

## Beschermende Uitrusting
- **Helm**: Verplicht en levensreddend
- **Motorkleding**: Beschermt bij een val
- **Handschoenen en laarzen**: Essentieel voor goede grip

## Zichtbaarheid
- Draag opvallende kleuren
- Zorg dat je verlichting werkt
- Wees extra alert in de spits

## Motor Controle
1. **Voor elke rit**: Controleer banden, remmen en verlichting
2. **Rijpositie**: Rechtop zitten, beide handen aan het stuur
3. **Balans**: Oefen langzaam rijden en balans houden

## Weer en Wegdek
- **Regen**: Motorfiets kan makkelijk wegglijden
- **Bladeren**: Zeer glad in de herfst
- **Wegwerkzaamheden**: Extra voorzichtigheid`,
        order: 1,
        isFree: true,
        contentType: 'TEXT',
        courseId: motorTheorieCourse.id
      }
    }),
    prisma.lesson.create({
      data: {
        title: 'Bochten en Wegligging',
        description: 'Veilig door bochten navigeren',
        content: `# Bochten en Wegligging

## Bochttechniek
1. **Voor de bocht**: Juiste snelheid, goede lijn kiezen
2. **In de bocht**: Constant gas, niet remmen
3. **Na de bocht**: Geleidelijk accelereren

## Wegligging
- **Droog asfalt**: Goede grip
- **Nat wegdek**: Minder grip, voorzichtiger rijden
- **Grind**: Vermijd plots remmen of sturen

## Risico Situaties
- **Onverwachte obstakels**: Altijd ruimte houden voor ontwijken
- **Tegenliggers**: Vooral bij inhalen
- **Kruispunten**: Motorrijders worden vaak over het hoofd gezien

## Verdediging Rijden
1. Vooruit kijken en anticiperen
2. Zorg dat je gezien wordt
3. Houd altijd een vluchtroute open`,
        order: 2,
        isFree: true,
        contentType: 'TEXT',
        courseId: motorTheorieCourse.id
      }
    }),
    prisma.lesson.create({
      data: {
        title: 'Inhalen en Snelweg',
        description: 'Veilig inhalen met de motor',
        content: `# Inhalen en Snelweg

## Inhaalmanoeuvre
1. **Controle**: Spiegels en dode hoek checken
2. **Acceleratie**: Zorg voor voldoende vermogen
3. **Veilige afstand**: Houd ruimte voor en achter

## Snelweg Rijden
- **Positie**: Rijd in het midden van de rijstrook
- **Windvlaag**: Let op vrachtwagens en bussen
- **Invoegen**: Andere voertuigen verwachten motorrijders niet altijd

## Gevaarlijke Situationen
- **Spookrijders**: Blijf rechts, ga langzamer rijden
- **File**: Niet tussen auto's door slalommen
- **Wegwerkzaamheden**: Extra voorzichtigheid bij versmalde rijbanen

## Communicatie
1. Gebruik richtingaanwijzers tijdig
2. Remlicht bij afremmen
3. Claxon alleen bij gevaar`,
        order: 3,
        isFree: true,
        contentType: 'TEXT',
        courseId: motorTheorieCourse.id
      }
    }),
    prisma.lesson.create({
      data: {
        title: 'Motor Theorie Examen',
        description: 'Specifieke kennis voor het motor theorie-examen',
        content: `# Motor Theorie Examen

## Examen Opzet
- **25 algemene vragen**: Gelijk aan auto theorie
- **25 motor specifieke vragen**: Uniek voor motorrijbewijs
- **Tijd**: 30 minuten totaal
- **Slaaggrens**: Minimaal 44 van de 50 vragen goed

## Motor Specifieke Onderwerpen
1. **Remtechniek**: Voor- en achterrem gebruik
2. **Bochttechniek**: Lijn kiezen en snelheid
3. **Beschermende uitrusting**: Wettelijke eisen
4. **Motoronderhoud**: Basis controles

## Veelgestelde Examenvragen
- Wanneer gebruik je de voorrem vs achterrem?
- Welke beschermende kleding is verplicht?
- Hoe rijd je veilig door een bocht?
- Wat doe je bij aquaplaning?

## Praktische Examen Tips
1. **Theorie eerst**: Haal eerst je theorie-examen
2. **Motorrijlessen**: Neem professionele lessen
3. **Oefenen**: Veel oefenen met theorie vragen
4. **Rustbewaren**: Stress vermindert je prestaties

**Veel succes met je motor theorie-examen!**`,
        order: 4,
        isFree: false,
        contentType: 'TEXT',
        courseId: motorTheorieCourse.id
      }
    })
  ])

  // Create questions for Auto Theorie
  const autoQuestions = await Promise.all([
    prisma.question.create({
      data: {
        title: 'Voorrang van rechts',
        content: 'Bij een kruispunt zonder verkeersborden, wie heeft er voorrang?',
        type: 'MULTIPLE_CHOICE',
        options: ['Het verkeer van rechts', 'Het verkeer van links', 'De grootste auto', 'Niemand heeft voorrang'],
        correctAnswer: 'Het verkeer van rechts',
        explanation: 'In Nederland geldt de regel dat verkeer van rechts voorrang heeft bij gelijkwaardige kruispunten.',
        courseId: autoTheorieCourse.id
      }
    }),
    prisma.question.create({
      data: {
        title: 'Snelheidslimiet binnenstad',
        content: 'Wat is de algemene snelheidslimiet binnen de bebouwde kom?',
        type: 'MULTIPLE_CHOICE',
        options: ['30 km/h', '50 km/h', '60 km/h', '70 km/h'],
        correctAnswer: '50 km/h',
        explanation: 'De algemene snelheidslimiet binnen de bebouwde kom is 50 km/h, tenzij anders aangegeven.',
        courseId: autoTheorieCourse.id
      }
    }),
    prisma.question.create({
      data: {
        title: 'Stopbord betekenis',
        content: 'Een rood achthoekig bord met "STOP" betekent dat je:',
        type: 'MULTIPLE_CHOICE',
        options: ['Moet vertragen', 'Volledig moet stoppen', 'Voorrang moet verlenen', 'Mag doorrijden als het veilig is'],
        correctAnswer: 'Volledig moet stoppen',
        explanation: 'Een stopbord betekent dat je volledig moet stoppen en absolute voorrang moet verlenen.',
        courseId: autoTheorieCourse.id
      }
    }),
    prisma.question.create({
      data: {
        title: 'Veiligheidsafstand',
        content: 'Welke afstand moet je minimaal aanhouden tot de voorligger?',
        type: 'MULTIPLE_CHOICE',
        options: ['1 seconde', '2 seconden', '3 seconden', '5 seconden'],
        correctAnswer: '3 seconden',
        explanation: 'De 3-seconden regel geldt als minimum veiligheidsafstand onder normale omstandigheden.',
        courseId: autoTheorieCourse.id
      }
    }),
    prisma.question.create({
      data: {
        title: 'Alcohol en rijden',
        content: 'Het is verboden om te rijden met alcohol in het bloed.',
        type: 'TRUE_FALSE',
        options: ['Waar', 'Onwaar'],
        correctAnswer: 'Onwaar',
        explanation: 'Er geldt een limiet van 0,5 promille voor ervaren bestuurders en 0,2 promille voor beginnende bestuurders.',
        courseId: autoTheorieCourse.id
      }
    })
  ])

  // Create questions for Motor Theorie
  const motorQuestions = await Promise.all([
    prisma.question.create({
      data: {
        title: 'Helm verplicht',
        content: 'Is het dragen van een helm verplicht voor motorrijders?',
        type: 'TRUE_FALSE',
        options: ['Waar', 'Onwaar'],
        correctAnswer: 'Waar',
        explanation: 'Het dragen van een goedgekeurde helm is wettelijk verplicht voor alle motorrijders.',
        courseId: motorTheorieCourse.id
      }
    }),
    prisma.question.create({
      data: {
        title: 'Remtechniek motor',
        content: 'Welke rem gebruik je het meest bij een motor?',
        type: 'MULTIPLE_CHOICE',
        options: ['Alleen de voorrem', 'Alleen de achterrem', 'Beide remmen tegelijk', 'Het maakt niet uit'],
        correctAnswer: 'Beide remmen tegelijk',
        explanation: 'Voor optimale remprestatie gebruik je zowel voor- als achterrem, waarbij de voorrem meer remkracht levert.',
        courseId: motorTheorieCourse.id
      }
    }),
    prisma.question.create({
      data: {
        title: 'Bocht rijden',
        content: 'Hoe rijd je het veiligst door een bocht met een motor?',
        type: 'MULTIPLE_CHOICE',
        options: ['Hard remmen in de bocht', 'Constant gas in de bocht', 'Accelereren in de bocht', 'Van gas gaan in de bocht'],
        correctAnswer: 'Constant gas in de bocht',
        explanation: 'In een bocht houd je constant gas aan voor stabiliteit. Voor de bocht rem je af tot de juiste snelheid.',
        courseId: motorTheorieCourse.id
      }
    }),
    prisma.question.create({
      data: {
        title: 'Zichtbaarheid motor',
        content: 'Wat kun je doen om beter zichtbaar te zijn als motorrijder?',
        type: 'MULTIPLE_CHOICE',
        options: ['Donkere kleding dragen', 'Opvallende kleuren dragen', 'Geen verlichting gebruiken overdag', 'Zachtjes rijden'],
        correctAnswer: 'Opvallende kleuren dragen',
        explanation: 'Opvallende kleuren en reflecterende materialen maken je veel beter zichtbaar voor andere weggebruikers.',
        courseId: motorTheorieCourse.id
      }
    })
  ])

  // Create enrollments
  await prisma.enrollment.create({
    data: {
      userId: studentUser.id,
      courseId: autoTheorieCourse.id,
      status: 'ACTIVE'
    }
  })

  await prisma.enrollment.create({
    data: {
      userId: studentUser2.id,
      courseId: autoTheorieCourse.id,
      status: 'ACTIVE'
    }
  })

  await prisma.enrollment.create({
    data: {
      userId: studentUser2.id,
      courseId: motorTheorieCourse.id,
      status: 'ACTIVE'
    }
  })

  // Create progress for student
  await Promise.all([
    prisma.progress.create({
      data: {
        userId: studentUser.id,
        lessonId: autoLessons[0].id,
        completed: true,
        timeSpent: 15,
        completedAt: new Date()
      }
    }),
    prisma.progress.create({
      data: {
        userId: studentUser.id,
        lessonId: autoLessons[1].id,
        completed: true,
        timeSpent: 20,
        completedAt: new Date()
      }
    }),
    prisma.progress.create({
      data: {
        userId: studentUser.id,
        lessonId: autoLessons[2].id,
        completed: false,
        timeSpent: 10
      }
    }),
    prisma.progress.create({
      data: {
        userId: studentUser2.id,
        lessonId: autoLessons[0].id,
        completed: true,
        timeSpent: 12,
        completedAt: new Date()
      }
    })
  ])

  // Create exam results
  await Promise.all([
    prisma.examResult.create({
      data: {
        userId: studentUser.id,
        courseId: autoTheorieCourse.id,
        score: 78.0,
        totalQuestions: 50,
        correctAnswers: 39,
        timeSpent: 25,
        passed: true
      }
    }),
    prisma.examResult.create({
      data: {
        userId: studentUser.id,
        courseId: autoTheorieCourse.id,
        score: 85.0,
        totalQuestions: 50,
        correctAnswers: 42,
        timeSpent: 22,
        passed: true
      }
    }),
    prisma.examResult.create({
      data: {
        userId: studentUser2.id,
        courseId: motorTheorieCourse.id,
        score: 92.0,
        totalQuestions: 50,
        correctAnswers: 46,
        timeSpent: 28,
        passed: true
      }
    })
  ])

  // Create invoices
  await Promise.all([
    prisma.invoice.create({
      data: {
        userId: studentUser.id,
        amount: 29.99,
        itemDescription: 'Auto Theorie Cursus',
        status: 'COMPLETED',
        paidAt: new Date()
      }
    }),
    prisma.invoice.create({
      data: {
        userId: studentUser2.id,
        amount: 29.99,
        itemDescription: 'Auto Theorie Cursus',
        status: 'COMPLETED',
        paidAt: new Date()
      }
    }),
    prisma.invoice.create({
      data: {
        userId: studentUser2.id,
        amount: 34.99,
        itemDescription: 'Motor Theorie Cursus',
        status: 'COMPLETED',
        paidAt: new Date()
      }
    })
  ])

  console.log('✅ Database seeded successfully!')
  console.log(`Created:`)
  console.log(`- 3 users (1 admin, 2 students)`)
  console.log(`- 2 courses (Auto & Motor Theorie)`)
  console.log(`- 9 lessons total`)
  console.log(`- 9 practice questions`)
  console.log(`- 3 enrollments`)
  console.log(`- 4 progress records`)
  console.log(`- 3 exam results`)
  console.log(`- 3 invoices`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
