import React from 'react'

import { ButtonLink } from '@/components/ui/button-link'

export default function NotFound() {
  return (
    <div className="container py-28">
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0 }}>404</h1>
        <p className="mb-4">This page could not be found.</p>
      </div>
      <ButtonLink href="/" variant="primary">
        Go home
      </ButtonLink>
    </div>
  )
}
