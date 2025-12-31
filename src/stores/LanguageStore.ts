import { writable, derived } from "svelte/store";

type Language = "en" | "ar";

const translations = {
    en: {
        dashboard: "Dashboard",
        login: "Login",
        logout: "Logout",
        username: "Username",
        password: "Password",
        enterUsername: "Enter username",
        enterPassword: "Enter password",
        income: "Income",
        expenses: "Expenses",
        spend: "Spend",
        earn: "Earn",
        recentTransactions: "Recent Transactions",
        addExpense: "Add Expense",
        addIncome: "Add Income",
        description: "Description",
        amount: "Amount",
        add: "Add",
        cancel: "Cancel",
        whatDidYouBuy: "What did you buy?",
        sourceOfIncome: "Source of income",
        features: {
            playground: "Go to Playground",
            claude: "Go to Claude Ground",
            animation: "Go to Animation Ground",
        },
        appTitle: "Finsistance App",
        pricing: "Pricing",
        demo: "Demo",
        support: "Support",
        categories: "Categories",
        analytics: "Analytics",
    },
    ar: {
        dashboard: "لوحة التحكم",
        login: "تسجيل الدخول",
        logout: "تسجيل الخروج",
        username: "اسم المستخدم",
        password: "كلمة المرور",
        enterUsername: "أدخل اسم المستخدم",
        enterPassword: "أدخل كلمة المرور",
        income: "الدخل",
        expenses: "المصروفات",
        spend: "صرف",
        earn: "كسب",
        recentTransactions: "المعاملات الأخيرة",
        addExpense: "إضافة مصروف",
        addIncome: "إضافة دخل",
        description: "الوصف",
        amount: "المبلغ",
        add: "إضافة",
        cancel: "إلغاء",
        whatDidYouBuy: "ماذا اشتريت؟",
        sourceOfIncome: "مصدر الدخل",
        features: {
            playground: "الذهاب إلى Playground",
            claude: "الذهاب إلى Claude Ground",
            animation: "الذهاب إلى Animation Ground",
        },
        appTitle: "تطبيق فينسيستانس",
        pricing: "الأسعار",
        demo: "تجربة",
        support: "الدعم",
        categories: "التصنيفات",
        analytics: "التحليلات",
    },
};

function createLanguageStore() {
    const { subscribe, set, update } = writable<Language>("en");

    return {
        subscribe,
        setLanguage: (lang: Language) => {
            set(lang);
            document.documentElement.lang = lang;
            document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        },
        toggleLanguage: () => {
            update((current) => {
                const newLang = current === "en" ? "ar" : "en";
                document.documentElement.lang = newLang;
                document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
                return newLang;
            });
        }
    };
}

export const language = createLanguageStore();

export const t = derived(language, ($language) => {
    return (key: string) => {
        const keys = key.split(".");
        let value: any = translations[$language];
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return key; // Fallback to key if not found
            }
        }
        return value;
    };
});
