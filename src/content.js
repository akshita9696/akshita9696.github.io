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
    { label: 'Contact', href: '#contact' },
  ],
  brand: 'akshita',
}

export const hero = {
  badge: 'life original',
  // Line one shows in capitals; line two is handwritten, so it keeps this casing.
  titleTop: "I'm your",
  titleBottom: 'Next Hire',
  play: 'Play now',
  // The intro video that "Play now" opens. Swap in a Loom link here if you upload it there instead.
  video: '/videos/intro.mp4',
  tryAI: 'Try my AI',
  included: 'Included in Life',
  isNew: 'NEW MOVIE',
  rank: '#1 in inspiring movies',
  description:
    'She started out marketing 20+ brands across India, from Budweiser to Hyatt. Then she found her real superpower: making marketing run itself. Today she builds automated customer journeys, CRM workflows and AI agents that answer phones, chase leads and never ask for a day off. The final scene is yours to write. Spoiler: it ends with "You\'re hired."',
  genres: ['Inspiring', 'Drama', 'Feel-good'],
  rating: 'AMDb 9/10',
  year: '2026',
  runtime: '12 min',
  cast: ['Akshita Dhariwal'],
}

// The Details tab. Left column: two boxes. Right column: three boxes.
// Kept short on purpose: the Gallery tells the rest.
export const details = {
  tabs: ['Gallery', 'Details'],
  experience: {
    title: 'Experience',
    badges: ['MARKETING AUTOMATION', 'LIFECYCLE', 'AI'],
    intro: 'From brand and partnership marketing in New Delhi to marketing automation and AI in the UK.',
    roles: [
      {
        when: 'Aug 2024 to now',
        role: 'Marketing & AI Automation Consultant',
        org: 'Freelance',
        scope: 'Marketing and operations automation for small businesses, built in n8n.',
        points: [
          'Built 9 automation systems covering customer journeys, CRM workflows and AI agents.',
          "Built an AI support agent that drafts email replies from a business's own knowledge base, with a person approving every send.",
          'Built an AI voice receptionist that books, moves and cancels appointments, and flags calls that need a human.',
          'Built a live AI tool on this site that reads any website and suggests 3 automations in about 5 seconds.',
        ],
      },
      {
        when: 'Jul 2025 to Oct 2026',
        role: 'CRM Analyst',
        org: 'Hillcrest Estate Management, Bristol',
        scope: 'CRM, marketing automation and lifecycle communications for an 82-property residential portfolio.',
        points: [
          'Connected Fixflo to HubSpot with Zapier, so repair tickets landed in CRM pipelines automatically: ticket creation 40% faster and emergency dispatch under 15 minutes.',
          'Built automated Mailchimp journeys for leaseholder onboarding and updates: 62% open rate and 25% fewer routine support calls.',
          'Automated contractor renewal reminders in HubSpot, saving property managers 10+ hours a month of contract admin.',
          'Cleaned and standardised resident, leaseholder and contractor data across HubSpot and Mailchimp, keeping it 99%+ accurate and GDPR compliant.',
          'Built Power BI dashboards on CRM data that saved around 7 hours of reporting a week.',
          'Kept a 100% complaint resolution rate, measured in Fixflo.',
        ],
      },
      {
        when: 'Jul 2022 to Aug 2023',
        role: 'Marketing Manager',
        org: 'Blisstro Videos, New Delhi',
        scope: 'Promoted from Marketing Executive. Led marketing for 20+ brands across food, drinks, FMCG, beauty and hospitality.',
        points: [
          'Won £90k+ in B2B partnership revenue from Tier-1 brands like Budweiser and Kingfisher, owning each deal from pitch to ROI report.',
          'Ran 50+ creator partnerships against monthly KPIs for every brand, lifting client engagement by 35%.',
          'Led a cross-functional team of 10 across campaigns for Sula Wines, Mamaearth, Hyatt and JW Marriott.',
        ],
      },
      {
        when: 'Jul 2021 to Jun 2022',
        role: 'Marketing Executive',
        org: 'Blisstro Videos, New Delhi',
        scope: 'Campaigns for brand clients across social, digital, print and out-of-home.',
        points: [
          'Delivered brand events end to end, from concept and suppliers to budget.',
          'Marketed music and culture events including Sunburn, Supersonic and Inscape.',
        ],
      },
    ],
  },
  credits: {
    title: 'Creators and Cast',
    rows: [
      ['Directors', ['God']],
      ['Producers', ['Family']],
      ['Cast', ['Akshita Dhariwal']],
      ['Studio', ['Filmed in India and United Kingdom'], 'plain'],
    ],
  },
  education: {
    title: 'Education',
    badges: ['MSc', 'BBA'],
    text: 'MSc Marketing, University of Bristol, 2024. Projects: Hotel Chocolat digital strategy, Maybelline marketing data analysis and AR/VR gamified marketing (all in the Gallery). BBA Marketing, Maharishi University of Information Technology, Lucknow, 2018 to 2021.',
  },
  tools: {
    title: 'Tools I speak fluently',
    badges: ['AUTOMATION', 'AI'],
    groups: [
      { label: 'Marketing automation and CRM', items: ['n8n', 'Zapier', 'HubSpot', 'Mailchimp', 'Salesforce', 'Bloomreach', 'Fixflo'] },
      { label: 'AI', items: ['Claude', 'Claude Code', 'ChatGPT', 'Codex', 'Gemini', 'OpenAI API', 'Vapi voice AI', 'Pinecone', 'Firecrawl', 'Groq'] },
      { label: 'Data and reporting', items: ['Power BI', 'Google Analytics', 'Excel', 'Google Sheets', 'Airtable', 'Supabase'] },
      { label: 'Marketing', items: ['LinkedIn Matched Audiences', 'Canva'] },
      { label: 'Building', items: ['Python', 'React', 'Next.js', 'FastAPI', 'Vite', 'GitHub'] },
    ],
  },
  // Paste a link into `link` to turn a name into a link.
  building: {
    title: 'Now building',
    badges: ['IN PROGRESS'],
    items: [{ name: 'Eligibly', text: 'checks whether a UK job can sponsor a visa', link: 'https://www.eligibly.co.uk', github: 'https://github.com/akshita9696/eligibly' }],
    note: "Live and still being built. It's in the Gallery too.",
  },
}

// The Gallery tab: one row of project cards. Each `image` is a picture in public/images/projects/
// (the n8n workflow itself, stitched from screenshots with sticky-note text blurred).
// Clicking a card opens it full size. On the card itself, `focus` zooms into the most
// interesting part (x% and y% across the picture, and how far to zoom), usually the AI step.
// `fit: 'cover'` simply fills the card (used for the website screenshot).
// `colors` are the two shades of the cover if a picture is missing.
export const gallery = {
  row: 'Recruiters also watched',
  view: 'View full size',
  watch: 'Watch it run',
  visit: 'Visit site',
  projects: [
    {
      title: 'AI Customer Support Agent',
      kind: 'AI automation',
      made: "I made an AI that reads customer emails, finds the answer in the business's own FAQs and documents, and writes a reply for the owner to approve.",
      for: 'Any small business, for example property management and real estate.',
      image: '/images/projects/support-agent.jpg', flow: 'support-agent', focus: { x: 46, y: 34, zoom: 1.35 },
      colors: ['#0f766e', '#042f2e'],
    },
    {
      title: 'AI Receptionist',
      kind: 'AI automation',
      made: 'I made a voice AI that answers the phone, books, moves and cancels appointments, takes messages, and emails the owner when a person needs to call back.',
      for: 'Clinics, salons, trades and any business that misses calls.',
      image: '/images/projects/receptionist.jpg', flow: 'receptionist', focus: { x: 42, y: 42, zoom: 1.45 },
      colors: ['#6d28d9', '#1e1036'],
    },
    {
      title: 'Lead Intelligence System',
      kind: 'AI automation',
      made: 'I made a system that finds local businesses on Google Maps, checks their website, reviews and YouTube, picks out their biggest problem, ranks them, and drafts a personal outreach email.',
      for: 'Agencies, real estate, aesthetics clinics and dentists looking for new clients.',
      image: '/images/projects/lead-intelligence.jpg', flow: 'lead-intel', focus: { x: 60, y: 24, zoom: 2.6 },
      colors: ['#b45309', '#2b1503'],
    },
    {
      title: 'Quote Follow-Up',
      kind: 'AI automation',
      made: 'I made an automation that chases every quote with up to 4 different messages, and stops as soon as the client replies or opts out.',
      for: 'Trades and service businesses losing jobs to unanswered quotes.',
      image: '/images/projects/quote-follow-up.jpg', flow: 'quote', focus: { x: 38, y: 62, zoom: 1.25 },
      colors: ['#be123c', '#2d0610'],
    },
    {
      title: 'Reactivation and Reviews',
      kind: 'AI automation',
      made: 'I made an automation that brings back customers who are overdue a visit, asks every customer for a review after a job, and respects anyone who opts out.',
      for: 'Dentists, salons and home services that rely on repeat customers.',
      image: '/images/projects/reactivation-reviews.jpg', flow: 'reactivation', focus: { x: 55, y: 62, zoom: 1.2 },
      colors: ['#15803d', '#05210f'],
    },
    {
      title: 'Property Management Automation',
      kind: 'AI automation',
      made: 'I made a set of automations for booking, job intake, invoicing, subcontractor tax (CIS) through Xero, and a weekly summary for the owner.',
      for: 'Letting agents and property maintenance companies.',
      image: '/images/projects/property-management.jpg', flow: 'property', focus: { x: 30, y: 30, zoom: 1.5 },
      colors: ['#1d4ed8', '#081433'],
    },
    {
      title: 'AI Automation Agency Backend',
      kind: 'AI automation',
      made: 'I made the system behind my own automation business: it takes in leads from my form, syncs meetings, and replies to emails using my own knowledge base.',
      for: 'Running my own business.',
      image: '/images/projects/agency-backend.jpg', flow: 'agency', focus: { x: 42, y: 38, zoom: 1.3 },
      colors: ['#c026d3', '#2a0730'],
    },
    {
      title: 'Lead Gen Prospecting',
      kind: 'AI automation',
      made: 'I made an automation that searches Google for prospects every week, finds their contact details, and saves them to a CRM.',
      for: 'Building a list of people to sell to.',
      image: '/images/projects/lead-gen-prospecting.jpg', flow: 'lead-gen', focus: { x: 60, y: 56, zoom: 2.5 },
      colors: ['#0369a1', '#03192b'],
    },
    {
      title: 'William ESQ Website',
      kind: 'Website',
      made: 'We built a full website for a property maintenance company, with automation built in: quote requests and repair tickets are logged and tracked, customers and the business get emails automatically at every step, and the site is set up so ChatGPT and Google\'s AI answers can find it.',
      for: 'A Bristol property maintenance company serving landlords, letting agents and student housing.',
      image: '/images/projects/william-esq.jpg', fit: 'cover',
      site: 'https://www.williamesq.co.uk',
      // The site's own colours: lime on near-black.
      colors: ['#3a4200', '#0d0f00'],
      ink: '#E1FF00',
    },
  ],
  // Row 2: what's being built right now. A `link` shows a "Take a peek" button.
  peek: 'Take a peek',
  github: 'View on GitHub',
  building: {
    row: 'Coming soon: now building',
    projects: [
      {
        title: 'Eligibly',
        kind: 'Building now',
        building: true,
        made: "I'm building a checker that reads a UK job advert and tells you whether it can sponsor a visa: the occupation code, the salary floor that applies to you, and whether the employer holds a licence.",
        for: 'International graduates and job seekers in the UK.',
        link: 'https://www.eligibly.co.uk',
        github: 'https://github.com/akshita9696/eligibly',
        image: '/images/projects/eligibly.jpg', fit: 'cover',
        colors: ['#4338ca', '#0f0b33'],
      },
    ],
  },
  // Row 3: the marketing years in India, told in CRM and lifecycle terms.
  // No campaign files survived, so each `photo` is an unbranded AI-made scene (no logos)
  // with the brand names written on top.
  earlier: {
    row: 'Where it all started',
    projects: [
      {
        title: 'B2B Brand Partnerships',
        photo: '/images/projects/india-b2b.jpg',
        kind: 'Marketing · New Delhi',
        made: "I opened an independent Delhi agency's route into Tier-1 drinks and FMCG brands, owning each account from pitch and proposal to signed contract, delivery and ROI report, and won £90k+ in partnership revenue.",
        for: 'Tier-1 brands including Budweiser and Kingfisher.',
        brands: ['Budweiser', 'Kingfisher'],
        colors: ['#c2410c', '#2a0d02'],
      },
      {
        title: 'Creator Programme',
        photo: '/images/projects/india-creators.jpg',
        kind: 'Marketing · New Delhi',
        made: 'I ran 50+ creator partnerships end to end: sourcing, briefing, approvals and performance tracking against monthly KPIs for every brand, and lifted client engagement by 35%.',
        for: 'Brands including Mamaearth, Sula Wines, Whisper and Blue Tokai.',
        brands: ['Mamaearth', 'Sula Wines', 'Whisper', 'Blue Tokai'],
        colors: ['#a21caf', '#24052a'],
      },
      {
        title: 'Campaigns for 20+ Brands',
        photo: '/images/projects/india-campaigns.jpg',
        kind: 'Marketing · New Delhi',
        made: "I planned and delivered integrated campaigns across social, digital, print, out-of-home and events, shaping each brand's customer journey and leading a cross-functional team of 10.",
        for: 'Food, drinks, beauty and hospitality brands, from Hyatt and JW Marriott to Master Chow.',
        brands: ['Hyatt', 'JW Marriott', 'Master Chow', 'Kalyan Jewellers'],
        colors: ['#0e7490', '#021a20'],
      },
    ],
  },
  // Row 4: MSc projects at the University of Bristol, always labelled as university work.
  // The photos are unbranded on purpose, so nothing suggests these brands were clients.
  university: {
    row: 'University projects',
    projects: [
      {
        title: 'Hotel Chocolat Digital Strategy',
        photo: '/images/projects/msc-hotel-chocolat.jpg',
        kind: 'University project',
        made: 'I audited every channel Hotel Chocolat owns, mapped the customer journey, and set the role, cadence and content for each platform, with the website as the place to convert.',
        for: 'A premium retailer, as an MSc project at the University of Bristol.',
        colors: ['#7c2d12', '#1f0a03'],
      },
      {
        title: 'Maybelline Marketing Data Analysis',
        photo: '/images/projects/msc-maybelline.jpg',
        kind: 'University project',
        made: 'I analysed customer comments on the Super Stay lipstick range, separating praise from complaints and finding which themes drove response and which carried risk.',
        for: 'A beauty brand, as an MSc project at the University of Bristol.',
        colors: ['#be185d', '#2b0516'],
      },
      {
        title: 'AR/VR Gamified Marketing',
        photo: '/images/projects/msc-ar-vr.jpg',
        kind: 'University project',
        made: 'I designed augmented and virtual reality brand experiences with game mechanics, and built working prototypes to test whether immersive formats hold attention better than normal campaigns.',
        for: 'Brands exploring immersive marketing, as an MSc project at the University of Bristol.',
        colors: ['#6d28d9', '#0b1a33'],
      },
    ],
  },
}

// The search box behind the nav's magnifying glass.
export const search = {
  label: 'Search my portfolio',
  placeholder: 'Search my CV and projects',
  tryLabel: 'Try searching for',
  tryThese: ['Marketing automation', 'AI', 'n8n', 'HubSpot', 'Budweiser', 'Bristol'],
  none: 'Nothing found for',
  noneHint: 'Try marketing automation, HubSpot or AI.',
  sections: {
    about: 'About',
    experience: 'Experience',
    education: 'Education',
    tools: 'Tools',
    building: 'Now building',
    projects: 'Projects',
    earlier: 'Earlier work',
    building: 'Now building',
    university: 'University project',
    contact: 'Contact',
  },
}

// The big pop-ups behind the plus, thumbs up and thumbs down buttons.
// Each button is { label, do }: 'share' opens the share pop-up, 'contact' starts an email,
// 'feedback' starts an email to me, 'close' just closes.
export const reactions = {
  shortlist: {
    title: "You've got great taste",
    text: "Thanks for shortlisting me! Most people just scroll past. You stopped, which means you've already spotted your right hire. Shall we make it official?",
    buttons: [
      { label: 'Email me', do: 'contact' },
      { label: 'Share with my team', do: 'share' },
    ],
  },
  like: {
    title: 'That made my day!',
    text: "Thank you! A like from someone hiring is basically a first-round interview, right? If you think your team would like me too, send this their way.",
    buttons: [
      { label: 'Share with my team', do: 'share' },
      { label: 'Close', do: 'close' },
    ],
  },
  dislike: {
    title: 'Sorry about that!',
    text: "We'll try to make it better. Tell me what missed the mark, and I'll fix it before my next take.",
    buttons: [
      { label: 'Tell me what to fix', do: 'feedback' },
      { label: 'Close', do: 'close' },
    ],
  },
}

// The "Email me" pop-up.
export const contact = {
  email: 'akshitadhariwal96@gmail.com',
  title: "Let's talk",
  text: "I'd love to hear about the role. Drop me a line and I'll get back to you quickly.",
  copy: 'Copy email',
  copied: 'Copied!',
  write: 'Write an email',
  subject: 'Your portfolio caught my eye',
}

// The "Contact us" section and footer at the bottom of the page.
export const footer = {
  title: 'Contact us',
  text: "Hiring a marketing automation manager? I'd love to hear from you.",
  links: [
    { key: 'email', label: 'Email', handle: 'akshitadhariwal96@gmail.com', href: 'mailto:akshitadhariwal96@gmail.com?subject=Your%20portfolio%20caught%20my%20eye' },
    { key: 'linkedin', label: 'LinkedIn', handle: 'in/akshitadhariwal', href: 'https://www.linkedin.com/in/akshitadhariwal' },
    { key: 'github', label: 'GitHub', handle: '@akshita9696', href: 'https://github.com/akshita9696' },
  ],
  playLine: 'By clicking play, you agree to watch until the end.',
  copyright: '© 2026 Akshita Dhariwal. A life video original.',
}

// The feedback form behind "Tell me what to fix".
// `endpoint` is where the form sends its answers (an n8n webhook, for example).
// While it's empty, sending opens the visitor's email app with their note filled in.
export const feedback = {
  endpoint: '',
  title: 'Tell me what to fix',
  text: "Be honest, I can take it. What would make this better?",
  placeholder: 'What missed the mark?',
  emailLabel: 'Your email, if you would like a reply (optional)',
  send: 'Send feedback',
  sending: 'Sending…',
  subject: 'Feedback on your portfolio',
  thanks: { title: 'Thank you!', text: "Your feedback is on its way to me. I'll use it to make the next take better." },
  failed: "That didn't send. Please try again, or email me instead.",
}

// The small messages the remaining hero buttons show when pressed.
export const actions = {
  play: 'My intro video is coming soon.',
}

// The "Try my AI" pop-up: a visitor pastes their website and my n8n workflow
// reads the landing page and suggests 3 AI automations for their business.
// `endpoint` is that workflow's webhook ("Portfolio: AI Ideas Widget" in n8n, PORTFOLIO folder).
// While it's empty, the pop-up says it's warming up.
export const tryAI = {
  endpoint: 'https://kreyansh.app.n8n.cloud/webhook/portfolio-ai-ideas',
  title: 'Test my AI workflow',
  text: 'Paste your website. My mini agent reads your landing page and suggests 3 AI automations for your business, in about 5 seconds.',
  placeholder: 'yourcompany.com',
  go: 'Analyse my site',
  steps: ['Reading your landing page', 'Understanding your business', 'Writing your 3 ideas'],
  resultTitle: 'Here are your 3 ideas',
  ideaLabel: 'Idea',
  cta: "Want one of these built? Let's talk",
  again: 'Try another site',
  badUrl: "That doesn't look like a website address. Try something like yourcompany.com",
  failed: "I couldn't read that site. Some sites block visitors like my agent. Try another one?",
  offline: 'My AI is being plugged in right now. Check back very soon!',
  busy: "My AI has hit its daily limit (it's popular!). Try again tomorrow, or email me and I'll send you ideas myself.",
  contactSubject: 'AI automation ideas for',
}

// The big pop-up behind the Share button.
export const share = {
  title: 'Share my portfolio',
  text: 'Know a hiring manager who should see this? Copy the link or send it straight to them.',
  copy: 'Copy link',
  copied: 'Copied!',
  more: 'More options',
  subject: 'Akshita Dhariwal: your next hire',
  message: 'Take a look at Akshita Dhariwal, a marketing automation manager who builds with AI:',
}
