<template>
    <button :type="type" :disabled="loading || disabled" :class="[
        'relative rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0E2046]',
        full ? 'w-full' : '',
        variant === 'primary'
            ? 'bg-[#0E2046] text-white hover:bg-gradient-to-r hover:from-[#F87B10] hover:to-[#FEB10B]'
            : '',
        variant === 'secondary'
            ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            : '',
        variant === 'outline'
            ? 'border border-[#0E2046] text-[#0E2046] hover:bg-blue-50'
            : '',
        size === 'sm' ? 'text-sm py-2 px-3' : '',
        size === 'md' ? 'text-base py-3 px-4' : '',
        size === 'lg' ? 'text-lg py-3 px-6' : '',
    ]">
        <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
            </svg>
        </span>
        <span :class="{ 'opacity-0': loading }">
            <slot></slot>
        </span>
    </button>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: 'button'
        },
        variant: {
            type: String,
            default: 'primary',
            validator: value => ['primary', 'secondary', 'outline'].includes(value)
        },
        size: {
            type: String,
            default: 'md',
            validator: value => ['sm', 'md', 'lg'].includes(value)
        },
        loading: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        full: {
            type: Boolean,
            default: false
        }
    }
}
</script>
