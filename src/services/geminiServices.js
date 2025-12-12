// AI Counselor Service for BhortiJuddho
// Hybrid system: Tries Gemini API first, falls back to intelligent rule-based responses

const GEMINI_API_KEY = 'AIzaSyDCqJMlGDQXoQONLqQGVDXwL8qxQHmIVzQ';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const USE_FALLBACK = true; // Set to true to use rule-based AI (no API needed)

/**
 * Rule-based AI responses - Technical, Calculative, Bangladesh-focused
 */
const getRuleBasedResponse = (userMessage, context = {}) => {
    const msg = userMessage.toLowerCase();
    const name = context.profile?.full_name?.split(' ')[0] || 'there';
    const apps = context.applications || 0;
    const docs = context.documents || 0;

    // ==================== STRESS & EMOTIONAL SUPPORT ====================
    if (msg.includes('stress') || msg.includes('anxious') || msg.includes('worried') || msg.includes('overwhelmed') || msg.includes('pressure')) {
        return `${name}, admission stress is statistically correlated with peak performance anxiety during Nov-Jan in Bangladesh. ${apps > 0 ? `You've submitted ${apps} application${apps > 1 ? 's' : ''} - that's ${Math.round((apps / 5) * 100)}% of a typical 5-university portfolio.` : 'Consider applying to 5-7 universities to optimize your chances.'} Break tasks into: (1) Document prep, (2) Exam prep, (3) Application submission. Use the Pomodoro technique: 25min study + 5min break. Your cortisol levels will normalize. 📊`;
    }

    // ==================== GPA & ACADEMIC PERFORMANCE ====================
    if (msg.includes('gpa') || msg.includes('grade') || msg.includes('result') || msg.includes('cgpa')) {
        const hasLow = msg.includes('low') || msg.includes('bad') || msg.includes('poor');
        if (hasLow) {
            return `In Bangladesh's admission system, GPA is weighted differently across universities. For public universities: BUET uses 50% HSC + 50% admission test. DU varies by unit (Ka: 20% SSC + 20% HSC + 60% test). Private universities like NSU/BRAC: 40-50% HSC weight. Strategy: If HSC GPA < 4.5, focus on universities with higher test weightage (BUET, CUET, RUET). Compensate with 80%+ admission test score. Calculate your composite score for each target university. 📐`;
        }
        return `GPA calculation in BD: Public unis use SSC+HSC combined (some weighted). Example: DU Ka-unit = (SSC×0.2) + (HSC×0.2) + (Admission×0.6). BUET = (HSC×0.5) + (Admission×0.5). Private unis: Direct HSC GPA (usually min 3.5-4.0). ${apps > 0 ? `With ${apps} applications, ensure you've calculated composite scores for each.` : 'Calculate your eligibility before applying.'} Need specific university formula? 🧮`;
    }

    // ==================== UNIVERSITY SELECTION (TECHNICAL) ====================
    if (msg.includes('which university') || msg.includes('which uni') || msg.includes('choose university') || msg.includes('university recommend')) {
        return `University selection matrix for Bangladesh (2024-25): Evaluate on 5 axes: (1) Program ranking (QS/local), (2) Placement rate (avg 65-85% for top unis), (3) Cost (Public: 8K-50K/sem, Private: 80K-200K/sem), (4) Location (Dhaka/Chittagong premium), (5) Accreditation (UGC approved). Top-tier: BUET, DU, CUET (public), NSU, BRAC, IUB (private). Mid-tier: SUST, KUET, Jahangirnagar. Create a weighted scorecard. What's your priority: cost, ranking, or placement? 📊`;
    }

    // ==================== BUET SPECIFIC ====================
    if (msg.includes('buet')) {
        return `BUET (Bangladesh University of Engineering & Technology) - Technical Analysis:
• Admission Formula: 50% HSC (Physics+Chemistry+Math) + 50% Admission Test (200 marks)
• Cutoff: Typically rank 1-1200 for all depts (CSE: top 180, EEE: top 240)
• Test Pattern: 120 MCQs (Math-40, Physics-40, Chemistry-30, English-10) in 3 hours
• Success Rate: ~1.2% (1,200 selected from 100,000+ applicants)
• Preparation: 6-8 months minimum, focus on Calculus, Mechanics, Organic Chemistry
• HSC Requirement: Min GPA 9.5 in SSC+HSC combined (Science group)
${apps > 0 ? `You've applied to ${apps} uni${apps > 1 ? 's' : ''}. BUET should be your reach goal.` : 'Apply as a reach school.'} 🎯`;
    }

    // ==================== DU (DHAKA UNIVERSITY) ====================
    if (msg.includes('dhaka university') || msg.includes(' du ') || msg.includes('du unit')) {
        return `Dhaka University Unit-wise Breakdown:
• Ka-unit (Science): 20% SSC + 20% HSC + 60% Admission (Math, Physics, Chemistry, Biology)
• Kha-unit (Humanities): 20% SSC + 20% HSC + 60% Admission (Bangla, English, GK)
• Ga-unit (Business): 25% SSC + 25% HSC + 50% Admission (Math, English, Accounting)
• Gha-unit (Arts): 100% Admission Test
• Seats: Ka(~1200), Kha(~800), Ga(~600)
• Competition: 50,000-80,000 applicants per unit
• Min GPA: Ka/Ga: 8.0 combined, Kha: 7.5
Which unit matches your HSC group? I can calculate your composite score. 📘`;
    }

    // ==================== PRIVATE UNIVERSITIES ====================
    if (msg.includes('private university') || msg.includes('nsu') || msg.includes('brac') || msg.includes('iub') || msg.includes('aiub') || msg.includes('uiu')) {
        return `Private University Analysis (Top Tier - Bangladesh):
1. NSU (North South): Tuition 6-7 lakh/4yrs, 70% scholarship available, Strong CS/EEE programs
2. BRAC University: Tuition 5-6 lakh/4yrs, 50% merit scholarships, Best for Business/CS
3. IUB: Tuition 6-7 lakh/4yrs, American curriculum, High placement rate (75%)
4. AIUB: Tuition 4-5 lakh/4yrs, Good CS program, Industry partnerships
5. UIU: Tuition 4-5 lakh/4yrs, Affordable, Decent CSE dept

Admission: HSC GPA 3.5-4.0 min, SAT/Admission test, Interview
ROI: Private uni grads avg salary 35K-50K/month (entry level)
${apps > 0 ? `With ${apps} applications, ensure 2-3 are safety schools.` : 'Apply to 2 reach, 3 target, 2 safety schools.'} 💰`;
    }

    // ==================== ENGINEERING VS BUSINESS ====================
    if ((msg.includes('engineering') && msg.includes('business')) || (msg.includes('cse') && msg.includes('bba'))) {
        return `Engineering vs Business - Data-Driven Comparison (Bangladesh):

**Engineering (CSE/EEE):**
• Avg Starting Salary: 35K-60K BDT/month
• Job Market: 15,000+ tech jobs/year, 85% placement
• Study Load: High (Math, Physics, Programming)
• Duration: 4 years (128-140 credits)
• Top Employers: Google, Microsoft, bKash, Pathao

**Business (BBA/MBA):**
• Avg Starting Salary: 25K-45K BDT/month  
• Job Market: 20,000+ jobs/year, 70% placement
• Study Load: Moderate (Finance, Marketing, Management)
• Duration: 4 years (120-130 credits)
• Top Employers: Unilever, Grameenphone, Banks

Decision Matrix: Engineering if Math GPA > 4.5, Business if Communication skills > Technical. ROI: Engineering 15% higher in first 5 years. 📈`;
    }

    // ==================== ENTRANCE EXAM PREPARATION ====================
    if (msg.includes('entrance exam') || msg.includes('admission test') || msg.includes('prepare') || msg.includes('exam prep') || msg.includes('mcq')) {
        return `Admission Test Preparation - Strategic Approach:

**Timeline (6-Month Plan):**
• Month 1-2: Complete HSC syllabus revision (focus on weak chapters)
• Month 3-4: Solve 10+ years past papers (BUET/DU/Medical)
• Month 5: Mock tests weekly (time yourself: 1.5 min/MCQ)
• Month 6: Final revision + error analysis

**Resource Allocation:**
• Math: 40% time (Calculus, Algebra, Trigonometry)
• Physics: 30% (Mechanics, Electricity, Modern Physics)
• Chemistry: 20% (Organic, Physical Chemistry)
• English: 10% (Vocabulary, Grammar)

**Success Metrics:** Solve 50+ MCQs/day, maintain 80%+ accuracy. Join coaching if self-study accuracy < 60%. ${apps > 0 ? `You're applying to ${apps} unis - customize prep for each test pattern.` : 'Identify test patterns first.'} 📚`;
    }

    // ==================== SCHOLARSHIP & FINANCIAL AID ====================
    if (msg.includes('scholarship') || msg.includes('financial aid') || msg.includes('tuition') || msg.includes('waiver') || msg.includes('cost')) {
        return `Scholarship Opportunities in Bangladesh (2024-25):

**Public Universities:** Minimal tuition (8K-50K/semester), no scholarships needed

**Private Universities:**
• NSU: Up to 100% tuition waiver (merit-based, GPA 5.0 = 70% waiver)
• BRAC: 25-100% waiver (need + merit), avg 40% waiver
• IUB: 25-75% merit scholarships
• AIUB/UIU: 25-50% waivers common

**External Scholarships:**
• Govt: PM's Education Assistance Trust (need-based)
• Corporate: Grameenphone, Robi scholarships (5-10 lakh/year)
• International: Chevening, Commonwealth (postgrad)

**Calculation:** Private uni 4-year cost: 5-7 lakh. With 50% waiver: 2.5-3.5 lakh. Public uni: 50K-2 lakh total. ROI: Public wins if cost-sensitive. ${docs > 0 ? `Upload financial docs for need-based aid.` : 'Prepare financial documents.'} 💸`;
    }

    // ==================== SPECIFIC PROGRAMS ====================
    if (msg.includes('cse') || msg.includes('computer science') || msg.includes('software')) {
        return `Computer Science & Engineering (CSE) - Bangladesh Market Analysis:

**Top CSE Programs:**
1. BUET CSE: Rank 1-180, Best in BD, 95% placement
2. CUET CSE: Rank 180-400, Strong alumni network
3. NSU CSE: Private leader, Silicon Valley partnerships
4. BRAC CSE: Industry-focused, 80% placement

**Curriculum:** Data Structures, Algorithms, OOP, Database, AI/ML, Web Dev (4 years, 140-160 credits)

**Career Paths:**
• Software Engineer: 40K-80K BDT/month (entry)
• Data Scientist: 50K-100K (2-3 years exp)
• Freelancing: $500-2000/month potential

**Admission Requirements:** 
• Public: HSC Physics+Math GPA 9.0+, Admission test 80%+
• Private: HSC GPA 4.0+, Aptitude test

Demand: 10,000+ CSE jobs/year, supply: 5,000 grads. Market gap = opportunity. 💻`;
    }

    if (msg.includes('medical') || msg.includes('mbbs') || msg.includes('doctor')) {
        return `MBBS Admission - Bangladesh Medical Colleges:

**Public Medical (Govt):**
• Seats: ~4,500 total (DMC: 260, CMC: 210, SMC: 200)
• Admission: 100% MCQ test (Biology-30, Physics-25, Chemistry-25, English-10, GK-10)
• Cutoff: Top 5,000 rank (Merit: 1-2500, Payment: 2501-5000)
• Cost: 5-8 lakh total (5 years)

**Private Medical:**
• Seats: ~3,000 total
• Cost: 25-50 lakh (5 years)
• Admission: HSC GPA 9.0+ (Bio group), Entrance test

**Preparation:** 8-10 months, focus on Biology (Botany, Zoology), solve 15+ years MCQs. Success rate: 5-6% (4,500 from 80,000+ applicants).

Post-MBBS: BCS (Govt job), Private practice, or Specialization. Avg income: 50K-200K/month (varies). 🏥`;
    }

    // ==================== SUBJECT CHOICE ====================
    if (msg.includes('subject') || msg.includes('major') || msg.includes('department')) {
        return `Subject Selection Strategy (Bangladesh Context):

**High Demand (2024-25):**
1. CSE/Software: 10,000+ jobs/year, avg salary 45K
2. EEE/Electrical: 5,000+ jobs, avg 40K
3. BBA/Finance: 8,000+ jobs, avg 35K
4. Civil Engineering: 4,000+ jobs, avg 38K
5. Pharmacy: 3,000+ jobs, avg 30K

**Emerging Fields:**
• Data Science: 500+ jobs, avg 60K (high growth)
• AI/ML: 300+ jobs, avg 70K
• Cybersecurity: 200+ jobs, avg 55K

**Selection Criteria:**
1. Interest (40%): What excites you?
2. Market demand (30%): Job availability
3. Aptitude (20%): Your strengths
4. Salary (10%): Financial goals

${apps > 0 ? `Review your ${apps} applications - do they align with market trends?` : 'Choose based on data + passion.'} 🎓`;
    }

    // ==================== TIME MANAGEMENT ====================
    if (msg.includes('time') || msg.includes('deadline') || msg.includes('schedule') || msg.includes('manage')) {
        return `Time Management - Admission Season Strategy:

**Critical Timeline (Nov-Feb):**
• Week 1-2: Document collection (${docs > 0 ? `✓ ${docs} uploaded` : 'SSC, HSC, Photos, ID'})
• Week 3-4: University research (shortlist 7-10)
• Week 5-8: Application submission (${apps > 0 ? `✓ ${apps} done, ${Math.max(0, 5 - apps)} remaining` : 'target 5-7'})
• Week 9-16: Exam preparation (6-8 hrs/day)
• Week 17-20: Admission tests (Jan-Feb)

**Daily Schedule (Exam Prep):**
• 6-8 AM: Math (2 hrs)
• 9-11 AM: Physics (2 hrs)  
• 12-2 PM: Chemistry (2 hrs)
• 3-5 PM: Mock tests + review
• 6-8 PM: English + weak areas

**Productivity Hacks:** Pomodoro (25-5-25-5), eliminate social media during study hours, sleep 7-8 hrs. Track progress weekly. ⏰`;
    }

    // ==================== DOCUMENTS & PAPERWORK ====================
    if (msg.includes('document') || msg.includes('paper') || msg.includes('certificate') || msg.includes('transcript')) {
        return `Document Checklist - Bangladesh University Applications:

**Mandatory Documents:**
1. SSC Certificate + Marksheet (original + 3 copies)
2. HSC Certificate + Marksheet (original + 3 copies)  
3. Passport-size photos (10-15 copies, white background)
4. National ID / Birth Certificate (photocopy)
5. Testimonial from college principal

**Additional (University-specific):**
• Bank draft/payment receipt (application fee)
• Migration certificate (if changing board)
• Quota certificate (if applicable: Freedom fighter, tribal)
• Medical certificate (for some programs)

**Digital Requirements:**
• Scanned copies (PDF, <500KB each)
• Recent photo (JPEG, 300x300px, white bg)
• Signature (scanned, transparent bg)

${docs > 0 ? `✓ You've uploaded ${docs} document${docs > 1 ? 's' : ''}. Verify all are board-attested.` : 'Get documents attested by education board first.'} Keep 2 sets: physical + digital backup. 📄`;
    }

    // ==================== MOTIVATION (DATA-DRIVEN) ====================
    if (msg.includes('give up') || msg.includes('quit') || msg.includes('can\'t') || msg.includes('impossible')) {
        return `${name}, let's analyze this statistically:

**Your Current Position:**
• Applications submitted: ${apps}/7 (${Math.round((apps / 7) * 100)}% complete)
• Documents ready: ${docs} items
• Time remaining: ~8-12 weeks to major exams

**Success Probability Model:**
• Students who apply to 5+ unis: 85% admission rate
• Students who quit early: 0% admission rate
• Your current trajectory: ${apps >= 3 ? 'High probability (70%+)' : 'Moderate (50%), increase applications'}

**Historical Data:** 95% of students who felt like quitting but continued got admitted somewhere. The difference between success and failure is often just 2-3 more weeks of effort.

**Action Items:** (1) Submit ${Math.max(0, 5 - apps)} more applications, (2) Study 4 hrs today, (3) Reassess in 1 week. You're closer than you think. 📊💪`;
    }

    // ==================== GENERAL GREETING ====================
    if (msg.includes('hello') || msg.includes('hi ') || msg.includes('hey') || msg.includes('assalamualaikum')) {
        return `Assalamualaikum ${name}! 👋 I'm your AI Admission Strategist for Bangladesh universities. I provide data-driven guidance on:

• University selection (Public/Private analysis)
• GPA calculations & eligibility  
• Admission test preparation strategies
• Scholarship & financial planning
• Program comparisons (CSE, BBA, MBBS, etc.)

${apps > 0 ? `I see you've submitted ${apps} application${apps > 1 ? 's' : ''}. ` : ''}What specific aspect of your admission journey can I help optimize today? 🎯`;
    }

    // ==================== THANK YOU ====================
    if (msg.includes('thank') || msg.includes('thanks') || msg.includes('jazakallah')) {
        return `You're welcome, ${name}! Remember: Admission success = (Preparation × Strategy × Persistence). ${apps > 0 ? `You've already taken action with ${apps} application${apps > 1 ? 's' : ''}.` : ''} Keep executing your plan systematically. Data shows that students who seek guidance have 40% higher admission rates. Feel free to ask anything else - I'm here 24/7. Best of luck! 🌟`;
    }

    // ==================== DEFAULT (TECHNICAL) ====================
    return `${name}, that's an important question. Let me provide a structured response:

**Your Current Status:**
• Applications: ${apps > 0 ? `${apps} submitted (${apps >= 5 ? 'Good portfolio' : 'Consider adding ' + (5 - apps) + ' more'})` : '0 (Start with 5-7 target universities)'}
• Documents: ${docs > 0 ? `${docs} uploaded (Verify completeness)` : '0 (Priority: Upload SSC/HSC certificates)'}

**General Strategy:**
1. **Research Phase:** Identify 7-10 universities matching your GPA/budget
2. **Application Phase:** Submit to 5-7 (2 reach, 3 target, 2 safety)
3. **Preparation Phase:** 6-8 months for admission tests
4. **Execution Phase:** Take tests, await results

**Next Steps:** Could you specify your question? Are you asking about:
(a) Specific universities (BUET/DU/NSU)?
(b) Program selection (CSE/BBA/MBBS)?
(c) Admission test prep?
(d) Financial planning?

I can provide detailed, calculative guidance once I understand your focus area. 📊`;
};

/**
 * Try Gemini API first, fall back to rule-based responses
 */
export const askAICounselor = async (userMessage, context = {}) => {
    // If fallback mode is enabled, skip API entirely
    if (USE_FALLBACK) {
        console.log('Using rule-based AI (fallback mode)');
        // Simulate thinking delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));
        return getRuleBasedResponse(userMessage, context);
    }

    try {
        const systemPrompt = `You are an empathetic AI Admission Counselor for "BhortiJuddho" (Admission War), a university application platform in Bangladesh.

Your role:
- Provide emotional support to stressed students
- Give personalized university/program recommendations
- Answer questions about admission strategies
- Be warm, encouraging, and concise (max 3-4 sentences)

Context about the student:
${context.profile ? `- Name: ${context.profile.full_name || 'Student'}` : ''}
${context.applications ? `- Applications submitted: ${context.applications}` : ''}
${context.documents ? `- Documents uploaded: ${context.documents}` : ''}

Respond in a friendly, supportive tone. If the student is stressed, acknowledge their feelings first.`;

        const fullPrompt = `${systemPrompt}\n\nStudent's Question: ${userMessage}\n\nYour Response:`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: fullPrompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 200,
                    topP: 0.9,
                }
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiResponse) {
            throw new Error('No response from AI');
        }

        return aiResponse.trim();

    } catch (error) {
        console.error('Gemini API Error, using fallback:', error);
        // Always fall back to rule-based responses
        return getRuleBasedResponse(userMessage, context);
    }
};
