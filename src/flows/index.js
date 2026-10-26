// "Watch it run" stories for the Gallery's automation cards.
// Each one plays on top of the real n8n pictures. The layout files hold every step's
// position and every wire's shape, read straight from the workflows in n8n (names and
// positions only, no settings). The example messages are made up; the steps and the
// safety checks are the real ones, taken from the workflows' own notes.
//
// The pictures were taken at half size, so a step at n8n position (x, y) sits at
// picture (x / 2 + offset). The player lays a system's pictures side by side in order.
// The support agent's main picture doubles as its Gallery cover.
// Step ids are "<workflow key>:<step name>". A hand-off is the moment one workflow
// passes the job to the next, shown as a badge between the two pictures.

import supportAgent from './support-agent.layout.json'
import receptionist from './receptionist.layout.json'
import quote from './quote.layout.json'
import reactivation from './reactivation.layout.json'
import leadIntel from './lead-intel.layout.json'
import property from './property.layout.json'
import agency from './agency.layout.json'
import leadGen from './lead-gen.layout.json'

const steps = (key, names) => names.map((n) => `${key}:${n}`)

export const flows = {
  'support-agent': {
    title: 'AI Customer Support Agent',
    built: 'Built in n8n with Gmail, Gemini, Supabase and Airtable.',
    stats: ['4 workflows', '33 steps in the main one', '5 checks that hand over to a person'],
    workflows: supportAgent,
    // The person between the two workflows: nothing is sent until the owner ticks Approved.
    handoffs: [{ id: 'approve', label: 'Owner ticks Approved', from: 'r:Wait 200ms', to: 's:Poll Every 15 Minutes' }],
    runs: [
      {
        name: 'A question it can answer',
        steps: [
          {
            title: 'A customer emails',
            text: 'The inbox is checked every minute. The email is tidied into one standard shape and empty ones are dropped. Its own alerts and bounced emails are filtered out, so it can never answer itself in a loop.',
            data: '"Hi, what number do I call for an emergency repair at the weekend?"',
            nodes: steps('r', ['Watch Support Inbox', 'Normalize Gmail Input', 'Prepare Message Record', 'Has Inbound Message?']),
          },
          {
            title: 'AI reads it',
            text: 'Gemini works out what the customer wants, how urgent it is and whether they sound upset. Then two checks: did the AI call work, and does a person need to step in?',
            data: 'Question · not urgent · calm → safe to answer',
            nodes: steps('r', ['Classify Message', 'AI Classify Call OK?', 'Escalate Immediately?']),
          },
          {
            title: "Searches the business's own documents",
            text: 'The message is matched against the knowledge base in Supabase and the 3 closest entries are combined. No match means a person takes over, never a guess.',
            data: '3 matches · Emergency repairs FAQ',
            nodes: steps('r', ['Retrieve KB Matches', 'Combine KB Context', 'KB Matches Found?']),
          },
          {
            title: 'AI writes a reply, then checks it',
            text: 'Gemini drafts a reply using only those documents and has to say whether every word came from them. If the call failed or it guessed anything, a person takes over.',
            data: '"For emergency repairs out of hours, call our emergency line..." · fully backed',
            nodes: steps('r', ['Draft Reply', 'AI Answer Call OK?', 'Reply Grounded?']),
          },
          {
            title: 'Saved for approval and logged',
            text: 'The draft waits in Airtable. Nothing is ever sent from this workflow. Every outcome, replied or handed over, gets one row in the conversation log.',
            data: 'Waiting for the owner',
            nodes: steps('r', ['Save Draft for Approval', 'Note - Draft Saved', 'Log to Conversation Log', 'Wait 200ms']),
          },
          {
            title: 'The owner approves',
            text: 'The owner ticks Approved in Airtable. A second workflow checks for approved drafts every 15 minutes, which leaves a window to un-tick a mistake.',
            data: 'Approved ✓',
            nodes: ['approve', ...steps('s', ['Poll Every 15 Minutes', 'Get Approved Unsent Drafts', 'Loop Over Drafts'])],
          },
          {
            title: 'Reply sent in the same thread',
            text: "Each approved draft goes out as a reply in the customer's original email thread and is marked as sent. If a send fails, the error is logged and it retries on the next check.",
            data: 'Sent and logged',
            nodes: steps('s', ['Send Approved Reply', 'Send OK?', 'Mark Draft as Sent', 'Wait 200ms', 'Loop Over Drafts', 'All Replies Sent']),
          },
        ],
      },
      {
        name: 'An upset customer',
        steps: [
          {
            title: 'A customer emails',
            text: 'Same inbox, same one-minute check, same tidy-up.',
            data: '"Third time the heating has broken this month. I want compensation."',
            nodes: steps('r', ['Watch Support Inbox', 'Normalize Gmail Input', 'Prepare Message Record', 'Has Inbound Message?']),
          },
          {
            title: 'AI reads it',
            text: 'Gemini spots a complaint, a request for money and an upset customer. That needs a person, so it skips the AI reply completely.',
            data: 'Complaint · urgent · upset → hand over',
            nodes: steps('r', ['Classify Message', 'AI Classify Call OK?', 'Escalate Immediately?']),
          },
          {
            title: 'The owner gets an alert',
            text: 'An email goes to the owner with the message and the reason it was handed over, so they can call back fast. The workflow even checks that the alert was sent.',
            data: 'Reason: complaint, customer upset',
            nodes: steps('r', ['Note - Escalate Immediately', 'Build Escalation Email', 'Send Escalation Alert', 'Escalation Sent OK?']),
          },
          {
            title: 'Logged',
            text: 'The hand-over is written to the conversation log, so no message is ever lost.',
            data: 'Handed over and logged',
            nodes: steps('r', ['Note - Escalation Sent', 'Log to Conversation Log', 'Wait 200ms']),
          },
        ],
      },
      {
        name: 'No answer in the documents',
        steps: [
          {
            title: 'A customer emails',
            text: 'Same inbox, same one-minute check, same tidy-up.',
            data: '"Can I keep a dog in my flat?"',
            nodes: steps('r', ['Watch Support Inbox', 'Normalize Gmail Input', 'Prepare Message Record', 'Has Inbound Message?']),
          },
          {
            title: 'AI reads it',
            text: 'A simple, calm question. Safe to try answering.',
            data: 'Question · not urgent · calm → safe to answer',
            nodes: steps('r', ['Classify Message', 'AI Classify Call OK?', 'Escalate Immediately?']),
          },
          {
            title: "Searches the business's own documents",
            text: 'Nothing in the knowledge base covers it. Instead of making something up, it hands over to a person.',
            data: '0 matches',
            nodes: steps('r', ['Retrieve KB Matches', 'Combine KB Context', 'KB Matches Found?']),
          },
          {
            title: 'The owner gets an alert',
            text: 'The owner gets the question with the reason "No matching knowledge base entry found", and the hand-over is logged.',
            data: 'Reason: no answer in the documents',
            nodes: steps('r', ['Note - No KB Match', 'Build Escalation Email', 'Send Escalation Alert', 'Escalation Sent OK?', 'Note - Escalation Sent', 'Log to Conversation Log', 'Wait 200ms']),
          },
        ],
      },
    ],
  },

  receptionist: {
    title: 'AI Receptionist',
    built: 'Built in n8n with Vapi voice AI, Google Calendar, Gemini, Airtable and Gmail.',
    stats: ['3 workflows', '68 steps', '5 things it can do on a call'],
    workflows: receptionist,
    handoffs: [
      { id: 'call-ends', label: 'The call ends', icon: 'phone', from: 'wf:1', to: '2:Receive End of Call Report' },
      { id: 'every-hour', label: 'Every hour', icon: 'clock', from: '2:Log to Interaction Log', to: '3:Every Hour' },
    ],
    runs: [
      {
        name: 'Booking an appointment',
        steps: [
          {
            title: 'A caller asks for an appointment',
            text: 'The voice AI (Vapi) is on the phone with the caller. When it needs to do something, it calls this workflow, which works out which of its 5 tools was asked for.',
            data: '"Can I book a cleaning for Tuesday at 10?"',
            nodes: steps('1', ['Receive Vapi Tool Call', 'Normalize Tool Call', 'Route by Tool Name']),
          },
          {
            title: 'Checks the date makes sense',
            text: 'A booking in the past is caught before anything touches the calendar.',
            data: 'Tuesday 10:00 · in the future',
            nodes: steps('1', ['Booking Date Sane?']),
          },
          {
            title: 'Books it in the calendar',
            text: 'It creates the Google Calendar event, then logs the appointment in Airtable so the reminders know it exists. If the calendar write fails, the caller is told honestly instead of getting a false confirmation.',
            data: 'Booked ✓',
            nodes: steps('1', ['Create Booking', 'Booking Created OK?', 'Log Appointment Record (Booked)', 'Format Booking Confirmation', 'Respond - Booking']),
          },
          {
            title: 'The call ends and Gemini reads it',
            text: 'When the call ends, Vapi sends the full transcript. Gemini decides how it went: booked, cancelled, a message, or someone needs to ring back. If Gemini fails, the call is marked Unclear and flagged, never dropped.',
            data: 'Outcome: booked',
            nodes: ['call-ends', ...steps('2', ['Receive End of Call Report', 'Is End-Of-Call Report?', 'Prepare Call Record', 'Classify Call Outcome', 'AI Classify OK?', 'Prepare Outcome (Classified)'])],
          },
          {
            title: 'Nobody needs to call back, so it is logged quietly',
            text: 'Every call lands in the interaction log, whether it needed a person or not. That log is the record you would show a client.',
            data: 'Logged',
            nodes: steps('2', ['Needs Escalation?', 'Note - No Escalation Needed', 'Log to Interaction Log']),
          },
          {
            title: 'A reminder the day before',
            text: "Every hour it looks for bookings in the next 24 hours that haven't been reminded yet. It reads from Airtable, so it only reminds people about bookings this system made.",
            data: 'Due tomorrow at 10:00',
            nodes: ['every-hour', ...steps('3', ['Every Hour', 'Get Appointments Due in 24h', 'Lookup OK?', 'Has Customer Email?'])],
          },
          {
            title: 'Reminder sent, never twice',
            text: 'The customer gets the reminder by email and the booking is marked, so nobody is reminded twice. Email for now; text messages slot in when a paying client needs them.',
            data: 'Reminder sent ✓',
            nodes: steps('3', ['Send Customer Reminder', 'Customer Reminder Sent OK?', 'Mark Reminder Sent']),
          },
        ],
      },
      {
        name: 'A caller who needs a person',
        steps: [
          {
            title: 'A caller asks for something the AI should not handle',
            text: 'Same phone line, same routing to the right tool.',
            data: '"I want to talk to someone about my bill."',
            nodes: steps('1', ['Receive Vapi Tool Call', 'Normalize Tool Call', 'Route by Tool Name']),
          },
          {
            title: 'Takes a message',
            text: 'Anything the AI should not handle itself, like a complaint or a pricing question, is logged in Airtable as a message for a person to follow up.',
            data: 'Message taken',
            nodes: steps('1', ['Format Message', 'Log Message Taken', 'Respond - Message Taken']),
          },
          {
            title: 'The call ends and Gemini reads it',
            text: 'Gemini reads the transcript and sees the caller asked for a person.',
            data: 'Outcome: needs a call back',
            nodes: ['call-ends', ...steps('2', ['Receive End of Call Report', 'Is End-Of-Call Report?', 'Prepare Call Record', 'Classify Call Outcome', 'AI Classify OK?', 'Prepare Outcome (Classified)'])],
          },
          {
            title: 'The owner gets an email',
            text: 'An email goes out when the AI could not finish the job, the caller asked for a person, or the call dropped. The call is logged either way.',
            data: 'Alert sent · logged',
            nodes: steps('2', ['Needs Escalation?', 'Send Escalation Alert', 'Escalation Sent OK?', 'Note - Escalation Sent', 'Log to Interaction Log']),
          },
        ],
      },
      {
        name: 'Moving an appointment',
        steps: [
          {
            title: 'A caller wants to move their booking',
            text: 'Same phone line, same routing to the right tool.',
            data: '"Can I move my appointment to Friday?"',
            nodes: steps('1', ['Receive Vapi Tool Call', 'Normalize Tool Call', 'Route by Tool Name']),
          },
          {
            title: 'Finds the booking by phone number',
            text: "It looks up the caller's booking by their phone number first. If nothing is found, the AI offers to take a message instead of guessing.",
            data: 'Found: Tuesday 10:00',
            nodes: steps('1', ['Find Appointment by Phone (Reschedule)', 'Appointment Found (Reschedule)?']),
          },
          {
            title: 'Moves it',
            text: 'It updates the calendar, marks the Airtable record Rescheduled and tells the caller.',
            data: 'Moved to Friday ✓',
            nodes: steps('1', ['Update Event (Reschedule)', 'Reschedule Update OK?', 'Update Appointment Status (Rescheduled)', 'Format Reschedule Success', 'Respond - Reschedule']),
          },
        ],
      },
    ],
  },

  quote: {
    title: 'Quote Follow-Up',
    built: 'Built in n8n with Airtable, Gemini and Gmail.',
    stats: ['3 workflows', '46 steps', 'Up to 4 chases, then it stops'],
    workflows: quote,
    handoffs: [
      { id: 'next-morning', label: 'Next morning', icon: 'clock', from: 'wf:1', to: '2:Run Once Each Morning' },
      { id: 'client-replies', label: 'The client replies', icon: 'mail', from: 'wf:2', to: '3:Watch the Inbox for Replies' },
    ],
    runs: [
      {
        name: 'Chasing a quote',
        steps: [
          {
            title: 'A quote goes out',
            text: 'Anything that can send a web request, like a form, a CRM or an Airtable button, logs the quote. It lands in the quote register and the sender is told it was saved. If Airtable refuses, the owner is emailed instead of it failing quietly.',
            data: 'Boiler replacement · £2,400',
            nodes: steps('1', ['Receive New Quote', 'Normalize Quote Input', 'Required Fields Present?', 'Build Register Row', 'Create Quote Record', 'Respond Logged']),
          },
          {
            title: 'Every morning, it finds quotes due a nudge',
            text: 'Once a day it asks Airtable which quotes are due a chase. Quotes that were replied to, won, lost or opted out are filtered out before anything is written.',
            data: '3 quotes due today',
            nodes: ['next-morning', ...steps('2', ['Run Once Each Morning', 'Find Quotes Due a Chase', 'Loop Over Due Quotes'])],
          },
          {
            title: 'A different angle each time',
            text: 'The touch number picks the angle: a friendly check-in, the likely objection, an offer to talk, then a smaller starting option. Gemini writes it so it sounds like a person. If Gemini is down, a plain pre-written version goes instead.',
            data: 'Touch 2 · answer the likely objection',
            nodes: steps('2', ['Pick Chase Angle', 'Write the Follow-Up', 'Use AI Copy']),
          },
          {
            title: 'Sent and logged',
            text: 'The register gets the new touch count and next date, and the message is copied into the touch log. If the email fails, the owner is alerted and it retries tomorrow.',
            data: 'Sent · next chase booked',
            nodes: steps('2', ['Send Follow-Up Email', 'Update Quote After Send', 'Log the Touch', 'Was That the Last Touch?']),
          },
          {
            title: 'The owner gets a daily summary',
            text: 'When every due quote has been chased, the owner gets one summary email. After the fourth touch a quote is marked Stopped and nobody gets a fifth.',
            data: 'Daily summary sent',
            nodes: steps('2', ['Loop Over Due Quotes', 'Build Run Summary', 'Send Owner the Daily Summary']),
          },
        ],
      },
      {
        name: 'The client replies',
        steps: [
          {
            title: 'The client writes back',
            text: 'It watches the inbox. When an email arrives, it checks whether the sender has a live quote. This is the stop switch: nobody gets chased after they reply.',
            data: '"Thanks, can we start in March?"',
            nodes: ['client-replies', ...steps('3', ['Watch the Inbox for Replies', 'Normalize the Reply', 'Could Read a Sender Address?', 'Find a Matching Live Quote', 'Is This About a Quote?'])],
          },
          {
            title: 'Gemini reads the reply',
            text: 'Gemini decides what the reply means. If Gemini fails, it scans for opt-out words itself and errs towards stopping.',
            data: 'A normal reply, not an opt-out',
            nodes: steps('3', ['Read the Reply', 'Use AI Reading', 'Did They Ask to Stop?']),
          },
          {
            title: 'The chase stops and the owner hears about it',
            text: 'The quote is marked Replied, which takes it out of the chase, and the reply is forwarded so the owner can answer it like a human.',
            data: 'Chase stopped · reply forwarded',
            nodes: steps('3', ['Mark the Quote as Replied', 'Forward the Reply to the Owner']),
          },
        ],
      },
      {
        name: 'The client asks to stop',
        steps: [
          {
            title: 'The client writes back',
            text: 'Same inbox watch, same check for a live quote.',
            data: '"Please stop emailing me."',
            nodes: ['client-replies', ...steps('3', ['Watch the Inbox for Replies', 'Normalize the Reply', 'Could Read a Sender Address?', 'Find a Matching Live Quote', 'Is This About a Quote?'])],
          },
          {
            title: 'Gemini reads the reply',
            text: 'Gemini sees an opt-out.',
            data: 'Opt-out',
            nodes: steps('3', ['Read the Reply', 'Use AI Reading', 'Did They Ask to Stop?']),
          },
          {
            title: 'Flagged for good',
            text: 'The record is flagged permanently, so they can never be chased again, not for this quote or a future one. The owner is told.',
            data: 'Opted out · owner told',
            nodes: steps('3', ['Flag as Opted Out', 'Tell Owner They Opted Out']),
          },
        ],
      },
    ],
  },

  reactivation: {
    title: 'Reactivation and Reviews',
    built: 'Built in n8n with Airtable, Gemini and Gmail.',
    stats: ['3 workflows', '52 steps', 'No review gating, ever'],
    workflows: reactivation,
    runs: [
      {
        name: 'Bringing back a quiet customer',
        steps: [
          {
            title: "Every Monday, it finds who's overdue",
            text: 'Each customer has their own return window: 6 months for a dental check-up, 3 for Botox, 12 for a boiler service. Opted-out customers are filtered out first, and one run sends 25 messages at most.',
            data: 'Dental check-up · last visit 8 months ago',
            nodes: steps('1', ['Run Every Monday Morning', 'Find Customers Who Are Overdue', 'Cap This Run', 'Loop Over Overdue Customers']),
          },
          {
            title: 'Written to sound like the owner',
            text: "Gemini writes each message using how long they've been away and what they last had done. It reads as a check-in from someone who remembers them, never as marketing. If Gemini is down, a plain message goes instead.",
            data: '"It\'s been a while since your last check-up..."',
            nodes: steps('1', ['Prepare Customer', 'Write the Check-In', 'Use AI Message']),
          },
          {
            title: 'Sent, recorded, summarised',
            text: 'The customer record is updated so nobody is contacted twice inside 90 days, or more than twice ever. The owner gets a weekly summary.',
            data: 'Sent · weekly summary',
            nodes: steps('1', ['Send the Check-In', 'Update the Customer Record', 'Write to the Send Log', 'Loop Over Overdue Customers', 'Build Weekly Summary', 'Send Owner the Weekly Summary']),
          },
        ],
      },
      {
        name: 'Asking for a review',
        steps: [
          {
            title: 'A job is marked complete',
            text: "The business's own system sends the finished job here.",
            data: 'Boiler service · completed',
            nodes: steps('2', ['Receive Completed Job', 'Normalize the Job', 'Enough Detail to Send?', 'Settings - Edit These']),
          },
          {
            title: 'Checks the opt-out list',
            text: 'Anyone who has asked to be left alone is skipped.',
            data: 'Not on the list',
            nodes: steps('2', ['Have They Opted Out Before?', 'Are They on the Opt-Out List?']),
          },
          {
            title: 'Waits, then asks everyone the same way',
            text: "A couple of hours later, while it's still fresh, the customer gets one short email. Everyone gets the same email and the same private way to reply to a person. Nobody is screened first, because Google bans review gating.",
            data: 'Review request sent',
            nodes: steps('2', ['Wait Until It Is Fresh But Not Instant', 'Send the Review Request', 'Log the Review Request']),
          },
        ],
      },
      {
        name: 'Someone asks to be left alone',
        steps: [
          {
            title: 'An email arrives',
            text: 'Pass one is a free word check for the obvious ones: unsubscribe, remove me, stop emailing. Short, politely worded emails go to Gemini as a second pass.',
            data: '"Please remove me from your list."',
            nodes: steps('3', ['Watch the Inbox', 'Normalize the Message', 'Could Read a Sender Address?', 'Obvious Opt-Out Words?']),
          },
          {
            title: 'Suppressed everywhere',
            text: 'The address goes on the suppression list, which every review request checks, and their customer record is flagged, which takes them out of the reactivation sweep. Both, so nobody falls through a gap.',
            data: 'Suppressed · owner told',
            nodes: steps('3', ['Confirmed by Word Check', 'Add to the Suppression List', 'Are They a Known Customer?', 'Found Them in the Customer List?', 'Flag the Customer Record', 'Tell Owner Someone Opted Out']),
          },
        ],
      },
    ],
  },

  'lead-intel': {
    title: 'Lead Intelligence System',
    built: 'Built in n8n with DataForSEO, Firecrawl, the YouTube API, Gemini and Airtable.',
    stats: ['3 workflows', '71 steps', 'Nothing is ever sent automatically'],
    workflows: leadIntel,
    handoffs: [
      { id: 'deep-analysis', label: 'Deep analysis', icon: 'clock', from: 'wf:1', to: '2:Start Analysis Run' },
      { id: 'email-by-hand', label: 'Owner adds the email', icon: 'person', from: 'wf:2', to: '3:Start Draft Run' },
    ],
    runs: [
      {
        name: 'Finding and pitching a business',
        steps: [
          {
            title: 'Reads the search',
            text: 'It pulls the active search from Airtable and turns it into a Google Maps query.',
            data: 'Dentists · Bristol',
            nodes: steps('1', ['Start Scrape Run', 'Get Active Criteria', 'Build Search Query']),
          },
          {
            title: 'Searches Google Maps',
            text: 'One call returns every business at once. If it fails, it logs why instead of breaking silently.',
            data: '40 businesses found',
            nodes: steps('1', ['DataForSEO Maps Search', 'Search Call OK?', 'Split Businesses']),
          },
          {
            title: 'Qualifies and saves',
            text: 'Every business is saved. Only the ones with a website and 10 or more reviews move on to deep analysis.',
            data: 'Website ✓ · 86 reviews ✓',
            nodes: steps('1', ['Map to Tab 2 Fields', 'Save to Tab 2 - Scraped', 'Wait 200ms (a)', 'Has Enough Data?', 'Save to Tab 3 - Pending', 'Wait 200ms (b)']),
          },
          {
            title: 'Fetches all the reviews at once',
            text: 'The speed fix: every review job is posted up front in batches of 100 and the workflow waits once, instead of 45 seconds per business. 10 leads or 1,000, same wait.',
            data: 'Last 50 reviews per business',
            nodes: ['deep-analysis', ...steps('2', ['Start Analysis Run', 'Get Pending Records', 'Limit Leads This Run', 'Build Review Batches', 'Post Review Tasks - Batched', 'Wait for All Reviews', 'List Review Task IDs', 'Fetch Review Results', 'Reviews Ready?', 'Combine Review Results', 'Merge Reviews into Records'])],
          },
          {
            title: 'Reads the website',
            text: "Firecrawl reads the homepage, plus the contact or booking page if there is one, because that's where the real details usually are.",
            data: 'Homepage + booking page',
            nodes: steps('2', ['Loop Over Items', 'Normalize Reviews', 'Scrape Website - Firecrawl', 'Normalize Website Text', 'Find Secondary Page to Scrape', 'Secondary Page Found?', 'Scrape Secondary Page - Firecrawl', 'Consolidate Website Text']),
          },
          {
            title: 'Checks their YouTube and digital footprint',
            text: "It finds the business's own channel, from the website first because that's free, and when it last posted. Plain code then counts facts like booking type, forms and live chat, so the AI gets the same answer every run.",
            data: 'Channel found · last upload 14 months ago',
            nodes: steps('2', ['Find YouTube Link in Text', 'Channel Link Found?', 'Get Channel by Handle', 'Normalize YouTube Data', 'Get Latest Upload', 'Assess Digital Footprint']),
          },
          {
            title: 'Gemini finds the problem',
            text: 'One business per AI call, never batched, because mixing businesses breaks accuracy. Then it scores priority from how strong the problem is and how complete the data is.',
            data: 'Problem: no online booking · High priority',
            nodes: steps('2', ['Find Problem and Score', 'AI Call OK?', 'Compute Priority', 'Prepare Tab 3 Update', 'Update Tab 3 Record', 'Wait 200ms (a)', 'Priority Tier?']),
          },
          {
            title: 'The owner adds the email, the AI drafts',
            text: 'Email addresses are never scraped: the owner types them in by hand. Gemini then writes one personal draft using the exact problem and a real review quote. It waits in Airtable for the owner to read and send from Gmail.',
            data: 'Draft ready to review',
            nodes: ['email-by-hand', ...steps('3', ['Start Draft Run', 'Get Ready Leads', 'Loop Over Leads', 'Draft Email', 'AI Call OK?', 'Save to Tab 4 - Ready to Contact', 'Update Tab 3 - Drafted'])],
          },
        ],
      },
    ],
  },

  property: {
    title: 'Property Management Automation',
    built: 'Built in n8n with Airtable, OpenAI, Cal.com, Xero and Gmail.',
    stats: ['5 workflows', '100 steps', 'From the first report to the monthly digest'],
    workflows: property,
    handoffs: [
      { id: 'needs-booking', label: 'Job needs a visit', icon: 'person', from: 'wf:1', to: '2:Watch for Needs Booking' },
      { id: 'job-done', label: 'Job complete', icon: 'person', from: 'wf:2', to: '3:Watch for Job Complete' },
      { id: 'ready-to-bill', label: 'Ready to pay', icon: 'person', from: 'wf:3', to: '4:Watch for Ready to Bill' },
      { id: 'monthly', label: 'Every month', icon: 'clock', from: 'wf:4', to: '5:Monthly Owner Digest' },
    ],
    runs: [
      {
        name: 'A repair, start to finish',
        steps: [
          {
            title: 'A tenant reports a repair',
            text: 'Repairs come in by email or by a form standing in for Fixflo. Both are tidied into one shape and checked for the details a job needs.',
            data: '"The kitchen tap is leaking under the sink."',
            nodes: steps('1', ['Poll Job Intake Inbox', 'Map Gmail Fields', 'Normalize Job Data', 'Has Required Fields?']),
          },
          {
            title: 'AI reads the job',
            text: 'OpenAI reads the report. A repeat report is added to the job that already exists instead of making a new one. Unclear jobs go to the coordinator for review, and emergencies are flagged straight away.',
            data: 'New job · routine priority',
            nodes: steps('1', ['Job Analysis Agent', 'Dedup Check - Existing Open Job', 'Duplicate Job Found?', 'Needs Manual Review?', 'Create Job Card', 'Priority == Emergency?']),
          },
          {
            title: 'The tenant picks a time',
            text: 'The tenant is emailed a Cal.com link to book the visit.',
            data: 'Booking link sent',
            nodes: ['needs-booking', ...steps('2', ['Watch for Needs Booking', 'Build Cal.com Booking Link', 'Update Job - Booking Sent', 'Email Tenant - Booking Link'])],
          },
          {
            title: 'Booking confirmed',
            text: 'When they book, the job is matched by its ID, or by email as a fallback, and marked Booked. If nobody books in time, a daily check tells the coordinator to call the tenant.',
            data: 'Booked for Thursday',
            nodes: steps('2', ['Cal.com Booking Webhook', 'Extract Booking Fields', 'Look Up Job by ID', 'Job Found by ID?', 'Update Job - Booked', 'Email Tenant - Booking Confirmed']),
          },
          {
            title: 'Job done, invoice raised in Xero',
            text: "When the job is marked complete, it checks it hasn't been invoiced already, finds or creates the owner in Xero, raises the invoice and emails the owner.",
            data: 'Invoice issued',
            nodes: ['job-done', ...steps('3', ['Watch for Job Complete', 'Already Invoiced?', 'Required Fields for Invoicing?', 'Owner Xero Contact Cached?', 'Payment Terms (Days)', 'Create Sales Invoice', 'Invoice Created OK?', 'Update Job - Awaiting Payment', 'Email Owner - Invoice Issued'])],
          },
          {
            title: 'Chases payment, politely first',
            text: 'Every day it checks Xero. An unpaid invoice gets a friendly reminder, then a firm one, then a final notice, and the coordinator is told when one is overdue.',
            data: 'Friendly reminder sent',
            nodes: steps('3', ['Daily Payment Chase Check', 'Search Awaiting Payment Jobs', 'Get Xero Invoices', 'Merge Jobs with Invoice Status', 'Reminder Tier Thresholds (Days)', 'Fully Paid?', 'Compute Days Past Due', 'Compute Reminder Tier To Send', 'Send Final Notice?', 'Send Firm Reminder?', 'Send Friendly Reminder?', 'Email Owner - Friendly Reminder', 'Update Job - Tier Friendly']),
          },
          {
            title: 'Pays the subcontractor, CIS checked',
            text: "Before a subcontractor's bill is raised in Xero, it checks their CIS (Construction Industry Scheme) status is verified. If it isn't, the coordinator is told instead. A monthly reminder flags the CIS300 return.",
            data: 'CIS verified · bill raised',
            nodes: ['ready-to-bill', ...steps('4', ['Watch for Ready to Bill', 'Already Billed?', 'Look Up Subcontractor Record', 'CIS Precondition Verified?', 'Create CIS Bill', 'Bill Created OK?', 'Update Job - Bill Created', 'Email Subcontractor - Bill Raised'])],
          },
          {
            title: 'The monthly owner digest',
            text: 'Once a month, every property owner gets one email summarising their jobs.',
            data: 'Digest sent to each owner',
            nodes: ['monthly', ...steps('5', ['Monthly Owner Digest', 'Search All Active Jobs', 'Summarize by Owner', 'Split In Batches - Owners', 'Search Owner Job Details', 'Aggregate Owner Jobs', 'Build Digest Email Body', 'Email Owner - Monthly Digest'])],
          },
        ],
      },
    ],
  },

  agency: {
    title: 'AI Automation Agency Backend',
    built: 'Built in n8n with Tally, OpenAI, Pinecone, Google Sheets, Cal.com and Gmail.',
    stats: ['4 workflows', '57 steps', 'My own business runs on it'],
    workflows: agency,
    handoffs: [
      { id: 'books-call', label: 'They book a call', icon: 'clock', from: 'wf:2', to: '3:Cal.com Booking Webhook' },
      { id: 'replies', label: 'They reply', icon: 'mail', from: 'wf:3', to: '4:Poll Inbox for Replies' },
    ],
    runs: [
      {
        name: 'A new lead',
        steps: [
          {
            title: 'A lead fills in my form',
            text: 'Leads come from my Tally form or my website. Both are tidied into one shape and checked.',
            data: '"We run 3 dental clinics and miss calls at lunch."',
            nodes: steps('2', ['Tally Form Webhook', 'Detect Payload Shape', 'Map Tally Fields', 'Normalize Lead Data', 'Has Required Fields?']),
          },
          {
            title: 'AI reads it against my services',
            text: 'OpenAI reads the enquiry and looks up my own services and knowledge base in Pinecone to work out what would help. Anything unclear is flagged for me.',
            data: 'Good fit: AI receptionist',
            nodes: steps('2', ['Lead Analysis Agent', 'Needs Manual Review?']),
          },
          {
            title: 'A personal reply goes out',
            text: 'The lead is saved to Google Sheets and gets a personal email about the services that fit. High-priority leads ping me too.',
            data: 'Personal email sent',
            nodes: steps('2', ['Append Lead Row - Analyzed', 'Send Personalized Service Email', 'Update Thread ID - Analyzed']),
          },
          {
            title: 'They book a call',
            text: 'When they book on Cal.com, the meeting is added to their lead record.',
            data: 'Call booked',
            nodes: ['books-call', ...steps('3', ['Cal.com Booking Webhook', 'Extract Booking Fields', 'Look Up Lead by Email', 'Lead Record Found?', 'Update Meeting Info'])],
          },
          {
            title: 'They reply by email',
            text: "Replies from known leads are answered using the same knowledge base. If the AI isn't confident, the lead gets a holding message and I get a heads-up instead.",
            data: 'Answered · thread marked done',
            nodes: ['replies', ...steps('4', ['Poll Inbox for Replies', 'Extract Sender & Thread Info', 'Look Up Lead by Email', 'Lead Record Found?', 'Reply Handling Agent', 'Needs Manual Review? (Reply)', 'Reply - Personalized Response', 'Update Lead Row - After Reply', 'Mark Thread Processed (Confident)'])],
          },
        ],
      },
      {
        name: 'Teaching it something new',
        steps: [
          {
            title: 'A new document joins the knowledge base',
            text: "Dropping a PDF into a Google Drive folder adds it to the knowledge base: it's split into chunks, embedded with OpenAI and stored in Pinecone, ready for the next lead.",
            data: 'Pricing guide.pdf',
            nodes: steps('1', ['New File in KB Folder', 'Is PDF?', 'Download File', 'Insert into KB Index']),
          },
        ],
      },
    ],
  },

  'lead-gen': {
    title: 'Lead Gen Prospecting',
    built: 'Built in n8n with SerpApi Google search, Groq, Hunter, Dropcontact and Airtable.',
    stats: ['1 workflow', '43 steps', '3 search lanes'],
    workflows: leadGen,
    runs: [
      {
        name: 'A weekly prospecting run',
        steps: [
          {
            title: 'Every week, it reads the search criteria',
            text: 'It reads each active search from Airtable and marks when it last ran.',
            data: 'Letting agents · Bristol',
            nodes: steps('1', ['Weekly Prospecting Trigger', 'Get Active Search Criteria', 'Normalize Criteria Row', 'Split In Batches - Criteria Rows', 'Update Criteria - Mark Last Run']),
          },
          {
            title: 'Searches Google three ways',
            text: 'Three search lanes run side by side: company directories, editorial mentions and LinkedIn profiles. Each lane is capped, then the results are merged.',
            data: 'Companies lane',
            nodes: steps('1', ['Search Google - Companies', 'Tag Source - Companies', 'Split Results - Directories', 'Limit - Companies Lane', 'Merge Search Results']),
          },
          {
            title: 'Cleans the list',
            text: 'Results are tidied, duplicates removed and each search capped.',
            data: 'Duplicates removed',
            nodes: steps('1', ['Normalize Search Result', 'Remove Duplicate Results', 'Limit Results Per Criteria Row', 'Split In Batches - Prospects']),
          },
          {
            title: 'AI pulls out the prospect',
            text: 'Each page is fetched and Groq extracts the person and the company. Known prospects are skipped and unclear ones are saved for review.',
            data: 'Name, role and company found',
            nodes: steps('1', ['Fetch Prospect Page', 'Parse Page Text', 'Prospect Extraction Agent', 'Normalize Agent Output', 'Dedup Check - Existing Prospect', 'Duplicate Prospect Found?', 'Needs Manual Review? (Prospect)']),
          },
          {
            title: 'Finds the email and saves it',
            text: 'Hunter looks for the email from the company domain, with Dropcontact as the fallback. The prospect is saved to the CRM in Airtable.',
            data: 'Saved to the CRM',
            nodes: steps('1', ['Has Company Domain?', 'Enrich Contact - Hunter', 'Hunter Found Email?', 'Map Hunter Result', 'Create Prospect']),
          },
        ],
      },
    ],
  },
}
