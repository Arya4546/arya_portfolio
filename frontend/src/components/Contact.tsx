import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import Magnetic from './Magnetic';

const Contact = () => {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        setStatus('submitting');
        
        const formData = new FormData(form);
        
        // Add Web3Forms Access Key
        // The user will need to put their Web3Forms key in .env or replace this string
        formData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY || "");

        try {
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: json
            });

            if (response.ok) {
                setStatus('success');
                form.reset();
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                console.error("Form submission failed:", response.status);
                setStatus('error');
                setTimeout(() => setStatus('idle'), 3000);
            }
        } catch (error) {
            console.error("Error submitting form", error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <section id="contact" className="bg-background py-20 md:py-32 px-6 md:px-20 relative overflow-hidden z-10 shadow-[0_-50px_100px_rgba(0,0,0,0.05)]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24">
                <div className="w-full md:w-1/2">
                    <span className="text-xs uppercase tracking-[0.3em] text-foreground/40 mb-4 block">Connection</span>
                    <h2 className="text-5xl md:text-9xl mb-12 leading-[1.1]">Let's <br /> <span className="italic underline decoration-foreground/20 underline-offset-8">Converge.</span></h2>

                    <div className="flex flex-col gap-8 mt-16 font-serif">
                        <Magnetic intensity={0.2} className="w-max">
                            <a href="mailto:singharya9693@gmail.com" className="flex items-center gap-6 group">
                                <div className="p-4 border border-foreground/20 rounded-full group-hover:bg-foreground group-hover:text-background transition-all duration-500 text-foreground">
                                    <Mail size={24} />
                                </div>
                                <span className="text-2xl md:text-3xl text-foreground/60 group-hover:text-foreground transition-colors">singharya9693@gmail.com</span>
                            </a>
                        </Magnetic>
                        <Magnetic intensity={0.2} className="w-max">
                            <a href="https://www.linkedin.com/in/arya-deep-singh-8b1a84230" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group">
                                <div className="p-4 border border-foreground/20 rounded-full group-hover:bg-foreground group-hover:text-background transition-all duration-500 text-foreground">
                                    <Linkedin size={24} />
                                </div>
                                <span className="text-2xl md:text-3xl text-foreground/60 group-hover:text-foreground transition-colors">linkedin.com/in/arya</span>
                            </a>
                        </Magnetic>
                        <Magnetic intensity={0.2} className="w-max">
                            <a href="https://github.com/Arya4546" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group">
                                <div className="p-4 border border-foreground/20 rounded-full group-hover:bg-foreground group-hover:text-background transition-all duration-500 text-foreground">
                                    <Github size={24} />
                                </div>
                                <span className="text-2xl md:text-3xl text-foreground/60 group-hover:text-foreground transition-colors">github.com/Arya4546</span>
                            </a>
                        </Magnetic>
                    </div>
                </div>

                <div className="w-full md:w-1/2 bg-foreground/5 p-8 md:p-12 rounded-[2rem] border border-foreground/10 xl:backdrop-blur-md">
                    <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4">
                            <label htmlFor="name" className="text-xs uppercase tracking-widest text-foreground/50 font-bold">Your Identity</label>
                            <input id="name" name="name" type="text" required placeholder="Name" className="bg-transparent border-b border-foreground/20 py-4 focus:outline-none focus:border-foreground transition-colors text-base md:text-xl font-serif text-foreground placeholder:text-foreground/30" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label htmlFor="email" className="text-xs uppercase tracking-widest text-foreground/50 font-bold">Electronic Mail</label>
                            <input id="email" name="email" type="email" required placeholder="Email" className="bg-transparent border-b border-foreground/20 py-4 focus:outline-none focus:border-foreground transition-colors text-base md:text-xl font-serif text-foreground placeholder:text-foreground/30" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label htmlFor="message" className="text-xs uppercase tracking-widest text-foreground/50 font-bold">The Message</label>
                            <textarea id="message" name="message" required placeholder="Tell me about your project..." rows={4} className="bg-transparent border-b border-foreground/20 py-4 focus:outline-none focus:border-foreground transition-colors text-base md:text-xl font-serif resize-none text-foreground placeholder:text-foreground/30" />
                        </div>
                        <Magnetic intensity={0.1}>
                        <motion.button
                            type="submit"
                            disabled={status === 'submitting' || status === 'success'}
                            whileHover={status === 'idle' ? { scale: 1.01, boxShadow: "0 20px 40px -15px rgba(255, 255, 255, 0.1)" } : {}}
                            whileTap={status === 'idle' ? { scale: 0.99 } : {}}
                            className={`mt-6 md:mt-8 w-full py-4 md:py-6 rounded-2xl font-bold uppercase tracking-widest md:tracking-[0.2em] text-sm md:text-base flex items-center justify-center gap-2 md:gap-4 transition-all duration-500 ${
                                status === 'success' 
                                ? 'bg-primary text-background' 
                                : status === 'error'
                                ? 'bg-red-900/50 text-red-200 border border-red-500/50'
                                : 'bg-foreground text-background group'
                            } ${status === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <span className="text-center">
                                {status === 'submitting' ? 'Initiating...' : 
                                 status === 'success' ? 'Message Sent' : 
                                 status === 'error' ? 'Failed to Send' : 
                                 'Initiate Discussion'}
                            </span>
                            {status === 'success' ? (
                                <CheckCircle2 size={18} className="md:w-[20px] md:h-[20px] shrink-0" />
                            ) : status === 'error' ? (
                                <AlertCircle size={18} className="md:w-[20px] md:h-[20px] shrink-0" />
                            ) : (
                                <Send size={18} className={`md:w-[20px] md:h-[20px] shrink-0 transition-transform ${status === 'idle' ? 'group-hover:translate-x-2 group-hover:-translate-y-2' : ''}`} />
                            )}
                        </motion.button>
                        </Magnetic>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto w-full">
                <footer className="mt-40 pt-12 border-t border-foreground/10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="font-serif italic text-2xl">Arya Deep Singh</p>
                    <p className="text-sm text-foreground/40 font-mono italic">&copy; {new Date().getFullYear()} — Engineering Excellence</p>
                    <div className="flex gap-8 text-xs uppercase tracking-widest font-bold text-foreground/40">
                        <a href="#hero" className="hover:text-primary transition-colors">Back to top</a>
                        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Resume</a>
                    </div>
                </footer>
            </div>
        </section>
    );
};

export default Contact;
