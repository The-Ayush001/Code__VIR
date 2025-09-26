document.addEventListener('DOMContentLoaded', function () {
  // Initialize variables
  let exams = JSON.parse(localStorage.getItem('exams')) || [];
  let settings = JSON.parse(localStorage.getItem('settings')) || {
    emailReminders: false,
    browserNotifications: true,
    reminderTime: 3
  };

  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  // DOM elements
  const examForm = document.getElementById('exam-form');
  const examList = document.getElementById('exam-list');
  const noExamsMessage = document.getElementById('no-exams-message');
  const revisionList = document.getElementById('revision-list');
  const noRevisionMessage = document.getElementById('no-revision-message');
  const calendar = document.getElementById('calendar');
  const currentMonthElement = document.getElementById('current-month');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  const notification = document.getElementById('notification');
  const notificationMessage = document.getElementById('notification-message');

  // Settings elements
  const emailReminders = document.getElementById('email-reminders');
  const browserNotifications = document.getElementById('browser-notifications');
  const reminderTime = document.getElementById('reminder-time');
  const saveSettingsBtn = document.getElementById('save-settings');

  // Initialize the app
  function init() {
    renderExams();
    renderRevisionSchedule();
    renderCalendar();
    loadSettings();
    checkUpcomingExams();
    setInterval(checkUpcomingExams, 60000); // Check every minute
  }

  // Load settings from localStorage
  function loadSettings() {
    emailReminders.checked = settings.emailReminders;
    browserNotifications.checked = settings.browserNotifications;
    reminderTime.value = settings.reminderTime;
  }

  // Save settings to localStorage
  function saveSettings() {
    settings = {
      emailReminders: emailReminders.checked,
      browserNotifications: browserNotifications.checked,
      reminderTime: parseInt(reminderTime.value)
    };
    localStorage.setItem('settings', JSON.stringify(settings));
    showNotification('Settings saved successfully!');
  }

  // Add new exam
  examForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const subject = document.getElementById('subject').value;
    const examDate = new Date(document.getElementById('exam-date').value);
    const importance = document.getElementById('importance').value;

    if (!subject || !examDate) return;

    // Check if exam date is in the future
    if (examDate < new Date().setHours(0, 0, 0, 0)) {
      showNotification('Exam date must be in the future!', 'error');
      return;
    }

    const newExam = {
      id: Date.now(),
      subject,
      date: examDate.toISOString().split('T')[0],
      importance,
      createdAt: new Date().toISOString()
    };

    exams.push(newExam);
    saveExams();
    renderExams();
    renderRevisionSchedule();
    renderCalendar();

    examForm.reset();
    showNotification('Exam added successfully!');
  });

  // Save exams to localStorage
  function saveExams() {
    localStorage.setItem('exams', JSON.stringify(exams));
  }

  // Render exams list
  function renderExams() {
    if (exams.length === 0) {
      noExamsMessage.style.display = 'block';
      examList.innerHTML = '';
      return;
    }

    noExamsMessage.style.display = 'none';

    // Sort exams by date
    exams.sort((a, b) => new Date(a.date) - new Date(b.date));

    examList.innerHTML = '';

    exams.forEach(exam => {
      const examDate = new Date(exam.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const daysUntilExam = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

      const li = document.createElement('li');
      li.className = 'exam-item';

      li.innerHTML = `
                        <div>
                            <div class="exam-subject">${exam.subject}</div>
                            <div class="exam-date">${formatDate(examDate)}</div>
                        </div>
                        <div class="days-away">${daysUntilExam} day${daysUntilExam !== 1 ? 's' : ''}</div>
                        <button class="btn btn-danger" data-id="${exam.id}">Delete</button>
                    `;

      examList.appendChild(li);

      // Add event listener for delete button
      li.querySelector('button').addEventListener('click', function () {
        deleteExam(exam.id);
      });
    });
  }

  // Delete an exam
  function deleteExam(id) {
    exams = exams.filter(exam => exam.id !== id);
    saveExams();
    renderExams();
    renderRevisionSchedule();
    renderCalendar();
    showNotification('Exam deleted successfully!');
  }

  // Render revision schedule
  function renderRevisionSchedule() {
    if (exams.length === 0) {
      noRevisionMessage.style.display = 'block';
      revisionList.innerHTML = '';
      return;
    }

    noRevisionMessage.style.display = 'none';
    revisionList.innerHTML = '';

    // Generate revision schedule for each exam
    exams.forEach(exam => {
      const examDate = new Date(exam.date);
      const revisionDates = generateRevisionSchedule(examDate, exam.importance);

      const examElement = document.createElement('div');
      examElement.innerHTML = `<h3 style="margin-bottom: 0.5rem;">${exam.subject}</h3>`;


      revisionDates.forEach(revDate => {
        const revItem = document.createElement('div');
        revItem.className = 'revision-item';

        const daysUntilRevision = Math.ceil((revDate - new Date()) / (1000 * 60 * 60 * 24));
        const status = daysUntilRevision > 0 ? 'Upcoming' : (daysUntilRevision === 0 ? 'Today' : 'Completed');

        revItem.innerHTML = `
                            <div class="revision-date">${formatDate(revDate)}</div>
                            <div>${status} • ${getDaysAwayText(daysUntilRevision)}</div>
                        `;

        examElement.appendChild(revItem);
      });

      revisionList.appendChild(examElement);
    });
  }

  // Generate revision schedule based on exam date and importance
  function generateRevisionSchedule(examDate, importance) {
    const revisionDates = [];
    const today = new Date();

    // Determine number of revisions based on importance
    let revisions = 3; // Default for medium importance
    if (importance === 'high') revisions = 5;
    if (importance === 'low') revisions = 2;

    // Calculate revision dates (spaced repetition)
    for (let i = revisions; i > 0; i--) {
      const daysBeforeExam = Math.pow(2, i - 1) * (importance === 'high' ? 2 : 3);
      const revisionDate = new Date(examDate);
      revisionDate.setDate(examDate.getDate() - daysBeforeExam);

      // If revision date is in the past, skip it
      if (revisionDate < today) continue;

      revisionDates.push(revisionDate);
    }

    // Always include one day before exam
    const dayBefore = new Date(examDate);
    dayBefore.setDate(examDate.getDate() - 1);
    if (dayBefore >= today) {
      revisionDates.push(dayBefore);
    }

    return revisionDates.sort((a, b) => a - b);
  }

  // Render calendar
  function renderCalendar() {
    currentMonthElement.textContent = `${getMonthName(currentMonth)} ${currentYear}`;

    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    calendar.innerHTML = '';

    // Add day headers
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'calendar-header';
      dayHeader.textContent = day;
      calendar.appendChild(dayHeader);
    });

    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'calendar-day';
      calendar.appendChild(emptyCell);
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayCell = document.createElement('div');
      dayCell.className = 'calendar-day';
      dayCell.textContent = i;

      const cellDate = new Date(currentYear, currentMonth, i);
      const dateString = formatDate(cellDate);

      // Check if today
      const today = new Date();
      if (cellDate.getDate() === today.getDate() &&
        cellDate.getMonth() === today.getMonth() &&
        cellDate.getFullYear() === today.getFullYear()) {
        dayCell.classList.add('today');
      }

      // Check if has exam
      const hasExam = exams.some(exam => exam.date === dateString);
      if (hasExam) {
        dayCell.classList.add('has-exam');
      }

      // Check if has revision
      const hasRevision = exams.some(exam => {
        const revisionDates = generateRevisionSchedule(new Date(exam.date), exam.importance);
        return revisionDates.some(revDate => formatDate(revDate) === dateString);
      });

      if (hasRevision) {
        dayCell.classList.add('has-revision');
      }

      calendar.appendChild(dayCell);
    }
  }

  // Navigate calendar months
  prevMonthBtn.addEventListener('click', function () {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  });

  nextMonthBtn.addEventListener('click', function () {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  });

  // Check for upcoming exams and show notifications
  function checkUpcomingExams() {
    if (!settings.browserNotifications) return;

    const today = new Date();
    exams.forEach(exam => {
      const examDate = new Date(exam.date);
      const daysUntilExam = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

      if (daysUntilExam === parseInt(settings.reminderTime)) {
        showNotification(`Reminder: ${exam.subject} exam in ${daysUntilExam} day${daysUntilExam !== 1 ? 's' : ''}!`, 'info', 5000);
      }
    });
  }

  // Show notification
  function showNotification(message, type = 'success', duration = 3000) {
    notificationMessage.textContent = message;
    notification.style.display = 'block';

    // Remove previous classes
    notification.classList.remove('error', 'info');

    if (type === 'error') {
      notification.style.borderLeftColor = 'var(--danger)';
    } else if (type === 'info') {
      notification.style.borderLeftColor = 'var(--primary)';
    } else {
      notification.style.borderLeftColor = 'var(--accent)';
    }

    setTimeout(() => {
      notification.style.display = 'none';
    }, duration);
  }

  // Format date as YYYY-MM-DD
  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  // Get month name
  function getMonthName(month) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  }

  // Get days away text
  function getDaysAwayText(days) {
    if (days > 0) return `in ${days} day${days !== 1 ? 's' : ''}`;
    if (days === 0) return 'today';
    return `${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`;
  }

  // Save settings button event
  saveSettingsBtn.addEventListener('click', saveSettings);

  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  // Initialize the app
  init();
});