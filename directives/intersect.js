// directives/intersect.js
export default {
  mounted(el, binding) {
    if (!binding.instance._observerMap) {
      // نگهداری کارت‌های مشاهده‌شده
      binding.instance._observerMap = new Map()
    }

    if (!binding.instance._observer) {
      binding.instance._observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              !binding.instance._observerMap.has(entry.target)
            ) {
              if (typeof binding.value === 'function') {
                binding.value(entry.target)

                // اضافه کردن کارت به لیست مشاهده‌شده‌ها
                binding.instance._observerMap.set(entry.target, true)

                // حذف کارت از مشاهده‌گر پس از اجرای تابع
                observer.unobserve(entry.target)
              }
            }
          })
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.1
        }
      )
    }

    // بررسی اینکه کارت قبلاً مشاهده نشده باشد
    if (!binding.instance._observerMap.has(el)) {
      binding.instance._observer.observe(el)
    }
  },
  updated(el, binding) {
    // اعمال observer به تمامی کارت‌های جدید
    const cards = el.querySelectorAll('.observerTrigger')
    cards.forEach((card) => {
      if (!binding.instance._observerMap.has(card)) {
        binding.instance._observer.observe(card)
      }
    })
  }
  // unmounted(el, binding) {
  //     if (binding.instance._observer) {
  //         binding.instance._observer.disconnect();
  //     }
  // }
}
