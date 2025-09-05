import { cva } from 'class-variance-authority';

export const colorPresets = cva('outline-none cursor-pointer', {
  variants: {
    preset: {
      primary: 'bg-blue-500 hover:bg-blue-600 text-white',
      'primary-dark': 'bg-blue-600 hover:bg-blue-700 text-white',
      'primary-light': 'bg-blue-50 hover:bg-blue-100 text-blue-500',
      green: 'bg-green-500 hover:bg-green-600 text-white',
      'green-dark': 'bg-green-600 hover:bg-green-700 text-white',
      'green-light': 'bg-green-50 hover:bg-green-100 text-green-500',
      red: 'bg-red-500 hover:bg-red-600 text-white',
      'red-dark': 'bg-red-600 hover:bg-red-700 text-white',
      'red-light': 'bg-red-50 hover:bg-red-100 text-red-500',
      yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      'yellow-dark': 'bg-yellow-600 hover:bg-yellow-700 text-white',
      'yellow-light': 'bg-yellow-50 hover:bg-yellow-100 text-yellow-500',
      purple: 'bg-purple-500 hover:bg-purple-600 text-white',
      'purple-dark': 'bg-purple-600 hover:bg-purple-700 text-white',
      'purple-light': 'bg-purple-50 hover:bg-purple-100 text-purple-500',
      orange: 'bg-orange-500 hover:bg-orange-600 text-white',
      'orange-dark': 'bg-orange-600 hover:bg-orange-700 text-white',
      'orange-light': 'bg-orange-50 hover:bg-orange-100 text-orange-500',
      pink: 'bg-pink-500 hover:bg-pink-600 text-white',
      'pink-dark': 'bg-pink-600 hover:bg-pink-700 text-white',
      'pink-light': 'bg-pink-50 hover:bg-pink-100 text-pink-500',
    },
    defaultVariants: {
      preset: 'primary',
    },
  },
});
