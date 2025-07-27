'use client';

import { useState, useEffect, useRef } from 'react';
import Metronome from '@/components/Metronome';

export default function Home() {
    return (
        <main className="min-h-screen bg-black flex items-center justify-center">
            <Metronome />
        </main>
    );
}
