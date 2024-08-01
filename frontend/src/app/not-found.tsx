"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"

function NotFound () {
    const router = useRouter() 
    const [countDown, setCountDown] = useState(5);

    useEffect(() => {
        const timeDown = setTimeout(() => {
            if (countDown === 1) router.push("/");
            setCountDown(countDown => countDown - 1);
        }, 1000);
        return () => clearTimeout(timeDown);
    }, [countDown, router]);

    useEffect(() => {
        return () => {
            setCountDown(5);
        };
    }, []);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold text-champagne">Wrong URL 👇</h1>
            <h2 className="mt-4 text-lg text-gray-700">Redirecting to Home in {countDown} seconds</h2>
        </div>
    );
}
export default NotFound