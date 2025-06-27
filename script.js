// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- LOGICAL STATEMENT VARIABLES ---
    let mainMood = "";
    let subMood = "";
    let note = "";
    let history = [];

    // --- DOM ELEMENT REFERENCES ---
    const mainMoodButtons = document.querySelectorAll('#main-mood-options .mood-btn');
    const subMoodSection = document.getElementById('sub-mood-section');
    const subMoodOptionsContainer = document.getElementById('sub-mood-options');
    const noteSection = document.getElementById('note-section');
    const noteInput = document.getElementById('note-input');
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackText = document.getElementById('feedback-text');
    const submitBtn = document.getElementById('submit-btn');
    const historyList = document.getElementById('history-list');
    const noHistoryMsg = document.getElementById('no-history-msg');

    // --- DATA MAPPINGS FOR MOODS AND SUGGESTIONS ---
    const moodMappings = {
        "Happy": ["Energetic", "Calm"],
        "Sad": ["Lonely", "Tired"],
        "Stressed": ["Overworked", "Worried"]
    };

    const suggestionMappings = {
        "Energetic": "Channel your energy into something creative!",
        "Calm": "Enjoy the peace. Maybe try a 5-minute meditation?",
        "Lonely": "Connection is important. Call a friend or family member.",
        "Tired": "Your body is asking for a break. Take a short nap or rest.",
        "Overworked": "Remember to take breaks. Balance is key to long-term success.",
        "Worried": "Focus on your breath. Try some deep breathing exercises."
    };

    // --- EVENT LISTENERS ---

    // 1. Listen for clicks on main mood buttons
    mainMoodButtons.forEach(button => {
        button.addEventListener('click', () => {
            handleMainMoodSelection(button.dataset.mood, button);
        });
    });

    // 2. Listen for click on the submit button
    submitBtn.addEventListener('click', handleSubmission);

    // --- CORE FUNCTIONS ---

    /**
     * Handles the selection of a main mood.
     * @param {string} selectedMood - The mood from the button's data attribute.
     * @param {HTMLElement} clickedButton - The button element that was clicked.
     */
    function handleMainMoodSelection(selectedMood, clickedButton) {
        mainMood = selectedMood;
        subMood = ""; // Reset sub-mood on new main mood selection

        // Visual feedback for active button
        mainMoodButtons.forEach(btn => btn.classList.remove('active'));
        clickedButton.classList.add('active');

        // Dynamically populate and show the sub-mood section
        populateSubMoods(mainMood);
        subMoodSection.classList.remove('hidden');
        subMoodSection.classList.add('fade-in');
        noteSection.classList.remove('hidden');
        noteSection.classList.add('fade-in');
        
        // Reset feedback
        showFeedback("Select a sub-mood to continue.", "neutral");
    }

    /**
     * Creates and displays sub-mood buttons based on the main mood.
     * @param {string} mood - The selected main mood.
     */
    function populateSubMoods(mood) {
        subMoodOptionsContainer.innerHTML = ''; // Clear previous options
        const subMoods = moodMappings[mood];

        subMoods.forEach(sm => {
            const button = document.createElement('button');
            button.textContent = sm;
            button.className = 'mood-btn sub-mood';
            button.dataset.mood = sm;
            button.addEventListener('click', () => handleSubMoodSelection(sm, button));
            subMoodOptionsContainer.appendChild(button);
        });
    }

    /**
     * Handles the selection of a sub-mood.
     * @param {string} selectedSubMood - The selected sub-mood.
     * @param {HTMLElement} clickedButton - The button element that was clicked.
     */
    function handleSubMoodSelection(selectedSubMood, clickedButton) {
        subMood = selectedSubMood;

        // Visual feedback for active button
        document.querySelectorAll('.sub-mood').forEach(btn => btn.classList.remove('active'));
        clickedButton.classList.add('active');

        // Show the personalized suggestion
        const suggestion = suggestionMappings[subMood];
        showFeedback(suggestion, "suggestion");
    }

    /**
     * Handles the final submission of the mood entry.
     */
    function handleSubmission() {
        // --- VALIDATION LOGIC ---
        if (mainMood === "") {
            showFeedback("Please select your main mood.", "error");
            return;
        }
        if (subMood === "") {
            showFeedback("Please select your sub mood.", "error");
            return;
        }

        // Get the note from the textarea
        note = noteInput.value.trim();

        // Create timestamp
        const timestamp = new Date();
        const formattedDate = `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

        // Create the new entry object
        const newEntry = {
            mainMood,
            subMood,
            note,
            timestamp: formattedDate
        };

        // Add to history and update the display
        history.unshift(newEntry); // Add to the start of the array
        updateHistoryDisplay();

        // Reset the form for the next entry
        resetForm();
        showFeedback("Entry saved! Ready for the next one.", "neutral");
    }

    // --- UI UPDATE FUNCTIONS ---

    /**
     * Renders the history list in the UI.
     */
    function updateHistoryDisplay() {
        historyList.innerHTML = ''; // Clear the current list

        if (history.length === 0) {
            noHistoryMsg.classList.remove('hidden');
        } else {
            noHistoryMsg.classList.add('hidden');
            history.forEach(entry => {
                const li = document.createElement('li');
                li.className = 'history-item';
                li.innerHTML = `
                    <div class="history-item-content">
                        <p>${entry.mainMood} - ${entry.subMood}</p>
                        ${entry.note ? `<p class="note">"${entry.note}"</p>` : ''}
                    </div>
                    <span class="history-item-timestamp">${entry.timestamp}</span>
                `;
                historyList.appendChild(li);
            });
        }
    }

    /**
     * Resets the entire form to its initial state.
     */
    function resetForm() {
        mainMood = "";
        subMood = "";
        note = "";
        noteInput.value = "";

        mainMoodButtons.forEach(btn => btn.classList.remove('active'));
        
        subMoodSection.classList.add('hidden');
        noteSection.classList.add('hidden');
        subMoodOptionsContainer.innerHTML = '';
    }

    /**
     * Displays feedback messages (suggestions or errors) to the user.
     * @param {string} message - The text to display.
     * @param {'suggestion'|'error'|'neutral'} type - The type of message.
     */
    function showFeedback(message, type) {
        feedbackText.textContent = message;
        feedbackContainer.className = 'feedback-box'; // Reset classes
        if (type === 'suggestion' || type === 'error') {
            feedbackContainer.classList.add(type);
        }
    }
});
