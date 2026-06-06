import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LLM Agent Visualizer',
  description: 'Real-time visualization of LLM agent execution flows - VS Code extension concept',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* Apply .dark before first paint to prevent flash of wrong theme.
          Saved choice in localStorage wins; otherwise follow system preference. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `var t;try{t=localStorage.getItem('theme')}catch(e){}var d=t==='dark'?true:t==='light'?false:window.matchMedia('(prefers-color-scheme: dark)').matches;if(d){document.documentElement.classList.add('dark')}`,
        }}
      />
      <body className="font-sans antialiased bg-background">
        {children}
      </body>
    </html>
  )
}
