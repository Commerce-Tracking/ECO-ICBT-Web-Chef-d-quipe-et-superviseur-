export type LocaleSettings = {
    startsWith?: string;
    contains?: string;
    notContains?: string;
    endsWith?: string;
    equals?: string;
    notEquals?: string;
    noFilter?: string;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    dateIs?: string;
    dateIsNot?: string;
    dateBefore?: string;
    dateAfter?: string;
    custom?: string;
    clear?: string;
    apply?: string;
    matchAll?: string;
    matchAny?: string;
    addRule?: string;
    removeRule?: string;
    accept?: string;
    reject?: string;
    choose?: string;
    upload?: string;
    cancel?: string;
    dayNames?: string[];
    dayNamesShort?: string[];
    dayNamesMin?: string[];
    monthNames?: string[];
    monthNamesShort?: string[];
    today?: string;
    weekHeader?: string;
};

const en: LocaleSettings = {
    startsWith: 'Starts with',
    contains: 'Contains',
    notContains: 'Does not contain',
    endsWith: 'Ends with',
    equals: 'Equals',
    notEquals: 'Not equals',
    noFilter: 'No filter',
    lt: 'Less than',
    lte: 'Less than or equal to',
    gt: 'Greater than',
    gte: 'Greater than or equal to',
    dateIs: 'Date is',
    dateIsNot: 'Date is not',
    dateBefore: 'Date before',
    dateAfter: 'Date after',
    custom: 'Custom',
    clear: 'Clear', // ⚠️ Très important
    apply: 'Apply',
    matchAll: 'Match all',
    matchAny: 'Match any',
    addRule: 'Add rule',
    removeRule: 'Remove rule',
    accept: 'Yes',
    reject: 'No',
    choose: 'Choose',
    upload: 'Upload',
    cancel: 'Cancel',
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
    monthNamesShort: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ],
    today: 'Today',
    weekHeader: 'Week',
};

export default en;