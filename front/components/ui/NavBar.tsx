// @ts-nocheck
'use client'
import '@/app/(dashboard)/(routes)/dashboard/style.css'
import React from 'react';
import Image from 'next/image';
import { CSSProperties, useState } from 'react';

export default function NavBar() {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const containerStyle: CSSProperties = {
    width: '2.75rem',
    height: '40.125rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const buttonStyle: CSSProperties = {
    padding: '10px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    opacity: 0.5, // Initial opacity
    transition: 'opacity 0.2s', // Add a transition for smoother hover effect
  };

  const handleIconClick = (iconName) => {
    setSelectedIcon(iconName);
  };

  const handleIconMouseEnter = (iconName) => {
    setHoveredIcon(iconName);
  };

  const handleIconMouseLeave = () => {
    setHoveredIcon(null);
  };

  const renderIconButton = (iconName, imageSrc, altText) => {
    return (
      <button
        style={{
          ...buttonStyle,
          opacity: selectedIcon === iconName || hoveredIcon === iconName ? 1 : 0.5,
        }}
        onClick={() => handleIconClick(iconName)}
        onMouseEnter={() => handleIconMouseEnter(iconName)}
        onMouseLeave={handleIconMouseLeave}
      >
        <Image
          src={imageSrc}
          alt={altText}
          width={24}
          height={21}
        />
      </button>
    );
  };

  return (
    <div className="style rounded-full" style={containerStyle}>
      {renderIconButton('home', 'home.svg', 'home')}
      {renderIconButton('game', '🦆 icon _medical cross_.svg', 'game')}
      {renderIconButton('chat', '🦆 icon _chat_.svg', 'chat')}
      {renderIconButton('settings', '🦆 icon _cog_.svg', 'settings')}
    </div>
  );
}
