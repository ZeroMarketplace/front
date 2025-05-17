export const formatters = {
    price: ($value) => {
        if (!$value) return 0;

        // convert number to string
        if (typeof $value === 'number') {
            $value = `${$value}`;
        }

        return $value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
};