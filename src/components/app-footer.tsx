import React from 'react'

export function AppFooter() {
  return (
    <footer className="text-center pt-6 p-2 bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400 h-20 mt-10">
      Created with ❤ by{' '}
      <a
        className="link hover:text-neutral-500 dark:hover:text-white"
        href="https://x.com/0xShenigun"
        target="_blank"
        rel="noopener noreferrer"
      >
        Anurag Munda
      </a>
    </footer>
  )
}