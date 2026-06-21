'use client'

export default function ContactForm() {
    return (
        <div
            className="
            rounded-2xl
            border
            border-blue-500/10
            bg-[#071427]
            p-8
            shadow-[0_0_15px_rgba(59,130,246,0.15)]
            "
        >
            <h2 className="text-2xl font-bold text-white mb-8">
                Send us a Message
            </h2>

            <form className="space-y-5">

                <div className="grid grid-cols-2 gap-4">

                    <div>
                        <label className="text-sm text-slate-400">
                            Your Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="
                            mt-2
                            w-full
                            rounded-xl
                            border
                            border-slate-700
                            bg-slate-900
                            px-4
                            py-3
                            text-white
                            outline-none
                            "
                        />
                    </div>

                    <div>
                        <label className="text-sm text-slate-400">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="
                            mt-2
                            w-full
                            rounded-xl
                            border
                            border-slate-700
                            bg-slate-900
                            px-4
                            py-3
                            text-white
                            outline-none
                            "
                        />
                    </div>

                </div>

                <div>
                    <label className="text-sm text-slate-400">
                        Subject
                    </label>

                    <input
                        type="text"
                        placeholder="Enter subject"
                        className="
                        mt-2
                        w-full
                        rounded-xl
                        border
                        border-slate-700
                        bg-slate-900
                        px-4
                        py-3
                        text-white
                        outline-none
                        "
                    />
                </div>

                <div>
                    <label className="text-sm text-slate-400">
                        Message
                    </label>

                    <textarea
                        rows={5}
                        placeholder="Type your message..."
                        className="
                        mt-2
                        w-full
                        rounded-xl
                        border
                        border-slate-700
                        bg-slate-900
                        px-4
                        py-3
                        text-white
                        outline-none
                        resize-none
                        "
                    />
                </div>

                <button
                    type="submit"
                    className="
                    w-full
                    rounded-xl
                    bg-blue-600
                    py-3
                    font-medium
                    text-white
                    transition
                    hover:bg-blue-700
                    "
                >
                    Send Message
                </button>

            </form>
        </div>
    )
}