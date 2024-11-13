import React from 'react'

export default function Loading() {
  return (
    <div 
      className="flex justify-center items-center h-screen" 
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}
    >
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
}
