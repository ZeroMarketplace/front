export const rules = {
    required              : (value) => (value ? true : 'پر کردن این فیلد اجباری است'),
    requiredSelect        : (value) => (value ? true : 'لطفا انتخاب کنید'),
    requiredMultipleSelect: (value) => {
        if (value.length) return true;
        return "حداقل یک مورد انتخاب کنید";
    },
    phone                 : (value) => {
        const mobileRegex = /^(\+98|0)?9\d{9}$/;
        if (mobileRegex.test(value)) {
            return true;
        } else {
            return 'فرمت شماره موبایل اشتباه است';
        }
    },
    password              : (value) => {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber    = /[0-9]/.test(value);
        const hasSymbol    = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        const minLength    = value.length >= 8;

        if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSymbol || !minLength) {
            return 'رمز عبور ضعیف است';
        } else {
            return true;
        }
    },
};