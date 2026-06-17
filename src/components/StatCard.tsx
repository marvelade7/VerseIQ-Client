import { type LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string | number | undefined;
    icon: LucideIcon;
    accent?: string;
    subtext?: string;
}

const StatCard = ({
    label,
    value,
    icon: Icon,
    accent = "#7C3AED",
    subtext,
}: StatCardProps) => {
    return (
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${accent}15` }}
            >
                <Icon size={20} style={{ color: accent }} />
            </div>
            <div className="min-w-0">
                <p className="text-gray-500 text-sm mb-0.5">{label}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                    {value ?? "—"}
                </p>
                {subtext && (
                    <p className="text-xs text-gray-400 mt-0.5">{subtext}</p>
                )}
            </div>
        </div>
    );
};

export default StatCard;
