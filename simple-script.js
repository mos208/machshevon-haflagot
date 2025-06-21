document.addEventListener('DOMContentLoaded', function() {
    // קבלת גישה לאלמנטים
    const daySelect = document.getElementById('day');
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');
    const hebrewDateDisplay = document.getElementById('selected-hebrew-date');
    
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
    
    // פונקציה להמרת תאריך לועזי לתאריך עברי
    function convertGregorianToHebrew(date) {
        // אלגוריתם פשוט להמרת תאריך לועזי לתאריך עברי
        // זה אינו מדויק לחלוטין אך מספק כברירת מחדל
        
        const day = date.getDate();
        const month = date.getMonth(); // 0-11
        const year = date.getFullYear();
        
        // חישוב פשוט לשנה העברית
        // השנה העברית מתחילה בסביבות ספטמבר-אוקטובר
        let hebrewYear = year + 3760;
        if (month >= 8) { // אם אנחנו אחרי ספטמבר
            hebrewYear = year + 3761;
        }
        
        // חישוב פשוט לחודש העברי
        // זה אינו מדויק אך מספק כברירת מחדל
        let hebrewMonth;
        if (month === 2) { // מרץ
            hebrewMonth = 6; // אדר
        } else if (month === 3) { // אפריל
            hebrewMonth = 0; // ניסן
        } else if (month === 4) { // מאי
            hebrewMonth = 1; // אייר
        } else if (month === 5) { // יוני
            hebrewMonth = 2; // סיון
        } else if (month === 6) { // יולי
            hebrewMonth = 3; // תמוז
        } else if (month === 7) { // אוגוסט
            hebrewMonth = 4; // אב
        } else if (month === 8) { // ספטמבר
            hebrewMonth = 5; // אלול
        } else if (month === 9) { // אוקטובר
            hebrewMonth = 6; // תשרי
        } else if (month === 10) { // נובמבר
            hebrewMonth = 7; // חשון
        } else if (month === 11) { // דצמבר
            hebrewMonth = 8; // כסלו
        } else if (month === 0) { // ינואר
            hebrewMonth = 9; // טבת
        } else if (month === 1) { // פברואר
            hebrewMonth = 10; // שבט
        } else {
            hebrewMonth = 0; // ברירת מחדל - ניסן
        }
        
        // חישוב פשוט ליום העברי
        // זה אינו מדויק אך מספק כברירת מחדל
        let hebrewDay = day;
        if (hebrewDay > 30) {
            hebrewDay = 30; // מקסימום 30 יום בחודש עברי
        }
        
        return {
            day: hebrewDay,
            month: hebrewMonth,
            year: hebrewYear
        };
    }
    
    // מילוי רשימת השנים (20 שנים קדימה ו-5 שנים אחורה)
    // חישוב התאריך העברי הנוכחי לפי התאריך הלועזי
    const today = new Date();
    const currentHebrewDate = convertGregorianToHebrew(today);
    console.log('Current Hebrew date:', currentHebrewDate);
    
    const currentHebrewYear = currentHebrewDate.year;
    
    for (let i = currentHebrewYear - 5; i <= currentHebrewYear + 20; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = hebrewYearToString(i);
        yearSelect.appendChild(option);
    }
    
    // בחירת השנה הנוכחית
    yearSelect.value = currentHebrewYear;
    
    // מילוי רשימת החודשים
    fillMonths();
    
    // בחירת החודש הנוכחי
    monthSelect.value = currentHebrewDate.month;
    
    // מילוי רשימת הימים
    fillDays();
    
    // בחירת היום הנוכחי
    daySelect.value = currentHebrewDate.day;
    
    // הצגת התאריך העברי המלא
    updateHebrewDateDisplay();
    
    // חישוב הפלגות ראשוני
    updateAllCalculations();
    
    // הוספת מאזינים לאירועים
    yearSelect.addEventListener('change', function() {
        fillMonths();
        fillDays();
        updateHebrewDateDisplay();
        updateAllCalculations();
    });
    
    monthSelect.addEventListener('change', function() {
        fillDays();
        updateHebrewDateDisplay();
        updateAllCalculations();
    });
    
    daySelect.addEventListener('change', function() {
        updateHebrewDateDisplay();
        updateAllCalculations();
    });
    
    // הוספת מאזיני אירועים לשדות הקלט
    daysInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            updateCalculation(index);
        });
    });
    
    // פונקציה למילוי רשימת החודשים
    function fillMonths() {
        const year = parseInt(yearSelect.value);
        monthSelect.innerHTML = '';
        
        // בדיקה אם השנה מעוברת
        const isLeapYear = isHebrewLeapYear(year);
        console.log('Is leap year:', isLeapYear);
        
        // בחירת רשימת החודשים המתאימה
        const months = isLeapYear ? hebrewMonthNamesLeap : hebrewMonthNames;
        
        // יצירת אפשרויות עבור כל חודש
        for (let i = 0; i < months.length; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = months[i];
            monthSelect.appendChild(option);
        }
    }
    
    // פונקציה למילוי רשימת הימים
    function fillDays() {
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);
        
        // שמירת היום הנוכחי שנבחר לפני שינוי הרשימה
        const currentSelectedDay = parseInt(daySelect.value) || 1;
        
        // בחירת רשימת החודשים המתאימה
        const isLeapYear = isHebrewLeapYear(year);
        const months = isLeapYear ? hebrewMonthNamesLeap : hebrewMonthNames;
        const monthName = months[month];
        
        // קביעת מספר הימים בחודש
        let daysInMonth = daysInHebrewMonth[monthName];
        console.log('Days in month:', daysInMonth);
        
        daySelect.innerHTML = '';
        
        // יצירת אפשרויות עבור כל יום
        for (let i = 1; i <= daysInMonth; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = hebrewDayOfMonth(i);
            daySelect.appendChild(option);
        }
        
        // בחירת היום הקודם שהיה נבחר, אם הוא קיים בחודש החדש
        if (currentSelectedDay <= daysInMonth) {
            daySelect.value = currentSelectedDay;
        } else {
            // אם היום לא קיים בחודש החדש, בחר את היום האחרון בחודש
            daySelect.value = daysInMonth;
        }
    }
    
    // פונקציה לעדכון תצוגת התאריך העברי המלא
    function updateHebrewDateDisplay() {
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);
        const day = parseInt(daySelect.value);
        
        // בחירת רשימת החודשים המתאימה
        const isLeapYear = isHebrewLeapYear(year);
        const months = isLeapYear ? hebrewMonthNamesLeap : hebrewMonthNames;
        
        // הצגת התאריך העברי
        const hebrewDay = hebrewDayOfMonth(day);
        const hebrewMonth = months[month];
        const hebrewYear = hebrewYearToString(year);
        
        hebrewDateDisplay.textContent = hebrewDay + ' ' + hebrewMonth + ' ' + hebrewYear;
    }
    
    // פונקציה לעדכון כל החישובים
    function updateAllCalculations() {
        for (let i = 0; i < daysInputs.length; i++) {
            updateCalculation(i);
        }
    }
    
    // פונקציה לעדכון חישוב בודד
    function updateCalculation(index) {
        const daysToAdd = parseInt(daysInputs[index].value) || 0;
        
        if (daysToAdd <= 0) {
            resultsDisplays[index].textContent = 'יש להזין מספר חיובי';
            // הפעלת אירוע שינוי כדי לעדכן את לוח השנה
            triggerCalendarUpdate();
            return;
        }
        
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);
        const day = parseInt(daySelect.value);
        
        // חישוב התאריך החדש
        const result = calculateFutureHebrewDate(day, month, year, daysToAdd);
        
        // הצגת התוצאה
        resultsDisplays[index].textContent = result.day + ' ' + result.month + ' ' + hebrewYearToString(result.year);
        
        // הפעלת אירוע שינוי כדי לעדכן את לוח השנה
        triggerCalendarUpdate();
    }
    
    // פונקציה להפעלת עדכון לוח השנה
    function triggerCalendarUpdate() {
        // יצירת אירוע מותאם לעדכון לוח השנה
        const event = new CustomEvent('calculationUpdated');
        document.dispatchEvent(event);
    }
    
    // פונקציה לחישוב תאריך עברי עתידי
    function calculateFutureHebrewDate(day, month, year, daysToAdd) {
        // בחירת רשימת החודשים המתאימה
        let isLeapYear = isHebrewLeapYear(year);
        let months = isLeapYear ? hebrewMonthNamesLeap : hebrewMonthNames;
        let monthName = months[month];
        
        // חישוב התאריך העתידי
        let remainingDays = daysToAdd - 1; // כולל את היום הראשון
        let currentDay = day;
        let currentMonth = month;
        let currentYear = year;
        let currentMonthName = monthName;
        
        while (remainingDays > 0) {
            // מספר הימים שנותרו בחודש הנוכחי
            const daysInCurrentMonth = daysInHebrewMonth[currentMonthName];
            const daysLeftInMonth = daysInCurrentMonth - currentDay + 1;
            
            if (remainingDays < daysLeftInMonth) {
                // אם נשארו פחות ימים מאשר בחודש הנוכחי
                currentDay += remainingDays;
                remainingDays = 0;
            } else {
                // מעבר לחודש הבא
                remainingDays -= daysLeftInMonth;
                currentMonth++;
                currentDay = 1;
                
                // בדיקה אם צריך לעבור לשנה הבאה
                if (currentMonth >= months.length) {
                    currentMonth = 0;
                    currentYear++;
                    isLeapYear = isHebrewLeapYear(currentYear);
                    months = isLeapYear ? hebrewMonthNamesLeap : hebrewMonthNames;
                }
                
                currentMonthName = months[currentMonth];
            }
        }
        
        return {
            day: hebrewDayOfMonth(currentDay),
            month: currentMonthName,
            year: currentYear
        };
    }
    
    // פונקציה להמרת מספר יום בחודש לייצוג עברי
    function hebrewDayOfMonth(day) {
        const hebChars = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב', 'יג', 'יד', 'טו', 'טז', 'יז', 'יח', 'יט', 'כ', 'כא', 'כב', 'כג', 'כד', 'כה', 'כו', 'כז', 'כח', 'כט', 'ל'];
        return hebChars[day - 1] || 'א';
    }
    
    // פונקציה להמרת שנה עברית למחרוזת (למשל תשפ"ה)
    function hebrewYearToString(year) {
        // לוקחים רק את שתי הספרות האחרונות (העשרות והיחידות)
        const lastTwoDigits = year % 100;
        
        // המרה לאותיות עבריות
        const units = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
        const tens = ['י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
        
        let result = '';
        
        // הוספת עשרות
        let tensDigit = Math.floor(lastTwoDigits / 10);
        if (tensDigit > 0) {
            result += tens[tensDigit - 1];
        }
        
        // הוספת יחידות
        let unitsDigit = lastTwoDigits % 10;
        if (unitsDigit > 0) {
            result += units[unitsDigit - 1];
        }
        
        // הוספת גרשיים לפני האות האחרונה
        if (result.length > 1) {
            result = result.substring(0, result.length - 1) + '"' + result.substring(result.length - 1);
        }
        
        // הוספת הקידומת המתאימה לפי המאה
        const century = Math.floor((year % 1000) / 100);
        
        // באלף החמישי - המאה ה-8 היא תש"פ, המאה ה-7 היא תש"ע, וכו'
        if (century === 7) {
            result = 'תש' + result; // תש - מאה ה-7 (5700-5799)
        } else if (century === 8) {
            result = 'תת' + result; // תת - מאה ה-8 (5800-5899)
        } else {
            // ברירת מחדל למקרה של מאות אחרות
            result = 'תש' + result;
        }
        
        return result;
    }
});
