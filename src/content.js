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
  // The intro video that "Play now" opens. Swap in a Loom link here if you upload it there instead.
  video: '/videos/intro.mp4',
  tryAI: 'Try my AI',
  included: 'Included in Life',
  isNew: 'NEW MOVIE',
  rank: '#1 in inspiring movies',
  description:
    'She marketed 20+ brands across India, from Budweiser to Hyatt to Mamaearth. Then she crossed continents, earned a Bristol MSc, and became the CRM analyst who got every system talking to each other. By night, she builds AI that answers phones, finds leads and never asks for a day off. The final scene is yours to write. Spoiler: it ends with "You\'re hired."',
  genres: ['Inspiring', 'Drama', 'Feel-good'],
  rating: 'AMDb 9/10',
  year: '2026',
  runtime: '12 min',
  cast: ['Akshita Dhariwal'],
}

// The Details tab. Left column: two boxes. Right column: three boxes.
// Anything in [brackets] is a placeholder still to be filled in.
export const details = {
  tabs: ['Gallery', 'Details'],
  experience: {
    title: 'Experience',
    badges: ['DATA VISION', 'CRM', 'AI'],
    intro:
      'Twelve years of work, from a first job at 18 to running CRM and AI automation. Brand, creator and partnership marketing for 20+ brands in India, B2B and B2C, then CRM, data and automation in the UK.',
    roles: [
      { when: '2026 to now', role: 'Founder', org: 'Property operations automation', text: 'AI systems for letting agents: maintenance intake, compliance tracking and tenant communication, with a human approving anything sensitive.' },
      { when: 'Jul 2025 to Oct 2026', role: 'CRM Analyst', org: 'Hillcrest Estate Management, Bristol', text: 'Connected Fixflo to HubSpot with Zapier, built Power BI dashboards that saved around 7 hours a week, ran Mailchimp campaigns and automated contractor renewals.' },
      { when: 'Aug 2024 to Apr 2025', role: 'Crew Trainer, promoted to Shift Manager', org: "McDonald's, Bristol", text: 'Trained new crew, then ran shifts.' },
      { when: '[dates]', role: 'Marketing Manager', org: 'Blisstro Videos, India', text: 'Integrated campaigns for 20+ brands across food, drinks, FMCG, beauty and hospitality, including Budweiser, Sula Wines, Mamaearth, Whisper, Master Chow, Blue Tokai, Hyatt and JW Marriott. Won £90k+ in B2B partnership revenue, ran 50+ creator partnerships, led a team of 10, and lifted engagement 35%.' },
      { when: 'Jul 2021 to Jun 2022', role: 'Marketing Executive', org: 'Blisstro Videos, India', text: 'Campaigns for brand clients across social, digital, print and out-of-home, plus music and culture events including Sunburn, Supersonic and Inscape.' },
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

// The Gallery tab: one row of project cards. Put a picture in public/images/projects/
// and its path in `image`; clicking the card then opens it full size.
// `colors` are the two shades of the cover until the picture is in.
export const gallery = {
  row: 'Recruiters also watched',
  view: 'View picture',
  visit: 'Visit site',
  projects: [
    {
      title: 'AI Customer Support Agent',
      kind: 'AI automation',
      made: "I made an AI that reads customer emails, finds the answer in the business's own FAQs and documents, and writes a reply for the owner to approve.",
      for: 'Small businesses that get the same questions every day.',
      image: '',
      colors: ['#0f766e', '#042f2e'],
    },
    {
      title: 'AI Receptionist',
      kind: 'AI automation',
      made: 'I made a voice AI that answers the phone, books, moves and cancels appointments, takes messages, and emails the owner when a person needs to call back.',
      for: 'Clinics, salons and trades that miss calls.',
      image: '',
      colors: ['#6d28d9', '#1e1036'],
    },
    {
      title: 'Lead Intelligence System',
      kind: 'AI automation',
      made: 'I made a system that finds local businesses on Google Maps, checks their website, reviews and YouTube, picks out their biggest problem, ranks them, and drafts a personal outreach email.',
      for: 'Agencies and freelancers looking for new clients.',
      image: '',
      colors: ['#b45309', '#2b1503'],
    },
    {
      title: 'Quote Follow-Up',
      kind: 'AI automation',
      made: 'I made an automation that chases every quote with up to 4 different messages, and stops as soon as the client replies or opts out.',
      for: 'Trades and service businesses losing jobs to unanswered quotes.',
      image: '',
      colors: ['#be123c', '#2d0610'],
    },
    {
      title: 'Reactivation and Reviews',
      kind: 'AI automation',
      made: 'I made an automation that brings back customers who are overdue a visit, asks every customer for a review after a job, and respects anyone who opts out.',
      for: 'Dentists, salons and home services that rely on repeat customers.',
      image: '',
      colors: ['#15803d', '#05210f'],
    },
    {
      title: 'Property Management Automation',
      kind: 'AI automation',
      made: 'I made a set of automations for booking, job intake, invoicing, subcontractor tax (CIS) through Xero, and a weekly summary for the owner.',
      for: 'Letting agents and property maintenance companies.',
      image: '',
      colors: ['#1d4ed8', '#081433'],
    },
    {
      title: 'AI Automation Agency Backend',
      kind: 'AI automation',
      made: 'I made the system behind my own automation business: it takes in leads from my form, syncs meetings, and replies to emails using my own knowledge base.',
      for: 'Running my own business.',
      image: '',
      colors: ['#c026d3', '#2a0730'],
    },
    {
      title: 'Lead Gen Prospecting',
      kind: 'AI automation',
      made: 'I made an automation that searches Google for prospects every week, finds their contact details, and saves them to a CRM.',
      for: 'Building a list of people to sell to.',
      image: '',
      colors: ['#0369a1', '#03192b'],
    },
    {
      title: 'William ESQ Website',
      kind: 'Website',
      made: 'We built a full website for a property maintenance company, with automation built in: quote requests and repair tickets are logged and tracked, customers and the business get emails automatically at every step, and the site is set up so ChatGPT and Google\'s AI answers can find it.',
      for: 'A Bristol property maintenance company serving landlords, letting agents and student housing.',
      image: '',
      site: 'https://www.williamesq.co.uk',
      // The site's own colours: lime on near-black.
      colors: ['#3a4200', '#0d0f00'],
      ink: '#E1FF00',
    },
  ],
}

// The search box behind the nav's magnifying glass.
export const search = {
  label: 'Search my portfolio',
  placeholder: 'Search my CV and projects',
  tryLabel: 'Try searching for',
  tryThese: ['CRM', 'AI automation', 'HubSpot', 'Budweiser', 'Power BI', 'Bristol'],
  none: 'Nothing found for',
  noneHint: 'Try CRM, HubSpot or AI.',
  sections: {
    about: 'About',
    experience: 'Experience',
    education: 'Education',
    tools: 'Tools',
    building: 'Now building',
    projects: 'Projects',
  },
}

// The big pop-ups behind the plus, thumbs up and thumbs down buttons.
// Each button is { label, do }: 'share' opens the share pop-up, 'cv' the CV one,
// 'feedback' starts an email to me, 'close' just closes.
export const reactions = {
  shortlist: {
    title: "You've got great taste",
    text: "Thanks for shortlisting me! Most people just scroll past. You stopped, which means you've already spotted your right hire. Shall we make it official?",
    buttons: [
      { label: 'Download my CV', do: 'cv' },
      { label: 'Email me', do: 'contact' },
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
  message: 'Take a look at Akshita Dhariwal, a marketer who builds AI automation:',
}

// The Download button. Put the PDF in public/cv/ and its path in `file`.
// Until then, the pop-up says the CV is coming soon.
export const cv = {
  file: '',
  done: { title: 'Your CV has been downloaded', text: "Thanks for your interest! It's in your downloads folder. Want to pass my portfolio on to your team?" },
  soon: { title: 'My CV is almost ready', text: "It'll be here very soon. In the meantime, you can share my portfolio with your team." },
  shareNow: 'Share it now',
  close: 'Close',
}
