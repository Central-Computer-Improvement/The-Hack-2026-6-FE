"use client";

import React from 'react';
import { MotionDiv } from './Motion';
import { FadeInProps } from '../../../types';


export default function FadeIn({ 
    children, 
    delay = 0, 
    duration = 0.6, 
    direction = 'up',
    className = '' 
}: FadeInProps) {
    const offset = 40; 
    let initialX = 0;
    let initialY = 0;

    if (direction === 'up') initialY = offset;
    if (direction === 'down') initialY = -offset;
    if (direction === 'left') initialX = offset;
    if (direction === 'right') initialX = -offset;

    return (
    <MotionDiv
        initial={{ opacity: 0, x: initialX, y: initialY }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: "-100px" }} 
        transition={{ 
        duration: duration, 
        delay: delay, 
        ease: "easeOut" 
        }}
        className={className}
    >
        {children}
    </MotionDiv>
    );
}