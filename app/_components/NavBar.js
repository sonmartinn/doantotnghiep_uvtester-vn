'use client'

import { Button } from './ui/button'
import { Bug, Menu } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="border-border bg-background/50 fixed top-0 right-0 left-0 z-50 border-b shadow-sm backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Bug className="text-primary h-8 w-8" />
            <span className="text-foreground text-2xl font-bold">UVTester</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden items-center space-x-8 md:flex">
            <a
              href="#features"
              className="text-foreground hover:text-primary font-medium transition-colors"
            >
              Tính Năng
            </a>
            <a
              href="#how-it-works"
              className="text-foreground hover:text-primary font-medium transition-colors"
            >
              Cách Hoạt Động
            </a>
            <a
              href="#contact"
              className="text-foreground hover:text-primary font-medium transition-colors"
            >
              Liên Hệ
            </a>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden items-center space-x-4 md:flex">
            <Button
              variant="ghost"
              className="text-foreground hover:text-primary"
            >
              Đăng Nhập
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Đăng Ký
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="text-foreground md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="space-y-4 py-4 md:hidden">
            <a
              href="#features"
              className="text-foreground hover:text-primary block font-medium transition-colors"
            >
              Tính Năng
            </a>
            <a
              href="#how-it-works"
              className="text-foreground hover:text-primary block font-medium transition-colors"
            >
              Cách Hoạt Động
            </a>
            <a
              href="#contact"
              className="text-foreground hover:text-primary block font-medium transition-colors"
            >
              Liên Hệ
            </a>
            <div className="flex flex-col space-y-2 pt-4">
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary w-full"
              >
                Đăng Nhập
              </Button>
              <Button className="bg-primary hover:bg-primary/90 w-full text-white">
                Đăng Ký
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
