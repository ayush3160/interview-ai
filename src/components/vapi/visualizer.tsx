"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useVapi from "@/hooks/use-vapi";
// import { Button } from "@/components/ui/button";
import { MicIcon, PhoneOff } from "lucide-react";

const Visualizer: React.FC = () => {
    const { volumeLevel, isSessionActive, toggleCall } = useVapi();
    const [bars, setBars] = useState(Array(50).fill(5)); // Initialize with low value for inactivity

    useEffect(() => {
        if (isSessionActive) {
            updateBars(volumeLevel);
        } else {
            resetBars();
        }
    }, [volumeLevel, isSessionActive]);

    const updateBars = (volume: number) => {
        setBars(bars.map(() => Math.random() * volume * 150));
    };

    const resetBars = () => {
        setBars(Array(50).fill(5)); // Reset to low value for inactivity
    };

    const micPulseAnimation = {
        scale: [1, 1.2, 1],
        opacity: [1, 0.8, 1],
        transition: { duration: 0.8, repeat: Infinity },
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 rounded">
            <AnimatePresence>
                {isSessionActive && (
                    <motion.div
                        className="flex items-center justify-center w-full h-full"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                    >
                        <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 1000 200"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            {bars.map((height, index) => (
                                <React.Fragment key={index}>
                                    <rect
                                        x={500 + index * 20 - 490}
                                        y={100 - height / 2}
                                        width="10"
                                        height={height}
                                        className={`fill-current ${
                                            isSessionActive
                                                ? "text-black dark:text-white opacity-70"
                                                : "text-gray-400 opacity-30"
                                        }`}
                                    />
                                    <rect
                                        x={500 - index * 20 - 10}
                                        y={100 - height / 2}
                                        width="10"
                                        height={height}
                                        className={`fill-current ${
                                            isSessionActive
                                                ? "text-black dark:text-white opacity-70"
                                                : "text-gray-400 opacity-30"
                                        }`}
                                    />
                                </React.Fragment>
                            ))}
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                className="mt-4"
                animate={
                    isSessionActive && volumeLevel === 0
                        ? micPulseAnimation
                        : {}
                }
            >
                <button
                    onClick={toggleCall}
                    className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
                >
                    <AnimatePresence>
                        {isSessionActive ? (
                            <motion.div
                                key="phone-off"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <PhoneOff size={24} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="mic-icon"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <MicIcon size={24} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </motion.div>
        </div>
    );
};

export default Visualizer;
