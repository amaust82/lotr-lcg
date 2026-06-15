export interface PhaseStep {
  text: string;
  boldPrefix?: string;  // text before the colon, rendered in crimson bold
}

export interface ActionWindow {
  text: string;
}

export interface Phase {
  name: string;
  slug: string;          // url segment, e.g. "resource"
  eyebrow: string;       // e.g. "The Round · Phase I"
  subtitle: string;      // italic subheading
  intro?: string;        // optional drop-cap paragraph
  quote?: { text: string; attribution: string };
  sections: PhaseSection[];
}

export interface PhaseSection {
  eyebrow?: string;
  heading?: string;
  steps?: PhaseStep[];
  actionWindow?: ActionWindow;
}

export const PHASES: Phase[] = [
  {
    name: 'Resource',
    slug: 'resource',
    eyebrow: 'The Round · Phase I',
    subtitle: 'Gather strength for the road ahead.',
    intro: 'Each hero awakens to face another day. Resources are collected, cards drawn, and the fellowship prepares for what the journey demands.',
    quote: { text: 'Even the smallest person can change the course of the future.', attribution: 'J.R.R. Tolkien' },
    sections: [
      {
        eyebrow: 'Each Player',
        heading: 'Collect Resources',
        steps: [
          { boldPrefix: 'Each hero', text: ' adds 1 resource token to their resource pool.' },
          { boldPrefix: 'Draw 1 card', text: ' from your player deck.' },
          { boldPrefix: 'Discard down', text: ' to your hand size limit (default: no limit in most scenarios).' },
        ],
        actionWindow: {
          text: 'Players may take actions before the Planning Phase begins.',
        },
      },
    ],
  },
  {
    name: 'Planning',
    slug: 'planning',
    eyebrow: 'The Round · Phase II',
    subtitle: 'Allies arrive; attachments are readied.',
    intro: 'This is the moment to marshal your forces. Allies join the company and equipment is prepared before the quest resumes.',
    quote: { text: 'All we have to decide is what to do with the time that is given us.', attribution: 'J.R.R. Tolkien' },
    sections: [
      {
        eyebrow: 'Each Player in Turn',
        heading: 'Play Cards from Hand',
        steps: [
          { boldPrefix: 'Allies', text: ' may be played by paying their printed resource cost from any hero\'s resource pool (sphere must match).' },
          { boldPrefix: 'Attachments', text: ' may be played onto valid targets by paying their resource cost.' },
          { boldPrefix: 'Events', text: ' with a Planning timing may also be played now.' },
          { text: 'You may play as many cards as you can afford. Other players may not play cards during your planning.' },
        ],
        actionWindow: {
          text: 'Players may take actions before the Quest Phase begins.',
        },
      },
    ],
  },
  {
    name: 'Quest',
    slug: 'quest',
    eyebrow: 'The Round · Phase III',
    subtitle: 'The road is long; progress must be made or darkness grows.',
    intro: 'Characters commit their will to the quest. Danger is revealed from the encounter deck, and the fate of the round is decided by willpower against threat.',
    quote: { text: 'The road goes ever on and on, down from the door where it began.', attribution: 'J.R.R. Tolkien' },
    sections: [
      {
        eyebrow: 'Step 1',
        heading: 'Commit Characters',
        steps: [
          { text: 'Each player may commit any number of heroes and allies to the quest by exhausting them.' },
          { boldPrefix: 'Willpower', text: ' of all committed characters is totalled across all players.' },
          { text: 'Characters with the Doomed or Peril keyword have special restrictions — check their text.' },
        ],
        actionWindow: {
          text: 'Players may take actions after committing characters but before encounter cards are revealed.',
        },
      },
      {
        eyebrow: 'Step 2',
        heading: 'Staging',
        steps: [
          { text: 'Reveal one encounter card per player from the encounter deck, placing each in the staging area.' },
          { boldPrefix: 'Surge', text: ': Reveal an additional card. Doomed X: Each player raises their threat by X.' },
          { boldPrefix: 'Treacheries', text: ' are resolved immediately; Enemies and Locations remain in the staging area.' },
          { text: 'Total the threat of all cards in the staging area (active location excluded — it adds its threat here).' },
        ],
        actionWindow: {
          text: 'Players may take actions after staging but before quest resolution.',
        },
      },
      {
        eyebrow: 'Step 3',
        heading: 'Quest Resolution',
        steps: [
          { text: 'Compare total Willpower of committed characters against total Threat in the staging area.' },
          { boldPrefix: 'Willpower exceeds Threat', text: ': Place that many progress tokens on the active location (first) then on the current quest card.' },
          { boldPrefix: 'Threat exceeds Willpower', text: ': The first player raises their threat by the difference.' },
          { boldPrefix: 'Tie', text: ': No progress is made; no threat is raised.' },
          { text: 'If a location fills with progress, it is explored and excess tokens carry to the quest card. If the quest card fills, advance to the next stage.' },
        ],
        actionWindow: {
          text: 'Players may take actions after quest resolution before the Travel Phase.',
        },
      },
    ],
  },
  {
    name: 'Travel',
    slug: 'travel',
    eyebrow: 'The Round · Phase IV',
    subtitle: 'Choose where the path leads.',
    intro: 'The fellowship moves through the land. If no active location exists, players may — and sometimes must — travel to a location in the staging area.',
    quote: { text: 'It\'s a dangerous business, going out your door. You step onto the road, and if you don\'t keep your feet, there\'s no knowing where you might be swept off to.', attribution: 'J.R.R. Tolkien' },
    sections: [
      {
        eyebrow: 'Optional',
        heading: 'Travel to a Location',
        steps: [
          { text: 'Players may collectively travel to one location from the staging area, making it the active location.' },
          { boldPrefix: 'Travel keyword', text: ': The location imposes a cost; all players must be willing to pay it before traveling.' },
          { text: 'Only one location may become active per round. If there is already an active location, players may not travel.' },
          { boldPrefix: 'While a location is active', text: ', its Threat does not count in the staging area — but its Quest Points must be completed to explore it.' },
        ],
        actionWindow: {
          text: 'Players may take actions after the Travel Phase before the Encounter Phase.',
        },
      },
    ],
  },
  {
    name: 'Encounter',
    slug: 'encounter',
    eyebrow: 'The Round · Phase V',
    subtitle: 'Enemies draw near.',
    intro: 'Foes from the darkness press upon the company. Enemies with low engagement costs surge forward; others may be drawn into combat by bold heroes.',
    quote: { text: 'Faithless is he that says farewell when the road darkens.', attribution: 'J.R.R. Tolkien' },
    sections: [
      {
        eyebrow: 'Engagement',
        heading: 'Enemies Engage Players',
        steps: [
          { boldPrefix: 'Optional engagement', text: ': Each player may optionally engage one enemy from the staging area (highest engagement cost first if multiple enemies qualify).' },
          { boldPrefix: 'Forced engagement', text: ': Any enemy in the staging area whose engagement cost is equal to or less than a player\'s threat immediately engages that player.' },
          { text: 'Enemies engage players in order from highest engagement cost to lowest. Each enemy engages the player whose threat is closest to (but not exceeding) the enemy\'s engagement cost.' },
          { text: 'Enemies that cannot engage any player remain in the staging area.' },
        ],
        actionWindow: {
          text: 'Players may take actions after engagement but before the Combat Phase.',
        },
      },
    ],
  },
  {
    name: 'Combat',
    slug: 'combat',
    eyebrow: 'The Round · Phase VI',
    subtitle: 'Steel meets shadow.',
    intro: 'The clash of arms. Enemies strike, and heroes answer blow for blow. Victory clears the path; defeat costs dearly.',
    quote: { text: 'Courage is found in unlikely places.', attribution: 'J.R.R. Tolkien' },
    sections: [
      {
        eyebrow: 'Step 1',
        heading: 'Deal Shadow Cards',
        steps: [
          { text: 'Deal one shadow card face-down to each enemy engaged with any player.' },
          { text: 'Shadow cards are drawn from the encounter deck. If the deck is empty, shuffle the discard pile first.' },
        ],
        actionWindow: {
          text: 'Players may take actions after shadow cards are dealt.',
        },
      },
      {
        eyebrow: 'Step 2',
        heading: 'Resolve Enemy Attacks',
        steps: [
          { text: 'Beginning with the first player, each player resolves attacks from all enemies engaged with them.' },
          { boldPrefix: 'Declare a defender', text: ': One character may exhaust to defend. If no defender is declared, the attack is undefended.' },
          { boldPrefix: 'Flip shadow card', text: ': Apply any shadow effect. If the shadow card has no shadow effect, discard it.' },
          { boldPrefix: 'Calculate damage', text: ': Enemy Attack minus defender\'s Defense equals damage dealt. Undefended attacks deal full damage to the first player\'s hero of their choice.' },
          { boldPrefix: 'Sentinel', text: ': A character with Sentinel may defend attacks against other players.' },
        ],
        actionWindow: {
          text: 'Players may take actions after all enemy attacks are resolved.',
        },
      },
      {
        eyebrow: 'Step 3',
        heading: 'Players Attack Enemies',
        steps: [
          { text: 'Beginning with the first player, each player may declare one or more attacks against enemies engaged with them.' },
          { boldPrefix: 'Declare attackers', text: ': Exhaust one or more characters to attack. Total their Attack values.' },
          { boldPrefix: 'Calculate damage', text: ': Total Attack minus the enemy\'s Defense equals damage dealt to the enemy.' },
          { boldPrefix: 'Ranged', text: ': A character with Ranged may participate in attacks against enemies engaged with other players.' },
          { text: 'If damage on an enemy equals or exceeds its Hit Points, it is defeated and removed from play. Collect any Victory Points printed on the card.' },
        ],
        actionWindow: {
          text: 'Players may take actions after all player attacks before the Refresh Phase.',
        },
      },
    ],
  },
  {
    name: 'Refresh',
    slug: 'refresh',
    eyebrow: 'The Round · Phase VII',
    subtitle: 'The darkness deepens; rest what can be rested.',
    intro: 'The round concludes. Threat rises inexorably, but weary characters recover their strength for another turn.',
    quote: { text: 'In the end, it\'s only a passing thing, this shadow. Even darkness must pass.', attribution: 'J.R.R. Tolkien' },
    sections: [
      {
        eyebrow: 'In Order',
        heading: 'End of Round',
        steps: [
          { boldPrefix: 'Raise threat', text: ': Each player raises their threat by 1.' },
          { boldPrefix: 'Ready all characters', text: ': All exhausted heroes, allies, and attachments under each player\'s control are readied (rotated upright).' },
          { boldPrefix: 'Ready all cards', text: ': All other exhausted cards (locations, enemies with exhausting abilities) ready as well unless a card specifies otherwise.' },
          { boldPrefix: 'Pass the first player token', text: ': The first player token passes clockwise to the next player.' },
          { text: 'Begin a new round with the Resource Phase. If any player\'s threat reaches 50 (or the scenario threshold), the game ends in defeat.' },
        ],
        actionWindow: {
          text: 'Players may take actions at the end of the Refresh Phase before the next round begins.',
        },
      },
    ],
  },
];
