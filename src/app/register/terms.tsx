"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TermsModal() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="text-red-600 hover:text-red-700 font-semibold cursor-pointer transition-colors duration-200 text-sm"
                >
                    Terms and Conditions of Service
                </button>
            </DialogTrigger>

            <DialogContent className="max-w-lg max-h-[75vh] rounded-lg border border-slate-200 shadow-lg overflow-hidden p-0">
                <DialogHeader className="bg-gradient-to-r from-red-800 to-red-900 border-b border-red-600 px-4 py-4">
                    <div>
                        <DialogTitle className="text-lg font-bold text-white">
                            Terms and Conditions of Service
                        </DialogTitle>
                        <p className="text-xs text-purple-100 mt-1">
                            Last Updated: January 15, 2026
                        </p>
                    </div>
                </DialogHeader>

                <ScrollArea className="h-[calc(75vh-140px)]">
                    <div className="px-6 py-6 space-y-5 text-sm text-slate-700">

                        <p className="leading-relaxed">
                            Welcome to{" "}
                            <span className="font-semibold text-red-700">
                                Ipponyari
                            </span>{" "}
                            (“we,” “our,” “us”). By dining with us, making a
                            reservation, placing an order, or using our website
                            and services, you agree to the following Terms and
                            Conditions.
                        </p>

                        {/* General */}
                        <section className="space-y-2">
                            <h4 className="font-semibold text-slate-900">
                                1. General
                            </h4>
                            <p>
                                These terms apply to all customers dining in,
                                ordering takeaway or delivery, and making
                                reservations. We reserve the right to modify
                                these terms at any time without prior notice.
                            </p>
                        </section>

                        {/* Reservations */}
                        <section className="space-y-2">
                            <h4 className="font-semibold text-slate-900">
                                2. Reservations
                            </h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Reservations are subject to availability.</li>
                                <li>
                                    Late arrivals may result in shortened dining
                                    time or cancellation.
                                </li>
                                <li>
                                    Large group reservations may require a
                                    deposit or minimum spend.
                                </li>
                                <li>
                                    No-shows or last-minute cancellations may be
                                    charged accordingly.
                                </li>
                            </ul>
                        </section>

                        {/* Conduct */}
                        <section className="space-y-2">
                            <h4 className="font-semibold text-slate-900">
                                3. Dining Etiquette & Conduct
                            </h4>
                            <p>
                                We aim to provide a respectful dining experience
                                inspired by Japanese hospitality
                                (<em>omotenashi</em>). Disruptive or abusive
                                behavior toward staff or guests may result in
                                refusal of service. Children must be supervised
                                at all times.
                            </p>
                        </section>

                        {/* Menu & Pricing */}
                        <section className="space-y-2">
                            <h4 className="font-semibold text-slate-900">
                                4. Menu & Pricing
                            </h4>
                            <p>
                                Prices are listed in the applicable currency and
                                may be subject to tax and service charges. Menu
                                items, ingredients, and prices may change
                                without prior notice. Images are for
                                illustrative purposes only.
                            </p>
                        </section>

                        {/* Allergies */}
                        <section className="space-y-2">
                            <h4 className="font-semibold text-slate-900">
                                5. Allergies & Dietary Requirements
                            </h4>
                            <p>
                                Our kitchen handles common allergens including
                                seafood, soy, wheat, sesame, eggs, and dairy.
                                Please inform our staff of any allergies before
                                ordering. We cannot guarantee an allergen-free
                                environment.
                            </p>
                        </section>

                        {/* Orders & Payments */}
                        <section className="space-y-2">
                            <h4 className="font-semibold text-slate-900">
                                6. Orders & Payments
                            </h4>
                            <p>
                                Payment is required upon ordering unless
                                otherwise stated. Once an order is confirmed or
                                prepared, cancellations or refunds may not be
                                possible.
                            </p>
                        </section>

                        {/* Takeaway & Delivery */}
                        <section className="space-y-2">
                            <h4 className="font-semibold text-slate-900">
                                7. Takeaway & Delivery
                            </h4>
                            <p>
                                Orders should be checked upon receipt. Delivery
                                times are estimates and may vary due to traffic,
                                weather, or demand.
                            </p>
                        </section>

                        {/* Liability */}
                        <section className="space-y-2">
                            <h4 className="font-semibold text-slate-900">
                                8. Limitation of Liability
                            </h4>
                            <p>
                                We are not responsible for loss, theft, or
                                damage to personal belongings on our premises.
                                Liability is limited to the fullest extent
                                permitted by law.
                            </p>
                        </section>

                        {/* Governing Law */}
                        <section className="space-y-2">
                            <h4 className="font-semibold text-slate-900">
                                9. Governing Law
                            </h4>
                            <p>
                                These Terms and Conditions are governed by the
                                applicable laws of the operating country or
                                city.
                            </p>
                        </section>

                        <div className="bg-purple-50 border-l-4 border-red-500 p-3 rounded-r-lg mt-4">
                            <p className="text-xs text-slate-700 leading-relaxed">
                                <span className="font-semibold text-slate-900">
                                    Important:
                                </span>{" "}
                                These terms may be updated at any time.
                                Continued use of our services constitutes
                                acceptance of the revised terms.
                            </p>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
