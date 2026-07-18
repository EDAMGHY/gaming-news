'use client'

import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
}) => {
  const [searchValue, setSearchValue] = useState(value)

  useEffect(() => {
    setSearchValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchValue(newValue)
    onChange(newValue)
  }

  const handleClear = () => {
    setSearchValue('')
    onChange('')
  }

  return (
    <div className="relative flex-1">
      <Input
        type="text"
        value={searchValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="pr-10"
      />
      {searchValue && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-0 top-1/2 -translate-y-1/2 h-full px-3 hover:bg-transparent"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
