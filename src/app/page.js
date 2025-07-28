'use client';

import { useState, useEffect, useRef } from 'react';
import Metronome from '@/components/Metronome';
import OfflineIndicator from '@/components/OfflineIndicator';
import InstallPrompt from '@/components/InstallPrompt';
import PWADebugger from '@/components/PWADebugger';

export default function Home() {
    return (
        <main className="flex justify-center items-center min-h-dvh">
            <OfflineIndicator />
            <Metronome />
            <InstallPrompt />
            <PWADebugger />
        </main>
    );
}
