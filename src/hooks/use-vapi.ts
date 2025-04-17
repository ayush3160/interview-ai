"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Vapi from "@vapi-ai/web";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || ""; // Replace with your actual public key
const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID; // Replace with your actual assistant ID

const assistantConfig: CreateAssistantDTO = {
    firstMessage:
        "Hi Ayush, How are you doing. Welcome to the first round of interview",
    firstMessageMode: "assistant-speaks-first",
    model: {
        provider: "groq",
        model: "llama-3.1-8b-instant",
        messages: [
            {
                role: "assistant",
                content: "You are an interviewer and you have to ask questions",
            },
        ],
    },
    transcriber: {
        provider: "deepgram",
        model: "Nova 3",
        language: "en",
    },
};

const useVapi = () => {
    const [volumeLevel, setVolumeLevel] = useState(100);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [conversation, setConversation] = useState<
        { role: string; text: string }[]
    >([]);
    const vapiRef = useRef<any>(null);

    const initializeVapi = useCallback(() => {
        if (!vapiRef.current) {
            const vapiInstance = new Vapi(publicKey);
            vapiRef.current = vapiInstance;

            vapiInstance.on("call-start", () => {
                setIsSessionActive(true);
            });

            vapiInstance.on("call-end", () => {
                setIsSessionActive(false);
                setConversation([]); // Reset conversation on call end
            });

            vapiInstance.on("volume-level", (volume: number) => {
                setVolumeLevel(volume);
            });

            vapiInstance.on("message", (message: any) => {
                if (
                    message.type === "transcript" &&
                    message.transcriptType === "final"
                ) {
                    setConversation((prev) => [
                        ...prev,
                        { role: message.role, text: message.transcript },
                    ]);
                }
            });

            vapiInstance.on("error", (e: Error) => {
                console.error("Vapi error:", e);
            });
        }
    }, []);

    useEffect(() => {
        initializeVapi();

        // Cleanup function to end call and dispose Vapi instance
        return () => {
            if (vapiRef.current) {
                vapiRef.current.stop();
                vapiRef.current = null;
            }
        };
    }, [initializeVapi]);

    const toggleCall = async () => {
        try {
            if (isSessionActive) {
                await vapiRef.current.stop();
            } else {
                console.log("I am Called");
                setIsSessionActive(true);
                await vapiRef.current.start(assistantConfig);
            }
        } catch (err) {
            console.error("Error toggling Vapi session:", err);
        }
    };

    return { volumeLevel, isSessionActive, conversation, toggleCall };
};

export default useVapi;
