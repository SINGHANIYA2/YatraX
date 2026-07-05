"use client";

import { Settings } from "lucide-react";

interface Props {
    admin: { name: string; email: string; profilePhoto?: { url: string } };
}

export default function SettingsTopbar({ admin }: Props) {
    return (
        <div className="sticky top-0 z-50 flex h-[72px] items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-6 font-sans">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Settings className="h-4 w-4" />
                </div>
                <div>
                    <h1 className="text-base font-bold text-foreground">Settings</h1>
                    <p className="text-xs text-muted-foreground">Manage your account and preferences</p>
                </div>
            </div>
        </div>
    );
}