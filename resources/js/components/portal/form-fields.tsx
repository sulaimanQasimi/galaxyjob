import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function Field({ label, name, value, error, type = 'text' }: { label: string; name: string; value?: any; error?: string; type?: string }) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} type={type} defaultValue={value ?? ''} />
            <InputError message={error} />
        </div>
    );
}

export function TextArea({ label, name, value, error }: { label: string; name: string; value?: any; error?: string }) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={name}>{label}</Label>
            <textarea id={name} name={name} defaultValue={value ?? ''} className="min-h-28 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            <InputError message={error} />
        </div>
    );
}
