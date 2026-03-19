/**
 * AG Grid locale text + date format config for all 7 supported languages.
 * Used by AgGridDatePicker and all admin grid pages.
 */

export interface AgGridDateConfig {
    /** date-fns locale key for registerLocale */
    dateFnsKey: string;
    /** date-fns format string used in DatePicker */
    dateFormat: string;
    /** Placeholder shown in the date input before a date is selected */
    placeholder: string;
    /** Intl.DateTimeFormat locale string for cell value formatting */
    intlLocale: string;
    /** Label for the time input inside the calendar popup */
    timeLabel: string;
    /** Placeholder inside the time input (HH:MM equivalent) */
    timePlaceholder: string;
}

export const DATE_CONFIG: Record<string, AgGridDateConfig> = {
    tr: { dateFnsKey: 'tr',    dateFormat: 'dd.MM.yyyy', placeholder: 'gg.aa.yyyy',    intlLocale: 'tr-TR', timeLabel: 'Saat:',   timePlaceholder: 'SS:DD' },
    en: { dateFnsKey: 'en-US', dateFormat: 'MM/dd/yyyy', placeholder: 'mm/dd/yyyy',    intlLocale: 'en-US', timeLabel: 'Time:',   timePlaceholder: 'HH:MM' },
    de: { dateFnsKey: 'de',    dateFormat: 'dd.MM.yyyy', placeholder: 'tt.mm.jjjj',    intlLocale: 'de-DE', timeLabel: 'Uhrzeit:',timePlaceholder: 'SS:MM' },
    fr: { dateFnsKey: 'fr',    dateFormat: 'dd/MM/yyyy', placeholder: 'jj/mm/aaaa',    intlLocale: 'fr-FR', timeLabel: 'Heure:',  timePlaceholder: 'HH:MM' },
    es: { dateFnsKey: 'es',    dateFormat: 'dd/MM/yyyy', placeholder: 'dd/mm/aaaa',    intlLocale: 'es-ES', timeLabel: 'Hora:',   timePlaceholder: 'HH:MM' },
    ru: { dateFnsKey: 'ru',    dateFormat: 'dd.MM.yyyy', placeholder: 'дд.мм.гггг',    intlLocale: 'ru-RU', timeLabel: 'Время:',  timePlaceholder: 'ЧЧ:ММ' },
    ar: { dateFnsKey: 'ar-SA', dateFormat: 'dd/MM/yyyy', placeholder: 'يي/شش/سسسس', intlLocale: 'ar-SA', timeLabel: 'الوقت:', timePlaceholder: 'سس:دد' },
};

export function getDateConfig(lang: string): AgGridDateConfig {
    return DATE_CONFIG[lang] ?? DATE_CONFIG['tr'];
}

/** Formats a date-string cell value using the locale-appropriate Intl.DateTimeFormat */
export function formatDateByLocale(value: string | null | undefined, intlLocale: string): string {
    if (!value) return '';
    try {
        return new Intl.DateTimeFormat(intlLocale, {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit',
        }).format(new Date(value));
    } catch {
        return value;
    }
}

// ── AG Grid locale text per language ──────────────────────────────────────────

const BASE_KEYS = {
    applyFilter: '', resetFilter: '', clearFilter: '',
    before: '', after: '', equals: '', notEqual: '', blank: '', notBlank: '',
    contains: '', notContains: '', startsWith: '', endsWith: '',
    greaterThan: '', greaterThanOrEqual: '', lessThan: '', lessThanOrEqual: '',
    inRange: '', inRangeStart: '', inRangeEnd: '',
    andCondition: '', orCondition: '',
    sortAscending: '', sortDescending: '', columnAutoSize: '',
    page: '', more: '', to: '', of: '', next: '', last: '', first: '', previous: '',
    pageSizeSelectorLabel: '', loadingOoo: '', noRowsToShow: '',
    january: '', february: '', march: '', april: '', may: '', june: '',
    july: '', august: '', september: '', october: '', november: '', december: '',
    jan: '', feb: '', mar: '', apr: '', mayShort: '', jun: '',
    jul: '', aug: '', sep: '', oct: '', nov: '', dec: '',
    sunday: '', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '',
    sun: '', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '',
    today: '', clear: '', filterOoo: '',
};

export type AgGridLocaleText = typeof BASE_KEYS & { dateFormatOoo: string; dateFilterPlaceholder: string };

export const AG_GRID_LOCALES: Record<string, AgGridLocaleText> = {
    tr: {
        filterOoo: 'Filtrele...', applyFilter: 'Uygula', resetFilter: 'Sıfırla', clearFilter: 'Temizle',
        dateFormatOoo: 'dd.mm.yyyy', dateFilterPlaceholder: 'gg.aa.yyyy',
        before: 'Önce', after: 'Sonra', equals: 'Eşittir', notEqual: 'Eşit Değil',
        blank: 'Boş', notBlank: 'Dolu', contains: 'İçerir', notContains: 'İçermez',
        startsWith: 'İle Başlar', endsWith: 'İle Biter',
        greaterThan: 'Büyüktür', greaterThanOrEqual: 'Büyüktür veya Eşittir',
        lessThan: 'Küçüktür', lessThanOrEqual: 'Küçüktür veya Eşittir',
        inRange: 'Arasında', inRangeStart: 'Başlangıç', inRangeEnd: 'Bitiş',
        andCondition: 'VE', orCondition: 'VEYA',
        sortAscending: 'Artan Sıralama', sortDescending: 'Azalan Sıralama',
        columnAutoSize: 'Otomatik Genişlik',
        page: 'Sayfa', more: 'Daha Fazla', to: '-', of: '/', next: 'Sonraki',
        last: 'Son', first: 'İlk', previous: 'Önceki',
        pageSizeSelectorLabel: 'Sayfa Boyutu:', loadingOoo: 'Yükleniyor...', noRowsToShow: 'Kayıt bulunamadı.',
        january: 'Ocak', february: 'Şubat', march: 'Mart', april: 'Nisan',
        may: 'Mayıs', june: 'Haziran', july: 'Temmuz', august: 'Ağustos',
        september: 'Eylül', october: 'Ekim', november: 'Kasım', december: 'Aralık',
        jan: 'Oca', feb: 'Şub', mar: 'Mar', apr: 'Nis', mayShort: 'May',
        jun: 'Haz', jul: 'Tem', aug: 'Ağu', sep: 'Eyl', oct: 'Eki', nov: 'Kas', dec: 'Ara',
        sunday: 'Pazar', monday: 'Pazartesi', tuesday: 'Salı', wednesday: 'Çarşamba',
        thursday: 'Perşembe', friday: 'Cuma', saturday: 'Cumartesi',
        sun: 'Paz', mon: 'Pzt', tue: 'Sal', wed: 'Çar', thu: 'Per', fri: 'Cum', sat: 'Cmt',
        today: 'Bugün', clear: 'Temizle',
    },
    en: {
        filterOoo: 'Filter...', applyFilter: 'Apply', resetFilter: 'Reset', clearFilter: 'Clear',
        dateFormatOoo: 'mm/dd/yyyy', dateFilterPlaceholder: 'mm/dd/yyyy',
        before: 'Before', after: 'After', equals: 'Equals', notEqual: 'Not Equal',
        blank: 'Blank', notBlank: 'Not Blank', contains: 'Contains', notContains: 'Not Contains',
        startsWith: 'Starts With', endsWith: 'Ends With',
        greaterThan: 'Greater Than', greaterThanOrEqual: 'Greater Than or Equal',
        lessThan: 'Less Than', lessThanOrEqual: 'Less Than or Equal',
        inRange: 'In Range', inRangeStart: 'From', inRangeEnd: 'To',
        andCondition: 'AND', orCondition: 'OR',
        sortAscending: 'Sort Ascending', sortDescending: 'Sort Descending',
        columnAutoSize: 'Auto Size Column',
        page: 'Page', more: 'More', to: 'to', of: 'of', next: 'Next',
        last: 'Last', first: 'First', previous: 'Previous',
        pageSizeSelectorLabel: 'Page Size:', loadingOoo: 'Loading...', noRowsToShow: 'No records found.',
        january: 'January', february: 'February', march: 'March', april: 'April',
        may: 'May', june: 'June', july: 'July', august: 'August',
        september: 'September', october: 'October', november: 'November', december: 'December',
        jan: 'Jan', feb: 'Feb', mar: 'Mar', apr: 'Apr', mayShort: 'May',
        jun: 'Jun', jul: 'Jul', aug: 'Aug', sep: 'Sep', oct: 'Oct', nov: 'Nov', dec: 'Dec',
        sunday: 'Sunday', monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
        thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday',
        sun: 'Sun', mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat',
        today: 'Today', clear: 'Clear',
    },
    de: {
        filterOoo: 'Filtern...', applyFilter: 'Anwenden', resetFilter: 'Zurücksetzen', clearFilter: 'Löschen',
        dateFormatOoo: 'tt.mm.jjjj', dateFilterPlaceholder: 'tt.mm.jjjj',
        before: 'Vor', after: 'Nach', equals: 'Gleich', notEqual: 'Ungleich',
        blank: 'Leer', notBlank: 'Nicht leer', contains: 'Enthält', notContains: 'Enthält nicht',
        startsWith: 'Beginnt mit', endsWith: 'Endet mit',
        greaterThan: 'Größer als', greaterThanOrEqual: 'Größer als oder gleich',
        lessThan: 'Kleiner als', lessThanOrEqual: 'Kleiner als oder gleich',
        inRange: 'Im Bereich', inRangeStart: 'Von', inRangeEnd: 'Bis',
        andCondition: 'UND', orCondition: 'ODER',
        sortAscending: 'Aufsteigend sortieren', sortDescending: 'Absteigend sortieren',
        columnAutoSize: 'Spalte automatisch anpassen',
        page: 'Seite', more: 'Mehr', to: 'bis', of: 'von', next: 'Weiter',
        last: 'Letzte', first: 'Erste', previous: 'Zurück',
        pageSizeSelectorLabel: 'Seitengröße:', loadingOoo: 'Laden...', noRowsToShow: 'Keine Einträge gefunden.',
        january: 'Januar', february: 'Februar', march: 'März', april: 'April',
        may: 'Mai', june: 'Juni', july: 'Juli', august: 'August',
        september: 'September', october: 'Oktober', november: 'November', december: 'Dezember',
        jan: 'Jan', feb: 'Feb', mar: 'Mär', apr: 'Apr', mayShort: 'Mai',
        jun: 'Jun', jul: 'Jul', aug: 'Aug', sep: 'Sep', oct: 'Okt', nov: 'Nov', dec: 'Dez',
        sunday: 'Sonntag', monday: 'Montag', tuesday: 'Dienstag', wednesday: 'Mittwoch',
        thursday: 'Donnerstag', friday: 'Freitag', saturday: 'Samstag',
        sun: 'So', mon: 'Mo', tue: 'Di', wed: 'Mi', thu: 'Do', fri: 'Fr', sat: 'Sa',
        today: 'Heute', clear: 'Löschen',
    },
    fr: {
        filterOoo: 'Filtrer...', applyFilter: 'Appliquer', resetFilter: 'Réinitialiser', clearFilter: 'Effacer',
        dateFormatOoo: 'jj/mm/aaaa', dateFilterPlaceholder: 'jj/mm/aaaa',
        before: 'Avant', after: 'Après', equals: 'Égal', notEqual: 'Différent',
        blank: 'Vide', notBlank: 'Non vide', contains: 'Contient', notContains: 'Ne contient pas',
        startsWith: 'Commence par', endsWith: 'Se termine par',
        greaterThan: 'Supérieur à', greaterThanOrEqual: 'Supérieur ou égal à',
        lessThan: 'Inférieur à', lessThanOrEqual: 'Inférieur ou égal à',
        inRange: 'Dans la plage', inRangeStart: 'De', inRangeEnd: 'À',
        andCondition: 'ET', orCondition: 'OU',
        sortAscending: 'Tri croissant', sortDescending: 'Tri décroissant',
        columnAutoSize: 'Ajustement automatique',
        page: 'Page', more: 'Plus', to: 'à', of: 'sur', next: 'Suivant',
        last: 'Dernier', first: 'Premier', previous: 'Précédent',
        pageSizeSelectorLabel: 'Taille de page :', loadingOoo: 'Chargement...', noRowsToShow: 'Aucun enregistrement.',
        january: 'Janvier', february: 'Février', march: 'Mars', april: 'Avril',
        may: 'Mai', june: 'Juin', july: 'Juillet', august: 'Août',
        september: 'Septembre', october: 'Octobre', november: 'Novembre', december: 'Décembre',
        jan: 'Jan', feb: 'Fév', mar: 'Mar', apr: 'Avr', mayShort: 'Mai',
        jun: 'Juin', jul: 'Juil', aug: 'Août', sep: 'Sep', oct: 'Oct', nov: 'Nov', dec: 'Déc',
        sunday: 'Dimanche', monday: 'Lundi', tuesday: 'Mardi', wednesday: 'Mercredi',
        thursday: 'Jeudi', friday: 'Vendredi', saturday: 'Samedi',
        sun: 'Dim', mon: 'Lun', tue: 'Mar', wed: 'Mer', thu: 'Jeu', fri: 'Ven', sat: 'Sam',
        today: "Aujourd'hui", clear: 'Effacer',
    },
    es: {
        filterOoo: 'Filtrar...', applyFilter: 'Aplicar', resetFilter: 'Restablecer', clearFilter: 'Borrar',
        dateFormatOoo: 'dd/mm/aaaa', dateFilterPlaceholder: 'dd/mm/aaaa',
        before: 'Antes', after: 'Después', equals: 'Igual', notEqual: 'No igual',
        blank: 'Vacío', notBlank: 'No vacío', contains: 'Contiene', notContains: 'No contiene',
        startsWith: 'Empieza con', endsWith: 'Termina con',
        greaterThan: 'Mayor que', greaterThanOrEqual: 'Mayor o igual que',
        lessThan: 'Menor que', lessThanOrEqual: 'Menor o igual que',
        inRange: 'En rango', inRangeStart: 'Desde', inRangeEnd: 'Hasta',
        andCondition: 'Y', orCondition: 'O',
        sortAscending: 'Orden ascendente', sortDescending: 'Orden descendente',
        columnAutoSize: 'Ajuste automático',
        page: 'Página', more: 'Más', to: 'a', of: 'de', next: 'Siguiente',
        last: 'Último', first: 'Primero', previous: 'Anterior',
        pageSizeSelectorLabel: 'Tamaño de página:', loadingOoo: 'Cargando...', noRowsToShow: 'No se encontraron registros.',
        january: 'Enero', february: 'Febrero', march: 'Marzo', april: 'Abril',
        may: 'Mayo', june: 'Junio', july: 'Julio', august: 'Agosto',
        september: 'Septiembre', october: 'Octubre', november: 'Noviembre', december: 'Diciembre',
        jan: 'Ene', feb: 'Feb', mar: 'Mar', apr: 'Abr', mayShort: 'May',
        jun: 'Jun', jul: 'Jul', aug: 'Ago', sep: 'Sep', oct: 'Oct', nov: 'Nov', dec: 'Dic',
        sunday: 'Domingo', monday: 'Lunes', tuesday: 'Martes', wednesday: 'Miércoles',
        thursday: 'Jueves', friday: 'Viernes', saturday: 'Sábado',
        sun: 'Dom', mon: 'Lun', tue: 'Mar', wed: 'Mié', thu: 'Jue', fri: 'Vie', sat: 'Sáb',
        today: 'Hoy', clear: 'Borrar',
    },
    ru: {
        filterOoo: 'Фильтр...', applyFilter: 'Применить', resetFilter: 'Сбросить', clearFilter: 'Очистить',
        dateFormatOoo: 'дд.мм.гггг', dateFilterPlaceholder: 'дд.мм.гггг',
        before: 'До', after: 'После', equals: 'Равно', notEqual: 'Не равно',
        blank: 'Пусто', notBlank: 'Не пусто', contains: 'Содержит', notContains: 'Не содержит',
        startsWith: 'Начинается с', endsWith: 'Заканчивается на',
        greaterThan: 'Больше', greaterThanOrEqual: 'Больше или равно',
        lessThan: 'Меньше', lessThanOrEqual: 'Меньше или равно',
        inRange: 'В диапазоне', inRangeStart: 'С', inRangeEnd: 'По',
        andCondition: 'И', orCondition: 'ИЛИ',
        sortAscending: 'По возрастанию', sortDescending: 'По убыванию',
        columnAutoSize: 'Авторазмер колонки',
        page: 'Страница', more: 'Ещё', to: '–', of: 'из', next: 'Следующая',
        last: 'Последняя', first: 'Первая', previous: 'Предыдущая',
        pageSizeSelectorLabel: 'Строк на странице:', loadingOoo: 'Загрузка...', noRowsToShow: 'Записей не найдено.',
        january: 'Январь', february: 'Февраль', march: 'Март', april: 'Апрель',
        may: 'Май', june: 'Июнь', july: 'Июль', august: 'Август',
        september: 'Сентябрь', october: 'Октябрь', november: 'Ноябрь', december: 'Декабрь',
        jan: 'Янв', feb: 'Фев', mar: 'Мар', apr: 'Апр', mayShort: 'Май',
        jun: 'Июн', jul: 'Июл', aug: 'Авг', sep: 'Сен', oct: 'Окт', nov: 'Ноя', dec: 'Дек',
        sunday: 'Воскресенье', monday: 'Понедельник', tuesday: 'Вторник', wednesday: 'Среда',
        thursday: 'Четверг', friday: 'Пятница', saturday: 'Суббота',
        sun: 'Вс', mon: 'Пн', tue: 'Вт', wed: 'Ср', thu: 'Чт', fri: 'Пт', sat: 'Сб',
        today: 'Сегодня', clear: 'Очистить',
    },
    ar: {
        filterOoo: 'تصفية...', applyFilter: 'تطبيق', resetFilter: 'إعادة تعيين', clearFilter: 'مسح',
        dateFormatOoo: 'يي/شش/سسسس', dateFilterPlaceholder: 'يي/شش/سسسس',
        before: 'قبل', after: 'بعد', equals: 'يساوي', notEqual: 'لا يساوي',
        blank: 'فارغ', notBlank: 'غير فارغ', contains: 'يحتوي على', notContains: 'لا يحتوي على',
        startsWith: 'يبدأ بـ', endsWith: 'ينتهي بـ',
        greaterThan: 'أكبر من', greaterThanOrEqual: 'أكبر من أو يساوي',
        lessThan: 'أصغر من', lessThanOrEqual: 'أصغر من أو يساوي',
        inRange: 'في النطاق', inRangeStart: 'من', inRangeEnd: 'إلى',
        andCondition: 'و', orCondition: 'أو',
        sortAscending: 'ترتيب تصاعدي', sortDescending: 'ترتيب تنازلي',
        columnAutoSize: 'تغيير الحجم تلقائياً',
        page: 'صفحة', more: 'المزيد', to: 'إلى', of: 'من', next: 'التالي',
        last: 'الأخير', first: 'الأول', previous: 'السابق',
        pageSizeSelectorLabel: 'حجم الصفحة:', loadingOoo: 'جاري التحميل...', noRowsToShow: 'لا توجد سجلات.',
        january: 'يناير', february: 'فبراير', march: 'مارس', april: 'أبريل',
        may: 'مايو', june: 'يونيو', july: 'يوليو', august: 'أغسطس',
        september: 'سبتمبر', october: 'أكتوبر', november: 'نوفمبر', december: 'ديسمبر',
        jan: 'يناير', feb: 'فبراير', mar: 'مارس', apr: 'أبريل', mayShort: 'مايو',
        jun: 'يونيو', jul: 'يوليو', aug: 'أغسطس', sep: 'سبتمبر', oct: 'أكتوبر', nov: 'نوفمبر', dec: 'ديسمبر',
        sunday: 'الأحد', monday: 'الاثنين', tuesday: 'الثلاثاء', wednesday: 'الأربعاء',
        thursday: 'الخميس', friday: 'الجمعة', saturday: 'السبت',
        sun: 'أحد', mon: 'اثنين', tue: 'ثلاثاء', wed: 'أربعاء', thu: 'خميس', fri: 'جمعة', sat: 'سبت',
        today: 'اليوم', clear: 'مسح',
    },
};

export function getAgGridLocale(lang: string): AgGridLocaleText {
    return AG_GRID_LOCALES[lang] ?? AG_GRID_LOCALES['tr'];
}
