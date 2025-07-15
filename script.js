document.addEventListener('DOMContentLoaded', () => {

    if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
    }
      
    // --- Screen Elements ---
    const homeScreen = document.getElementById('homeScreen');
    const addRoutineScreen = document.getElementById('addRoutineScreen');
    const routineDetailsScreen = document.getElementById('routineDetailsScreen');
    const selectExerciseScreen = document.getElementById('selectExerciseScreen');

    // --- Buttons & Inputs ---
    const addRoutineButton = document.getElementById('addRoutineButton'); // Home Screen
    const backButtonAddRoutine = document.querySelector('.back-button-add-routine'); // Add Routine Screen
    const saveRoutineButton = document.getElementById('saveRoutineButton'); // Add Routine Screen
    const newRoutineNameInput = document.getElementById('newRoutineNameInput'); // Add Routine Screen

    const backButtonRoutineDetails = document.querySelector('.back-button-routine-details'); // Routine Details Screen
    const addExerciseButton = document.getElementById('addExerciseButton'); // Routine Details Screen
    const editRoutineDetailsButton = document.getElementById('editRoutineDetailsButton'); // Routine Details Screen
    const deleteRoutineButton = document.getElementById('deleteRoutineButton'); // Routine Details Screen

    const backButtonSelectExercise = document.querySelector('.back-button-select-exercise'); // Select Exercise Screen
    const exerciseSearchInput = document.getElementById('exerciseSearchInput'); // Select Exercise Screen
    const allExercisesList = document.getElementById('allExercisesList'); // Select Exercise Screen

    const routinesList = document.getElementById('routinesList'); // Home Screen - where routines are listed
    const exercisesListContainer = document.getElementById('exercisesList'); // Routine Details Screen - where exercises are listed
    const routineDetailsTitle = document.getElementById('routineDetailsTitle'); // Routine Details Screen title

    const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');
    const homeNavItem = document.querySelector('.home-nav-item');
    const workoutNavItem = document.querySelector('.workout-nav-item');
    const profileNavItem = document.querySelector('.profile-nav-item');

    // Rest Timer Elements
    const openRestTimerPickerButton = document.getElementById('openRestTimerPicker');
    const displayRestTimer = document.getElementById('displayRestTimer');
    // The startRestTimerButton is now removed as per your request to auto-start.
    // const startRestTimerButton = document.getElementById('startRestTimerButton'); // Assuming you add this button in HTML

    // Action Sheet Elements (Set Type)
    const setOptionsActionSheet = document.getElementById('setOptionsActionSheet');
    const actionList = setOptionsActionSheet.querySelector('.action-list');
    const cancelSetOptionButton = document.getElementById('cancelSetOption');

    // Action Sheet Elements (Rest Timer Picker)
    const restTimerPickerActionSheet = document.getElementById('restTimerPickerActionSheet');
    const restTimerExerciseName = restTimerPickerActionSheet.querySelector('.rest-timer-exercise-name');
    const restTimerOptionsList = restTimerPickerActionSheet.querySelector('.rest-timer-options-list');
    const cancelRestTimerPickerButton = document.getElementById('cancelRestTimerPicker');

    // NEW: Action Sheet Elements (Repetition Options)
    const repetitionOptionsActionSheet = document.getElementById('repetitionOptionsActionSheet');
    const repsOption = repetitionOptionsActionSheet.querySelector('li[data-rep-option="reps"]');
    const repRangeOption = repetitionOptionsActionSheet.querySelector('li[data-rep-option="rep_range"]');
    const repsCheckIcon = document.getElementById('repsCheckIcon');
    const repRangeCheckIcon = document.getElementById('repRangeCheckIcon');
    const cancelRepetitionOptionsButton = document.getElementById('cancelRepetitionOptions');

    // --- Data Structures (Mock Data) ---
    let routines = JSON.parse(localStorage.getItem('fitnessRoutines')) || [];
    let currentRoutineId = null; // To keep track of the currently viewed/edited routine

    // Rest Timer Variables
    let restTimerInterval = null;
    let restTimeRemaining = 0; // In seconds
    let currentRestExerciseId = null; // To store which exercise's timer is active
    let currentRoutineRestTime = 60; // Default rest time for the routine (can be set per routine later)

    // Predefined rest times for the picker
    const restTimeOptions = [
        { display: 'Off', value: 0 },
        { display: '15s', value: 15 },
        { display: '30s', value: 30 },
        { display: '45s', value: 45 },
        { display: '1:00', value: 60 },
        { display: '1:30', value: 90 },
        { display: '2:00', value: 120 },
        { display: '2:30', value: 150 },
        { display: '3:00', value: 180 },
        { display: '4:00', value: 240 },
        { display: '5:00', value: 300 },
        { display: '6:00', value: 360 },
    ];


    // Variables for Action Sheet context
    let currentExerciseIdForSet = null;
    let currentSetIndexForSet = null;
    // NEW: Variable for Repetition Options context
    let currentExerciseIdForRepOption = null;


    // Define a list of all available exercises
    const allExercises = [
        { id: 'ex1', name: 'Abs', muscle: 'تمارين عضلات البطن' },      
        { id: 'ex1', name: 'Bird Dog', muscle: 'Core' },
        { id: 'ex2', name: 'Side Bend', muscle: 'Abs' },
        { id: 'ex3', name: 'Plank', muscle: 'Abs' },
        { id: 'ex4', name: 'Dead Bug', muscle: 'Core' },
        { id: 'ex5', name: 'Crunch', muscle: 'Abs' }, // From image
        { id: 'ex6', name: 'Whodchop Rotation (pallof rotation)', muscle: 'Core' }, // From image
        { id: 'ex7', name: 'Cable Crunch', muscle: 'Abs' }, // From image
        { id: 'ex8', name: 'Pallof Press Cable', muscle: 'Core' }, // From image
        { id: 'ex9', name: 'Side Plank', muscle: 'Abs' },
        { id: 'ex10', name: 'legs', muscle: 'تمارين عضلات الرجل' },
        { id: 'ex11', name: 'Hip Adduction Machine', muscle: 'Adductors' },
        { id: 'ex12', name: 'Standing Calf Raise (smith)', muscle: 'Calves' },
        { id: 'ex13', name: 'Standing Calf Raise (Machine)', muscle: 'Calves' },
        { id: 'ex14', name: 'Standing Calf Raise (Dumbbell)', muscle: 'Calves' },
        { id: 'ex15', name: 'Single Leg Standing Calf Raise (Machine)', muscle: 'Calves' },
        { id: 'ex16', name: 'Single Leg Standing Calf Raise (Dumbbell)', muscle: 'Calves' },
        { id: 'ex17', name: 'Calf press (Machine)', muscle: 'Calves' },
        { id: 'ex18', name: 'Calf Extension (Machine)', muscle: 'Calves' },
        { id: 'ex20', name: 'Leg Extension (Machine)', muscle: 'Quads' },
        { id: 'ex20', name: 'Single Leg Extension (Machine)', muscle: 'Quads' },
        { id: 'ex21', name: 'Leg Press (Machine)', muscle: 'Quads' },
        { id: 'ex22', name: 'Squat (Smith Machine)', muscle: 'Quads' },
        { id: 'ex23', name: 'Bulgarian Split Squat Dumbbell', muscle: 'Quads' },
        { id: 'ex24', name: 'Hack Squat (Machine)', muscle: 'Quads' },
        { id: 'ex25', name: 'Sissy Squat', muscle: 'Quads' },
        { id: 'ex26', name: 'Lying Leg Curl (Machine)', muscle: 'Hamstrings' },
        { id: 'ex27', name: 'Seated Leg Curl (Machine)', muscle: 'Hamstrings' },
        { id: 'ex28', name: 'Romanian Deadlift (Dumbbell)', muscle: 'Hamstrings' },
        { id: 'ex29', name: 'Romanian Deadlift (Barbell)', muscle: 'Hamstrings' },
        { id: 'ex30', name: 'Glute Bridge', muscle: 'Glutes' },
        { id: 'ex31', name: 'HiP Thrust', muscle: 'Glutes' },
        { id: 'ex32', name: 'Chest', muscle: 'تمارين عضلات الصدر' },
        { id: 'ex33', name: 'Bench Press (Dumbbell)', muscle: 'Chest' },
        { id: 'ex34', name: 'incline Bench Press (Dumbbell)', muscle: 'Chest' },
        { id: 'ex35', name: 'Bench Press (Barbell)', muscle: 'Chest' },
        { id: 'ex36', name: 'incline Bench Press (Barbell)', muscle: 'Chest' },
        { id: 'ex37', name: 'incline Smith Machine', muscle: 'Chest' },
        { id: 'ex38', name: 'incline Chest Fly (Cable)', muscle: 'Chest' },
        { id: 'ex39', name: 'Bench Press (Cable)', muscle: 'Chest' },
        { id: 'ex40', name: 'Flat Smith Machine', muscle: 'Chest' },
        { id: 'ex41', name: 'Butterfly Machine', muscle: 'Chest' },
        { id: 'ex42', name: 'Flat Chest Press (Machine)', muscle: 'Chest' },
        { id: 'ex43', name: 'incline Chest Press (Machine)', muscle: 'Chest' },
        { id: 'ex44', name: 'Push up', muscle: 'Chest' },
        { id: 'ex45', name: 'Back', muscle: 'تمارين عضلات الظهر' },
        { id: 'ex46', name: 'Lat Pulldown', muscle: 'Lats' },
        { id: 'ex47', name: 'Chin up', muscle: 'Lats' },
        { id: 'ex48', name: 'Pullover', muscle: 'Lats' },
        { id: 'ex49', name: 'Single Arm Lat Pulldown', muscle: 'Lats' },
        { id: 'ex50', name: 'Pull up', muscle: 'Lats' },
        { id: 'ex51', name: 'Lat Pulldown - Close Grip', muscle: 'Lats' },
        { id: 'ex52', name: 'iliac Lat Pulldown', muscle: 'Lats' },
        { id: 'ex53', name: 'Lateral Row Machine', muscle: 'Lats' },
        { id: 'ex54', name: 'Lateral Row Machine', muscle: 'Upper Back' },
        { id: 'ex55', name: 'Seated Row V Grip', muscle: 'Lats' },
        { id: 'ex56', name: 'Barbell Row', muscle: 'Upper Back' },
        { id: 'ex57', name: 'T.Bar', muscle: 'Upper Back' },
        { id: 'ex58', name: 'Lat Pulldown', muscle: 'Upper Back' },
        { id: 'ex59', name: 'Chest Supported incline row Dumbbell', muscle: 'Upper Back' },
        { id: 'ex60', name: 'Dumbbell Row', muscle: 'Lats' },
        { id: 'ex61', name: 'Single Arm Row Cable', muscle: 'Lats' },
        { id: 'ex62', name: 'Seated Row Wide Grip', muscle: 'Upper Back' },
        { id: 'ex63', name: 'Back Extension', muscle: 'Lower Back' },
        { id: 'ex64', name: 'DeadLift', muscle: 'Glut And Hamstrings And Lower Back' },
        { id: 'ex65', name: 'Shrug Dumbbell', muscle: 'Traps' },
        { id: 'ex66', name: 'Shrug Cable', muscle: 'Traps' },
        { id: 'ex67', name: 'shrug Smith Machine', muscle: 'Traps' },
        { id: 'ex68', name: 'Shrug T.Bar', muscle: 'Traps' },
        { id: 'ex69', name: 'Shrug Seated Row Wide Grib', muscle: 'Traps' },
        { id: 'ex70', name: 'Shrug Chest Supported Dumbbell', muscle: 'Traps' },
        { id: 'ex71', name: 'Triceps', muscle: 'تمارين عضلات التراي سيبس' },
        { id: 'ex72', name: 'Triceps Pushdown (8)', muscle: 'Triceps' },
        { id: 'ex73', name: 'Triceps Pushdown (Ruler)', muscle: 'Triceps' },
        { id: 'ex74', name: 'Triceps Rope Pushdown ', muscle: 'Triceps' },
        { id: 'ex75', name: 'Triceps Over Head (8)', muscle: 'Triceps' },
        { id: 'ex76', name: 'Triceps Rope Over Head', muscle: 'Triceps' },
        { id: 'ex77', name: 'Single Arm Triceps Pushdown (شداد)', muscle: 'Triceps' },
        { id: 'ex78', name: 'Triceps Pushdown 8', muscle: 'Triceps' },
        { id: 'ex79', name: 'Single Arm Triceps Over Head', muscle: 'Triceps' },
        { id: 'ex80', name: 'Triceps DiPS', muscle: 'Triceps' },
        { id: 'ex81', name: 'Skullcrusher (Barbell)', muscle: 'Triceps' },
        { id: 'ex82', name: 'Skullcrusher (Dumbbell)', muscle: 'Triceps' },
        { id: 'ex83', name: 'Biceps', muscle: 'تمارين عضلات الباي سيبس' },
        { id: 'ex84', name: 'Bicep Curl (Dumbbell)', muscle: 'Biceps' },
        { id: 'ex85', name: 'Hammer Curl (Dumbbell)', muscle: 'Biceps' },
        { id: 'ex86', name: 'Bicep Curl (Barbell)', muscle: 'Biceps' },
        { id: 'ex87', name: 'Bicep Curl Ruler (Cable)', muscle: 'Biceps' },
        { id: 'ex88', name: 'Bicep Curl (Machine)', muscle: 'Biceps' },
        { id: 'ex89', name: 'Concentration curl', muscle: 'Biceps' },
        { id: 'ex90', name: 'EZ Bar Biceps Curl', muscle: 'Biceps' },
        { id: 'ex91', name: 'Hammer Curl (Cable)', muscle: 'Biceps' },
        { id: 'ex92', name: 'Overhead Curl (Cable)', muscle: 'Biceps' },
        { id: 'ex93', name: 'Single Arm Overhead Curl (Cable)', muscle: 'Biceps' },
        { id: 'ex94', name: 'Preacher Curl (Machine)', muscle: 'Biceps' },
        { id: 'ex95', name: 'Preacher Curl (Dumbbell)', muscle: 'Biceps' },
        { id: 'ex96', name: 'Single Arm Preacher Curl (Dumbbell)', muscle: 'Biceps' },
        { id: 'ex97', name: 'Seated incline Curl (Dumbbell)', muscle: 'Biceps' },
        { id: 'ex98', name: 'Spider Curl (BarBell)', muscle: 'Biceps' },
        { id: 'ex99', name: 'Shoulders', muscle: 'تمارين عضلات الكتف' },
        { id: 'ex100', name: 'Face Pull (Cable)', muscle: 'Shoulders' },
        { id: 'ex101', name: 'Lateral Raise (Dumbbell)', muscle: 'Shoulders' },
        { id: 'ex102', name: 'Lateral Raise (Cable Shorted)', muscle: 'Shoulders' },
        { id: 'ex103', name: 'Single Arm Lateral Raise (Cable Shorted)', muscle: 'Shoulders' },
        { id: 'ex104', name: 'Lateral Raise (Cable Lenght)', muscle: 'Shoulders' },
        { id: 'ex105', name: 'Single Arm Lateral Raise (Cable Lenght)', muscle: 'Shoulders' },
        { id: 'ex106', name: 'Shoulder Press (Dumbbell)', muscle: 'Shoulders' },
        { id: 'ex107', name: 'Shoulder Press (Machine)', muscle: 'Shoulders' },
        { id: 'ex108', name: 'Y Raises (Cable)', muscle: 'Shoulders' },
        { id: 'ex109', name: 'Front Raise (Cable)', muscle: 'Shoulders' },
        { id: 'ex110', name: 'Front Raise (Dumbbell)', muscle: 'Shoulders' },
        { id: 'ex111', name: 'Lateral Raise (Machine)', muscle: 'Shoulders' },
        { id: 'ex112', name: 'Single Rear Delt Reverse Fly (Cable)', muscle: 'Shoulders' },
        { id: 'ex113', name: 'Rear Delt Reverse Fly (Cable)', muscle: 'Shoulders' },
        { id: 'ex114', name: 'Rear Delt Reverse Fly (Dumbbell)', muscle: 'Shoulders' },
        { id: 'ex115', name: 'Single Arm Rear Delt Bahaa (Cable)', muscle: 'Shoulders' },
        { id: 'ex116', name: 'Rear Delt Reverse Fly (Machine)', muscle: 'Shoulders' },
        { id: 'ex117', name: 'Single Arm Rear Delt Reverse Fly (Machine)', muscle: 'Shoulders' },
        { id: 'ex118', name: 'Seated Lateral Raise (Dumbbell)', muscle: 'Shoulders' },
        { id: 'ex119', name: 'Rotator Cuff (Cable)', muscle: 'Shoulders' },
        { id: 'ex120', name: 'Forearms', muscle: 'تمارين عضلات الساعد والريست و الرقبه' },
        { id: 'ex121', name: 'Reverse Curl Ruler بالشداد أو بدون الشداد (Cable)', muscle: 'Forearms' },
        { id: 'ex122', name: 'Single Arm Flexors (Cable)', muscle: 'Forearms' },
        { id: 'ex123', name: 'Ruler Flexors من فوق (Cable)', muscle: 'Forearms' },
        { id: 'ex124', name: 'ساعد دامبل وانت قاعد ', muscle: 'Forearms' },
        { id: 'ex125', name: 'بالمسطره وانت معكوس ريست (Cable)', muscle: 'Forearms' },
        { id: 'ex126', name: 'Lying Neck Curls Weighted', muscle: 'رقبه' },
        { id: 'ex127', name: 'Lying Neck Extension Weighted', muscle: 'رقبه' },



    ];

    // Helper to save routines to Local Storage
    function saveRoutines() {
        localStorage.setItem('fitnessRoutines', JSON.stringify(routines));
    }

    // --- Screen Navigation Functions ---
    function showScreen(screenToShow, activeNavItemId = null) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        screenToShow.classList.add('active');

        bottomNavItems.forEach(item => item.classList.remove('active'));
        if (activeNavItemId) {
            const activeItem = document.querySelector(`.${activeNavItemId}`);
            if (activeItem) {
                activeItem.classList.add('active');
            }
        }
    }

    // --- Rest Timer Functions ---
    function formatTime(seconds) {
        if (seconds === 0) return 'OFF';
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        // Format to "MM:SS" or "SSs" if less than a minute
        if (minutes > 0) {
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${secs}s`;
        }
    }

    function updateRestTimerDisplay() {
        displayRestTimer.textContent = formatTime(restTimeRemaining);
        if (restTimeRemaining > 0) {
            openRestTimerPickerButton.classList.add('active-timer'); // Add a class for visual feedback
        } else {
            openRestTimerPickerButton.classList.remove('active-timer');
        }
    }

    function startRestTimer(duration) {
        pauseRestTimer(); // Clear any existing timer
        restTimeRemaining = duration;
        // We do NOT update currentRoutineRestTime here, as this is the *duration to run*, not the routine's *setting*.
        // currentRoutineRestTime should only be updated from the picker.
        if (restTimeRemaining === 0) {
            updateRestTimerDisplay();
            return;
        }

        updateRestTimerDisplay(); // Initial display
        restTimerInterval = setInterval(() => {
            if (restTimeRemaining > 0) {
                restTimeRemaining--;
                updateRestTimerDisplay();
            } else {
                clearInterval(restTimerInterval);
                restTimerInterval = null;
                // Optional: Play a sound or vibrate when timer ends
                alert('Rest time is over!');
                // Reset to OFF or previous default if desired after completion
                displayRestTimer.textContent = 'OFF';
            }
        }, 1000);
    }

    function pauseRestTimer() {
        if (restTimerInterval) {
            clearInterval(restTimerInterval);
            restTimerInterval = null;
            updateRestTimerDisplay(); // Update display to show paused state
        }
    }

    // --- Action Sheet Functions (Common) ---
    function showActionSheet(overlayElement) {
        overlayElement.classList.add('visible');
    }

    function hideActionSheet(overlayElement) {
        overlayElement.classList.remove('visible');
    }

    // --- Render Functions ---

    function renderRoutines() {
        routinesList.innerHTML = ''; // Clear current list
        if (routines.length === 0) {
            routinesList.innerHTML = '<p style="text-align: center; color: #777; margin-top: 20px;">No routines yet. Add one!</p>';
            return;
        }
        routines.forEach(routine => {
            const routineCard = document.createElement('div');
            routineCard.classList.add('routine-card');
            routineCard.dataset.routineId = routine.id;
            routineCard.innerHTML = `
                <div class="routine-details">
                    <h3>${routine.name}</h3>
                    <p>${routine.exercises.length > 0 ? routine.exercises.map(ex => ex.name).join(', ').substring(0, 50) + '...' : 'No exercises yet'}</p>
                </div>
            `;
            routineCard.addEventListener('click', () => {
                currentRoutineId = routine.id;
                renderRoutineDetails(routine.id);
                showScreen(routineDetailsScreen, 'workout-nav-item');
            });
            routinesList.appendChild(routineCard);
        });
    }

    function getSetTypeClass(type) {
        switch (type) {
            case 'W': return 'warm-up';
            case 'N': return 'normal';
            case 'F': return 'failure';
            case 'D': return 'drop-set';
            default: return '';
        }
    }

    function renderRoutineDetails(routineId) {
        const routine = routines.find(r => r.id === routineId);
        if (!routine) {
            console.error('Routine not found:', routineId);
            showScreen(homeScreen, 'home-nav-item'); // Go back if not found
            return;
        }

        routineDetailsTitle.textContent = routine.name;
        exercisesListContainer.innerHTML = ''; // Clear current exercises

        if (routine.exercises.length === 0) {
            exercisesListContainer.innerHTML += '<p style="text-align: center; color: #777; margin-top: 20px;">No exercises in this routine. Add one!</p>';
        }

        routine.exercises.forEach(exercise => {
            const exerciseCard = document.createElement('div');
            exerciseCard.classList.add('exercise-card');
            exerciseCard.dataset.exerciseId = exercise.id;

            // Determine the REPS header text based on exercise.repOption
            const repsHeaderText = exercise.repOption === 'rep_range' ? 'REP RANGE' : 'REPS';

            exerciseCard.innerHTML = `
                <div class="exercise-header">
                    <h3>${exercise.name}</h3>
                    <button class="delete-exercise-button" data-exercise-id="${exercise.id}"><i class="fas fa-times"></i></button>
                </div>
                <div class="sets-table">
                    <div class="table-header">
                        <span>Set</span>
                        <span>Weight (KG)</span>
                        <button class="reps-header-button" data-exercise-id="${exercise.id}">${repsHeaderText} <i class="fas fa-chevron-down"></i></button>
                        <span></span>
                    </div>
                </div>
                <button class="add-set-button" data-exercise-id="${exercise.id}"><i class="fas fa-plus"></i> Add Set</button>
            `;

            const setsTable = exerciseCard.querySelector('.sets-table');
            exercise.sets.forEach((set, index) => {
                const setRow = document.createElement('div');
                setRow.classList.add('table-row');

                let repsInputHtml = '';
                if (exercise.repOption === 'rep_range') {
                    repsInputHtml = `
                        <div class="rep-range-input-group">
                            <input type="number" value="${set.repsMin || 0}" placeholder="Min" class="set-reps-min-input" data-exercise-id="${exercise.id}" data-set-index="${index}">
                            <span>to</span>
                            <input type="number" value="${set.repsMax || 0}" placeholder="Max" class="set-reps-max-input" data-exercise-id="${exercise.id}" data-set-index="${index}">
                        </div>
                    `;
                } else {
                    repsInputHtml = `<input type="number" value="${set.reps || 0}" class="set-reps-input" data-exercise-id="${exercise.id}" data-set-index="${index}">`;
                }

                setRow.innerHTML = `
                    <span class="set-type-display ${getSetTypeClass(set.type || 'N')}" data-exercise-id="${exercise.id}" data-set-index="${index}">${set.type || (index + 1)}</span>
                    <input type="number" value="${set.kg}" class="set-kg-input" data-exercise-id="${exercise.id}" data-set-index="${index}">
                    ${repsInputHtml}
                    <button class="delete-set-button" data-exercise-id="${exercise.id}" data-set-index="${index}"><i class="fas fa-minus-circle"></i></button>
                `;
                setsTable.appendChild(setRow);
            });

            exercisesListContainer.appendChild(exerciseCard);
        });

        // Attach event listeners for dynamically added elements
        attachExerciseCardEventListeners();
        updateRestTimerDisplay(); // Ensure timer display is correct when routine details load
    }

    function renderAllExercises(searchTerm = '') {
        allExercisesList.innerHTML = ''; // Clear current list
        const filteredExercises = allExercises.filter(ex =>
            ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ex.muscle.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredExercises.length === 0) {
            allExercisesList.innerHTML = '<p style="text-align: center; color: #777; padding: 20px;">No matching exercises.</p>';
            return;
        }

        filteredExercises.forEach(exercise => {
            const listItem = document.createElement('li');
            listItem.dataset.exerciseId = exercise.id;
            listItem.innerHTML = `${exercise.name} (${exercise.muscle})`;
            listItem.addEventListener('click', () => {
                addExerciseToCurrentRoutine(exercise.id);
                showScreen(routineDetailsScreen, 'workout-nav-item'); // Go back to routine details
            });
            allExercisesList.appendChild(listItem);
        });
    }

    function renderRestTimerOptions() {
        restTimerOptionsList.innerHTML = ''; // Clear existing options
        restTimeOptions.forEach(option => {
            const listItem = document.createElement('li');
            listItem.dataset.value = option.value;
            listItem.textContent = option.display;
            if (option.value === currentRoutineRestTime) { // Highlight selected option
                listItem.classList.add('selected');
                listItem.innerHTML += ' <i class="fas fa-check"></i>';
            }
            restTimerOptionsList.appendChild(listItem);
        });
    }

    // NEW: Function to update Repetition Options Action Sheet UI
    function updateRepetitionOptionsUI(selectedOption) {
        repsCheckIcon.style.display = 'none';
        repRangeCheckIcon.style.display = 'none';

        if (selectedOption === 'reps') {
            repsCheckIcon.style.display = 'inline-block';
        } else if (selectedOption === 'rep_range') {
            repRangeCheckIcon.style.display = 'inline-block';
        }
    }

    // --- Data Manipulation Functions ---

    function addRoutine(name) {
        const newRoutine = {
            id: 'routine_' + Date.now(), // Simple unique ID
            name: name,
            exercises: [],
            restTime: 60 // Default rest time for a new routine
        };
        routines.push(newRoutine);
        saveRoutines();
        return newRoutine.id; // Return the ID of the new routine
    }

    function deleteRoutine(routineId) {
        routines = routines.filter(r => r.id !== routineId);
        saveRoutines();
        currentRoutineId = null; // Clear current routine selection
        showScreen(homeScreen, 'home-nav-item');
        renderRoutines(); // Re-render the home screen to show updated list
    }


    function addExerciseToCurrentRoutine(exerciseId) {
        const routine = routines.find(r => r.id === currentRoutineId);
        const exerciseToAdd = allExercises.find(ex => ex.id === exerciseId);

        if (routine && exerciseToAdd && !routine.exercises.some(ex => ex.id === exerciseId)) {
            // Add default sets to the exercise when it's added to a routine
            const newExerciseInstance = {
                ...exerciseToAdd,
                sets: [{ type: 'N', kg: 0, reps: 0, repsMin: 0, repsMax: 0 }], // Default 1 Normal set, and add rep range properties
                repOption: 'reps' // Default to 'reps' (single value)
            };
            routine.exercises.push(newExerciseInstance);
            saveRoutines();
            renderRoutineDetails(currentRoutineId); // Re-render to show new exercise
        } else if (routine && exerciseToAdd && routine.exercises.some(ex => ex.id === exerciseId)) {
            alert('This exercise is already in the routine!');
        }
    }

    function addSetToExercise(exerciseId, type = 'N') { // Default to Normal set
        const routine = routines.find(r => r.id === currentRoutineId);
        const exercise = routine ? routine.exercises.find(ex => ex.id === exerciseId) : null;

        if (exercise) {
            exercise.sets.push({ type: type, kg: 0, reps: 0, repsMin: 0, repsMax: 0 }); // Add rep range properties for new set
            saveRoutines();
            renderRoutineDetails(currentRoutineId); // Re-render to show new set
        }
    }

    function updateSet(exerciseId, setIndex, field, value) {
        const routine = routines.find(r => r.id === currentRoutineId);
        const exercise = routine ? routine.exercises.find(ex => ex.id === exerciseId) : null;

        if (exercise && exercise.sets[setIndex]) {
            exercise.sets[setIndex][field] = value;
            saveRoutines();
            // No need to re-render the whole screen, as input values update directly
        }
    }

    function updateSetType(exerciseId, setIndex, newType) {
        const routine = routines.find(r => r.id === currentRoutineId);
        const exercise = routine ? routine.exercises.find(ex => ex.id === exerciseId) : null;

        if (exercise && exercise.sets[setIndex]) {
            exercise.sets[setIndex].type = newType;
            saveRoutines();
            renderRoutineDetails(currentRoutineId); // Re-render to update the display of set type
        }
    }

    function deleteSet(exerciseId, setIndex) {
        const routine = routines.find(r => r.id === currentRoutineId);
        const exercise = routine ? routine.exercises.find(ex => ex.id === exerciseId) : null;

        if (exercise && exercise.sets.length > 0 && setIndex >= 0 && setIndex < exercise.sets.length) {
            exercise.sets.splice(setIndex, 1);
            saveRoutines();
            renderRoutineDetails(currentRoutineId); // Re-render to update set numbers
        }
    }

    function deleteExercise(exerciseId) {
        const routine = routines.find(r => r.id === currentRoutineId);
        if (routine) {
            routine.exercises = routine.exercises.filter(ex => ex.id !== exerciseId);
            saveRoutines();
            renderRoutineDetails(currentRoutineId); // Re-render after deletion
        }
    }

    // NEW: Function to set the repetition option for an exercise
    function setExerciseRepetitionOption(exerciseId, option) {
        const routine = routines.find(r => r.id === currentRoutineId);
        const exercise = routine ? routine.exercises.find(ex => ex.id === exerciseId) : null;

        if (exercise) {
            exercise.repOption = option;
            saveRoutines();
            renderRoutineDetails(currentRoutineId); // Re-render to show updated input fields
        }
    }

    // --- Event Listeners Attachment for Dynamic Elements ---
    function attachExerciseCardEventListeners() {
        // Add Set Button
        document.querySelectorAll('.add-set-button').forEach(button => {
            button.onclick = null; // **هذا السطر مهم جداً لمنع تكرار المستمعين**
            button.addEventListener('click', (event) => {
                const exerciseId = event.target.dataset.exerciseId || event.target.closest('button').dataset.exerciseId;
                addSetToExercise(exerciseId, 'N'); // Always add a Normal set by default for simplicity
            });
        });

        // Delete Set Button
        document.querySelectorAll('.delete-set-button').forEach(button => {
            button.onclick = null; // **هذا السطر مهم جداً لمنع تكرار المستمعين**
            button.addEventListener('click', (event) => {
                const exerciseId = event.target.closest('.delete-set-button').dataset.exerciseId;
                const setIndex = parseInt(event.target.closest('.delete-set-button').dataset.setIndex);
                deleteSet(exerciseId, setIndex);
            });
        });

        // Input field for KG
        document.querySelectorAll('.set-kg-input').forEach(input => {
            input.oninput = null; // **هذا السطر مهم جداً لمنع تكرار المستمعين**
            input.addEventListener('input', (event) => {
                const exerciseId = event.target.dataset.exerciseId;
                const setIndex = parseInt(event.target.dataset.setIndex);
                const value = parseFloat(event.target.value) || 0; // Ensure number
                updateSet(exerciseId, setIndex, 'kg', value);
            });
        });

        // Input field for REPS (single value)
        document.querySelectorAll('.set-reps-input').forEach(input => {
            input.oninput = null; // **هذا السطر مهم جداً لمنع تكرار المستمعين**
            input.addEventListener('input', (event) => {
                const exerciseId = event.target.dataset.exerciseId;
                const setIndex = parseInt(event.target.dataset.setIndex);
                const value = parseInt(event.target.value) || 0; // Ensure integer
                updateSet(exerciseId, setIndex, 'reps', value);
            });
        });

        // NEW: Input fields for REPS MIN (rep range)
        document.querySelectorAll('.set-reps-min-input').forEach(input => {
            input.oninput = null; // **هذا السطر مهم جداً لمنع تكرار المستمعين**
            input.addEventListener('input', (event) => {
                const exerciseId = event.target.dataset.exerciseId;
                const setIndex = parseInt(event.target.dataset.setIndex);
                const value = parseInt(event.target.value) || 0;
                updateSet(exerciseId, setIndex, 'repsMin', value);
            });
        });

        // NEW: Input fields for REPS MAX (rep range)
        document.querySelectorAll('.set-reps-max-input').forEach(input => {
            input.oninput = null; // **هذا السطر مهم جداً لمنع تكرار المستمعين**
            input.addEventListener('input', (event) => {
                const exerciseId = event.target.dataset.exerciseId;
                const setIndex = parseInt(event.target.dataset.setIndex);
                const value = parseInt(event.target.value) || 0;
                updateSet(exerciseId, setIndex, 'repsMax', value);
            });
        });


        // Delete Exercise Button (NO CONFIRMATION)
        document.querySelectorAll('.delete-exercise-button').forEach(button => {
            button.onclick = null; // **هذا السطر مهم جداً لمنع تكرار المستمعين**
            button.addEventListener('click', (event) => {
                const exerciseId = event.target.closest('.delete-exercise-button').dataset.exerciseId;
                deleteExercise(exerciseId); // Removed confirm dialog
            });
        });

        // Event listener for clicking on the SET TYPE (W, 1, F, D) to open Action Sheet
        document.querySelectorAll('.set-type-display').forEach(span => {
            span.onclick = null; // **هذا السطر مهم جداً لمنع تكرار المستمعين**
            span.addEventListener('click', (event) => {
                const exerciseId = event.target.dataset.exerciseId;
                const setIndex = parseInt(event.target.dataset.setIndex);
                // Set context for the Action Sheet
                currentExerciseIdForSet = exerciseId;
                currentSetIndexForSet = setIndex;
                showActionSheet(setOptionsActionSheet);
            });
        });

        // NEW: Event listener for clicking on the REPS header button to open Repetition Options Action Sheet
        document.querySelectorAll('.reps-header-button').forEach(button => {
            button.onclick = null; // **هذا السطر مهم جداً لمنع تكرار المستمعين**
            button.addEventListener('click', (event) => {
                const exerciseId = event.target.dataset.exerciseId || event.target.closest('button').dataset.exerciseId;
                currentExerciseIdForRepOption = exerciseId; // Set context for repetition options

                // Get current rep option for this exercise to update UI
                const routine = routines.find(r => r.id === currentRoutineId);
                const exercise = routine ? routine.exercises.find(ex => ex.id === exerciseId) : null;
                if (exercise) {
                    updateRepetitionOptionsUI(exercise.repOption);
                }

                showActionSheet(repetitionOptionsActionSheet);
            });
        });
    }


    // --- Main Event Listeners ---
    // هذه المستمعات لا تحتاج لـ .onclick = null; لأن عناصرها ليست ديناميكية (لا يتم إزالتها وإعادة إضافتها)
    addRoutineButton.addEventListener('click', () => {
        newRoutineNameInput.value = ''; // Clear input
        showScreen(addRoutineScreen);
    });

    backButtonAddRoutine.addEventListener('click', () => {
        showScreen(homeScreen, 'home-nav-item');
        renderRoutines(); // Re-render in case something changed
    });

    saveRoutineButton.addEventListener('click', () => {
        const routineName = newRoutineNameInput.value.trim();
        if (routineName) {
            const newId = addRoutine(routineName);
            currentRoutineId = newId; // Set current routine to the newly created one
            renderRoutineDetails(newId);
            showScreen(routineDetailsScreen, 'workout-nav-item');
        } else {
            alert('Please enter a routine name.');
        }
    });

    backButtonRoutineDetails.addEventListener('click', () => {
        pauseRestTimer(); // Pause timer when leaving routine details
        showScreen(homeScreen, 'home-nav-item');
        renderRoutines(); // Re-render to ensure routine names are updated
    });

    addExerciseButton.addEventListener('click', () => {
        renderAllExercises(); // Show all exercises for selection
        exerciseSearchInput.value = ''; // Clear search bar
        showScreen(selectExerciseScreen);
    });

    editRoutineDetailsButton.addEventListener('click', () => {
        alert('Full routine editing functionality will be added here.');
        console.log('Edit Routine Details button clicked.');
    });

    deleteRoutineButton.addEventListener('click', () => {
        if (currentRoutineId) {
            deleteRoutine(currentRoutineId);
        }
    });

    backButtonSelectExercise.addEventListener('click', () => {
        showScreen(routineDetailsScreen, 'workout-nav-item');
    });

    exerciseSearchInput.addEventListener('input', (event) => {
        renderAllExercises(event.target.value);
    });

    // --- Bottom Navigation Logic ---
    bottomNavItems.forEach(item => {
        item.addEventListener('click', (event) => {
            bottomNavItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            if (item.classList.contains('home-nav-item')) {
                pauseRestTimer(); // Pause timer when navigating away
                showScreen(homeScreen, 'home-nav-item');
                renderRoutines();
            } else if (item.classList.contains('workout-nav-item')) {
                if (currentRoutineId && routines.some(r => r.id === currentRoutineId)) {
                    showScreen(routineDetailsScreen, 'workout-nav-item');
                    renderRoutineDetails(currentRoutineId); // تأكد من إعادة رسم التفاصيل عند العودة
                } else {
                    showScreen(homeScreen, 'workout-nav-item');
                    renderRoutines();
                }
            } else if (item.classList.contains('profile-nav-item')) {
                pauseRestTimer(); // Pause timer when navigating away
                console.log('Profile button clicked. (No alert)');
            }
        });
    });

    // --- Rest Timer Picker Action Sheet Event Listeners ---
    openRestTimerPickerButton.addEventListener('click', () => {
        const routine = routines.find(r => r.id === currentRoutineId);
        if (routine) {
            restTimerExerciseName.textContent = '';
            renderRestTimerOptions();
            showActionSheet(restTimerPickerActionSheet);
        }
    });

    cancelRestTimerPickerButton.addEventListener('click', () => {
        hideActionSheet(restTimerPickerActionSheet);
    });

    restTimerOptionsList.addEventListener('click', (event) => {
        const listItem = event.target.closest('li');
        if (listItem) {
            const selectedValue = parseInt(listItem.dataset.value);
            currentRoutineRestTime = selectedValue; // Update the routine's rest time setting
            updateRestTimerDisplay(); // Update display immediately
            hideActionSheet(restTimerPickerActionSheet);
            // NEW: Automatically start the timer if a non-zero value is selected
            if (selectedValue > 0) {
                startRestTimer(selectedValue);
            } else {
                // If "Off" (0) is selected, pause any running timer and set display to OFF
                pauseRestTimer();
                displayRestTimer.textContent = 'OFF';
            }
        }
    });

    // --- Action Sheet Event Listeners (Set Type) ---
    actionList.addEventListener('click', (event) => {
        const selectedType = event.target.dataset.setType;
        if (selectedType && currentExerciseIdForSet !== null && currentSetIndexForSet !== null) {
            updateSetType(currentExerciseIdForSet, currentSetIndexForSet, selectedType);
            hideActionSheet(setOptionsActionSheet);
        }
    });

    cancelSetOptionButton.addEventListener('click', () => {
        hideActionSheet(setOptionsActionSheet);
    });

    // NEW: Action Sheet Event Listeners (Repetition Options)
    repsOption.addEventListener('click', () => {
        if (currentExerciseIdForRepOption) {
            setExerciseRepetitionOption(currentExerciseIdForRepOption, 'reps');
            hideActionSheet(repetitionOptionsActionSheet);
        }
    });

    repRangeOption.addEventListener('click', () => {
        if (currentExerciseIdForRepOption) {
            setExerciseRepetitionOption(currentExerciseIdForRepOption, 'rep_range');
            hideActionSheet(repetitionOptionsActionSheet);
        }
    });

    cancelRepetitionOptionsButton.addEventListener('click', () => {
        hideActionSheet(repetitionOptionsActionSheet);
    });


    // العرض الأولي
    renderRoutines();
    showScreen(homeScreen, 'home-nav-item'); // عرض الشاشة الرئيسية عند التحميل
}); // نهاية DOMContentLoaded
