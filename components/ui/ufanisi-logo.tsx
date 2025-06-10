import React from 'react'

interface UfanisiLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon' | 'text'
  className?: string
}

export function UfanisiLogo({ size = 'md', variant = 'full', className = '' }: UfanisiLogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10', 
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl', 
    xl: 'text-3xl'
  }

  const LogoIcon = () => (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
      {/* Outer Ring - Efficiency */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 animate-pulse"></div>
      
      {/* Inner Circle - Knowledge */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
        {/* Core Icon - Education */}
        <div className="text-white font-bold text-xs">
          {size === 'xl' ? '🎓' : size === 'lg' ? '📚' : '🎯'}
        </div>
      </div>
      
      {/* Efficiency Lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-0.5 bg-white/30 transform rotate-45"></div>
        <div className="absolute w-full h-0.5 bg-white/30 transform -rotate-45"></div>
      </div>
    </div>
  )

  const LogoText = () => (
    <div className={`font-bold ${textSizeClasses[size]} bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent`}>
      <span className="tracking-tight">Ufanisi</span>
      <span className="text-orange-500 ml-0.5">Pro</span>
    </div>
  )

  const FullLogo = () => (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon />
      <LogoText />
    </div>
  )

  switch (variant) {
    case 'icon':
      return <LogoIcon />
    case 'text':
      return <LogoText />
    case 'full':
    default:
      return <FullLogo />
  }
}

// Animated version for loading screens
export function UfanisiLogoAnimated({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <UfanisiLogo size={size} variant="icon" className="animate-bounce" />
        <div className="absolute -inset-4 rounded-full border-2 border-blue-200 animate-ping"></div>
      </div>
      <UfanisiLogo size={size} variant="text" className="animate-pulse" />
      <div className="text-sm text-gray-500 animate-pulse">by MooreTech</div>
    </div>
  )
}

// Compact version for headers
export function UfanisiLogoCompact({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <span className="text-white font-bold text-sm">U</span>
      </div>
      <div className="font-bold text-lg">
        <span className="text-gray-900">Ufanisi</span>
        <span className="text-orange-500">Pro</span>
      </div>
    </div>
  )
} 