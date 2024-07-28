import React from 'react'
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { Github } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Button } from './ui/button'
import { useTheme } from 'next-themes'

export default function BTheme() {
    const { setTheme } = useTheme()
    const repoUrl = 'https://github.com/Tirth-chokshi/LyricSense-AI'
    return (
        <div className="flex items-center space-x-2">
            <Button 
                variant="outline" 
                className="transition-all hover:bg-primary hover:text-primary-foreground"
                onClick={() => window.open(repoUrl, '_blank')}
            >
                <Github className="mr-2 h-4 w-4" /> Star on GitHub
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}