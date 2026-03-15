import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Send } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="bg-background py-20 md:py-32 px-6 md:px-20 relative z-10 shadow-[0_-50px_100px_rgba(0,0,0,0.05)]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24">
                <div className="w-full md:w-1/2">
                    <span className="text-xs uppercase tracking-[0.3em] text-foreground/40 mb-4 block">Connection</span>
                    <h2 className="text-5xl md:text-9xl mb-12 leading-[1.1]">Let's <br /> <span className="italic underline decoration-primary/20 underline-offset-8">Converge.</span></h2>

                    <div className="flex flex-col gap-8 mt-16 font-serif">
                        <a href="mailto:hello@aryadeepsingh.dev" className="flex items-center gap-6 group">
                            <div className="p-4 bg-accent/20 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                <Mail size={24} />
                            </div>
                            <span className="text-2xl md:text-3xl text-foreground/60 group-hover:text-foreground transition-colors">hello@aryadeepsingh.dev</span>
                        </a>
                        <a href="#" className="flex items-center gap-6 group">
                            <div className="p-4 bg-accent/20 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                <Linkedin size={24} />
                            </div>
                            <span className="text-2xl md:text-3xl text-foreground/60 group-hover:text-foreground transition-colors">linkedin.com/in/arya</span>
                        </a>
                        <a href="#" className="flex items-center gap-6 group">
                            <div className="p-4 bg-accent/20 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                <Github size={24} />
                            </div>
                            <span className="text-2xl md:text-3xl text-foreground/60 group-hover:text-foreground transition-colors">github.com/arya</span>
                        </a>
                    </div>
                </div>

                <div className="w-full md:w-1/2 bg-accent/5 p-8 md:p-12 rounded-[2rem] border border-foreground/5">
                    <form className="flex flex-col gap-10">
                        <div className="flex flex-col gap-4">
                            <label className="text-xs uppercase tracking-widest text-foreground/40 font-bold">Your Identity</label>
                            <input type="text" placeholder="Name" className="bg-transparent border-b border-foreground/10 py-4 focus:outline-none focus:border-primary transition-colors text-xl font-serif" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="text-xs uppercase tracking-widest text-foreground/40 font-bold">Electronic Mail</label>
                            <input type="email" placeholder="Email" className="bg-transparent border-b border-foreground/10 py-4 focus:outline-none focus:border-primary transition-colors text-xl font-serif" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="text-xs uppercase tracking-widest text-foreground/40 font-bold">The Message</label>
                            <textarea placeholder="Tell me about your project..." rows={4} className="bg-transparent border-b border-foreground/10 py-4 focus:outline-none focus:border-primary transition-colors text-xl font-serif resize-none" />
                        </div>
                        <motion.button
                            whileHover={{
                                scale: 1.01,
                                boxShadow: "0 20px 40px -15px rgba(53, 102, 60, 0.3)"
                            }}
                            whileTap={{ scale: 0.99 }}
                            className="mt-6 md:mt-8 w-full py-4 md:py-6 bg-primary text-primary-foreground rounded-2xl font-bold uppercase tracking-widest md:tracking-[0.2em] text-sm md:text-base flex items-center justify-center gap-2 md:gap-4 group transition-all duration-500"
                        >
                            <span className="text-center">Initiate Discussion</span>
                            <Send size={18} className="md:w-[20px] md:h-[20px] group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform shrink-0" />
                        </motion.button>
                    </form>
                </div>
            </div>

            <footer className="mt-40 pt-12 border-t border-foreground/10 flex flex-col md:flex-row justify-between items-center gap-8">
                <p className="font-serif italic text-2xl">Arya Deep Singh</p>
                <p className="text-sm text-foreground/40 font-mono italic">&copy; {new Date().getFullYear()} — Engineering Excellence</p>
                <div className="flex gap-8 text-xs uppercase tracking-widest font-bold text-foreground/40">
                    <a href="#" className="hover:text-primary transition-colors">Back to top</a>
                    <a href="#" className="hover:text-primary transition-colors">Resume</a>
                </div>
            </footer>
        </section>
    );
};

export default Contact;
