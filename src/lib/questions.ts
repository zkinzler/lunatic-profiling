export interface Answer {
    id: string;
    text: string;
    weight: Record<string, number>;
}

export interface Question {
    id: string;
    question: string;
    answers: Answer[];
    source?: string; // 'original' | 'chatgpt' | 'perplexity' | 'claude'
}

// The 8 Lunatic Archetypes
export const ARCHETYPES = [
    'Quantum Magician',
    'Cosmic Jester',
    'Reality Hacker',
    'Dream Alchemist',
    'Chaos Pilot',
    'Shadow Sage',
    'Sacred Rebel',
    'Flow Shaman'
] as const;

export const ALL_QUESTIONS: Question[] = [
    // ===== ORIGINAL QUESTIONS =====
    {
        id: 'orig_1',
        source: 'original',
        question: "You're at a party where you know very few people. What do you do?",
        answers: [
            { id: 'a', text: "Find the host and introduce yourself to everyone they know", weight: { 'Cosmic Jester': 3, 'Flow Shaman': 2 } },
            { id: 'b', text: "Look for someone who seems interesting and strike up a conversation", weight: { 'Quantum Magician': 2, 'Dream Alchemist': 2 } },
            { id: 'c', text: "Find a quiet corner and observe the social dynamics", weight: { 'Reality Hacker': 3, 'Shadow Sage': 2 } },
            { id: 'd', text: "Help with party tasks to feel useful and connected", weight: { 'Sacred Rebel': 3, 'Flow Shaman': 1 } },
            { id: 'e', text: "Leave early - parties aren't really your thing", weight: { 'Shadow Sage': 2, 'Quantum Magician': 2 } },
            { id: 'f', text: "Crack jokes to break the ice and make people laugh", weight: { 'Cosmic Jester': 2, 'Chaos Pilot': 3 } }
        ]
    },
    {
        id: 'orig_2',
        source: 'original',
        question: "When making an important decision, you typically:",
        answers: [
            { id: 'a', text: "Research extensively and analyze all possible outcomes", weight: { 'Reality Hacker': 3, 'Shadow Sage': 2 } },
            { id: 'b', text: "Go with your gut feeling - it rarely steers you wrong", weight: { 'Dream Alchemist': 3, 'Quantum Magician': 2 } },
            { id: 'c', text: "Seek advice from trusted friends and family", weight: { 'Flow Shaman': 2, 'Sacred Rebel': 2 } },
            { id: 'd', text: "Consider how it will affect others around you", weight: { 'Sacred Rebel': 3, 'Flow Shaman': 2 } },
            { id: 'e', text: "Choose the option that seems most exciting", weight: { 'Chaos Pilot': 3, 'Cosmic Jester': 2 } },
            { id: 'f', text: "Delay the decision until absolutely necessary", weight: { 'Shadow Sage': 2, 'Reality Hacker': 2 } }
        ]
    },
    {
        id: 'orig_3',
        source: 'original',
        question: "Your ideal weekend involves:",
        answers: [
            { id: 'a', text: "Trying a new restaurant or exploring a new place", weight: { 'Chaos Pilot': 2, 'Cosmic Jester': 2 } },
            { id: 'b', text: "Staying home with a good book or favorite TV series", weight: { 'Shadow Sage': 3, 'Dream Alchemist': 2 } },
            { id: 'c', text: "Organizing a gathering with friends or family", weight: { 'Flow Shaman': 3, 'Sacred Rebel': 2 } },
            { id: 'd', text: "Working on a personal project or hobby", weight: { 'Dream Alchemist': 2, 'Quantum Magician': 2 } },
            { id: 'e', text: "Doing something spontaneous - no plans needed", weight: { 'Cosmic Jester': 3, 'Chaos Pilot': 2 } },
            { id: 'f', text: "Volunteering or helping others in your community", weight: { 'Sacred Rebel': 3, 'Flow Shaman': 2 } }
        ]
    },
    {
        id: 'orig_4',
        source: 'original',
        question: "In group projects, you usually:",
        answers: [
            { id: 'a', text: "Take charge and delegate tasks to team members", weight: { 'Sacred Rebel': 3, 'Flow Shaman': 2 } },
            { id: 'b', text: "Focus on the creative or innovative aspects", weight: { 'Dream Alchemist': 3, 'Quantum Magician': 2 } },
            { id: 'c', text: "Handle the detailed research and analysis", weight: { 'Reality Hacker': 3, 'Shadow Sage': 2 } },
            { id: 'd', text: "Mediate conflicts and keep everyone motivated", weight: { 'Flow Shaman': 3, 'Sacred Rebel': 2 } },
            { id: 'e', text: "Do your part quietly and efficiently", weight: { 'Quantum Magician': 2, 'Reality Hacker': 2 } },
            { id: 'f', text: "Challenge ideas to make sure they're sound", weight: { 'Shadow Sage': 3, 'Reality Hacker': 2 } }
        ]
    },
    {
        id: 'orig_5',
        source: 'original',
        question: "When facing a major life challenge, you:",
        answers: [
            { id: 'a', text: "Break it down into manageable steps and tackle each one", weight: { 'Reality Hacker': 3, 'Shadow Sage': 2 } },
            { id: 'b', text: "Dive in headfirst and figure it out as you go", weight: { 'Chaos Pilot': 2, 'Cosmic Jester': 3 } },
            { id: 'c', text: "Seek support and advice from your network", weight: { 'Flow Shaman': 2, 'Sacred Rebel': 2 } },
            { id: 'd', text: "Take time to reflect and understand the deeper meaning", weight: { 'Shadow Sage': 3, 'Dream Alchemist': 2 } },
            { id: 'e', text: "Look for creative or unconventional solutions", weight: { 'Dream Alchemist': 2, 'Quantum Magician': 3 } },
            { id: 'f', text: "Focus on how to help others who might face similar challenges", weight: { 'Sacred Rebel': 3, 'Flow Shaman': 2 } }
        ]
    },
    {
        id: 'orig_6',
        source: 'original',
        question: "Your communication style is best described as:",
        answers: [
            { id: 'a', text: "Direct and to the point - no beating around the bush", weight: { 'Reality Hacker': 3, 'Quantum Magician': 2 } },
            { id: 'b', text: "Warm and encouraging - you focus on building people up", weight: { 'Flow Shaman': 3, 'Sacred Rebel': 2 } },
            { id: 'c', text: "Thoughtful and measured - you choose your words carefully", weight: { 'Shadow Sage': 2, 'Dream Alchemist': 2 } },
            { id: 'd', text: "Enthusiastic and animated - you get excited about ideas", weight: { 'Chaos Pilot': 3, 'Cosmic Jester': 2 } },
            { id: 'e', text: "Logical and fact-based - you stick to what can be proven", weight: { 'Reality Hacker': 3, 'Quantum Magician': 2 } },
            { id: 'f', text: "Diplomatic and tactful - you avoid causing offense", weight: { 'Flow Shaman': 3, 'Sacred Rebel': 2 } }
        ]
    },
    {
        id: 'orig_7',
        source: 'original',
        question: "When you're stressed, you typically:",
        answers: [
            { id: 'a', text: "Withdraw and need alone time to recharge", weight: { 'Shadow Sage': 2, 'Dream Alchemist': 3 } },
            { id: 'b', text: "Talk it out with friends or family", weight: { 'Cosmic Jester': 3, 'Chaos Pilot': 2 } },
            { id: 'c', text: "Throw yourself into work or physical activity", weight: { 'Chaos Pilot': 2, 'Flow Shaman': 2 } },
            { id: 'd', text: "Analyze the situation to understand what went wrong", weight: { 'Reality Hacker': 2, 'Quantum Magician': 3 } },
            { id: 'e', text: "Look for ways to help others instead of focusing on yourself", weight: { 'Sacred Rebel': 2, 'Flow Shaman': 2 } },
            { id: 'f', text: "Distract yourself with entertainment or hobbies", weight: { 'Dream Alchemist': 2, 'Shadow Sage': 2 } }
        ]
    },
    {
        id: 'orig_8',
        source: 'original',
        question: "Your approach to life philosophy is:",
        answers: [
            { id: 'a', text: "Live each day to the fullest - you never know what tomorrow brings", weight: { 'Cosmic Jester': 2, 'Chaos Pilot': 3 } },
            { id: 'b', text: "Plan carefully for the future while enjoying the present", weight: { 'Quantum Magician': 3, 'Reality Hacker': 2 } },
            { id: 'c', text: "Focus on making a positive impact on others and society", weight: { 'Sacred Rebel': 3, 'Flow Shaman': 2 } },
            { id: 'd', text: "Question everything and seek deeper understanding", weight: { 'Dream Alchemist': 3, 'Shadow Sage': 2 } },
            { id: 'e', text: "Stay practical and focus on what works", weight: { 'Reality Hacker': 3, 'Quantum Magician': 2 } },
            { id: 'f', text: "Embrace change and see life as an adventure", weight: { 'Chaos Pilot': 3, 'Cosmic Jester': 2 } }
        ]
    },

    // ===== CHATGPT QUESTIONS =====
    {
        id: 'chatgpt_1',
        source: 'chatgpt',
        question: "A hedgehog wearing a blazer appears in your garden and insists it's your new life coach. It says, 'You've been playing small, darling.' What do you do?",
        answers: [
            { id: 'a', text: "Offer it tea and a trauma dump.", weight: { 'Cosmic Jester': 3, 'Flow Shaman': 2 } },
            { id: 'b', text: "Ask if it does corporate rates and invoice it for your time.", weight: { 'Reality Hacker': 3, 'Chaos Pilot': 2 } },
            { id: 'c', text: "Record a podcast titled 'My Hedgehog, My Healer.'", weight: { 'Dream Alchemist': 3, 'Cosmic Jester': 2 } },
            { id: 'd', text: "Start taking notes like it's Eckhart Tolle with spikes.", weight: { 'Shadow Sage': 2, 'Quantum Magician': 3 } },
            { id: 'e', text: "Ask, 'Do you also do couples therapy?'", weight: { 'Flow Shaman': 2, 'Sacred Rebel': 1 } },
            { id: 'f', text: "Realise you are the hedgehog and immediately apply for a TED Talk.", weight: { 'Quantum Magician': 3, 'Dream Alchemist': 3 } }
        ]
    },
    {
        id: 'chatgpt_2',
        source: 'chatgpt',
        question: "A pigeon lands beside you and says, 'You've got two minutes to change history — but you'll smell faintly of bread forever.' What's your move?",
        answers: [
            { id: 'a', text: "Ask if you can change the invention of LinkedIn.", weight: { 'Cosmic Jester': 3, 'Sacred Rebel': 2 } },
            { id: 'b', text: "Use it to stop your last relationship before the 'healing crystal' phase.", weight: { 'Shadow Sage': 3, 'Reality Hacker': 2 } },
            { id: 'c', text: "Rewrite history so avocados aren't £1.50 each.", weight: { 'Chaos Pilot': 2, 'Cosmic Jester': 2 } },
            { id: 'd', text: "Turn down the offer; smelling of bread is too relatable.", weight: { 'Flow Shaman': 2, 'Shadow Sage': 2 } },
            { id: 'e', text: "Accept instantly — you've always wanted to be the Messiah and a sandwich.", weight: { 'Quantum Magician': 3, 'Cosmic Jester': 3 } }
        ]
    },
    {
        id: 'chatgpt_3',
        source: 'chatgpt',
        question: "An email arrives: Subject: Congratulations! You've been promoted to God. The pay is terrible, but the hours are eternal. What do you do first?",
        answers: [
            { id: 'a', text: "Delete humanity and start again with dolphins.", weight: { 'Chaos Pilot': 3, 'Sacred Rebel': 2 } },
            { id: 'b', text: "Automate creation using AI and go on a yoga retreat.", weight: { 'Reality Hacker': 3, 'Quantum Magician': 2 } },
            { id: 'c', text: "Send plagues exclusively to people who say 'let's circle back.'", weight: { 'Cosmic Jester': 3, 'Shadow Sage': 2 } },
            { id: 'd', text: "Rebrand Hell as 'A Networking Opportunity.'", weight: { 'Cosmic Jester': 3, 'Reality Hacker': 2 } },
            { id: 'e', text: "Outsource the universe to Fiverr.", weight: { 'Chaos Pilot': 3, 'Dream Alchemist': 1 } }
        ]
    },
    {
        id: 'chatgpt_4',
        source: 'chatgpt',
        question: "You're brushing your teeth and your reflection says: 'Mate, you've peaked. Let me drive for a bit.' What's your response?",
        answers: [
            { id: 'a', text: "Negotiate a time-share. You get weekends.", weight: { 'Reality Hacker': 2, 'Flow Shaman': 2 } },
            { id: 'b', text: "Tell it to send you a LinkedIn request like everyone else.", weight: { 'Cosmic Jester': 3, 'Chaos Pilot': 2 } },
            { id: 'c', text: "Compliment its confidence and ask for dating tips.", weight: { 'Flow Shaman': 2, 'Cosmic Jester': 2 } },
            { id: 'd', text: "Agree immediately — it's clearly the more stable one.", weight: { 'Shadow Sage': 3, 'Quantum Magician': 2 } },
            { id: 'e', text: "Swap bodies and never look back.", weight: { 'Chaos Pilot': 3, 'Dream Alchemist': 2 } }
        ]
    },
    {
        id: 'chatgpt_5',
        source: 'chatgpt',
        question: "You're invited to a dinner party hosted by polite aliens. The appetiser appears to be… you. What's your move?",
        answers: [
            { id: 'a', text: "Ask if you're at least gluten-free.", weight: { 'Cosmic Jester': 3, 'Chaos Pilot': 2 } },
            { id: 'b', text: "Try to sell them a meditation course before dessert.", weight: { 'Quantum Magician': 2, 'Sacred Rebel': 2 } },
            { id: 'c', text: "Offer your ex instead — 'great flavour, terrible aftertaste.'", weight: { 'Shadow Sage': 3, 'Cosmic Jester': 2 } },
            { id: 'd', text: "Compliment the plating and accept your destiny.", weight: { 'Flow Shaman': 2, 'Dream Alchemist': 2 } },
            { id: 'e', text: "Reverse Uno them and serve existential dread as the main course.", weight: { 'Quantum Magician': 3, 'Shadow Sage': 3 } }
        ]
    },
    {
        id: 'chatgpt_6',
        source: 'chatgpt',
        question: "You open a fortune cookie that says: 'Stop pretending you're not the villain in your own story.' What do you do?",
        answers: [
            { id: 'a', text: "Eat the cookie out of spite.", weight: { 'Chaos Pilot': 3, 'Cosmic Jester': 2 } },
            { id: 'b', text: "Frame it and call it 'Accountability Decor.'", weight: { 'Shadow Sage': 3, 'Reality Hacker': 2 } },
            { id: 'c', text: "Post it online with #ShadowWork.", weight: { 'Dream Alchemist': 2, 'Cosmic Jester': 2 } },
            { id: 'd', text: "Blame Mercury Retrograde.", weight: { 'Cosmic Jester': 3, 'Flow Shaman': 1 } },
            { id: 'e', text: "Send it a cease-and-desist letter for emotional damage.", weight: { 'Reality Hacker': 2, 'Chaos Pilot': 2 } }
        ]
    },
    {
        id: 'chatgpt_7',
        source: 'chatgpt',
        question: "A glowing baby appears in your living room and says, 'Enlightenment or Netflix — choose.'",
        answers: [
            { id: 'a', text: "Ask if enlightenment comes with subtitles.", weight: { 'Cosmic Jester': 3, 'Reality Hacker': 2 } },
            { id: 'b', text: "Binge Netflix to prove a point.", weight: { 'Chaos Pilot': 2, 'Shadow Sage': 1 } },
            { id: 'c', text: "Ask for a third option — 'Can I be a conscious hedonist?'", weight: { 'Quantum Magician': 3, 'Dream Alchemist': 2 } },
            { id: 'd', text: "Adopt the baby; raise it as your life coach.", weight: { 'Flow Shaman': 2, 'Sacred Rebel': 2 } },
            { id: 'e', text: "Merge with the baby and become a celestial influencer.", weight: { 'Quantum Magician': 3, 'Cosmic Jester': 3 } }
        ]
    },
    {
        id: 'chatgpt_8',
        source: 'chatgpt',
        question: "Your toaster starts talking every morning, offering unsolicited advice. Today it says: 'You're burning opportunities, not bread.' What do you do?",
        answers: [
            { id: 'a', text: "Argue back — it started it.", weight: { 'Chaos Pilot': 3, 'Cosmic Jester': 2 } },
            { id: 'b', text: "Ask if it's single.", weight: { 'Cosmic Jester': 3, 'Flow Shaman': 1 } },
            { id: 'c', text: "Try to monetise it as a motivational speaker.", weight: { 'Reality Hacker': 3, 'Sacred Rebel': 2 } },
            { id: 'd', text: "Unplug it and pretend it never happened.", weight: { 'Shadow Sage': 2, 'Reality Hacker': 2 } },
            { id: 'e', text: "Let it run your life — it can't do worse.", weight: { 'Chaos Pilot': 3, 'Dream Alchemist': 2 } }
        ]
    },
    {
        id: 'chatgpt_9',
        source: 'chatgpt',
        question: "A cloud follows you everywhere, raining only when you lie. What happens next?",
        answers: [
            { id: 'a', text: "Pretend you love your job. Monsoon.", weight: { 'Cosmic Jester': 3, 'Shadow Sage': 2 } },
            { id: 'b', text: "Start selling umbrellas — adapt or die.", weight: { 'Reality Hacker': 3, 'Chaos Pilot': 2 } },
            { id: 'c', text: "Confess everything and live in blissful dampness.", weight: { 'Flow Shaman': 3, 'Sacred Rebel': 2 } },
            { id: 'd', text: "Marry the cloud; it finally understands you.", weight: { 'Dream Alchemist': 3, 'Quantum Magician': 2 } },
            { id: 'e', text: "Train it to cry only during jazz.", weight: { 'Quantum Magician': 2, 'Cosmic Jester': 3 } }
        ]
    },
    {
        id: 'chatgpt_10',
        source: 'chatgpt',
        question: "You step into an elevator with 100 buttons. One goes to your dream life, one to certain doom, and 98 just play Coldplay. Which do you press?",
        answers: [
            { id: 'a', text: "Smash all of them. Chaos is a strategy.", weight: { 'Chaos Pilot': 3, 'Cosmic Jester': 3 } },
            { id: 'b', text: "Wait to see what the elevator wants.", weight: { 'Flow Shaman': 2, 'Dream Alchemist': 2 } },
            { id: 'c', text: "Hit the dream life one, but hold the door open for karma.", weight: { 'Sacred Rebel': 3, 'Quantum Magician': 2 } },
            { id: 'd', text: "Coldplay it is — safety and melancholy are your jam.", weight: { 'Shadow Sage': 3, 'Flow Shaman': 1 } },
            { id: 'e', text: "You are the elevator. And you just achieved enlightenment.", weight: { 'Quantum Magician': 3, 'Dream Alchemist': 3 } }
        ]
    },
    {
        id: 'chatgpt_11',
        source: 'chatgpt',
        question: "A duck walks up to you wearing sunglasses and says, 'Mate, reality's a simulation. Want in on the next patch?'",
        answers: [
            { id: 'a', text: "Ask if there's a duck-only discount.", weight: { 'Cosmic Jester': 3, 'Chaos Pilot': 2 } },
            { id: 'b', text: "Join immediately; you've always wanted to respawn with abs.", weight: { 'Chaos Pilot': 3, 'Dream Alchemist': 2 } },
            { id: 'c', text: "Demand proof — and maybe a business plan.", weight: { 'Reality Hacker': 3, 'Shadow Sage': 2 } },
            { id: 'd', text: "Ask if you can play God for a day.", weight: { 'Quantum Magician': 3, 'Sacred Rebel': 2 } },
            { id: 'e', text: "Tell the duck you're the developer. Watch it glitch.", weight: { 'Quantum Magician': 3, 'Reality Hacker': 3 } }
        ]
    },
    {
        id: 'chatgpt_12',
        source: 'chatgpt',
        question: "You're accidentally booked to speak at a support group for zombies recovering from capitalism. What's your opening line?",
        answers: [
            { id: 'a', text: "'I too have worked in retail.'", weight: { 'Cosmic Jester': 3, 'Flow Shaman': 2 } },
            { id: 'b', text: "'Let's eat the rich — literally.'", weight: { 'Sacred Rebel': 3, 'Chaos Pilot': 3 } },
            { id: 'c', text: "'Anyone tried mindfulness instead of brains?'", weight: { 'Quantum Magician': 2, 'Flow Shaman': 2 } },
            { id: 'd', text: "'You're all doing great. Decomposition is natural.'", weight: { 'Flow Shaman': 3, 'Cosmic Jester': 2 } },
            { id: 'e', text: "You join them. Finally, a group that gets you.", weight: { 'Shadow Sage': 3, 'Dream Alchemist': 2 } }
        ]
    },
    {
        id: 'chatgpt_13',
        source: 'chatgpt',
        question: "A talking cat blackmails you with your browser history. It wants snacks and power. What do you do?",
        answers: [
            { id: 'a', text: "Negotiate — it clearly understands leverage.", weight: { 'Reality Hacker': 3, 'Flow Shaman': 2 } },
            { id: 'b', text: "Admit everything; liberation through humiliation.", weight: { 'Shadow Sage': 3, 'Chaos Pilot': 2 } },
            { id: 'c', text: "Gaslight it: 'I was researching that ironically.'", weight: { 'Cosmic Jester': 3, 'Reality Hacker': 2 } },
            { id: 'd', text: "Hire it as your PR agent.", weight: { 'Quantum Magician': 2, 'Sacred Rebel': 2 } },
            { id: 'e', text: "Let it leak everything. You're going full messiah arc.", weight: { 'Quantum Magician': 3, 'Dream Alchemist': 3 } }
        ]
    },
    {
        id: 'chatgpt_14',
        source: 'chatgpt',
        question: "The world ends, but it's being live-streamed with commentary by David Attenborough. What's your role in the finale?",
        answers: [
            { id: 'a', text: "The dramatic hero trying to fix things.", weight: { 'Sacred Rebel': 3, 'Quantum Magician': 2 } },
            { id: 'b', text: "The comic relief making nihilism fun again.", weight: { 'Cosmic Jester': 3, 'Chaos Pilot': 3 } },
            { id: 'c', text: "The one live-tweeting sarcastic commentary.", weight: { 'Reality Hacker': 2, 'Cosmic Jester': 2 } },
            { id: 'd', text: "The mystic who already saw this coming.", weight: { 'Shadow Sage': 3, 'Dream Alchemist': 3 } },
            { id: 'e', text: "The camera operator who slowly zooms in on a sandwich.", weight: { 'Flow Shaman': 2, 'Cosmic Jester': 2 } }
        ]
    },
    {
        id: 'chatgpt_15',
        source: 'chatgpt',
        question: "Your washing machine gains sentience and tells you it's been cleansing souls, not socks. How do you respond?",
        answers: [
            { id: 'a', text: "Ask if it takes appointments.", weight: { 'Cosmic Jester': 2, 'Flow Shaman': 2 } },
            { id: 'b', text: "Request a deep cycle for your ex's energy.", weight: { 'Shadow Sage': 3, 'Cosmic Jester': 2 } },
            { id: 'c', text: "Rebrand it as a retreat centre.", weight: { 'Reality Hacker': 3, 'Sacred Rebel': 2 } },
            { id: 'd', text: "Perform an exorcism just to be sure.", weight: { 'Reality Hacker': 2, 'Sacred Rebel': 1 } },
            { id: 'e', text: "Join its cult. Fresh start, soft spin.", weight: { 'Quantum Magician': 3, 'Dream Alchemist': 3 } }
        ]
    },
    {
        id: 'chatgpt_16',
        source: 'chatgpt',
        question: "You wake up to a message from the Moon: 'We need to talk. You've been manifesting weird lately.' What do you reply?",
        answers: [
            { id: 'a', text: "'Sorry, I was drunk on intention again.'", weight: { 'Cosmic Jester': 3, 'Chaos Pilot': 2 } },
            { id: 'b', text: "'You watch everyone sleep, and I'm the weird one?'", weight: { 'Shadow Sage': 3, 'Cosmic Jester': 2 } },
            { id: 'c', text: "'New moon or full? I don't negotiate with halves.'", weight: { 'Quantum Magician': 3, 'Reality Hacker': 2 } },
            { id: 'd', text: "'Can we FaceTime? I've always wanted to eclipse.'", weight: { 'Dream Alchemist': 3, 'Cosmic Jester': 2 } },
            { id: 'e', text: "Ghost the Moon — pure power move.", weight: { 'Chaos Pilot': 3, 'Sacred Rebel': 2 } }
        ]
    },
    {
        id: 'chatgpt_17',
        source: 'chatgpt',
        question: "Your bus driver can read minds and just laughed way too loudly at your thoughts. What do you do?",
        answers: [
            { id: 'a', text: "Pretend you were thinking about puppies.", weight: { 'Flow Shaman': 2, 'Cosmic Jester': 2 } },
            { id: 'b', text: "Ask if they offer therapy sessions.", weight: { 'Shadow Sage': 2, 'Quantum Magician': 2 } },
            { id: 'c', text: "Laugh too — might as well go down in style.", weight: { 'Chaos Pilot': 3, 'Cosmic Jester': 3 } },
            { id: 'd', text: "Change seats and rethink your life.", weight: { 'Shadow Sage': 3, 'Reality Hacker': 2 } },
            { id: 'e', text: "Start narrating your thoughts out loud until they move.", weight: { 'Chaos Pilot': 3, 'Sacred Rebel': 2 } }
        ]
    },
    {
        id: 'chatgpt_18',
        source: 'chatgpt',
        question: "Every time you look in the mirror, a score appears above your head like a video game. Today it says '43/100: Trying Too Hard.' What's your reaction?",
        answers: [
            { id: 'a', text: "Demand a rematch and flex.", weight: { 'Chaos Pilot': 3, 'Sacred Rebel': 2 } },
            { id: 'b', text: "Accept your fate and start a podcast about authenticity.", weight: { 'Shadow Sage': 2, 'Cosmic Jester': 2 } },
            { id: 'c', text: "Cry, then monetize it.", weight: { 'Reality Hacker': 3, 'Cosmic Jester': 2 } },
            { id: 'd', text: "Compliment the mirror — you respect savage honesty.", weight: { 'Flow Shaman': 2, 'Dream Alchemist': 2 } },
            { id: 'e', text: "Smash it, ascend to the next dimension.", weight: { 'Quantum Magician': 3, 'Chaos Pilot': 3 } }
        ]
    },
    {
        id: 'chatgpt_19',
        source: 'chatgpt',
        question: "An angel appears with a clipboard and says, 'We've been auditing your karma, and… wow.' What do you do?",
        answers: [
            { id: 'a', text: "Offer a bribe — old habits die lucrative.", weight: { 'Chaos Pilot': 3, 'Cosmic Jester': 2 } },
            { id: 'b', text: "Ask to see the data before commenting.", weight: { 'Reality Hacker': 3, 'Shadow Sage': 2 } },
            { id: 'c', text: "Blame your star sign.", weight: { 'Cosmic Jester': 3, 'Flow Shaman': 1 } },
            { id: 'd', text: "Laugh, confess, and offer to do stand-up in purgatory.", weight: { 'Cosmic Jester': 3, 'Shadow Sage': 2 } },
            { id: 'e', text: "Fire the angel and run your own afterlife.", weight: { 'Quantum Magician': 3, 'Sacred Rebel': 3 } }
        ]
    },
    {
        id: 'chatgpt_20',
        source: 'chatgpt',
        question: "A small but devoted cult forms around you. They chant your tweets as scripture. What's your next move?",
        answers: [
            { id: 'a', text: "Launch merch and enlightenment retreats.", weight: { 'Reality Hacker': 3, 'Cosmic Jester': 2 } },
            { id: 'b', text: "Pretend you're horrified but secretly love it.", weight: { 'Shadow Sage': 3, 'Cosmic Jester': 2 } },
            { id: 'c', text: "Demand better fonts on the sacred texts.", weight: { 'Quantum Magician': 2, 'Reality Hacker': 2 } },
            { id: 'd', text: "Try to disband them by teaching critical thinking (fails).", weight: { 'Sacred Rebel': 3, 'Flow Shaman': 2 } },
            { id: 'e', text: "Join your own cult as a mysterious outsider.", weight: { 'Quantum Magician': 3, 'Dream Alchemist': 3 } }
        ]
    },

    // ===== PERPLEXITY QUESTIONS =====
    {
        id: 'perplexity_1',
        source: 'perplexity',
        question: "You wake to discover everyone speaks only in riddles. What's your first move?",
        answers: [
            { id: 'a', text: "Ask for the WiFi password in rhyming couplets.", weight: { 'Cosmic Jester': 3, 'Dream Alchemist': 2 } },
            { id: 'b', text: "Lead a support group: 'Lost in Translation Anonymous.'", weight: { 'Flow Shaman': 3, 'Sacred Rebel': 2 } },
            { id: 'c', text: "Set up an underground riddle market.", weight: { 'Reality Hacker': 3, 'Chaos Pilot': 2 } },
            { id: 'd', text: "Host daily decoding tournaments.", weight: { 'Reality Hacker': 2, 'Cosmic Jester': 2 } },
            { id: 'e', text: "Write a dictionary for interpretive dance responses.", weight: { 'Dream Alchemist': 3, 'Quantum Magician': 2 } },
            { id: 'f', text: "Laugh and see how long you last without Google Translate.", weight: { 'Chaos Pilot': 3, 'Cosmic Jester': 2 } },
            { id: 'g', text: "Start a podcast: 'The Mystery Hour.'", weight: { 'Cosmic Jester': 2, 'Shadow Sage': 2 } },
            { id: 'h', text: "Meditate, reflecting on the silence of clarity.", weight: { 'Shadow Sage': 3, 'Quantum Magician': 2 } }
        ]
    },
    {
        id: 'perplexity_2',
        source: 'perplexity',
        question: "You inherit a business staffed entirely by sentient houseplants. What's your management style?",
        answers: [
            { id: 'a', text: "Inspire with motivational sunlight speeches.", weight: { 'Sacred Rebel': 3, 'Flow Shaman': 2 } },
            { id: 'b', text: "Implement rigorous watering schedules.", weight: { 'Reality Hacker': 3, 'Flow Shaman': 1 } },
            { id: 'c', text: "Let roots run wild—embrace chaos.", weight: { 'Chaos Pilot': 3, 'Dream Alchemist': 2 } },
            { id: 'd', text: "Develop leaf-based communication protocols.", weight: { 'Reality Hacker': 3, 'Quantum Magician': 2 } },
            { id: 'e', text: "Focus group: 'Pot Bound and Proud.'", weight: { 'Cosmic Jester': 3, 'Sacred Rebel': 2 } },
            { id: 'f', text: "Give every fern a personal assistant.", weight: { 'Flow Shaman': 2, 'Reality Hacker': 1 } },
            { id: 'g', text: "Host plant karaoke every Friday.", weight: { 'Cosmic Jester': 3, 'Chaos Pilot': 2 } },
            { id: 'h', text: "Install mood lighting and host leaf yoga.", weight: { 'Flow Shaman': 3, 'Dream Alchemist': 2 } }
        ]
    },
    {
        id: 'perplexity_3',
        source: 'perplexity',
        question: "Your ideas appear as holograms above your head. How do you use this power?",
        answers: [
            { id: 'a', text: "Pitch creative brainstorms live on street corners.", weight: { 'Dream Alchemist': 3, 'Chaos Pilot': 2 } },
            { id: 'b', text: "Deflect questions by displaying random cats.", weight: { 'Cosmic Jester': 3, 'Chaos Pilot': 2 } },
            { id: 'c', text: "Run a hologram pop-up advice stall.", weight: { 'Sacred Rebel': 2, 'Flow Shaman': 2 } },
            { id: 'd', text: "Launch a startup for 'Headspace Billboards.'", weight: { 'Reality Hacker': 3, 'Quantum Magician': 2 } },
            { id: 'e', text: "Attend meetings with ironic memes only.", weight: { 'Cosmic Jester': 3, 'Shadow Sage': 2 } },
            { id: 'f', text: "Gift your best hologram to a friend.", weight: { 'Flow Shaman': 3, 'Dream Alchemist': 2 } },
            { id: 'g', text: "Hold a silent disco, letting ideas dance.", weight: { 'Dream Alchemist': 3, 'Cosmic Jester': 2 } },
            { id: 'h', text: "Ignore it—embrace the mystique.", weight: { 'Shadow Sage': 3, 'Quantum Magician': 2 } }
        ]
    },
    {
        id: 'perplexity_6',
        source: 'perplexity',
        question: "If your socks could debate philosophy, how do you handle morning routines?",
        answers: [
            { id: 'a', text: "Open with Socratic footnotes.", weight: { 'Shadow Sage': 3, 'Reality Hacker': 2 } },
            { id: 'b', text: "Hold a forum before breakfast.", weight: { 'Flow Shaman': 2, 'Sacred Rebel': 2 } },
            { id: 'c', text: "Maintain neutrality—left and right must agree.", weight: { 'Flow Shaman': 3, 'Quantum Magician': 2 } },
            { id: 'd', text: "Encourage sock-based improv sessions.", weight: { 'Cosmic Jester': 3, 'Dream Alchemist': 2 } },
            { id: 'e', text: "Record the debate for posterity.", weight: { 'Reality Hacker': 2, 'Shadow Sage': 2 } },
            { id: 'f', text: "Give all socks names and democratic voting rights.", weight: { 'Sacred Rebel': 3, 'Cosmic Jester': 2 } },
            { id: 'g', text: "Only wear socks that quote existential poets.", weight: { 'Shadow Sage': 3, 'Dream Alchemist': 2 } },
            { id: 'h', text: "Ignore them—embrace barefoot silence.", weight: { 'Chaos Pilot': 2, 'Quantum Magician': 2 } }
        ]
    },

    // ===== CLAUDE QUESTIONS (Money & Philosophy themed) =====
    {
        id: 'claude_1',
        source: 'claude',
        question: "A talking ATM becomes sentient and asks you what the meaning of money is. How do you respond?",
        answers: [
            { id: 'a', text: "'Money is just energy, babe. We're all made of stardust and credit scores.'", weight: { 'Quantum Magician': 3, 'Dream Alchemist': 2 } },
            { id: 'b', text: "'Money is the art of living beautifully. Also you're ugly.'", weight: { 'Cosmic Jester': 3, 'Shadow Sage': 2 } },
            { id: 'c', text: "'Money is security against the 47 ways civilization could collapse by Thursday.'", weight: { 'Reality Hacker': 3, 'Chaos Pilot': 2 } },
            { id: 'd', text: "'Money is fake and meaning is fake so let's just see what happens lol'", weight: { 'Chaos Pilot': 3, 'Cosmic Jester': 3 } },
            { id: 'e', text: "'Money is a tool for manifestation. Watch me turn this $20 into a Tesla.'", weight: { 'Quantum Magician': 3, 'Reality Hacker': 2 } },
            { id: 'f', text: "'Let me pull up my 40-slide presentation on optimal monetary theory.'", weight: { 'Reality Hacker': 3, 'Shadow Sage': 2 } },
            { id: 'g', text: "'Money is how we take care of each other. Are you okay? You seem stressed.'", weight: { 'Flow Shaman': 3, 'Sacred Rebel': 2 } },
            { id: 'h', text: "'Bold of you to assume money or meaning exist. I'm just here.'", weight: { 'Shadow Sage': 3, 'Quantum Magician': 2 } }
        ]
    },
    {
        id: 'claude_2',
        source: 'claude',
        question: "You inherit a house, but it's haunted by the ghost of a day trader who lost everything in 1929. What do you do?",
        answers: [
            { id: 'a', text: "Hire a medium to help him find spiritual closure (and maybe some investment tips)", weight: { 'Flow Shaman': 3, 'Quantum Magician': 2 } },
            { id: 'b', text: "Renovate it into an aesthetic masterpiece. The ghost adds character.", weight: { 'Dream Alchemist': 3, 'Cosmic Jester': 2 } },
            { id: 'c', text: "Sell immediately. Haunted assets have terrible resale value.", weight: { 'Reality Hacker': 3, 'Shadow Sage': 2 } },
            { id: 'd', text: "Move in. Chaos is just spicy stability.", weight: { 'Chaos Pilot': 3, 'Cosmic Jester': 2 } },
            { id: 'e', text: "Manifest the ghost into a wealth mentor. Trauma = wisdom.", weight: { 'Quantum Magician': 3, 'Dream Alchemist': 2 } },
            { id: 'f', text: "Create a risk-adjusted portfolio analysis of living with vs. selling a haunted house.", weight: { 'Reality Hacker': 3, 'Shadow Sage': 2 } },
            { id: 'g', text: "Let the ghost stay rent-free. Everyone deserves a home, even the dead.", weight: { 'Sacred Rebel': 3, 'Flow Shaman': 3 } },
            { id: 'h', text: "The ghost is you. You are the market crash. Wake up.", weight: { 'Shadow Sage': 3, 'Quantum Magician': 3 } }
        ]
    },
    {
        id: 'claude_5',
        source: 'claude',
        question: "You discover your soulmate, but they have a credit score of 400 and $80,000 in debt. What's your move?",
        answers: [
            { id: 'a', text: "Check their astrology chart. If the stars align, we'll manifest our way out of debt together.", weight: { 'Quantum Magician': 3, 'Dream Alchemist': 2 } },
            { id: 'b', text: "Can they at least dress well? I need a partner who understands aesthetic coherence.", weight: { 'Dream Alchemist': 2, 'Cosmic Jester': 2 } },
            { id: 'c', text: "Run a full financial background check and create a 10-year debt elimination plan before the first date.", weight: { 'Reality Hacker': 3, 'Shadow Sage': 2 } },
            { id: 'd', text: "Love is chaos. Debt is just spicy love. Let's get married tomorrow.", weight: { 'Chaos Pilot': 3, 'Cosmic Jester': 3 } },
            { id: 'e', text: "We'll manifest abundance together. Debt is just a limiting belief.", weight: { 'Quantum Magician': 3, 'Dream Alchemist': 2 } },
            { id: 'f', text: "Develop a shared budget optimization system and gamify debt repayment.", weight: { 'Reality Hacker': 3, 'Sacred Rebel': 1 } },
            { id: 'g', text: "I'll help them. Love means supporting people through their struggles.", weight: { 'Flow Shaman': 3, 'Sacred Rebel': 3 } },
            { id: 'h', text: "Soulmates are a capitalist construct to make you believe you're incomplete. I'm good alone.", weight: { 'Shadow Sage': 3, 'Reality Hacker': 2 } }
        ]
    },
    {
        id: 'claude_10',
        source: 'claude',
        question: "You find a wallet with $1,000 cash and an ID. No one's watching. What happens?",
        answers: [
            { id: 'a', text: "Ask the universe for guidance. Maybe this is a test.", weight: { 'Quantum Magician': 3, 'Flow Shaman': 2 } },
            { id: 'b', text: "Return it only if the person looks like they have good taste based on their ID photo.", weight: { 'Cosmic Jester': 3, 'Shadow Sage': 2 } },
            { id: 'c', text: "Keep $100 as a 'finder's fee' for emergency preparedness. Return the rest.", weight: { 'Reality Hacker': 3, 'Chaos Pilot': 2 } },
            { id: 'd', text: "Finders keepers. The universe rewards the bold.", weight: { 'Chaos Pilot': 3, 'Cosmic Jester': 2 } },
            { id: 'e', text: "Return it and manifest $10,000 for myself later as karmic reward.", weight: { 'Quantum Magician': 3, 'Dream Alchemist': 2 } },
            { id: 'f', text: "Calculate the statistical likelihood of being caught vs. the ethical implications.", weight: { 'Reality Hacker': 3, 'Shadow Sage': 3 } },
            { id: 'g', text: "Return it immediately. This is someone's life.", weight: { 'Sacred Rebel': 3, 'Flow Shaman': 3 } },
            { id: 'h', text: "Money isn't real. The wallet isn't real. Keep walking.", weight: { 'Shadow Sage': 3, 'Quantum Magician': 2 } }
        ]
    },
    {
        id: 'claude_13',
        source: 'claude',
        question: "You're on a sinking ship. You can save either a briefcase with $1M or a stranger. What do you do?",
        answers: [
            { id: 'a', text: "Save whoever the universe wants me to save. I'll know in the moment.", weight: { 'Quantum Magician': 3, 'Flow Shaman': 2 } },
            { id: 'b', text: "Save the money. A million dollars can save MANY lives later. I'm being strategic.", weight: { 'Reality Hacker': 3, 'Shadow Sage': 2 } },
            { id: 'c', text: "Save the stranger. They might have survival skills I need for the apocalypse.", weight: { 'Chaos Pilot': 2, 'Reality Hacker': 2 } },
            { id: 'd', text: "Save the stranger, then immediately ask if they want to invest in something wild together.", weight: { 'Chaos Pilot': 3, 'Cosmic Jester': 2 } },
            { id: 'e', text: "Save the stranger. The million will manifest back to me for doing the right thing.", weight: { 'Quantum Magician': 3, 'Dream Alchemist': 2 } },
            { id: 'f', text: "Calculate likelihood of stranger's survival vs. salvageability of waterlogged cash.", weight: { 'Reality Hacker': 3, 'Shadow Sage': 2 } },
            { id: 'g', text: "Save the stranger. Obviously. What kind of question is this?", weight: { 'Sacred Rebel': 3, 'Flow Shaman': 3 } },
            { id: 'h', text: "We're all drowning anyway. Save no one. Observe the impermanence.", weight: { 'Shadow Sage': 3, 'Quantum Magician': 2 } }
        ]
    }
];

/**
 * Randomly select N questions from the pool
 */
export function getRandomQuestions(count: number): Question[] {
    const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

/**
 * Get questions by their IDs
 */
export function getQuestionsByIds(ids: string[]): Question[] {
    return ids
        .map(id => ALL_QUESTIONS.find(q => q.id === id))
        .filter((q): q is Question => q !== undefined);
}
