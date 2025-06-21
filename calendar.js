document.addEventListener('DOMContentLoaded', function() {
    // קבלת גישה לאלמנטים של לוח השנה
    const calendarMonthSelect = document.getElementById('calendar-month');
    const calendarYearSelect = document.getElementById('calendar-year');
    const calendarDaysContainer = document.getElementById('calendar-days');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    // קבלת גישה לאלמנטים של בחירת התאריך
    const daySelect = document.getElementById('day');
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');
    
    // קבלת גישה לאלמנטים של החישובים
    const daysInputs = [
        document.getElementById('days1'),
        document.getElementById('days2'),
        document.getElementById('days3'),
        document.getElementById('days4')
    ];
    
    const resultsDisplays = [
        document.getElementById('result1'),
        document.getElementById('result2'),
        document.getElementById('result3'),
        document.getElementById('result4')
    ];
    
    // משתנה לשמירת תוצאות החישובים עבור לוח השנה
    let calculationResults = [];
    
    // שמות החודשים העבריים
    const hebrewMonthNames = [
        'ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול',
        'תשרי', 'חשון', 'כסלו', 'טבת', 'שבט', 'אדר'
    ];
    
    // שמות החודשים העבריים בשנה מעוברת
    const hebrewMonthNamesLeap = [
        'ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול',
        'תשרי', 'חשון', 'כסלו', 'טבת', 'שבט', 'אדר א', 'אדר ב'
    ];
    
    // מספר ימים בכל חודש עברי (ברירת מחדל)
    const daysInHebrewMonth = {
        'ניסן': 30, 'אייר': 29, 'סיון': 30, 'תמוז': 29, 'אב': 30, 'אלול': 29,
        'תשרי': 30, 'חשון': 29, 'כסלו': 30, 'טבת': 29, 'שבט': 30, 'אדר': 29,
        'אדר א': 30, 'אדר ב': 29
    };
    
    // שנים עבריות מעוברות במחזור של 19 שנים
    function isHebrewLeapYear(year) {
        return [0, 3, 6, 8, 11, 14, 17].includes(year % 19);
    }
    
    // פונקציה להמרת מספר יום בחודש לייצוג עברי
    function hebrewDayOfMonth(day) {
        const hebrewNumerals = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב', 'יג', 'יד', 'טו', 'טז', 'יז', 'יח', 'יט', 'כ', 'כא', 'כב', 'כג', 'כד', 'כה', 'כו', 'כז', 'כח', 'כט', 'ל'];
        return hebrewNumerals[day - 1] + '\'';
    }
    
    // פונקציה להמרת שנה עברית למחרוזת (למשל תשפ"ה)
    function hebrewYearToString(year) {
        // המרת שנה עברית לאותיות עבריות
        // לדוגמה: 5785 -> תשפ"ה
        
        // נתעלם מאלפים (5000+)
        const yearWithoutThousands = year % 1000;
        
        // טבלת המרה מספרות לאותיות עבריות
        const hebrewLetters = {
            1: 'א', 2: 'ב', 3: 'ג', 4: 'ד', 5: 'ה',
            6: 'ו', 7: 'ז', 8: 'ח', 9: 'ט', 10: 'י',
            20: 'כ', 30: 'ל', 40: 'מ', 50: 'נ', 60: 'ס',
            70: 'ע', 80: 'פ', 90: 'צ', 100: 'ק', 200: 'ר',
            300: 'ש', 400: 'ת', 500: 'ק', 600: 'ר', 700: 'ש',
            800: 'ת', 900: 'תק'
        };
        
        // פירוק המספר לספרות
        const hundreds = Math.floor(yearWithoutThousands / 100) * 100;
        const tens = Math.floor((yearWithoutThousands % 100) / 10) * 10;
        const units = yearWithoutThousands % 10;
        
        // בניית המחרוזת
        let result = '';
        
        // קביעת תחילית לפי המאה
        if (year >= 5700 && year < 5800) {
            result = 'תש';
        } else if (year >= 5800 && year < 5900) {
            result = 'תת';
        } else {
            // המרת מאות
            if (hundreds > 0) {
                result += hebrewLetters[hundreds];
            }
        }
        
        // המרת עשרות
        if (tens > 0) {
            result += hebrewLetters[tens];
        }
        
        // המרת יחידות
        if (units > 0) {
            result += hebrewLetters[units];
        }
        
        // הוספת גרש לפני האות האחרונה
        if (result.length > 1) {
            result = result.slice(0, -1) + '"' + result.slice(-1);
        } else if (result.length === 1) {
            result += '\'';
        }
        
        return result;
    }
    
    // פונקציה למילוי שנים בלוח השנה
    function fillCalendarYears() {
        calendarYearSelect.innerHTML = '';
        
        // קבלת השנה העברית הנוכחית
        const currentYear = parseInt(yearSelect.value);
        
        for (let i = currentYear - 5; i <= currentYear + 20; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = hebrewYearToString(i);
            calendarYearSelect.appendChild(option);
        }
        calendarYearSelect.value = currentYear;
    }
    
    // פונקציה למילוי חודשים בלוח השנה
    function fillCalendarMonths() {
        calendarMonthSelect.innerHTML = '';
        const isLeap = isHebrewLeapYear(parseInt(calendarYearSelect.value));
        const monthsArray = isLeap ? hebrewMonthNamesLeap : hebrewMonthNames;
        
        for (let i = 0; i < monthsArray.length; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = monthsArray[i];
            calendarMonthSelect.appendChild(option);
        }
        calendarMonthSelect.value = monthSelect.value;
    }
    
    // פונקציה לחישוב היום הראשון של החודש העברי (משוער)
    function getFirstDayOfHebrewMonth(month, year) {
        // פונקציה משוערת לחישוב היום בשבוע שבו מתחיל החודש העברי
        // זה אינו מדויק אך מספק לצורך הדגמה
        // 0 = ראשון, 1 = שני, ..., 6 = שבת
        
        // נוסחה משוערת לקביעת יום התחלת החודש
        return ((year % 7) + month + Math.floor(month / 2)) % 7;
    }
    
    // פונקציה לקבלת מספר הימים בחודש עברי
    function getDaysInHebrewMonth(month, year) {
        const isLeap = isHebrewLeapYear(year);
        const monthName = isLeap ? hebrewMonthNamesLeap[month] : hebrewMonthNames[month];
        return daysInHebrewMonth[monthName];
    }
    
    // פונקציה ליצירת לוח השנה
    function renderCalendar() {
        const month = parseInt(calendarMonthSelect.value);
        const year = parseInt(calendarYearSelect.value);
        
        // נקה את הלוח
        calendarDaysContainer.innerHTML = '';
        
        // נקבל את היום הראשון של החודש ומספר הימים בחודש
        const firstDay = getFirstDayOfHebrewMonth(month, year);
        const daysInMonth = getDaysInHebrewMonth(month, year);
        
        // נוסיף תאים ריקים לפני היום הראשון
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarDaysContainer.appendChild(emptyDay);
        }
        
        // נוסיף את ימי החודש
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = hebrewDayOfMonth(day);
            dayElement.dataset.day = day;
            
            // נבדוק אם זה היום הנוכחי
            if (day === parseInt(daySelect.value) && 
                month === parseInt(monthSelect.value) && 
                year === parseInt(yearSelect.value)) {
                dayElement.classList.add('selected');
            }
            
            // נבדוק אם היום מופיע בתוצאות החישובים
            if (isDateInResults(day, month, year)) {
                dayElement.classList.add('result');
                console.log('נמצא תאריך בתוצאות:', day, month, year);
            }
            
            // אירוע לחיצה על יום בלוח השנה - מבוטל
            // הסרנו את האפשרות לשנות את תאריך ההתחלה בלחיצה על יום בלוח
            
            calendarDaysContainer.appendChild(dayElement);
        }
    }
    
    // פונקציה לבדיקה אם תאריך מופיע בתוצאות
    function isDateInResults(day, month, year) {
        for (const result of calculationResults) {
            if (result.day === day && result.month === month && result.year === year) {
                return true;
            }
        }
        return false;
    }
    
    // פונקציה להוספת סגנון מיוחד לתאריכי התוצאות בלוח השנה
    function addResultStyles() {
        // אם אין כבר סגנון מוגדר, נוסיף אותו
        if (!document.getElementById('result-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'result-styles';
            styleElement.textContent = `
                .calendar-day.result {
                    background-color: #ffcc80 !important; /* צבע רקע כתום בהיר לתוצאות */
                    border: 2px solid #ff9800 !important; /* מסגרת כתומה */
                    color: #333 !important;
                    font-weight: bold !important;
                }
                .calendar-day.result::after {
                    display: none !important; /* הסתרת הנקודה מהסגנון המקורי */
                }
                .calendar-day.selected {
                    background-color: #ef9a9a !important; /* צבע רקע אדום בהיר לתאריך הנבחר */
                    border: 2px solid #e57373 !important; /* מסגרת אדומה */
                    color: #b71c1c !important;
                    font-weight: bold !important;
                }
            `;
            document.head.appendChild(styleElement);
        }
    }
    
    // פונקציה לעדכון תוצאות החישובים
    function updateCalendarResults() {
        console.log('מעדכן תוצאות חישובים בלוח השנה');
        // נקה את תוצאות החישובים הקודמות
        calculationResults = [];
        
        // עבור על כל החישובים ושמור את התוצאות
        for (let i = 0; i < resultsDisplays.length; i++) {
            const resultText = resultsDisplays[i].textContent;
            if (resultText && !resultText.includes('יש להזין מספר חיובי')) {
                // פירוק התאריך מהטקסט (יום חודש שנה)
                const parts = resultText.split(' ');
                if (parts.length === 3) {
                    // חיפוש היום והחודש
                    const dayText = parts[0];
                    const monthText = parts[1];
                    const yearText = parts[2];
                    
                    // מציאת היום במספר
                    let dayNum = -1;
                    const hebrewNumerals = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב', 'יג', 'יד', 'טו', 'טז', 'יז', 'יח', 'יט', 'כ', 'כא', 'כב', 'כג', 'כד', 'כה', 'כו', 'כז', 'כח', 'כט', 'ל'];
                    for (let j = 0; j < hebrewNumerals.length; j++) {
                        // בדיקה עם או בלי גרש
                        if (dayText === hebrewNumerals[j] || dayText === hebrewNumerals[j] + '\'') {
                            dayNum = j + 1;
                            break;
                        }
                    }
                    
                    // מציאת החודש במספר
                    let monthNum = -1;
                    const monthsToCheck = [...hebrewMonthNames, ...hebrewMonthNamesLeap];
                    for (let j = 0; j < monthsToCheck.length; j++) {
                        if (monthText === monthsToCheck[j]) {
                            // מציאת האינדקס הנכון בהתאם לסוג השנה
                            const isLeap = isHebrewLeapYear(parseInt(yearSelect.value));
                            const correctMonthsArray = isLeap ? hebrewMonthNamesLeap : hebrewMonthNames;
                            monthNum = correctMonthsArray.indexOf(monthText);
                            break;
                        }
                    }
                    
                    // מציאת השנה במספר
                    // נניח שהשנה היא אותה שנה שנבחרה כרגע
                    let yearNum = parseInt(yearSelect.value);
                    
                    // שמירת התוצאה
                    if (dayNum !== -1 && monthNum !== -1) {
                        calculationResults.push({
                            day: dayNum,
                            month: monthNum,
                            year: yearNum,
                            index: i
                        });
                    }
                }
            }
        }
        
        // הדפסת תוצאות לצורך דיבאג
        console.log('תוצאות חישובים:', calculationResults);
        
        // עדכון לוח השנה
        renderCalendar();
    }
    
    // אתחול לוח השנה
    addResultStyles();
    fillCalendarYears();
    fillCalendarMonths();
    renderCalendar();
    
    // אירועים ללוח השנה
    calendarYearSelect.addEventListener('change', function() {
        fillCalendarMonths();
        renderCalendar();
    });
    
    calendarMonthSelect.addEventListener('change', function() {
        renderCalendar();
    });
    
    // האזנה לחיצים עם הפונקציונליות המקורית
    prevMonthBtn.addEventListener('click', function() {
        let month = parseInt(calendarMonthSelect.value);
        let year = parseInt(calendarYearSelect.value);
        
        month--;
        if (month < 0) {
            month = isHebrewLeapYear(year - 1) ? 12 : 11; // אדר ב' או אדר
            year--;
            calendarYearSelect.value = year;
            fillCalendarMonths();
        }
        
        calendarMonthSelect.value = month;
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', function() {
        let month = parseInt(calendarMonthSelect.value);
        let year = parseInt(calendarYearSelect.value);
        const maxMonth = isHebrewLeapYear(year) ? 12 : 11;
        
        month++;
        if (month > maxMonth) {
            month = 0; // ניסן
            year++;
            calendarYearSelect.value = year;
            fillCalendarMonths();
        }
        
        calendarMonthSelect.value = month;
        renderCalendar();
    });
    
    // האזנה לשינויים בתוצאות החישובים
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.target.classList.contains('result')) {
                updateCalendarResults();
            }
        });
    });
    
    // הגדרת האזנה לשינויים בתוצאות
    for (const resultDisplay of resultsDisplays) {
        observer.observe(resultDisplay, { childList: true });
    }
    
    // האזנה לשינויים בבחירת התאריך
    daySelect.addEventListener('change', function() {
        renderCalendar();
    });
    
    monthSelect.addEventListener('change', function() {
        renderCalendar();
    });
    
    yearSelect.addEventListener('change', function() {
        renderCalendar();
    });
    
    // עדכון ראשוני של תוצאות החישובים
    setTimeout(updateCalendarResults, 500);
    
    // האזנה לשינויים בשדות הקלט של מספר הימים
    for (const input of daysInputs) {
        input.addEventListener('input', function() {
            setTimeout(updateCalendarResults, 100);
        });
    }
    
    // האזנה לאירוע שמופעל מקובץ simple-script.js
    document.addEventListener('calculationUpdated', function() {
        console.log('התקבל אירוע calculationUpdated');
        setTimeout(updateCalendarResults, 100);
    });
});
