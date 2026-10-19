// Every word on the site lives here, so the copy can change without touching the layout.

export const site = {
  name: 'Akshita Dhariwal',
  tab: "Akshita Dhariwal: I'm Your Next Hire",
}

export const nav = {
  links: [
    { label: 'Homepage', href: '#top', active: true },
    { label: 'Experience', href: '#details' },
    { label: 'Projects', href: '#gallery' },
  ],
  brand: 'akshita',
}

export const hero = {
  badge: 'life original',
  // Line one shows in capitals; line two is handwritten, so it keeps this casing.
  titleTop: "I'm your",
  titleBottom: 'Next Hire',
  play: 'Play now',
  tryAI: 'Try my AI',
  included: 'Included in Life',
  isNew: 'NEW MOVIE',
  rank: '#1 in inspiring movies',
  description:
    "When a festival marketer from India crosses continents with a Bristol MSc in hand, she finds her real superpower: making marketing run itself. Three countries, sold-out festivals and a growing army of AI automations later, she's ready for her biggest role yet...",
  genres: ['Inspiring', 'Drama', 'Feel-good'],
  rating: 'AMDb 9/10',
  year: '2026',
  runtime: '12 min',
  cast: ['Akshita Dhariwal', 'Praveen Dhariwal', 'Kreyansh Dhariwal'],
}

// The Details tab. Left column: two boxes. Right column: three boxes.
// Anything in [brackets] is a placeholder still to be filled in.
export const details = {
  tabs: ['Gallery', 'Details'],
  experience: {
    title: 'Experience',
    badges: ['DATA VISION', 'CRM', 'AI'],
    intro:
      'Twelve years of work, from a first job at 18 to running CRM and AI automation. Festival and creator marketing in India, then CRM, data and automation in the UK.',
    roles: [
      { when: '2026 to now', role: 'Founder', org: 'Property operations automation', text: 'AI systems for letting agents: maintenance intake, compliance tracking and tenant communication, with a human approving anything sensitive.' },
      { when: 'Jul 2025 to Oct 2026', role: 'CRM Analyst', org: 'Hillcrest Estate Management, Bristol', text: 'Connected Fixflo to HubSpot with Zapier, built Power BI dashboards that saved around 7 hours a week, ran Mailchimp campaigns and automated contractor renewals.' },
      { when: 'Aug 2024 to Apr 2025', role: 'Crew Trainer, promoted to Shift Manager', org: "McDonald's, Bristol", text: 'Trained new crew, then ran shifts.' },
      { when: '[dates]', role: 'Marketing Manager', org: 'Blisstro Videos, India', text: 'Tier-1 brand partnerships, a 50-creator programme, and hospitality and beauty campaigns.' },
      { when: 'Jul 2021 to Jun 2022', role: 'Marketing Executive', org: 'Blisstro Videos, India', text: 'Event marketing for Sunburn, Supersonic and Inscape, and brand events end to end.' },
    ],
  },
  credits: {
    title: 'Creators and Cast',
    rows: [
      ['Directors', ['God']],
      ['Producers', ['Family']],
      ['Cast', ['Akshita Dhariwal', 'Praveen Dhariwal', 'Kreyansh Dhariwal']],
      ['Studio', ['Filmed in India and United Kingdom'], 'plain'],
    ],
  },
  education: {
    title: 'Education',
    badges: ['MSc', 'BBA'],
    text: 'MSc Marketing, University of Bristol, [year]. Projects: Hotel Chocolat digital strategy, Maybelline Super Stay sentiment analysis, AR/VR gamified marketing. BBA Marketing, [university], 2018 to 2021.',
  },
  tools: {
    title: 'Tools I speak fluently',
    badges: ['12 yrs', 'AI'],
    text: 'Zapier, HubSpot, Power BI, Mailchimp, Fixflo, Excel, Python, AI agents, prompt design, creator marketing, event marketing, brand partnerships and social listening.',
  },
  building: {
    title: 'Now building',
    badges: ['LIVE'],
    text: 'Eligibly, a UK visa sponsorship checker. AI automations for letting agents. An AI lead generation engine. See them all in the Gallery.',
  },
}

// What each hero button says when it's pressed, until the real feature is wired up.
export const actions = {
  trailer: 'The trailer of my best projects is coming soon.',
  shortlist: 'Added to your shortlist. Good choice.',
  like: 'Thank you! That made my day.',
  dislike: 'Ouch. Watch the trailer first?',
  share: 'Link copied. Send it to your hiring manager.',
  shareFail: 'Copy this link: ',
  download: 'My CV download is coming soon.',
  play: 'My Loom intro is coming soon.',
  tryAI: 'My AI is being plugged in. Check back soon.',
}
