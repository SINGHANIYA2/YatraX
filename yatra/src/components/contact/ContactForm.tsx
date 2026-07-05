'use client'

export default function ContactForm() {
    return (
        <div
            className="
            rounded-2xl
            border
            border-primary/10
            bg-card
            p-8
            shadow-sm
            "
        >
            <h2 className="text-2xl font-bold text-foreground mb-8">
                Send us a Message
            </h2>

            <form className="space-y-5">

                <div className="grid grid-cols-2 gap-4">

                    <div>
                        <label className="text-sm text-muted-foreground">
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
                            border-border
                            bg-card
                            px-4
                            py-3
                            text-foreground
                            outline-none
                            "
                        />
                    </div>

                    <div>
                        <label className="text-sm text-muted-foreground">
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
                            border-border
                            bg-card
                            px-4
                            py-3
                            text-foreground
                            outline-none
                            "
                        />
                    </div>

                </div>

                <div>
                    <label className="text-sm text-muted-foreground">
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
                        border-border
                        bg-card
                        px-4
                        py-3
                        text-foreground
                        outline-none
                        "
                    />
                </div>

                <div>
                    <label className="text-sm text-muted-foreground">
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
                        border-border
                        bg-card
                        px-4
                        py-3
                        text-foreground
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
                    bg-primary
                    py-3
                    font-medium
                    text-foreground
                    transition
                    hover:bg-primary
                    "
                >
                    Send Message
                </button>

            </form>
        </div>
    )
}