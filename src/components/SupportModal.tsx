import React from "react";
import { X, Heart, Coffee, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface SupportModalProps {
    onClose: () => void;
}

export function SupportModal({ onClose }: SupportModalProps) {
    const [copied, setCopied] = React.useState(false);
    const accountNumber = "01877860659";

    const handleCopy = () => {
        navigator.clipboard.writeText(accountNumber);
        setCopied(true);
        toast.success("নম্বরটি কপি করা হয়েছে!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300" style={{ background: "white" }}>
                {/* Decorative Header */}
                <div className="h-32 flex items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FFC800 0%, #FF3C00 100%)" }}>
                    <div className="absolute inset-0 opacity-10">
                        <svg width="100%" height="100%" fill="none" viewBox="0 0 100 100">
                            <pattern id="heart-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M10 18l-1.45-1.32C3.4 12.36 0 9.28 0 5.5 0 2.42 2.42 0 5.5 0 7.24 0 8.91.81 10 2.09 11.09.81 12.76 0 14.5 0 17.58 0 20 2.42 20 5.5c0 3.78-3.4 6.86-8.55 11.18L10 18z" fill="white" />
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#heart-pattern)" />
                        </svg>
                    </div>
                    <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                        <Heart className="text-white w-10 h-10 fill-white" />
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                    <h2 className="text-xl font-bold mb-2" style={{ color: "hsl(20 30% 20%)" }}>সার্ভার সাপোর্ট প্রয়োজন</h2>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: "hsl(20 10% 40%)" }}>
                        আমরা এই প্রোজেক্টটি ফ্রি সার্ভারে চালাচ্ছি, যার কারণে এটি দ্রুত বন্ধ হয়ে যেতে পারে। আপনাদের ছোট একটি সাপোর্ট আমাদের এই ওয়েবসাইটটি স্থায়ী করতে সাহায্য করবে। <strong>এটি সম্পূর্ণ ঐচ্ছিক এবং আপনার ইচ্ছা অনুযায়ী।</strong>
                    </p>

                    {/* Donation Box */}
                    <div className="bg-orange-50 rounded-2xl p-4 mb-6 border border-orange-100">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-orange-600 mb-1 block">বিকাশ / নগদ (পার্সোনাল)</span>
                        <div className="flex items-center justify-center gap-3">
                            <span className="text-xl font-mono font-bold text-orange-950">{accountNumber}</span>
                            <button
                                onClick={handleCopy}
                                className="p-2 rounded-lg bg-white border border-orange-200 text-orange-600 hover:bg-orange-100 transition-colors"
                                title="কপি করুন"
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={onClose}
                            className="w-full py-3 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg shadow-orange-200"
                            style={{ background: "linear-gradient(90deg, #FFC800 0%, #FF3C00 100%)" }}
                        >
                            অবশ্যই সাপোর্ট করবো!
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-2 text-xs font-medium hover:underline"
                            style={{ color: "hsl(20 10% 60%)" }}
                        >
                            এখন নয়, পরে দেখবো
                        </button>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}
