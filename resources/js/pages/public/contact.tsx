import { Form } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';
import InputError from '@/components/input-error';
import PublicLayout from '@/components/portal/public-layout';
import SeoHead, { type SeoData } from '@/components/portal/seo-head';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ContactInfo = {
    email: string;
    phone: string;
    address: string;
};

export default function Contact({ contactInfo, seo }: { contactInfo: ContactInfo; seo: SeoData }) {
    return (
        <PublicLayout>
            <SeoHead seo={seo} />

            <section className="bg-white py-16">
                <div className="mx-auto max-w-7xl px-4">
                    <p className="font-semibold text-emerald-700">Contact Us</p>
                    <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
                        We would love to hear from you.
                    </h1>
                    <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                        Contact Galaxy Jobs and Galaxy Technology for support, partnerships, hiring, or platform questions.
                    </p>
                </div>
            </section>

            <section className="bg-slate-50 py-14">
                <div className="mx-auto grid max-w-7xl gap-5 px-4 md:grid-cols-3">
                    <ContactCard icon={Mail} title="Email" text={contactInfo.email} href={`mailto:${contactInfo.email}`} />
                    <ContactCard icon={Phone} title="Phone" text={contactInfo.phone} href="tel:+93797548234" />
                    <ContactCard icon={MapPin} title="Address" text={contactInfo.address} />
                </div>
            </section>

            <section className="bg-white py-14">
                <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[1fr_0.9fr]">
                    <Form action="/contact" method="post" className="grid gap-4 rounded-2xl border bg-white p-6 shadow-sm">
                        {({ errors, processing, recentlySuccessful }) => (
                            <>
                                <h2 className="text-2xl font-bold">Send a message</h2>
                                {recentlySuccessful && (
                                    <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
                                        Your message was sent successfully.
                                    </div>
                                )}
                                <Field label="Name" name="name" error={errors.name} />
                                <Field label="Email" name="email" type="email" error={errors.email} />
                                <Field label="Phone" name="phone" error={errors.phone} />
                                <Field label="Subject" name="subject" error={errors.subject} />
                                <div className="grid gap-2">
                                    <Label htmlFor="message">Message</Label>
                                    <textarea id="message" name="message" className="min-h-36 rounded-md border bg-white px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" />
                                    <InputError message={errors.message} />
                                </div>
                                <Button disabled={processing}>Send Message</Button>
                            </>
                        )}
                    </Form>

                    <div className="grid gap-5">
                        <div className="rounded-2xl border bg-slate-50 p-6">
                            <h2 className="text-2xl font-bold">Map</h2>
                            <div className="mt-5 flex aspect-video items-center justify-center rounded-xl border border-dashed bg-white text-center text-sm text-slate-500">
                                Google Map placeholder<br />Mazar Sharif, Muzafar Market
                            </div>
                        </div>
                        <FaqSection />
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

function ContactCard({ icon: Icon, title, text, href }: { icon: typeof Mail; title: string; text: string; href?: string }) {
    const content = (
        <article className="h-full rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <Icon className="size-6 text-emerald-700" />
            <h2 className="mt-5 font-semibold">{title}</h2>
            <p className="mt-2 text-slate-600">{text}</p>
        </article>
    );

    return href ? <a href={href}>{content}</a> : content;
}

function Field({ label, name, error, type = 'text' }: { label: string; name: string; error?: string; type?: string }) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} type={type} />
            <InputError message={error} />
        </div>
    );
}

function FaqSection() {
    const items = [
        ['Jobseeker FAQs', 'How do I apply?', 'Create an employee account, complete your profile, and apply to active jobs.'],
        ['Jobseeker FAQs', 'Can I upload a CV?', 'Yes, you can upload your CV on your profile and while applying.'],
        ['Employer FAQs', 'How do I post a job?', 'Register as an employer, complete your company profile, and submit a job for approval.'],
        ['Employer FAQs', 'Are companies verified?', 'Company and job posts can be reviewed by admins before appearing publicly.'],
    ];

    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">FAQs</h2>
            <div className="mt-5 grid gap-4">
                {items.map(([group, question, answer]) => (
                    <article key={question} className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase text-emerald-700">{group}</p>
                        <h3 className="mt-1 font-semibold">{question}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
                    </article>
                ))}
            </div>
        </div>
    );
}
