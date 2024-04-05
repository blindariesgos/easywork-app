'use client';
import React from "react";
import { useTranslation } from "react-i18next";
import Header from "@/components/header/Header";

export default function ToolsLayout({ children, table, modal }) {
    const { t } = useTranslation();
    return (
        <div className="bg-gray-100 h-full p-2 rounded-xl">
            <Header />
            {children}
        </div>
    )
}